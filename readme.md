# move-file

> Move a file

The built-in [`fs.rename()`](https://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback) is just a JavaScript wrapper for the C `rename(2)` function, which doesn't support moving files across partitions or devices. This module is what you would have expected `fs.rename()` to be.

## Highlights

- Promise API.
- Supports moving a file across partitions and devices.
- Optionally prevent overwriting an existing file.
- Creates non-existent destination directories for you.

## Install

```sh
npm install move-file
```

## Usage

```js
import {moveFile} from 'move-file';

await moveFile('source/unicorn.png', 'destination/unicorn.png');
console.log('The file has been moved');
```

## API

### moveFile(sourcePath, destinationPath, options?)

Returns a `Promise` that resolves when the file has been moved.

### moveFileSync(sourcePath, destinationPath, options?)

#### sourcePath

Type: `string`

The file you want to move.

#### destinationPath

Type: `string`

Where you want the file moved.

#### options

Type: `object`

See [Options](#options-2).

### renameFile(source, destination, options?)

Returns a `Promise` that resolves when the file has been renamed. `source` and `destination` must be in the same directory.

### renameFileSync(source, destination, options?)

#### source

Type: `string`

The file you want to rename.

#### destination

Type: `string`

What you want to rename the file to.

#### options

Type: `object`

See [Options](#options-2).

### Options

##### overwrite

Type: `boolean`\
Default: `true`

Overwrite existing destination file.

##### cwd

Type: `string`\
Default: `process.cwd()`

The working directory to find source files.

The source and destination path are relative to this.

##### directoryMode

Type: `number`\
Default: `0o777`

[Permissions](https://en.wikipedia.org/wiki/File-system_permissions#Numeric_notation) for created directories.

It has no effect on Windows.

## Related

- [move-file-cli](https://github.com/sindresorhus/move-file-cli) - CLI for this module
- [cp-file](https://github.com/sindresorhus/cp-file) - Copy a file
- [cpy](https://github.com/sindresorhus/cpy) - Copy files
- [make-dir](https://github.com/sindresorhus/make-dir) - Make a directory and its parents if needed
