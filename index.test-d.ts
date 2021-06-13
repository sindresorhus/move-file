import {expectError, expectType} from 'tsd';
import moveFile = require('.');

expectType<Promise<void>>(
	moveFile('source/unicorn.png', 'destination/unicorn.png')
);
expectType<Promise<void>>(
	moveFile('source/unicorn.png', 'destination/unicorn.png', {overwrite: false})
);
expectType<Promise<void>>(
	moveFile('source/unicorn.png', 'destination/unicorn.png', {
		directoryMode: 0o700
	})
);
expectError(
	await moveFile('source/unicorn.png', 'destination/unicorn.png', {
		directoryMode: '700'
	})
);
expectType<void>(
	moveFile.sync('source/unicorn.png', 'destination/unicorn.png')
);
expectType<void>(
	moveFile.sync('source/unicorn.png', 'destination/unicorn.png', {
		overwrite: false
	})
);
expectType<void>(
	moveFile.sync('source/unicorn.png', 'destination/unicorn.png', {
		directoryMode: 0o700
	})
);
expectError(
	moveFile.sync('source/unicorn.png', 'destination/unicorn.png', {
		directoryMode: '700'
	})
);
