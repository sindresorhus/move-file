import fs from 'fs';
import test from 'ava';
import tempy from 'tempy';
import tempWrite from 'temp-write';
import sinon from 'sinon';
import m from '..';

const fixture = '🦄';

test('missing `source` or `destination` throws', t => {
	t.throws(() => {
		m.sync();
	});
});

test('move a file', t => {
	const destination = tempy.file();
	m.sync(tempWrite.sync(fixture), destination);
	t.is(fs.readFileSync(destination, 'utf8'), fixture);
});

test('move a file across devices', t => {
	const exdevError = new Error();
	exdevError.code = 'EXDEV';
	fs.renameSync = sinon.stub(fs, 'renameSync').throws(exdevError);

	const destination = tempy.file();
	m.sync(tempWrite.sync(fixture), destination);
	t.is(fs.readFileSync(destination, 'utf8'), fixture);
	fs.renameSync.restore();
});

test('move a file across devices using fallback', t => {
	const exdevError = new Error();
	exdevError.code = 'EXDEV';
	fs.renameSync = sinon.stub(fs, 'renameSync').throws(exdevError);
	fs.accessSync = sinon.stub(fs, 'accessSync').throws(new Error());

	const destination = tempy.file();
	m.sync(tempWrite.sync(fixture), destination);
	t.is(fs.readFileSync(destination, 'utf8'), fixture);

	fs.renameSync.restore();
	fs.accessSync.restore();
});

test('overwrite option', t => {
	t.throws(() => {
		m.sync(tempWrite.sync('x'), tempWrite.sync('y'), {overwrite: false});
	}, /Destination file exists/);
});
