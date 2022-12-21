"use strict";
exports.__esModule = true;
exports.hasuraInit = void 0;
var SpawnHelper = require("@gluestack/helpers").SpawnHelper;
function installScript() {
    return ["hasura", "init", "."];
}
function hasuraInit(pluginInstance) {
    return new Promise(function (resolve, reject) {
        console.log("\x1b[33m");
        console.log("".concat(pluginInstance.getName(), ": Running `").concat(installScript().join(" "), "`"));
        console.log("\x1b[0m");
        SpawnHelper.run(pluginInstance.getInstallationPath(), installScript())
            .then(function (resp) {
            return resolve(true);
        })["catch"](function (e) {
            return reject(e);
        });
    });
}
exports.hasuraInit = hasuraInit;
//# sourceMappingURL=hasuraInit.js.map