const { DockerodeHelper } = require("@gluestack/helpers");
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import IContainerController from "@gluestack/framework/types/plugin/interface/IContainerController";
import { IHasPostgresInstance } from "./interfaces/IHasPostgresInstance";
import { hasuraCommand } from "./helpers/hasuraCommand";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";
import { PluginInstance } from "./PluginInstance";
import { generateDockerfile } from "./create-dockerfile";
import { IPortNumber } from "./interfaces/IPortNumber";
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
    return {
      Image: "hasura/graphql-engine",
      WorkingDir: "/hasura",
      HostConfig: {
        PortBindings: {
          "8080/tcp": [
            {
              HostPort: (await this.getPortNumber()).toString(),
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

  //@ts-ignore
  async getPortNumber(returnDefault?: boolean) {
    return new Promise((resolve, reject) => {
      if (this.portNumber) {
        return resolve(this.portNumber);
      }
      let ports =
        this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];
      DockerodeHelper.getPort(10880, ports)
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

  getConfig(): any { }

  async up() {
    if (!this.callerInstance.getPostgresInstance()) {
      throw new Error(
        `No postgres instance attached with ${this.callerInstance.getName()}`,
      );
    }
    if (
      !(await this.callerInstance
        .getPostgresInstance()
        .getConnectionString()) ||
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
      this.callerInstance.gluePluginStore.set("postgres_booted", false);
    }

    if (!this.callerInstance.gluePluginStore.get("postgres_booted")) {
      console.log("\x1b[36m");
      console.log(
        `Initializing graphql endpoint, waiting for postgres database...`,
      );
      console.log("\x1b[0m");
    }

    await new Promise(async (resolve, reject) => {
      setTimeout(
        async () => {
          DockerodeHelper.up(
            await this.getDockerJson(),
            await this.getEnv(),
            await this.getPortNumber(),
            this.callerInstance.getName(),
          )
            .then(
              ({
                status,
                containerId,
              }: {
                status: "up" | "down";
                containerId: string;
              }) => {
                this.setStatus(status);
                this.setContainerId(containerId);
                hasuraCommand(this.callerInstance, "version")
                  .then(() => {
                    console.log("\x1b[35m");
                    console.log(
                      `You can now use these endpoint for graphql: ${this.callerInstance.getGraphqlURL()}`,
                    );
                    console.log("\x1b[0m");
                    this.callerInstance.gluePluginStore.set(
                      "postgres_booted",
                      true,
                    );
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
        },
        this.callerInstance.gluePluginStore.get("postgres_booted")
          ? 1000
          : 30 * 1000,
      );
    });
  }

  async down() {
    await new Promise(async (resolve, reject) => {
      DockerodeHelper.down(this.getContainerId(), this.callerInstance.getName())
        .then(() => {
          this.setStatus("down");
          this.setContainerId(null);
          return resolve(true);
        })
        .catch((e: any) => {
          return reject(e);
        });
    });
  }

  async build() {
    await generateDockerfile(this.callerInstance.getInstallationPath());
  }
}
