import process from 'node:process';
import path from 'node:path';
import fs, {promises as fsPromises} from 'node:fs';

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

	if (!overwrite && fs.existsSync(destinationPath)) {
		throw new Error(`The destination file exists: ${destinationPath}`);
	}

	await fsPromises.mkdir(path.dirname(destinationPath), {
		recursive: true,
		mode: directoryMode,
	});

	try {
		await fsPromises.rename(sourcePath, destinationPath);
	} catch (error) {
		if (error.code === 'EXDEV') {
			const stats = await fsPromises.lstat(sourcePath);
			if (stats.isSymbolicLink()) {
				const target = await fsPromises.readlink(sourcePath);
				await fsPromises.symlink(target, destinationPath);
				await fsPromises.unlink(sourcePath);
			} else {
				await fsPromises.cp(sourcePath, destinationPath, {recursive: true, preserveTimestamps: true});
				await fsPromises.rm(sourcePath, {recursive: true});
			}
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
			const stats = fs.lstatSync(sourcePath);
			if (stats.isSymbolicLink()) {
				const target = fs.readlinkSync(sourcePath);
				fs.symlinkSync(target, destinationPath);
				fs.unlinkSync(sourcePath);
			} else {
				fs.cpSync(sourcePath, destinationPath, {recursive: true, preserveTimestamps: true});
				fs.rmSync(sourcePath, {recursive: true});
			}
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
