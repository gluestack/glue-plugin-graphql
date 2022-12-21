"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.PluginInstanceContainerController = void 0;
var DockerodeHelper = require("@gluestack/helpers").DockerodeHelper;
var GlobalEnv = require("@gluestack/helpers").GlobalEnv;
var defaultEnv = {
    HASURA_GRAPHQL_ENABLE_CONSOLE: "true",
    HASURA_GRAPHQL_DEV_MODE: "true",
    HASURA_GRAPHQL_ENABLED_LOG_TYPES: "startup, http-log, webhook-log, websocket-log, query-log",
    HASURA_GRAPHQL_ADMIN_SECRET: "secret",
    HASURA_GRAPHQL_JWT_SECRET: JSON.stringify({
        type: "HS256",
        key: "f7eb8518-a85e-45f1-983d-43ae8b5f92d7"
    }),
    HASURA_GRAPHQL_UNAUTHORIZED_ROLE: "anonymous"
};
var PluginInstanceContainerController = (function () {
    function PluginInstanceContainerController(app, callerInstance) {
        this.status = "down";
        this.app = app;
        this.callerInstance = callerInstance;
        this.setStatus(this.callerInstance.gluePluginStore.get("status"));
        this.setPortNumber(this.callerInstance.gluePluginStore.get("port_number"));
        this.setContainerId(this.callerInstance.gluePluginStore.get("container_id"));
    }
    PluginInstanceContainerController.prototype.getCallerInstance = function () {
        return this.callerInstance;
    };
    PluginInstanceContainerController.prototype.getFromGlobalEnv = function (key, defaultValue) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, GlobalEnv.get(this.callerInstance.getName(), key)];
                    case 1:
                        value = _a.sent();
                        if (!!value) return [3, 3];
                        return [4, GlobalEnv.set(this.callerInstance.getName(), key, defaultValue)];
                    case 2:
                        _a.sent();
                        return [2, defaultValue];
                    case 3: return [2, value];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.getEnv = function () {
        return __awaiter(this, void 0, void 0, function () {
            var env, _a, _b, _c, _i, key, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!this.callerInstance.getPostgresInstance()) {
                            throw new Error("Postgres instance not found");
                        }
                        if (!this.callerInstance.getPostgresInstance().getConnectionString()) {
                            throw new Error("Postgres instance not started");
                        }
                        env = {};
                        _a = defaultEnv;
                        _b = [];
                        for (_c in _a)
                            _b.push(_c);
                        _i = 0;
                        _f.label = 1;
                    case 1:
                        if (!(_i < _b.length)) return [3, 4];
                        _c = _b[_i];
                        if (!(_c in _a)) return [3, 3];
                        key = _c;
                        _d = env;
                        _e = key;
                        return [4, this.getFromGlobalEnv(key, defaultEnv[key])];
                    case 2:
                        _d[_e] = _f.sent();
                        _f.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2, __assign({ HASURA_GRAPHQL_METADATA_DATABASE_URL: this.callerInstance
                                .getPostgresInstance()
                                .getConnectionString(), PG_DATABASE_URL: this.callerInstance
                                .getPostgresInstance()
                                .getConnectionString() }, env)];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.getDockerJson = function () {
        return {
            Image: "hasura/graphql-engine",
            WorkingDir: "/hasura",
            HostConfig: {
                PortBindings: {
                    "8080/tcp": [
                        {
                            HostPort: this.getPortNumber(true).toString()
                        },
                    ]
                }
            },
            ExposedPorts: {
                "8080/tcp": {}
            },
            RestartPolicy: {
                Name: "always"
            }
        };
    };
    PluginInstanceContainerController.prototype.getStatus = function () {
        return this.status;
    };
    PluginInstanceContainerController.prototype.getPortNumber = function (returnDefault) {
        if (this.portNumber) {
            return this.portNumber;
        }
        if (returnDefault) {
            return 8080;
        }
    };
    PluginInstanceContainerController.prototype.getContainerId = function () {
        return this.containerId;
    };
    PluginInstanceContainerController.prototype.setStatus = function (status) {
        this.callerInstance.gluePluginStore.set("status", status || "down");
        return (this.status = status || "down");
    };
    PluginInstanceContainerController.prototype.setPortNumber = function (portNumber) {
        this.callerInstance.gluePluginStore.set("port_number", portNumber || null);
        return (this.portNumber = portNumber || null);
    };
    PluginInstanceContainerController.prototype.setContainerId = function (containerId) {
        this.callerInstance.gluePluginStore.set("container_id", containerId || null);
        return (this.containerId = containerId || null);
    };
    PluginInstanceContainerController.prototype.getConfig = function () { };
    PluginInstanceContainerController.prototype.up = function () {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var ports;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!this.callerInstance.getPostgresInstance()) {
                            throw new Error("No postgres instance attached with ".concat(this.callerInstance.getName()));
                        }
                        if (!this.callerInstance.getPostgresInstance().getConnectionString() ||
                            !((_a = this.callerInstance.getPostgresInstance()) === null || _a === void 0 ? void 0 : _a.getContainerController())) {
                            throw new Error("Not a valid postgres db configured with ".concat(this.callerInstance.getName()));
                        }
                        if (!(((_c = (_b = this.callerInstance
                            .getPostgresInstance()) === null || _b === void 0 ? void 0 : _b.getContainerController()) === null || _c === void 0 ? void 0 : _c.getStatus()) !== "up")) return [3, 2];
                        return [4, ((_e = (_d = this.callerInstance
                                .getPostgresInstance()) === null || _d === void 0 ? void 0 : _d.getContainerController()) === null || _e === void 0 ? void 0 : _e.up())];
                    case 1:
                        _f.sent();
                        _f.label = 2;
                    case 2:
                        ports = this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];
                        return [4, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    DockerodeHelper.getPort(this.getPortNumber(true), ports)
                                        .then(function (port) { return __awaiter(_this, void 0, void 0, function () {
                                        var _a, _b, _c;
                                        var _this = this;
                                        return __generator(this, function (_d) {
                                            switch (_d.label) {
                                                case 0:
                                                    this.portNumber = port;
                                                    _b = (_a = DockerodeHelper).up;
                                                    _c = [this.getDockerJson()];
                                                    return [4, this.getEnv()];
                                                case 1:
                                                    _b.apply(_a, _c.concat([_d.sent(), this.portNumber,
                                                        this.callerInstance.getName()]))
                                                        .then(function (_a) {
                                                        var status = _a.status, portNumber = _a.portNumber, containerId = _a.containerId;
                                                        _this.setStatus(status);
                                                        _this.setPortNumber(portNumber);
                                                        _this.setContainerId(containerId);
                                                        ports.push(portNumber);
                                                        _this.callerInstance.callerPlugin.gluePluginStore.set("ports", ports);
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
                                });
                            }); })];
                    case 3:
                        _f.sent();
                        return [2];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.down = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ports;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ports = this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];
                        return [4, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    DockerodeHelper.down(this.getContainerId(), this.callerInstance.getName())
                                        .then(function () {
                                        _this.setStatus("down");
                                        var index = ports.indexOf(_this.getPortNumber());
                                        if (index !== -1) {
                                            ports.splice(index, 1);
                                        }
                                        _this.callerInstance.callerPlugin.gluePluginStore.set("ports", ports);
                                        _this.setPortNumber(null);
                                        _this.setContainerId(null);
                                        return resolve(true);
                                    })["catch"](function (e) {
                                        return reject(e);
                                    });
                                    return [2];
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2];
        }); });
    };
    return PluginInstanceContainerController;
}());
exports.PluginInstanceContainerController = PluginInstanceContainerController;
//# sourceMappingURL=PluginInstanceContainerController.js.map