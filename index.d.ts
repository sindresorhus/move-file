export type Options = {
	/**
	Overwrite existing destination file.

	@default true
	*/
	readonly overwrite?: boolean;

	/**
	The working directory to find source files.

	The source and destination path are relative to this.

	@default process.cwd()
	*/
	readonly cwd?: string;

	/**
	[Permissions](https://en.wikipedia.org/wiki/File-system_permissions#Numeric_notation) for created directories.

	It has no effect on Windows.

	@default 0o777
	*/
	readonly directoryMode?: number;
};

/**
Move a file, directory, or symlink asynchronously.

@param sourcePath - The file, directory, or symlink you want to move.
@param destinationPath - Where you want it moved.
@returns A `Promise` that resolves when the file, directory, or symlink has been moved.

@example
```
import {moveFile} from 'move-file';

await moveFile('source/unicorn.png', 'destination/unicorn.png');
console.log('The file has been moved');
```
*/
export function moveFile(sourcePath: string, destinationPath: string, options?: Options): Promise<void>;

/**
Move a file, directory, or symlink synchronously.

@param sourcePath - The file, directory, or symlink you want to move.
@param destinationPath - Where you want it moved.

@example
```
import {moveFileSync} from 'move-file';

moveFileSync('source/unicorn.png', 'destination/unicorn.png');
console.log('The file has been moved');
```
*/
export function moveFileSync(sourcePath: string, destinationPath: string, options?: Options): void;

/**
Rename a file asynchronously.

@param source - The file you want to rename.
@param destination - The name of the renamed file.
@returns A `Promise` that resolves when the file has been renamed.

@example
```
import {renameFile} from 'move-file';

await renameFile('unicorn.png', 'unicorns.png', {cwd: 'source'});
console.log('The file has been renamed');
```
*/
export function renameFile(source: string, destination: string, options?: Options): Promise<void>;

/**
Rename a file synchronously.

@param source - The file you want to rename.
@param destination - The name of the renamed file.

@example
```
import {renameFileSync} from 'move-file';

renameFileSync('unicorn.png', 'unicorns.png', {cwd: 'source'});
console.log('The file has been renamed');
```
*/
export function renameFileSync(source: string, destination: string, options?: Options): void;
