'use strict';

require('babel/register')({
  extensions: [".es6", ".es", ".jsx"]
});
require('co');

import * as core from './installer.core.es6';

try {
  var fs = require('fs');
  var packages = JSON.parse(fs.readFileSync('./package.json'));
} catch (e) {
  console.error('Can\'t read file, err:', e);
  throw e;
}

var dependencies = Object.keys(packages.dependencies);
var devDependencies = Object.keys(packages.devDependencies);

console.log('Found %d deps and %d dev deps', dependencies.length, devDependencies.length);

core.installModulesList(dependencies)
  .then(function (modulesWithErrors) {
    if (modulesWithErrors.length !== 0) {
      console.log('Found %d modules with errors, try reinstall', modulesWithErrors.length);
      console.log('Full list: npm install %s', modulesWithErrors.join(' '));
      return core.installModulesList(modulesWithErrors);
    }
    return Promise.resolve([]);
  })
  .then(function () {
    console.log('Start install dev dependencies');
    return core.installModulesList(devDependencies)
  })
  .then(function (modulesWithErrors) {
    if (modulesWithErrors.length !== 0) {
      console.log('Found %d dev modules with errors, try reinstall', modulesWithErrors.length);
      console.log('Full dev list: npm install %s', modulesWithErrors.join(' '));
      return core.installModulesList(modulesWithErrors);
    }
    return Promise.resolve([]);
  })
  .catch(function (err) {
    throw err;
  });
