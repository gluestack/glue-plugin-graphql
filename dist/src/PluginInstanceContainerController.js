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
exports.PluginInstanceContainerController = void 0;
var DockerodeHelper = require("@gluestack/helpers").DockerodeHelper;
var helpers_1 = require("@gluestack/helpers");
var PluginInstanceContainerController = (function () {
    function PluginInstanceContainerController(app, callerInstance) {
        this.status = "down";
        this.app = app;
        this.callerInstance = callerInstance;
        this.setStatus(this.callerInstance.gluePluginStore.get("status"));
        this.setPortNumber(this.callerInstance.gluePluginStore.get("port_number"));
        this.setConsolePortNumber(this.callerInstance.gluePluginStore.get("console_port_number"));
        this.setContainerId(this.callerInstance.gluePluginStore.get("container_id"));
    }
    PluginInstanceContainerController.prototype.getCallerInstance = function () {
        return this.callerInstance;
    };
    PluginInstanceContainerController.prototype.getEnv = function () {
        return __awaiter(this, void 0, void 0, function () {
            var env, _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = {
                            HASURA_GRAPHQL_ADMIN_SECRET: "admin-secret",
                            HASURA_GRAPHQL_JWT_SECRET: "{\\\"type\\\": \\\"HS256\\\", \\\"key\\\": \\\"f7eb8518-a85e-45f1-983d-43ae8b5f92d7\\\"}",
                            HASURA_GRAPHQL_UNAUTHORIZED_ROLE: "guest",
                            HASURA_GRAPHQL_LOG_LEVEL: "DEBUG",
                            HASURA_GRAPHQL_ENABLE_CONSOLE: "true",
                            HASURA_GRAPHQL_CORS_DOMAIN: "*",
                            ACTION_BASE_URL: "http://engine:9000/actions",
                            EVENT_BASE_URL: "http://engine:9000/events",
                            HASURA_GRAPHQL_ENABLE_TELEMETRY: "false",
                            JWT_KEY: "HS256",
                            JWT_SECRET: "f7eb8518-a85e-45f1-983d-43ae8b5f92d7",
                            GRAPHQL_URL: "http://".concat(this.callerInstance.getName(), ":8080/v1/graphql"),
                            HASURA_GRAPHQL_DB_NAME: this.getEnvKey("POSTGRES_DB")
                        };
                        _a = "http://localhost:".concat;
                        return [4, this.getPortNumber()];
                    case 1:
                        env = (_b.HASURA_GRAPHQL_URL = _a.apply("http://localhost:", [_c.sent()]),
                            _b.HASURA_GRAPHQL_METADATA_DATABASE_URL = this.getEnvKey("POSTGRES_STRING"),
                            _b.HASURA_GRAPHQL_DATABASE_URL = this.getEnvKey("POSTGRES_STRING"),
                            _b);
                        return [2, env];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.getIpAddress = function () {
        return "localhost";
    };
    PluginInstanceContainerController.prototype.getDockerJson = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2];
            });
        });
    };
    PluginInstanceContainerController.prototype.getStatus = function () {
        return this.status;
    };
    PluginInstanceContainerController.prototype.getPortNumber = function (returnDefault) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        if (_this.portNumber) {
                            return resolve(_this.portNumber);
                        }
                        var ports = _this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];
                        DockerodeHelper.getPort(8080, ports)
                            .then(function (port) {
                            _this.setPortNumber(port);
                            ports.push(port);
                            _this.callerInstance.callerPlugin.gluePluginStore.set("ports", ports);
                            return resolve(_this.portNumber);
                        })["catch"](function (e) {
                            reject(e);
                        });
                    })];
            });
        });
    };
    PluginInstanceContainerController.prototype.getConsolePortNumber = function (returnDefault) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        if (_this.consolePortNumber) {
                            return resolve(_this.consolePortNumber);
                        }
                        var ports = _this.callerInstance.callerPlugin.gluePluginStore.get("console_ports") ||
                            [];
                        DockerodeHelper.getPort(9695, ports)
                            .then(function (port) {
                            _this.setConsolePortNumber(port);
                            ports.push(port);
                            _this.callerInstance.callerPlugin.gluePluginStore.set("console_ports", ports);
                            return resolve(_this.consolePortNumber);
                        })["catch"](function (e) {
                            reject(e);
                        });
                    })];
            });
        });
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
    PluginInstanceContainerController.prototype.setConsolePortNumber = function (consolePortNumber) {
        this.callerInstance.gluePluginStore.set("console_port_number", consolePortNumber || null);
        return (this.consolePortNumber = consolePortNumber || null);
    };
    PluginInstanceContainerController.prototype.setContainerId = function (containerId) {
        this.callerInstance.gluePluginStore.set("container_id", containerId || null);
        return (this.containerId = containerId || null);
    };
    PluginInstanceContainerController.prototype.getConfig = function () {
    };
    PluginInstanceContainerController.prototype.up = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getPortNumber()];
                    case 1:
                        _a.sent();
                        return [4, this.getConsolePortNumber()];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.down = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2];
            });
        });
    };
    PluginInstanceContainerController.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2];
            });
        });
    };
    PluginInstanceContainerController.prototype.getRoutes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var routes;
            return __generator(this, function (_a) {
                routes = [
                    { method: "POST", path: "/v1/graphql" }
                ];
                return [2, Promise.resolve(routes)];
            });
        });
    };
    PluginInstanceContainerController.prototype.getEnvKey = function (key) {
        var _a;
        return "%".concat((0, helpers_1.getCrossEnvKey)((_a = this.callerInstance) === null || _a === void 0 ? void 0 : _a.getPostgresInstance().getName(), key), "%");
    };
    return PluginInstanceContainerController;
}());
exports.PluginInstanceContainerController = PluginInstanceContainerController;
//# sourceMappingURL=PluginInstanceContainerController.js.map