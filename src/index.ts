//@ts-ignore
import packageJSON from "../package.json";
import { PluginInstance } from "./PluginInstance";
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import ILifeCycle from "@gluestack/framework/types/plugin/interface/ILifeCycle";
import IManagesInstances from "@gluestack/framework/types/plugin/interface/IManagesInstances";
import IGlueStorePlugin from "@gluestack/framework/types/store/interface/IGluePluginStore";
import { attachPostgresInstance } from "./attachPostgresInstance";
import { hasuraInit } from "./helpers/hasuraInit";

//Do not edit the name of this class
export class GlueStackPlugin implements IPlugin, IManagesInstances, ILifeCycle {
  app: IApp;
  instances: IInstance[];
  type: "stateless" | "stateful" | "devonly" = "stateless";
  gluePluginStore: IGlueStorePlugin;

  constructor(app: IApp, gluePluginStore: IGlueStorePlugin) {
    this.app = app;
    this.instances = [];
    this.gluePluginStore = gluePluginStore;
  }

  init() {
    //
  }

  destroy() {
    //
  }

  getName(): string {
    return packageJSON.name;
  }

  getVersion(): string {
    return packageJSON.version;
  }

  getType(): "stateless" | "stateful" | "devonly" {
    return this.type;
  }

  getTemplateFolderPath(): string {
    return `${process.cwd()}/node_modules/${this.getName()}/template`;
  }

  getInstallationPath(target: string): string {
    return `./backend/${target}`;
  }

  async runPostInstall(instanceName: string, target: string) {
    const postgresPlugin: GlueStackPlugin = this.app.getPluginByName(
      "@gluestack/glue-plugin-postgres",
    );
    //Validation
    if (!postgresPlugin || !postgresPlugin.getInstances().length) {
      console.log("\x1b[36m");
      console.log(
        `Install postgres instance: \`node glue add postgres ${instanceName}-postgres\``,
      );
      console.log("\x1b[31m");
      throw new Error(
        "Postgres instance not installed from `@gluestack/glue-plugin-postgres`",
      );
    }
    let hasDBConfig = false;
    const postgresInstanceswithDB: IInstance[] = [];
    for (const instance of postgresPlugin.getInstances()) {
      if (
        instance.gluePluginStore.get("db_config")?.username &&
        instance.gluePluginStore.get("db_config")?.db_name &&
        instance.gluePluginStore.get("db_config")?.password
      ) {
        hasDBConfig = true;
        postgresInstanceswithDB.push(instance);
      }
    }
    if (!hasDBConfig) {
      throw new Error(
        `No ${postgresPlugin.getName()} instance has db configuration`,
      );
    }

    const graphqlInstance: PluginInstance = await this.app.createPluginInstance(
      this,
      instanceName,
      this.getTemplateFolderPath(),
      target,
    );
    await attachPostgresInstance(graphqlInstance, postgresInstanceswithDB);
    await hasuraInit(graphqlInstance);
  }

  createInstance(
    key: string,
    gluePluginStore: IGlueStorePlugin,
    installationPath: string,
  ): IInstance {
    const instance = new PluginInstance(
      this.app,
      this,
      key,
      gluePluginStore,
      installationPath,
    );
    this.instances.push(instance);
    return instance;
  }

  getInstances(): IInstance[] {
    return this.instances;
  }
}
