import IApp from "@gluestack/framework/types/app/interface/IApp";
import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import ILifeCycle from "@gluestack/framework/types/plugin/interface/ILifeCycle";
import IGlueStorePlugin from "@gluestack/framework/types/store/interface/IGluePluginStore";
import IContainerController from "@gluestack/framework/types/plugin/interface/IContainerController";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";
import IManagesInstances from "@gluestack/framework/types/plugin/interface/IManagesInstances";
import { PluginInstanceContainerController } from "./PluginInstanceContainerController";
import { IHasPostgresInstance } from "./interfaces/IHasPostgresInstance";
import { IPostgres } from "@gluestack/glue-plugin-postgres/src/interfaces/IPostgres";

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
  containerController: IContainerController;
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

  getContainerController(): IContainerController {
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
        plugin.getInstances().map((instance: IInstance & IPostgres) => {
          if (instance.getName() === postgres_instance) {
            postgresInstance = instance;
          }
        });
      }
      return postgresInstance;
    }
  }
}
