import fs from 'fs';
import test from 'ava';
import tempy from 'tempy';
import tempWrite from 'temp-write';
import sinon from 'sinon';
import moveFile from '..';

const fixture = '🦄';

test('missing `source` or `destination` throws', t => {
	t.throws(() => {
		moveFile.sync();
	});
});

test('move a file', t => {
	const destination = tempy.file();
	moveFile.sync(tempWrite.sync(fixture), destination);
	t.is(fs.readFileSync(destination, 'utf8'), fixture);
});

test('move a file across devices', t => {
	const exdevError = new Error();
	exdevError.code = 'EXDEV';
	fs.renameSync = sinon.stub(fs, 'renameSync').throws(exdevError);

	const destination = tempy.file();
	moveFile.sync(tempWrite.sync(fixture), destination);
	t.is(fs.readFileSync(destination, 'utf8'), fixture);
	fs.renameSync.restore();
});

test('overwrite option', t => {
	t.throws(() => {
		moveFile.sync(tempWrite.sync('x'), tempWrite.sync('y'), {overwrite: false});
	}, /Destination file exists/);
});
