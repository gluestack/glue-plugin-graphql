const { promises } = require('fs');

export const writeFile = async (path: string, content: string = '') => {
	try {
		await promises.writeFile(path, content);
	} catch (err: any) {
		console.log('Writing file failed: ' + err.message);
	}

	return Promise.resolve(true);
};
