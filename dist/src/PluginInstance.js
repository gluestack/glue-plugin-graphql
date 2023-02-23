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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.PluginInstance = void 0;
var PluginInstanceContainerController_1 = require("./PluginInstanceContainerController");
var hasuraCommand_1 = require("./helpers/hasuraCommand");
var postMetataData_1 = require("./helpers/postMetataData");
var copyToTarget_1 = require("./helpers/copyToTarget");
var writeTrackFile_1 = __importDefault(require("./helpers/writeTrackFile"));
var PluginInstance = (function () {
    function PluginInstance(app, callerPlugin, name, gluePluginStore, installationPath) {
        this.isOfTypeInstance = false;
        this.app = app;
        this.name = name;
        this.callerPlugin = callerPlugin;
        this.gluePluginStore = gluePluginStore;
        this.installationPath = installationPath;
        this.containerController = new PluginInstanceContainerController_1.PluginInstanceContainerController(app, this);
    }
    PluginInstance.prototype.init = function () {
    };
    PluginInstance.prototype.destroy = function () {
    };
    PluginInstance.prototype.getName = function () {
        return this.name;
    };
    PluginInstance.prototype.getCallerPlugin = function () {
        return this.callerPlugin;
    };
    PluginInstance.prototype.getInstallationPath = function () {
        return this.installationPath;
    };
    PluginInstance.prototype.getMigrationFolderPath = function () {
        return "".concat(this.installationPath, "/migrations/").concat(this.getDbName());
    };
    PluginInstance.prototype.getTracksFolderPath = function () {
        return "".concat(this.installationPath, "/tracks");
    };
    PluginInstance.prototype.getDbName = function () {
        var _a;
        return (((_a = this.getPostgresInstance().gluePluginStore.get("db_config")) === null || _a === void 0 ? void 0 : _a.db_name) ||
            null);
    };
    PluginInstance.prototype.getContainerController = function () {
        return this.containerController;
    };
    PluginInstance.prototype.getPostgresInstance = function () {
        var postgresInstance = null;
        var postgres_instance = this.gluePluginStore.get("postgres_instance");
        if (postgres_instance) {
            var plugin = this.app.getPluginByName("@gluestack/glue-plugin-postgres");
            if (plugin) {
                plugin.getInstances().forEach(function (instance) {
                    if (instance.getName() === postgres_instance) {
                        postgresInstance = instance;
                    }
                });
            }
            return postgresInstance;
        }
    };
    PluginInstance.prototype.getGraphqlURL = function () {
        return "http://".concat(this.getName(), ":").concat(this.getContainerController().portNumber, "/v1/graphql");
    };
    PluginInstance.prototype.getMetdataURL = function () {
        return "http://".concat(this.getContainerController().getIpAddress(), ":").concat(this.getContainerController().portNumber, "/v1/metadata");
    };
    PluginInstance.prototype.getSecret = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getContainerController().getEnv()];
                    case 1: return [2, ((_a.sent())
                            .HASURA_GRAPHQL_ADMIN_SECRET || null)];
                }
            });
        });
    };
    PluginInstance.prototype.applyMigration = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        _this.metadataApply()
                            .then(function () {
                            _this.migrateApply()
                                .then(function () {
                                _this.metadataClear()
                                    .then(function () {
                                    _this.metadataApply()
                                        .then(function () {
                                        return resolve(true);
                                    })["catch"](function (e) {
                                        return reject(e);
                                    });
                                })["catch"](function (e) {
                                    return reject(e);
                                });
                            })["catch"](function (e) {
                                return reject(e);
                            });
                        })["catch"](function (e) {
                            return reject(e);
                        });
                    })];
            });
        });
    };
    PluginInstance.prototype.metadataApply = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        (0, hasuraCommand_1.hasuraCommand)(_this, "metadataApply")
                            .then(function () {
                            return resolve(true);
                        })["catch"](function (e) {
                            return reject(e);
                        });
                    })];
            });
        });
    };
    PluginInstance.prototype.migrateApply = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        (0, hasuraCommand_1.hasuraCommand)(_this, "migrateApply")
                            .then(function () {
                            return resolve(true);
                        })["catch"](function (e) {
                            return reject(e);
                        });
                    })];
            });
        });
    };
    PluginInstance.prototype.metadataClear = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        (0, hasuraCommand_1.hasuraCommand)(_this, "metadataClear")
                            .then(function () {
                            return resolve(true);
                        })["catch"](function (e) {
                            return reject(e);
                        });
                    })];
            });
        });
    };
    PluginInstance.prototype.requestMetadata = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = postMetataData_1.postMetataData;
                        _b = [this.getMetdataURL(),
                            body];
                        return [4, this.getSecret()];
                    case 1: return [4, _a.apply(void 0, _b.concat([_c.sent()]))];
                    case 2: return [2, _c.sent()];
                }
            });
        });
    };
    PluginInstance.prototype.copyMigration = function (migrationSrcFolder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, copyToTarget_1.copyToTarget)(migrationSrcFolder, this.getMigrationFolderPath())];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    PluginInstance.prototype.copyTrackJson = function (fileName, trackJson) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, writeTrackFile_1["default"])(fileName, trackJson, this.getTracksFolderPath())];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return PluginInstance;
}());
exports.PluginInstance = PluginInstance;
//# sourceMappingURL=PluginInstance.js.map