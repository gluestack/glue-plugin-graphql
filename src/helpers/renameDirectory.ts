import { rename } from 'fs/promises';

// Renames old directory name with the given new directory name
const renameDir = async (path: string, oldDirName: string, newDirName: string) => {
	return new Promise(async (resolve, reject) => {
		try {
			await rename(
				`${path}/${oldDirName}`,
				`${path}/${newDirName}`
			)
			resolve('done')
		} catch (err) {
			reject(err)
		}
	})
}

export default renameDir