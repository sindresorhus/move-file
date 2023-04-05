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

expectType<Promise<void>>(
	renameFile('source/unicorn.png', 'source/unicorns.png'),
);
expectType<Promise<void>>(
	renameFile('source/unicorn.png', 'source/unicorns.png', {
		overwrite: false,
	}),
);
expectType<Promise<void>>(
	renameFile('unicorn.png', 'unicorns.png', {
		cwd: 'source',
	}),
);
expectType<Promise<void>>(
	renameFile('source/unicorn.png', 'source/unicorns.png', {
		directoryMode: 0o700,
	}),
);
expectError(
	await renameFile('source/unicorn.png', 'source/unicorns.png', {
		directoryMode: '700',
	}),
);
expectType<void>(
	renameFileSync('source/unicorn.png', 'source/unicorns.png'),
);
expectType<void>(
	renameFileSync('source/unicorn.png', 'source/unicorns.png', {
		overwrite: false,
	}),
);
expectType<void>(
	renameFileSync('unicorn.png', 'unicorns.png', {
		cwd: 'source',
	}),
);
expectType<void>(
	renameFileSync('source/unicorn.png', 'source/unicorns.png', {
		directoryMode: 0o700,
	}),
);
expectError(
	renameFileSync('source/unicorn.png', 'source/unicorns.png', {
		directoryMode: '700',
	}),
);
