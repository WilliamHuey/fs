# Node.js File System Helpers

## Install

Node:

```
npm install tower-fs
```

## Quick Start

``` javascript
var tfs = require('tower-fs');

// general
tfs.glob
tfs.globSync
tfs.absolutePath
tfs.relativePath
tfs.dirname
tfs.basename
tfs.exists
tfs.existsSync
tfs.isFile
tfs.isFileSync
tfs.isDirectory
tfs.isDirectorySync
tfs.chmod
tfs.chmodSync
tfs.join
tfs.watch
tfs.stat
tfs.statSync
tfs.createReadStream
tfs.createWriteStream
tfs.pathSeparator
tfs.pathSeparatorPattern
// files
tfs.readFile // tfs.createFile
tfs.readFileSync // tfs.createFileSync
tfs.writeFile
tfs.writeFileSync
tfs.removeFile
tfs.removeFileSync
tfs.copyFile
tfs.copyFileSync
// directories (will fail if trying to create nested directories)
tfs.createDirectory
tfs.createDirectorySync
tfs.removeDirectory
tfs.removeDirectorySync
// use this to create nested directories
tfs.createDirectoryRecursive
tfs.createDirectoryRecursiveSync
tfs.copyDirectoryRecursive
tfs.copyDirectoryRecursiveSync
tfs.removeDirectoryRecursive
tfs.removeDirectoryRecursiveSync
tfs.readDirectoryRecursive
tfs.readDirectoryRecursiveSync
// checksum
tfs.fileDigest
tfs.pathWithDigest
tfs.pathWithoutDigest
```

TODO: symlinks

## Why?

Because the Node.js `fs` is incomplete and requires piecing together several libraries to get full functionality. This module encapsulates complete `fs` functionality.

## Licence

MIT