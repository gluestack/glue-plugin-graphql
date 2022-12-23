const { SpawnHelper } = require("@gluestack/helpers");
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import { IHasPostgresInstance } from ".././interfaces/IHasPostgresInstance";

async function script(
  pluginInstance: IInstance & IHasContainerController & IHasPostgresInstance,
  command: "version" | "metadataApply" | "migrateApply" | "metadataClear",
) {
  const containerController = pluginInstance.getContainerController();
  const env = await containerController.getEnv();

  const commands: any = {
    version: ["hasura", "version", "--skip-update-check"],
    metadataApply: [
      "hasura",
      "metadata",
      "apply",
      "--endpoint",
      `http://localhost:${await containerController.getPortNumber()}`,
      "--admin-secret",
      env.HASURA_GRAPHQL_ADMIN_SECRET,
      "--skip-update-check",
    ],
    migrateApply: [
      "hasura",
      "migrate",
      "apply",
      "--endpoint",
      `http://localhost:${await containerController.getPortNumber()}`,
      "--admin-secret",
      env.HASURA_GRAPHQL_ADMIN_SECRET,
      "--database-name",
      pluginInstance.getPostgresInstance().gluePluginStore.get("db_config")
        ?.db_name,
      "--skip-update-check",
    ],

    metadataClear: [
      "hasura",
      "metadata",
      "clear",
      "--endpoint",
      `http://localhost:${await containerController.getPortNumber()}`,
      "--admin-secret",
      env.HASURA_GRAPHQL_ADMIN_SECRET,
      "--skip-update-check",
    ],
  };
  return commands[command] || [];
}

export async function hasuraCommand(
  pluginInstance: IInstance & IHasContainerController & IHasPostgresInstance,
  command: "version" | "metadataApply" | "migrateApply" | "metadataClear",
) {
  return new Promise(async (resolve, reject) => {
    console.log("\x1b[33m");
    console.log(
      `${pluginInstance.getName()}: Running \`${(
        await script(pluginInstance, command)
      ).join(" ")}\``,
    );
    console.log("\x1b[0m");
    SpawnHelper.run(
      pluginInstance.getInstallationPath(),
      await script(pluginInstance, command),
    )
      .then((resp: any) => {
        return resolve(true);
      })
      .catch((e: any) => {
        return reject(e);
      });
  });
}
