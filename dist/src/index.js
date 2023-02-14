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
exports.GlueStackPlugin = void 0;
var package_json_1 = __importDefault(require("../package.json"));
var PluginInstance_1 = require("./PluginInstance");
var attachPostgresInstance_1 = require("./helpers/attachPostgresInstance");
var write_env_1 = require("./helpers/write-env");
var renameDirectory_1 = __importDefault(require("./helpers/renameDirectory"));
var reWriteFile_1 = __importDefault(require("./helpers/reWriteFile"));
var graphql_console_1 = require("./commands/graphql-console");
var update_workspaces_1 = require("./helpers/update-workspaces");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var GlueStackPlugin = (function () {
    function GlueStackPlugin(app, gluePluginStore) {
        this.type = "stateless";
        this.app = app;
        this.instances = [];
        this.gluePluginStore = gluePluginStore;
    }
    GlueStackPlugin.prototype.init = function () {
        var _this = this;
        this.app.addCommand(function (program) { return (0, graphql_console_1.graphqlConsole)(program, _this); });
    };
    GlueStackPlugin.prototype.destroy = function () {
    };
    GlueStackPlugin.prototype.getName = function () {
        return package_json_1["default"].name;
    };
    GlueStackPlugin.prototype.getVersion = function () {
        return package_json_1["default"].version;
    };
    GlueStackPlugin.prototype.getType = function () {
        return this.type;
    };
    GlueStackPlugin.prototype.getTemplateFolderPath = function () {
        return "".concat(process.cwd(), "/node_modules/").concat(this.getName(), "/template");
    };
    GlueStackPlugin.prototype.getInstallationPath = function (target) {
        return "./backend/services/".concat(target);
    };
    GlueStackPlugin.prototype.runPostInstall = function (instanceName, target) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function () {
            var postgresPlugin, hasDBConfig, postgresInstanceswithDB, dbConfigs, _i, _l, instance, graphqlInstance, metadataDir, migraitonDir, yamlFile, path, configPath, envs, pluginPackage, rootPackage;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0: return [4, this.checkAlreadyInstalled()];
                    case 1:
                        _m.sent();
                        if (instanceName !== "graphql") {
                            console.log("\x1b[36m");
                            console.log("Install graphql instance: `node glue add graphql graphql`");
                            console.log("\x1b[31m");
                            throw new Error("graphql supports instance name `graphql` only");
                        }
                        postgresPlugin = this.app.getPluginByName("@gluestack/glue-plugin-postgres");
                        if (!postgresPlugin || !postgresPlugin.getInstances().length) {
                            console.log("\x1b[36m");
                            console.log("Install postgres instance: `node glue add postgres ".concat(instanceName, "-postgres`"));
                            console.log("\x1b[31m");
                            throw new Error("Postgres instance not installed from `@gluestack/glue-plugin-postgres`");
                        }
                        hasDBConfig = false;
                        postgresInstanceswithDB = [];
                        dbConfigs = {};
                        for (_i = 0, _l = postgresPlugin.getInstances(); _i < _l.length; _i++) {
                            instance = _l[_i];
                            if (((_a = instance.gluePluginStore.get("db_config")) === null || _a === void 0 ? void 0 : _a.username) &&
                                ((_b = instance.gluePluginStore.get("db_config")) === null || _b === void 0 ? void 0 : _b.db_name) &&
                                ((_c = instance.gluePluginStore.get("db_config")) === null || _c === void 0 ? void 0 : _c.password) &&
                                ((_d = instance.gluePluginStore.get("db_config")) === null || _d === void 0 ? void 0 : _d.db_host) &&
                                ((_e = instance.gluePluginStore.get("db_config")) === null || _e === void 0 ? void 0 : _e.db_port)) {
                                dbConfigs.username = (_f = instance.gluePluginStore.get("db_config")) === null || _f === void 0 ? void 0 : _f.username;
                                dbConfigs.db_name = (_g = instance.gluePluginStore.get("db_config")) === null || _g === void 0 ? void 0 : _g.db_name;
                                dbConfigs.password = (_h = instance.gluePluginStore.get("db_config")) === null || _h === void 0 ? void 0 : _h.password;
                                dbConfigs.db_host = (_j = instance.gluePluginStore.get("db_config")) === null || _j === void 0 ? void 0 : _j.db_host;
                                dbConfigs.db_port = (_k = instance.gluePluginStore.get("db_config")) === null || _k === void 0 ? void 0 : _k.db_port;
                                dbConfigs.port = instance.gluePluginStore.get("port_number");
                                hasDBConfig = true;
                                postgresInstanceswithDB.push(instance);
                            }
                        }
                        if (!hasDBConfig) {
                            throw new Error("No ".concat(postgresPlugin.getName(), " instance has db configuration"));
                        }
                        return [4, this.app.createPluginInstance(this, instanceName, this.getTemplateFolderPath(), target)];
                    case 2:
                        graphqlInstance = _m.sent();
                        return [4, (0, attachPostgresInstance_1.attachPostgresInstance)(graphqlInstance, postgresInstanceswithDB)];
                    case 3:
                        _m.sent();
                        return [4, (0, write_env_1.writeEnv)(graphqlInstance, dbConfigs)];
                    case 4:
                        _m.sent();
                        metadataDir = "".concat(graphqlInstance.getInstallationPath(), "/metadata/databases");
                        return [4, (0, renameDirectory_1["default"])(metadataDir, 'my_first_db', dbConfigs.db_name)];
                    case 5:
                        _m.sent();
                        migraitonDir = "".concat(graphqlInstance.getInstallationPath(), "/migrations");
                        return [4, (0, renameDirectory_1["default"])(migraitonDir, 'my_first_db', dbConfigs.db_name)];
                    case 6:
                        _m.sent();
                        yamlFile = "".concat(graphqlInstance.getInstallationPath(), "/metadata/databases/databases.yaml");
                        return [4, (0, reWriteFile_1["default"])(yamlFile, dbConfigs.db_name)];
                    case 7:
                        _m.sent();
                        return [4, (0, reWriteFile_1["default"])(yamlFile, "".concat(dbConfigs.username, ":"), 'postgres:')];
                    case 8:
                        _m.sent();
                        return [4, (0, reWriteFile_1["default"])(yamlFile, ":".concat(dbConfigs.password), ':postgrespass')];
                    case 9:
                        _m.sent();
                        path = "".concat(graphqlInstance.getInstallationPath(), "/router.js");
                        return [4, (0, reWriteFile_1["default"])(path, instanceName, 'hasura')];
                    case 10:
                        _m.sent();
                        configPath = "".concat(graphqlInstance.getInstallationPath(), "/config.yaml");
                        return [4, graphqlInstance.containerController.getEnv()];
                    case 11:
                        envs = _m.sent();
                        return [4, (0, reWriteFile_1["default"])(configPath, envs.HASURA_GRAPHQL_URL, 'ENDPOINT')];
                    case 12:
                        _m.sent();
                        pluginPackage = "".concat(graphqlInstance.getInstallationPath(), "/package.json");
                        return [4, (0, reWriteFile_1["default"])(pluginPackage, instanceName, 'INSTANCENAME')];
                    case 13:
                        _m.sent();
                        rootPackage = "".concat(process.cwd(), "/package.json");
                        return [4, (0, update_workspaces_1.updateWorkspaces)(rootPackage, graphqlInstance.getInstallationPath())];
                    case 14:
                        _m.sent();
                        (0, node_fs_1.mkdirSync)((0, node_path_1.join)(graphqlInstance.getInstallationPath(), 'seeds', dbConfigs.db_name));
                        return [2];
                }
            });
        });
    };
    GlueStackPlugin.prototype.checkAlreadyInstalled = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var graphqlPlugin;
            return __generator(this, function (_b) {
                graphqlPlugin = this.app.getPluginByName("@gluestack/glue-plugin-graphql");
                if ((_a = graphqlPlugin === null || graphqlPlugin === void 0 ? void 0 : graphqlPlugin.getInstances()) === null || _a === void 0 ? void 0 : _a[0]) {
                    throw new Error("graphql instance already installed as ".concat(graphqlPlugin
                        .getInstances()[0]
                        .getName()));
                }
                return [2];
            });
        });
    };
    GlueStackPlugin.prototype.createInstance = function (key, gluePluginStore, installationPath) {
        var instance = new PluginInstance_1.PluginInstance(this.app, this, key, gluePluginStore, installationPath);
        this.instances.push(instance);
        return instance;
    };
    GlueStackPlugin.prototype.getInstances = function () {
        return this.instances;
    };
    return GlueStackPlugin;
}());
exports.GlueStackPlugin = GlueStackPlugin;
//# sourceMappingURL=index.js.map