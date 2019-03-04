import {expectType} from 'tsd-check';
import moveFile, {sync as moveFileSync} from '.';

expectType<Promise<void>>(
	moveFile('source/unicorn.png', 'destination/unicorn.png')
);
expectType<Promise<void>>(
	moveFile('source/unicorn.png', 'destination/unicorn.png', {overwrite: false})
);
expectType<void>(moveFileSync('source/unicorn.png', 'destination/unicorn.png'));
expectType<void>(
	moveFileSync('source/unicorn.png', 'destination/unicorn.png', {
		overwrite: false
	})
);
