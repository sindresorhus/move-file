import process from 'node:process';
import path from 'node:path';
import fs, {promises as fsP} from 'node:fs';
import {pathExists} from 'path-exists';

const resolvePath = (cwd, sourcePath, destinationPath) => {
	sourcePath = path.resolve(cwd, sourcePath);
	destinationPath = path.resolve(cwd, destinationPath);

	return {
		sourcePath,
		destinationPath,
	};
};

const validatePathsExist = (sourcePath, destinationPath, suffix = 'Path') => {
	if (!sourcePath || !destinationPath) {
		throw new TypeError(`\`source${suffix}\` and \`destination${suffix}\` required`);
	}
};

const validateSameDirectory = (source, destination) => {
	if (path.dirname(source) !== path.dirname(destination)) {
		throw new Error('`source` and `destination` must be in the same directory');
	}
};

const _moveFile = async (sourcePath, destinationPath, {overwrite = true, cwd = process.cwd(), directoryMode, validateDirectory = false} = {}) => {
	if (cwd) {
		({sourcePath, destinationPath} = resolvePath(cwd, sourcePath, destinationPath));
	}

	if (validateDirectory) {
		validateSameDirectory(sourcePath, destinationPath);
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
};

const _moveFileSync = (sourcePath, destinationPath, {overwrite = true, cwd = process.cwd(), directoryMode, validateDirectory = false} = {}) => {
	if (cwd) {
		({sourcePath, destinationPath} = resolvePath(cwd, sourcePath, destinationPath));
	}

	if (validateDirectory) {
		validateSameDirectory(sourcePath, destinationPath);
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
};

export async function moveFile(sourcePath, destinationPath, options) {
	validatePathsExist(sourcePath, destinationPath);
	return _moveFile(sourcePath, destinationPath, options);
}

export function moveFileSync(sourcePath, destinationPath, options) {
	validatePathsExist(sourcePath, destinationPath);
	return _moveFileSync(sourcePath, destinationPath, options);
}

export async function renameFile(source, destination, options = {}) {
	validatePathsExist(source, destination, '');
	return _moveFile(source, destination, {...options, validateDirectory: true});
}

export function renameFileSync(source, destination, options = {}) {
	validatePathsExist(source, destination, '');
	return _moveFileSync(source, destination, {...options, validateDirectory: true});
}
