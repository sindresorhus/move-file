'use strict';
const util = require('util');
const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const cpFile = require('cp-file');
const pathExists = require('path-exists');
const makeDir = require('make-dir');

module.exports = async (source, destination, options) => {
	if (!source || !destination) {
		throw new TypeError('`source` and `destination` file required');
	}

	options = Object.assign({overwrite: true}, options);

	if (!options.overwrite && await pathExists(destination)) {
		throw new Error('Destination file exists');
	}

	try {
		await util.promisify(fs.rename)(source, destination);
	} catch (err) {
		if (err.code === 'EXDEV') {
			// We prefer `mv` if it exists as it's faster
			try {
				await util.promisify(fs.access)('/bin/mv', fs.constants.X_OK);
				await makeDir(path.dirname(destination));
				await util.promisify(childProcess.execFile)('/bin/mv', [source, destination]);
			} catch (err) {
				await cpFile(source, destination);
				await util.promisify(fs.unlink)(source);
			}
		} else {
			throw err;
		}
	}
};

module.exports.sync = (source, destination, options) => {
	if (!source || !destination) {
		throw new TypeError('`source` and `destination` file required');
	}

	options = Object.assign({overwrite: true}, options);

	if (!options.overwrite && fs.existsSync(destination)) {
		throw new Error('Destination file exists');
	}

	try {
		fs.renameSync(source, destination);
	} catch (err) {
		if (err.code === 'EXDEV') {
			try {
				fs.accessSync('/bin/mv', fs.constants.X_OK);
				makeDir.sync(path.dirname(destination));
				childProcess.execFileSync('/bin/mv', [source, destination]);
			} catch (err) {
				cpFile.sync(source, destination);
				fs.unlinkSync(source);
			}
		} else {
			throw err;
		}
	}
};
