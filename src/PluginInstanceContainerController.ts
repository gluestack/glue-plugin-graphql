import { PluginInstance } from "./PluginInstance";
const { GlobalEnv } = require("@gluestack/helpers");
import { IPortNumber } from "./interfaces/IPortNumber";
const { DockerodeHelper } = require("@gluestack/helpers");
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import IContainerController from "@gluestack/framework/types/plugin/interface/IContainerController";

const defaultEnv: any = {
  HASURA_GRAPHQL_ENABLE_CONSOLE: "true",
  HASURA_GRAPHQL_DEV_MODE: "true",
  HASURA_GRAPHQL_ENABLED_LOG_TYPES:
    "startup, http-log, webhook-log, websocket-log, query-log",
  HASURA_GRAPHQL_ADMIN_SECRET: "secret",
  HASURA_GRAPHQL_JWT_SECRET: JSON.stringify({
    type: "HS256",
    key: "f7eb8518-a85e-45f1-983d-43ae8b5f92d7",
  }),
  HASURA_GRAPHQL_UNAUTHORIZED_ROLE: "anonymous",
};

export class PluginInstanceContainerController
  implements IContainerController, IPortNumber {
  app: IApp;
  status: "up" | "down" = "down";
  portNumber: number;
  containerId: string;
  callerInstance: PluginInstance;

  constructor(app: IApp, callerInstance: PluginInstance) {
    this.app = app;
    this.callerInstance = callerInstance;
    this.setStatus(this.callerInstance.gluePluginStore.get("status"));
    this.setPortNumber(this.callerInstance.gluePluginStore.get("port_number"));
    this.setContainerId(
      this.callerInstance.gluePluginStore.get("container_id"),
    );
  }

  getCallerInstance(): IInstance {
    return this.callerInstance;
  }

  async getFromGlobalEnv(key: string, defaultValue?: string) {
    const value = await GlobalEnv.get(this.callerInstance.getName(), key);
    if (!value) {
      await GlobalEnv.set(this.callerInstance.getName(), key, defaultValue);
      return defaultValue;
    }
    return value;
  }

  async getEnv() {
    const env: any = {};
    for (const key in defaultEnv) {
      env[key] = await this.getFromGlobalEnv(key, defaultEnv[key]);
    }

    const dbEnv: any = {
      HASURA_GRAPHQL_METADATA_DATABASE_URL:
        (await this.callerInstance
          ?.getPostgresInstance()
          ?.getConnectionString()) || null,
      HASURA_GRAPHQL_DATABASE_URL:
        (await this.callerInstance
          ?.getPostgresInstance()
          ?.getConnectionString()) || null,
    };
    for (const key in dbEnv) {
      env[key] = await this.getFromGlobalEnv(key, dbEnv[key]);
    }
    if (!env.HASURA_GRAPHQL_DATABASE_URL) {
      throw new Error("Postgres instance not set");
    }

    return env;
  }

  getIpAddress() {
    return "localhost";
  }

  async getDockerJson() {
    // do nothing
  }

  getStatus(): "up" | "down" {
    return this.status;
  }

  // @ts-ignore
  async getPortNumber(returnDefault?: boolean) {
    return new Promise((resolve, reject) => {
      if (this.portNumber) {
        return resolve(this.portNumber);
      }
      let ports =
        this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];
      DockerodeHelper.getPort(8080, ports)
        .then((port: number) => {
          this.setPortNumber(port);
          ports.push(port);
          this.callerInstance.callerPlugin.gluePluginStore.set("ports", ports);
          return resolve(this.portNumber);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  getContainerId(): string {
    return this.containerId;
  }

  setStatus(status: "up" | "down") {
    this.callerInstance.gluePluginStore.set("status", status || "down");
    return (this.status = status || "down");
  }

  setPortNumber(portNumber: number) {
    this.callerInstance.gluePluginStore.set("port_number", portNumber || null);
    return (this.portNumber = portNumber || null);
  }

  setContainerId(containerId: string) {
    this.callerInstance.gluePluginStore.set(
      "container_id",
      containerId || null,
    );
    return (this.containerId = containerId || null);
  }

  getConfig(): any {
    // do nothing
  }

  async up() {
    // do nothing
  }

  async down() {
    // do nothing
  }

  async build() {
    // do nothing
  }
}
