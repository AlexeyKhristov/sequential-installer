'use strict';

var exec = require('child_process').exec;
var util = require('util');
var co = require('co');

export function installModule(moduleName) {
  return function execThunk(cb) {
    var child = exec(util.format('npm install %s', moduleName), function (err, stdoutBuff, stderrBuff) {
      cb(err);
    });
  }
}

export function installModulesList(modulesList) {

  return co(function *() {

    let modulesWithErrors = [];

    for (let i = 0; i < modulesList.length; i++) {
      let moduleName = modulesList[i];
      try {
        console.log(' -> start %s (№ %d)', moduleName, i+1);
        yield installModule(moduleName);
        console.log(' <- installed %s (№ %d)', moduleName, i+1);
      } catch (e) {
        modulesWithErrors.push(moduleName);
        console.error('!===> error install %s (№ %d)', moduleName, i+1);
      }
    }

    return yield Promise.resolve(modulesWithErrors);
  });
}
