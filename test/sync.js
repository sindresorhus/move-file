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

test('move a symlink across devices', t => {
	const exdevError = new Error('exdevError');
	exdevError.code = 'EXDEV';
	fs.renameSync = sinon.stub(fs, 'renameSync').throws(exdevError);

	const directory = temporaryDirectory();
	const target = path.join(directory, 'target');
	const symlink = path.join(directory, 'symlink');
	const destination = temporaryFile();

	fs.writeFileSync(target, fixture);
	fs.symlinkSync(target, symlink);

	moveFileSync(symlink, destination);

	t.true(fs.lstatSync(destination).isSymbolicLink());
	t.is(fs.readlinkSync(destination), target);
	t.false(fs.existsSync(symlink));

	fs.renameSync.restore();
});

test('move a broken symlink across devices', t => {
	const exdevError = new Error('exdevError');
	exdevError.code = 'EXDEV';
	fs.renameSync = sinon.stub(fs, 'renameSync').throws(exdevError);

	const directory = temporaryDirectory();
	const symlink = path.join(directory, 'symlink');
	const destination = temporaryFile();

	fs.symlinkSync('/nonexistent', symlink);

	moveFileSync(symlink, destination);

	t.true(fs.lstatSync(destination).isSymbolicLink());
	t.is(fs.readlinkSync(destination), '/nonexistent');
	t.false(fs.existsSync(symlink));

	fs.renameSync.restore();
});

test('move a directory across devices', t => {
	const exdevError = new Error('exdevError');
	exdevError.code = 'EXDEV';
	fs.renameSync = sinon.stub(fs, 'renameSync').throws(exdevError);

	const source = temporaryDirectory();
	fs.writeFileSync(path.join(source, 'file1.txt'), 'content1');
	fs.writeFileSync(path.join(source, 'file2.txt'), 'content2');
	fs.mkdirSync(path.join(source, 'subdir'));
	fs.writeFileSync(path.join(source, 'subdir', 'nested.txt'), 'nested');

	const destination = path.join(temporaryDirectory(), 'moved');

	moveFileSync(source, destination);

	t.true(fs.statSync(destination).isDirectory());
	t.is(fs.readFileSync(path.join(destination, 'file1.txt'), 'utf8'), 'content1');
	t.is(fs.readFileSync(path.join(destination, 'file2.txt'), 'utf8'), 'content2');
	t.is(fs.readFileSync(path.join(destination, 'subdir', 'nested.txt'), 'utf8'), 'nested');
	t.false(fs.existsSync(source));

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
	const movedFile = path.resolve(destination, 'unicorn-dir/unicorn.txt');
	t.is(fs.readFileSync(movedFile, 'utf8'), fixture);
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
