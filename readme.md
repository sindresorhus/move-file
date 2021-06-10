# move-file

> Move a file

The built-in [`fs.rename()`](https://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback) is just a JavaScript wrapper for the C `rename(2)` function, which doesn't support moving files across partitions or devices. This module is what you would have expected `fs.rename()` to be.

## Highlights

- Promise API.
- Supports moving a file across partitions and devices.
- Optionally prevent overwriting an existing file.
- Creates non-existent destination directories for you.

## Install

```
$ npm install move-file
```

## Usage

```js
const moveFile = require('move-file');

(async () => {
	await moveFile('source/unicorn.png', 'destination/unicorn.png');
	console.log('The file has been moved');
})();
```

## API

### moveFile(source, destination, options?)

Returns a `Promise` that resolves when the file has been moved.

### moveFile.sync(source, destination, options?)

#### source

Type: `string`

File you want to move.

#### destination

Type: `string`

Where you want the file moved.

#### options

Type: `object`

##### overwrite

Type: `boolean`\
Default: `true`

Overwrite existing destination file.

##### directoryMode

Type: `number` | `string`\
Default: `0o777`

Permissions for created directories.

## Related

- [move-file-cli](https://github.com/sindresorhus/move-file-cli) - CLI for this module
- [cp-file](https://github.com/sindresorhus/cp-file) - Copy a file
- [cpy](https://github.com/sindresorhus/cpy) - Copy files
- [make-dir](https://github.com/sindresorhus/make-dir) - Make a directory and its parents if needed
