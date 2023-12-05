import { PluginInstance } from "./PluginInstance";
import { IPortNumber } from "./interfaces/IPortNumber";
const { DockerodeHelper } = require("@gluestack/helpers");
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
// @ts-ignore
import IContainerController, { IRoutes } from "@gluestack/framework/types/plugin/interface/IContainerController";
import { getCrossEnvKey } from "@gluestack/helpers";

export class PluginInstanceContainerController
  implements IContainerController, IPortNumber {
  app: IApp;
  status: "up" | "down" = "down";
  portNumber: number;
  consolePortNumber: number;
  containerId: string;
  callerInstance: PluginInstance;

  constructor(app: IApp, callerInstance: PluginInstance) {
    this.app = app;
    this.callerInstance = callerInstance;
    this.setStatus(this.callerInstance.gluePluginStore.get("status"));
    this.setPortNumber(this.callerInstance.gluePluginStore.get("port_number"));
    this.setConsolePortNumber(
      this.callerInstance.gluePluginStore.get("console_port_number"),
    );
    this.setContainerId(
      this.callerInstance.gluePluginStore.get("container_id"),
    );
  }

  getCallerInstance(): IInstance {
    return this.callerInstance;
  }

  async getEnv() {
    const env: any = {
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
      GRAPHQL_URL: `http://${this.callerInstance.getName()}:8080/v1/graphql`,

      HASURA_GRAPHQL_DB_NAME: this.getEnvKey("POSTGRES_DB"),
      HASURA_GRAPHQL_URL: `http://localhost:${await this.getPortNumber()}`,
      HASURA_GRAPHQL_METADATA_DATABASE_URL: this.getEnvKey("POSTGRES_STRING"),
      HASURA_GRAPHQL_DATABASE_URL: this.getEnvKey("POSTGRES_STRING"),
    };
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

  async getConsolePortNumber(returnDefault?: boolean) {
    return new Promise((resolve, reject) => {
      if (this.consolePortNumber) {
        return resolve(this.consolePortNumber);
      }
      let ports =
        this.callerInstance.callerPlugin.gluePluginStore.get("console_ports") ||
        [];
      DockerodeHelper.getPort(9695, ports)
        .then((port: number) => {
          this.setConsolePortNumber(port);
          ports.push(port);
          this.callerInstance.callerPlugin.gluePluginStore.set(
            "console_ports",
            ports,
          );
          return resolve(this.consolePortNumber);
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

  setConsolePortNumber(consolePortNumber: number) {
    this.callerInstance.gluePluginStore.set(
      "console_port_number",
      consolePortNumber || null,
    );
    return (this.consolePortNumber = consolePortNumber || null);
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
    await this.getPortNumber();
    await this.getConsolePortNumber();
  }

  async down() {
    // do nothing
  }

  async build() {
    // do nothing
  }

  async getRoutes(): Promise<IRoutes[]> {
    const routes: IRoutes[] = [
      { method: "POST", path: "/v1/graphql" }
    ];

    return Promise.resolve(routes);
  }

  getEnvKey(key: string) {
    return `%${getCrossEnvKey(this.callerInstance?.getPostgresInstance().getName(), key)}%`;
  }
}
