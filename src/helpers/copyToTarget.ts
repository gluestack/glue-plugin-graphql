const fs = require('fs-extra');

export async function copyToTarget(sourceFolder: string, targetFolder: string) {
  await fs.copySync(sourceFolder, targetFolder);
}
