export interface Options {
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
}

/**
Move a file asynchronously.

@param sourcePath - The file you want to move.
@param destinationPath - Where you want the file moved.
@returns A `Promise` that resolves when the file has been moved.

@example
```
import {moveFile} from 'move-file';

await moveFile('source/unicorn.png', 'destination/unicorn.png');
console.log('The file has been moved');
```
*/
export function moveFile(sourcePath: string, destinationPath: string, options?: Options): Promise<void>;
