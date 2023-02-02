import { join } from "path";
import { execute } from "../helpers/spawn";
import { GlueStackPlugin } from "..";

export function graphqlConsole(program: any, glueStackPlugin: GlueStackPlugin) {
  const command = program
    .command("graphql:console")
    .argument(
      "<instance-name>",
      "Name of the container instance to up (required)",
    )
    .option('--port <port>', 'Port to run the GraphQL instance on (default: 9695)', '9695')
    .description(
      "Opens up Hasura Console against the provided GraphlQL instance name",
    )
    .action((instanceName: string, options: any) => runner(instanceName, options, glueStackPlugin));
}

export async function runner(
  instanceName: string,
  options: any,
  glueStackPlugin: GlueStackPlugin,
) {
  const instances = glueStackPlugin.getInstances();
  if (!instances || instances.length <= 0) {
    console.log("> No GraphQL Instances found. Please add one and try again!");
    process.exit(-1);
  }

  const instance = instances.find((instance) => instance.getName() === instanceName);
  if (!instance) {
    console.log(`> No GraphQL Instance found with the ${instanceName} name. Please add it and try again!`);
    process.exit(-1);
  }

  const installationPath: string = instance.getInstallationPath();
  const path: string = join(process.cwd(), installationPath);

  await execute('hasura', [
    'console',
    '--console-port',
    options.port,
    '--skip-update-check'
  ], {
    cwd: installationPath,
    stdio: 'inherit'
  });
}
