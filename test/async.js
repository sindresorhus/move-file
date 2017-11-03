import fs from 'fs';
import test from 'ava';
import tempy from 'tempy';
import tempWrite from 'temp-write';
import sinon from 'sinon';
import m from '..';

const fixture = '🦄';

test('missing `source` or `destination` throws', async t => {
	await t.throws(m());
});

test('move a file', async t => {
	const destination = tempy.file();
	await m(tempWrite.sync(fixture), destination);
	t.is(fs.readFileSync(destination, 'utf8'), fixture);
});

test.serial('move a file across devices', async t => {
	const exdevError = new Error();
	exdevError.code = 'EXDEV';
	fs.rename = sinon.stub(fs, 'rename').throws(exdevError);

	const destination = tempy.file();
	await m(tempWrite.sync(fixture), destination);
	t.is(fs.readFileSync(destination, 'utf8'), fixture);
	fs.rename.restore();
});

test('overwrite option', async t => {
	await t.throws(
		m(tempWrite.sync('x'), tempWrite.sync('y'), {overwrite: false}),
		/Destination file exists/
	);
});
