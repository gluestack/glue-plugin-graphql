"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.hasuraInit = void 0;
var SpawnHelper = require("@gluestack/helpers").SpawnHelper;
var isEndpointUp_1 = require("./isEndpointUp");
function installScript(graphqlPluginInstance) {
    return __awaiter(this, void 0, void 0, function () {
        var containerController, env, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    containerController = graphqlPluginInstance.getContainerController();
                    return [4, containerController.getEnv()];
                case 1:
                    env = _c.sent();
                    _a = ["hasura",
                        "init",
                        ".",
                        "--endpoint"];
                    _b = "http://localhost:".concat;
                    return [4, containerController.getPortNumber()];
                case 2: return [2, _a.concat([
                        _b.apply("http://localhost:", [_c.sent()]),
                        "--admin-secret",
                        env.HASURA_GRAPHQL_ADMIN_SECRET,
                        "--skip-update-check"
                    ])];
            }
        });
    });
}
function hasuraInit(graphqlPluginInstance) {
    var _this = this;
    var containerController = graphqlPluginInstance.getContainerController();
    return new Promise(function (resolve, reject) {
        containerController
            .up()
            .then(function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = isEndpointUp_1.isEndpointUp;
                        _b = "http://localhost:".concat;
                        return [4, containerController.getPortNumber()];
                    case 1:
                        _a.apply(void 0, [_b.apply("http://localhost:", [_c.sent(), "/v1/version"])])
                            .then(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b, _c, _d, _e, _f, _g;
                            return __generator(this, function (_h) {
                                switch (_h.label) {
                                    case 0:
                                        console.log("\x1b[33m");
                                        _b = (_a = console).log;
                                        _d = (_c = "".concat(graphqlPluginInstance.getName(), ": Running `")).concat;
                                        return [4, installScript(graphqlPluginInstance)];
                                    case 1:
                                        _b.apply(_a, [_d.apply(_c, [(_h.sent()).join(" "), "`"])]);
                                        console.log("\x1b[0m");
                                        _f = (_e = SpawnHelper).run;
                                        _g = [graphqlPluginInstance.getInstallationPath()];
                                        return [4, installScript(graphqlPluginInstance)];
                                    case 2:
                                        _f.apply(_e, _g.concat([_h.sent()]))
                                            .then(function (resp) {
                                            return resolve(true);
                                        })["catch"](function (e) {
                                            return reject(e);
                                        });
                                        return [2];
                                }
                            });
                        }); })["catch"](function (e) {
                            return reject(e);
                        });
                        return [2];
                }
            });
        }); })["catch"](function (e) {
            return reject(e);
        });
    });
}
exports.hasuraInit = hasuraInit;
//# sourceMappingURL=hasuraInit.js.map