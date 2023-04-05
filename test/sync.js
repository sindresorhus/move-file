import fs from 'node:fs';
import path from 'node:path';
import test from 'ava';
import {temporaryFile, temporaryDirectory, temporaryWriteSync} from 'tempy';
import tempWrite from 'temp-write';
import sinon from 'sinon';
import {moveFileSync, renameFileSync} from '../index.js';

const fixture = '🦄';

test('missing `source` or `destination` throws', t => {
	t.throws(
		() => moveFileSync(),
		{message: '`sourcePath` and `destinationPath` required'},
	);
});

test('move a file', t => {
	const destination = temporaryFile();
	moveFileSync(tempWrite.sync(fixture), destination);
	t.is(fs.readFileSync(destination, 'utf8'), fixture);
});

test('move a file across devices', t => {
	const exdevError = new Error('exdevError');
	exdevError.code = 'EXDEV';
	fs.renameSync = sinon.stub(fs, 'renameSync').throws(exdevError);

	const destination = temporaryFile();
	moveFileSync(tempWrite.sync(fixture), destination);
	t.is(fs.readFileSync(destination, 'utf8'), fixture);
	fs.renameSync.restore();
});

test('overwrite option', t => {
	t.throws(
		() => moveFileSync(tempWrite.sync('x'), tempWrite.sync('y'), {overwrite: false}),
		{message: /The destination file exists/},
	);
});

test('cwd option', t => {
	const destination = temporaryFile();
	moveFileSync(tempWrite.sync(fixture), 'unicorn-dir/unicorn.txt', {cwd: destination});
	const movedFiled = path.resolve(destination, 'unicorn-dir/unicorn.txt');
	t.is(fs.readFileSync(movedFiled, 'utf8'), fixture);
});

test('directoryMode option', t => {
	const root = temporaryDirectory();
	const directory = `${root}/dir`;
	const destination = `${directory}/file`;
	const directoryMode = 0o700;
	moveFileSync(tempWrite.sync(fixture), destination, {directoryMode});
	const stat = fs.statSync(directory);
	t.is(stat.mode & directoryMode, directoryMode);
});

test('rename a file', t => {
	const file = temporaryWriteSync(fixture, {name: 'unicorn.txt'});
	const dir = path.dirname(file);

	const renamedFile = path.resolve(dir, 'unicorns.txt');

	renameFileSync(file, 'unicorns.txt', {cwd: dir});
	t.is(fs.readFileSync(renamedFile, 'utf8'), fixture);
});

test('renaming must be in same directory', t => {
	const file = temporaryWriteSync(fixture, {name: 'unicorn.txt'});
	const dir = path.dirname(file);

	const renamedFile = path.resolve(dir, 'dir2/unicorns.txt');

	t.throws(
		() => renameFileSync(file, renamedFile),
		{message: '`source` and `destination` must be in the same directory'},
	);
});

test('renaming without `source` or `destination` throws', t => {
	t.throws(
		() => renameFileSync(),
		{message: '`source` and `destination` required'},
	);
});
