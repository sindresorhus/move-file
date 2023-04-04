import fs from 'node:fs';
import path from 'node:path';
import test from 'ava';
import tempy from 'tempy';
import tempWrite from 'temp-write';
import sinon from 'sinon';
import {moveFileSync} from '../index.js';

const fixture = '🦄';

test('missing `source` or `destination` throws', t => {
	t.throws(() => {
		moveFileSync();
	});
});

test('move a file', t => {
	const destination = tempy.file();
	moveFileSync(tempWrite.sync(fixture), destination);
	t.is(fs.readFileSync(destination, 'utf8'), fixture);
});

test('move a file across devices', t => {
	const exdevError = new Error('exdevError');
	exdevError.code = 'EXDEV';
	fs.renameSync = sinon.stub(fs, 'renameSync').throws(exdevError);

	const destination = tempy.file();
	moveFileSync(tempWrite.sync(fixture), destination);
	t.is(fs.readFileSync(destination, 'utf8'), fixture);
	fs.renameSync.restore();
});

test('overwrite option', t => {
	t.throws(() => {
		moveFileSync(tempWrite.sync('x'), tempWrite.sync('y'), {overwrite: false});
	}, {
		message: /The destination file exists/,
	});
});

test('cwd option', async t => {
	const destination = tempy.file();
	moveFileSync(tempWrite.sync(fixture), 'unicorn-dir/unicorn.txt', {cwd: destination});
	const movedFiled = path.resolve(destination, 'unicorn-dir/unicorn.txt');
	t.is(fs.readFileSync(movedFiled, 'utf8'), fixture);
});

test('directoryMode option', t => {
	const root = tempy.directory();
	const directory = `${root}/dir`;
	const destination = `${directory}/file`;
	const directoryMode = 0o700;
	moveFileSync(tempWrite.sync(fixture), destination, {directoryMode});
	const stat = fs.statSync(directory);
	t.is(stat.mode & directoryMode, directoryMode);
});
