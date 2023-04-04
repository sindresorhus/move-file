import {expectError, expectType} from 'tsd';
import {moveFile, moveFileSync, renameFile, renameFileSync} from './index.js';

expectType<Promise<void>>(
	moveFile('source/unicorn.png', 'destination/unicorn.png'),
);
expectType<Promise<void>>(
	moveFile('source/unicorn.png', 'destination/unicorn.png', {
		overwrite: false,
	}),
);
expectType<Promise<void>>(
	moveFile('unicorn.png', '../destination/unicorn.png', {
		cwd: 'source',
	}),
);
expectType<Promise<void>>(
	moveFile('source/unicorn.png', 'destination/unicorn.png', {
		directoryMode: 0o700,
	}),
);
expectError(
	await moveFile('source/unicorn.png', 'destination/unicorn.png', {
		directoryMode: '700',
	}),
);
expectType<void>(
	moveFileSync('source/unicorn.png', 'destination/unicorn.png'),
);
expectType<void>(
	moveFileSync('source/unicorn.png', 'destination/unicorn.png', {
		overwrite: false,
	}),
);
expectType<void>(
	moveFileSync('unicorn.png', '../destination/unicorn.png', {
		cwd: 'source',
	}),
);
expectType<void>(
	moveFileSync('source/unicorn.png', 'destination/unicorn.png', {
		directoryMode: 0o700,
	}),
);
expectError(
	moveFileSync('source/unicorn.png', 'destination/unicorn.png', {
		directoryMode: '700',
	}),
);
