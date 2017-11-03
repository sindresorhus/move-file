'use strict';
const util = require('util');
const path = require('path');
const fs = require('fs');
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

	await makeDir(path.dirname(destination));

	try {
		await util.promisify(fs.rename)(source, destination);
	} catch (err) {
		if (err.code === 'EXDEV') {
			// TODO: Remove this when Node.js 10 is target
			const copy = fs.copyFile ? util.promisify(fs.copyFile) : cpFile;
			await copy(source, destination);
			await util.promisify(fs.unlink)(source);
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

	makeDir.sync(path.dirname(destination));

	try {
		fs.renameSync(source, destination);
	} catch (err) {
		if (err.code === 'EXDEV') {
			// TODO: Remove this when Node.js 10 is target
			const copy = fs.copyFileSync || cpFile.sync;
			copy(source, destination);
			fs.unlinkSync(source);
		} else {
			throw err;
		}
	}
};
