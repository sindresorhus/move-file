import path from 'node:path';
import fs, {promises as fsP} from 'node:fs';
import {pathExists} from 'path-exists';

export async function moveFile(sourcePath, destinationPath, {overwrite = true, directoryMode} = {}) {
	if (!sourcePath || !destinationPath) {
		throw new TypeError('`sourcePath` and `destinationPath` required');
	}

	if (!overwrite && await pathExists(destinationPath)) {
		throw new Error(`The destination file exists: ${destinationPath}`);
	}

	await fsP.mkdir(path.dirname(destinationPath), {
		recursive: true,
		mode: directoryMode,
	});

	try {
		await fsP.rename(sourcePath, destinationPath);
	} catch (error) {
		if (error.code === 'EXDEV') {
			await fsP.copyFile(sourcePath, destinationPath);
			await fsP.unlink(sourcePath);
		} else {
			throw error;
		}
	}
}

export function moveFileSync(sourcePath, destinationPath, {overwrite = true, directoryMode} = {}) {
	if (!sourcePath || !destinationPath) {
		throw new TypeError('`sourcePath` and `destinationPath` required');
	}

	if (!overwrite && fs.existsSync(destinationPath)) {
		throw new Error(`The destination file exists: ${destinationPath}`);
	}

	fs.mkdirSync(path.dirname(destinationPath), {
		recursive: true,
		mode: directoryMode,
	});

	try {
		fs.renameSync(sourcePath, destinationPath);
	} catch (error) {
		if (error.code === 'EXDEV') {
			fs.copyFileSync(sourcePath, destinationPath);
			fs.unlinkSync(sourcePath);
		} else {
			throw error;
		}
	}
}
