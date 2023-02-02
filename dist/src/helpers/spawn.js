"use strict";
exports.__esModule = true;
exports.execute = void 0;
var node_child_process_1 = require("node:child_process");
var execute = function (command, args, options) {
    return new Promise(function (resolve, reject) {
        var child = (0, node_child_process_1.spawn)(command, args, options);
        child.on('exit', function () { return resolve('done'); });
        child.on('close', function (code) { return (code === 0)
            ? resolve('done') : reject('failed'); });
    });
};
exports.execute = execute;
//# sourceMappingURL=spawn.js.map