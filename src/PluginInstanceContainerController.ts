const { DockerodeHelper } = require("@gluestack/helpers");
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import IContainerController from "@gluestack/framework/types/plugin/interface/IContainerController";
import { IHasPostgresInstance } from "./interfaces/IHasPostgresInstance";
import { hasuraCommand } from "./helpers/hasuraCommand";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";
const { GlobalEnv } = require("@gluestack/helpers");

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

export class PluginInstanceContainerController implements IContainerController {
  app: IApp;
  status: "up" | "down" = "down";
  portNumber: number;
  containerId: string;
  callerInstance: IInstance & IHasPostgresInstance & IHasContainerController;

  constructor(
    app: IApp,
    callerInstance: IInstance & IHasPostgresInstance & IHasContainerController,
  ) {
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
        this.callerInstance?.getPostgresInstance()?.getConnectionString() ||
        null,
      PG_DATABASE_URL:
        this.callerInstance?.getPostgresInstance()?.getConnectionString() ||
        null,
    };
    for (const key in dbEnv) {
      env[key] = await this.getFromGlobalEnv(key, dbEnv[key]);
    }
    if (!env.PG_DATABASE_URL) {
      throw new Error("Postgres instance not set");
    }

    return env;
  }

  getIpAddress() {
    return "localhost";
  }

  getDockerJson() {
    return {
      Image: "hasura/graphql-engine",
      WorkingDir: "/hasura",
      HostConfig: {
        PortBindings: {
          "8080/tcp": [
            {
              HostPort: this.getPortNumber(true).toString(),
            },
          ],
        },
      },
      ExposedPorts: {
        "8080/tcp": {},
      },
      RestartPolicy: {
        Name: "always",
      },
    };
  }

  getStatus(): "up" | "down" {
    return this.status;
  }

  getPortNumber(returnDefault?: boolean): number {
    if (this.portNumber) {
      return this.portNumber;
    }
    if (returnDefault) {
      return 8080;
    }
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

  getConfig(): any {}

  async up() {
    if (!this.callerInstance.getPostgresInstance()) {
      throw new Error(
        `No postgres instance attached with ${this.callerInstance.getName()}`,
      );
    }
    if (
      !this.callerInstance.getPostgresInstance().getConnectionString() ||
      !this.callerInstance.getPostgresInstance()?.getContainerController()
    ) {
      throw new Error(
        `Not a valid postgres db configured with ${this.callerInstance.getName()}`,
      );
    }
    if (
      this.callerInstance
        .getPostgresInstance()
        ?.getContainerController()
        ?.getStatus() !== "up"
    ) {
      await this.callerInstance
        .getPostgresInstance()
        ?.getContainerController()
        ?.up();
    }

    let ports =
      this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];

    await new Promise(async (resolve, reject) => {
      DockerodeHelper.getPort(this.getPortNumber(true), ports)
        .then(async (port: number) => {
          this.portNumber = port;
          DockerodeHelper.up(
            this.getDockerJson(),
            await this.getEnv(),
            this.portNumber,
            this.callerInstance.getName(),
          )
            .then(
              ({
                status,
                portNumber,
                containerId,
              }: {
                status: "up" | "down";
                portNumber: number;
                containerId: string;
              }) => {
                this.setStatus(status);
                this.setPortNumber(portNumber);
                this.setContainerId(containerId);
                ports.push(portNumber);
                this.callerInstance.callerPlugin.gluePluginStore.set(
                  "ports",
                  ports,
                );
                hasuraCommand(this.callerInstance, "version")
                  .then(() => {
                    return resolve(true);
                  })
                  .catch((e: any) => {
                    return resolve(true);
                  });
              },
            )
            .catch((e: any) => {
              return reject(e);
            });
        })
        .catch((e: any) => {
          return reject(e);
        });
    });
  }

  async down() {
    let ports =
      this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];
    await new Promise(async (resolve, reject) => {
      DockerodeHelper.down(this.getContainerId(), this.callerInstance.getName())
        .then(() => {
          this.setStatus("down");
          var index = ports.indexOf(this.getPortNumber());
          if (index !== -1) {
            ports.splice(index, 1);
          }
          this.callerInstance.callerPlugin.gluePluginStore.set("ports", ports);

          this.setPortNumber(null);
          this.setContainerId(null);
          return resolve(true);
        })
        .catch((e: any) => {
          return reject(e);
        });
    });
  }

  async build() {}
}
