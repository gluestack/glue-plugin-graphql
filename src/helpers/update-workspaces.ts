import { writeFile } from "./write-file";
import { fileExists } from "./file-exists";

export const updateWorkspaces = async (filepath: string, packagepath: string) => {
  if (! await fileExists(filepath)) {
    return;
  }

  const data = require(filepath);

  // Add the new workspace to the workspaces index
  if (!data.workspaces) {
    data.workspaces = [];
  }

  data.workspaces.push(packagepath.replace("./", ""));

  // Remove duplicates
  data.workspaces = data.workspaces.filter(
    (item: string, index: number) => data.workspaces.indexOf(item) === index
  );

  // Write the file
  await writeFile(filepath, JSON.stringify(data, null, 2));
};
