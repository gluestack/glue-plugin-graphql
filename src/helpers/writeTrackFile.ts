import fs from "fs";
import os from "os";
import util from "util";

const writeFile = util.promisify(fs.writeFile);

const writeTrackFile = async (
  fileName: string,
  fileContent: any,
  folderPath: string,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      await writeFile(
        `${folderPath}/${fileName}`,
        JSON.stringify(fileContent, null, 2) + os.EOL,
      );
      resolve("done");
    } catch (err) {
      reject(err);
    }
  });
};

export default writeTrackFile;
