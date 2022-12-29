const { SpawnHelper } = require("@gluestack/helpers");
import { PluginInstance } from "../../src/PluginInstance";
import { isEndpointUp } from "./isEndpointUp";

async function installScript(graphqlPluginInstance: PluginInstance) {
  const containerController = graphqlPluginInstance.getContainerController();
  const env = await containerController.getEnv();

  return [
    "hasura",
    "init",
    ".",
    "--endpoint",
    `http://localhost:${await containerController.getPortNumber()}`,
    "--admin-secret",
    env.HASURA_GRAPHQL_ADMIN_SECRET,
    "--skip-update-check",
  ];
}

export function hasuraInit(graphqlPluginInstance: PluginInstance) {
  const containerController = graphqlPluginInstance.getContainerController();

  return new Promise((resolve, reject) => {
    containerController
      .up()
      .then(async () => {
        // isEndpointUp(
        //   `http://localhost:${await containerController.getPortNumber()}/v1/version`,
        // )
        //   .then(async () => {
            console.log("\x1b[33m");
            console.log(
              `${graphqlPluginInstance.getName()}: Running \`${(
                await installScript(graphqlPluginInstance)
              ).join(" ")}\``,
            );
            console.log("\x1b[0m");
            SpawnHelper.run(
              graphqlPluginInstance.getInstallationPath(),
              await installScript(graphqlPluginInstance),
            )
              .then((resp: any) => {
                return resolve(true);
              })
              .catch((e: any) => {
                return reject(e);
              });
          // })
          // .catch((e: any) => {
          //   return reject(e);
          // });
      })
      .catch((e: any) => {
        return reject(e);
      });
  });
}
