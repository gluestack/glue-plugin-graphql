import IApp from "@gluestack/framework/types/app/interface/IApp";
import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import ILifeCycle from "@gluestack/framework/types/plugin/interface/ILifeCycle";
import IGlueStorePlugin from "@gluestack/framework/types/store/interface/IGluePluginStore";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";
import IManagesInstances from "@gluestack/framework/types/plugin/interface/IManagesInstances";
import { PluginInstanceContainerController } from "./PluginInstanceContainerController";
import { IHasPostgresInstance } from "./interfaces/IHasPostgresInstance";
import { IPostgres } from "@gluestack/glue-plugin-postgres/src/interfaces/IPostgres";
import { hasuraCommand } from "./helpers/hasuraCommand";
import { postMetataData } from "./helpers/postMetataData";
import { IPortNumber } from "./interfaces/IPortNumber";
import { copyToTarget } from "./helpers/copyToTarget";
import writeTrackFile from "./helpers/writeTrackFile";

export class PluginInstance
  implements
    IInstance,
    ILifeCycle,
    IHasContainerController,
    IHasPostgresInstance
{
  app: IApp;
  name: string;
  callerPlugin: IPlugin;
  containerController: PluginInstanceContainerController & IPortNumber;
  isOfTypeInstance: boolean = false;
  gluePluginStore: IGlueStorePlugin;
  installationPath: string;

  constructor(
    app: IApp,
    callerPlugin: IPlugin,
    name: string,
    gluePluginStore: IGlueStorePlugin,
    installationPath: string,
  ) {
    this.app = app;
    this.name = name;
    this.callerPlugin = callerPlugin;
    this.gluePluginStore = gluePluginStore;
    this.installationPath = installationPath;
    this.containerController = new PluginInstanceContainerController(app, this);
  }

  init() {
    //
  }

  destroy() {
    //
  }

  getName(): string {
    return this.name;
  }

  getCallerPlugin(): IPlugin {
    return this.callerPlugin;
  }

  getInstallationPath(): string {
    return this.installationPath;
  }

  getMigrationFolderPath(): string {
    return `${this.installationPath}/migrations/${this.getDbName()}`;
  }

  getTracksFolderPath(): string {
    return `${this.installationPath}/tracks`;
  }

  getDbName(): string {
    return (
      this.getPostgresInstance().gluePluginStore.get("db_config")?.db_name ||
      null
    );
  }

  getContainerController(): PluginInstanceContainerController & IPortNumber {
    return this.containerController;
  }

  getPostgresInstance(): IPlugin & IPostgres & IHasContainerController {
    let postgresInstance = null;
    const postgres_instance = this.gluePluginStore.get("postgres_instance");
    if (postgres_instance) {
      const plugin: IPlugin & IManagesInstances = this.app.getPluginByName(
        "@gluestack/glue-plugin-postgres",
      );
      if (plugin) {
        plugin.getInstances().forEach((instance: IInstance & IPostgres) => {
          if (instance.getName() === postgres_instance) {
            postgresInstance = instance;
          }
        });
      }
      return postgresInstance;
    }
  }

  getGraphqlURL(): string {
    return `http://${this.getName()}:${
      this.getContainerController().portNumber
    }/v1/graphql`;
  }

  getMetdataURL(): string {
    return `http://${this.getContainerController().getIpAddress()}:${
      this.getContainerController().portNumber
    }/v1/metadata`;
  }

  async getSecret() {
    return (
      (await this.getContainerController().getEnv())
        .HASURA_GRAPHQL_ADMIN_SECRET || null
    );
  }

  async applyMigration() {
    return new Promise((resolve, reject) => {
      this.metadataApply()
        .then(() => {
          this.migrateApply()
            .then(() => {
              this.metadataClear()
                .then(() => {
                  this.metadataApply()
                    .then(() => {
                      return resolve(true);
                    })
                    .catch((e: any) => {
                      return reject(e);
                    });
                })
                .catch((e: any) => {
                  return reject(e);
                });
            })
            .catch((e: any) => {
              return reject(e);
            });
        })
        .catch((e: any) => {
          return reject(e);
        });
    });
  }

  async metadataApply() {
    return new Promise((resolve, reject) => {
      hasuraCommand(this, "metadataApply")
        .then(() => {
          return resolve(true);
        })
        .catch((e: any) => {
          return reject(e);
        });
    });
  }

  async migrateApply() {
    return new Promise((resolve, reject) => {
      hasuraCommand(this, "migrateApply")
        .then(() => {
          return resolve(true);
        })
        .catch((e: any) => {
          return reject(e);
        });
    });
  }

  async metadataClear() {
    return new Promise((resolve, reject) => {
      hasuraCommand(this, "metadataClear")
        .then(() => {
          return resolve(true);
        })
        .catch((e: any) => {
          return reject(e);
        });
    });
  }

  async requestMetadata(body: any) {
    return await postMetataData(
      this.getMetdataURL(),
      body,
      await this.getSecret(),
    );
  }

  async copyMigration(migrationSrcFolder: string) {
    await copyToTarget(migrationSrcFolder, this.getMigrationFolderPath());
  }

  async copyTrackJson(fileName: string, trackJson: any) {
    await writeTrackFile(fileName, trackJson, this.getTracksFolderPath());
  }
}
