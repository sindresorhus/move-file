import fs from 'node:fs';
import path from 'node:path';
import test from 'ava';
import {temporaryFile, temporaryDirectory, temporaryWrite} from 'tempy';
import tempWrite from 'temp-write';
import sinon from 'sinon';
import {moveFile, renameFile} from '../index.js';

const fixture = '🦄';

test('missing `source` or `destination` throws', async t => {
	await t.throwsAsync(
		moveFile(),
		{message: '`sourcePath` and `destinationPath` required'},
	);
});

test('move a file', async t => {
	const destination = temporaryFile();
	await moveFile(tempWrite.sync(fixture), destination);
	t.is(fs.readFileSync(destination, 'utf8'), fixture);
});

test.serial('move a file across devices', async t => {
	const exdevError = new Error('exdevError');
	exdevError.code = 'EXDEV';
	fs.rename = sinon.stub(fs, 'rename').throws(exdevError);

	const destination = temporaryFile();
	await moveFile(tempWrite.sync(fixture), destination);
	t.is(fs.readFileSync(destination, 'utf8'), fixture);
	fs.rename.restore();
});

test('overwrite option', async t => {
	await t.throwsAsync(
		moveFile(tempWrite.sync('x'), tempWrite.sync('y'), {overwrite: false}),
		{message: /The destination file exists/},
	);
});

test('cwd option', async t => {
	const destination = temporaryFile();
	await moveFile(tempWrite.sync(fixture), 'unicorn-dir/unicorn.txt', {cwd: destination});
	const movedFiled = path.resolve(destination, 'unicorn-dir/unicorn.txt');
	t.is(fs.readFileSync(movedFiled, 'utf8'), fixture);
});

test('directoryMode option', async t => {
	const root = temporaryDirectory();
	const directory = `${root}/dir`;
	const destination = `${directory}/file`;
	const directoryMode = 0o700;
	await moveFile(tempWrite.sync(fixture), destination, {directoryMode});
	const stat = fs.statSync(directory);
	t.is(stat.mode & directoryMode, directoryMode);
});

test('rename a file', async t => {
	const file = await temporaryWrite(fixture, {name: 'unicorn.txt'});
	const dir = path.dirname(file);

	const renamedFile = path.resolve(dir, 'unicorns.txt');

	await renameFile(file, 'unicorns.txt', {cwd: dir});
	t.is(fs.readFileSync(renamedFile, 'utf8'), fixture);
});

test('renaming must be in same directory', async t => {
	const file = await temporaryWrite(fixture, {name: 'unicorn.txt'});
	const dir = path.dirname(file);

	const renamedFile = path.resolve(dir, 'dir2/unicorns.txt');

	await t.throwsAsync(
		renameFile(file, renamedFile),
		{message: '`source` and `destination` must be in the same directory'},
	);
});

test('renaming without `source` or `destination` throws', async t => {
	await t.throwsAsync(
		renameFile(),
		{message: '`source` and `destination` required'},
	);
});
