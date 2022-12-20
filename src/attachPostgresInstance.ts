const prompts = require("prompts");
import { PluginInstance } from "./PluginInstance";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";

export const setPostgresConfig = async (
  grapqhlPlugin: PluginInstance,
  postgresInstance: PluginInstance,
) => {
  if (!postgresInstance.gluePluginStore.get("db_config")) {
    console.error(`\nThis instance does not have any config\n`);
    return;
  }

  grapqhlPlugin.gluePluginStore.set(
    "postgres_instance",
    postgresInstance.getName(),
  );
  return grapqhlPlugin.gluePluginStore.get("postgres_instance");
};

async function selectPostgresInstance(postgresInstances: IInstance[]) {
  const choices = postgresInstances.map((instance: PluginInstance) => {
    return {
      title: instance.getName(),
      description: `Select ${instance.getName()} instance`,
      value: instance,
    };
  });
  const { value } = await prompts({
    type: "select",
    name: "value",
    message: "Select an instance",
    choices: choices,
  });

  return value;
}

export async function attachPostgresInstance(
  grapqhlPlugin: PluginInstance,
  postgresInstances: IInstance[],
) {
  const instance = await selectPostgresInstance(postgresInstances);
  if (instance) {
    await setPostgresConfig(grapqhlPlugin, instance);
  }
}
