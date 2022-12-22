import { join } from "path";
import { writeFileSync } from "fs";

export const generateDockerfile = async (installationPath: string) => {
  const filepath = join(process.cwd(), installationPath);

  // Create an empty Dockerfile
  const dockerfile = [];

  // Set the base image for the Dockerfile
  dockerfile.push("FROM hasura/graphql-engine");

  // ENV Management:: docker run -d -p 8080:8080 --env-file .env --name hasura hasura

  // Copy the package.json and package-lock.json files to the working directory
  dockerfile.push("COPY . .");

  // Expose port 8080
  dockerfile.push("EXPOSE 8080");

  // Specify the command to run when the Docker container is started
  dockerfile.push('CMD [ "graphql-engine", "serve" ]');

  // Write the Dockerfile to the filesystem
  writeFileSync(join(filepath, "Dockerfile"), dockerfile.join("\n"));
};
