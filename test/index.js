var tfs = require('..')
  , assert = require('assert');

describe('tower-fs', function(){
  it('should createFile', function(done){
    tfs.createFile('tmp/file.txt', 'asdf', function(error){
      assert(!error);
      assert(tfs.existsSync('tmp/file.txt'));

      done();
    });
  });

  it('should removeFile', function(done){
    tfs.removeFile('tmp/file.txt', function(error){
      assert(!error);

      done();
    });
  });

  it('should create/remove directory recursively', function(done){
    assert(!tfs.existsSync('tmp/a/b/c/d'), 'directory should not exist to start');

    tfs.createDirectoryRecursive('tmp/a/b/c/d', function(){
      assert(tfs.existsSync('tmp/a/b/c/d'), 'directory should exist');

      tfs.removeDirectoryRecursive('tmp/a', function(){
        assert(!tfs.existsSync('tmp/a'), 'after removing directory should not exist');

        tfs.createDirectoryRecursiveSync('tmp/a/b/c/d');
        assert(tfs.existsSync('tmp/a/b/c/d'), 'directory should exist (sync)');
        
        tfs.removeDirectoryRecursiveSync('tmp/a');
        assert(!tfs.existsSync('tmp/a'), 'directory should not exist (sync)');

        done();
      });
    });
  });

  it('should digest file', function(done){
    var filePath = tfs.absolutePath('./test/mocha.opts');

    tfs.fileDigest(filePath, function(error, digest){
      assert('4147caa7ca6a88a3cd51c235719cc923' === digest);

      var pathWithDigest = tfs.pathWithDigest(digest, filePath, '.opts');
      assert('mocha-' + digest + '.opts' === tfs.basename(pathWithDigest));

      var pathWithoutDigest = tfs.pathWithoutDigest(pathWithDigest, '.opts');
      assert('mocha.opts' === tfs.basename(pathWithoutDigest));

      done()
    });
  });

  it('should is file or directory', function(done){
    tfs.isFile('./test/mocha.opts', function(error, success){
      assert(success);
      assert(tfs.isFileSync('./test/mocha.opts'));

      tfs.isFile('./test', function(error, success){
        assert(!success);
        assert(!tfs.isFileSync('./test'));

        tfs.isDirectory('./test', function(error, success){
          assert(success);
          assert(tfs.isDirectorySync('./test'));

          tfs.isDirectory('./test/mocha.opts', function(error, success){
            assert(!success);
            assert(!tfs.isDirectorySync('./test/mocha.opts'));

            done();
          });
        });
      });
    });
  });

  it('should glob', function(done){
    tfs.glob('./test/*.js', function(error, files){
      assert(2 === files.length);
      assert('./test/client.js' === files[0]);
      assert('./test/serverTest.js' === files[1]);

      files = tfs.globSync('./test/*.js');
      assert(2 === files.length);
      assert('./test/client.js' === files[0]);
      assert('./test/serverTest.js' === files[1]);

      done();
    });
  });

  it('should watcher', function(done){
    var startTime = (new Date).getTime();

    if (tfs.existsSync('tmp/3.js')) tfs.removeFileSync('tmp/3.js');

    tfs.createFileSync('./tmp/1.js');
    tfs.createFileSync('./tmp/2.js');
    tfs.createFileSync('./tmp/1.txt');
    tfs.createFileSync('./tmp/2.txt');

    // IMPORTANT: ./tmp/*.js is different than tmp/*.js
    tfs.watch('tmp/*.js', function(error, watcher){
      var files = watcher.relative()['tmp/'];

      var changedPath, addedPath, deletedPath;

      assert(2 === files.length);
      assert('1.js' === files[0]);
      assert('2.js' === files[1]);

      watcher.on('changed', function(filePath){
        // console.log('changed', filePath);
        changedPath = filePath;
      });

      watcher.on('added', function(filePath){
        // console.log('added', filePath);
        addedPath = filePath;
      });

      watcher.on('deleted', function(filePath){
        // console.log('deleted', filePath);
        deletedPath = filePath;
      });

      // On changed/added/deleted
      watcher.on('all', function(event, filePath){
        // console.log(filePath + ' was ' + event);
      });

      // var endTime = (new Date).getTime();
      // this is taking ~145ms but that's b/c gaze is running this
      // on setTimeout with a delay of 10 + 100 == 110 ms,
      // so it's non-blocking.
      // console.log((endTime - startTime) + 'ms');

      tfs.createFile('tmp/3.js', function(){
        setTimeout(function(){
          assert(tfs.absolutePath('tmp/3.js') === addedPath);

          tfs.writeFile('tmp/3.js', 'asdf', function(){
            setTimeout(function(){
              assert(tfs.absolutePath('tmp/3.js') === changedPath);

              tfs.removeFile('tmp/3.js', function(){
                setTimeout(function(){
                  assert(tfs.absolutePath('tmp/3.js') === deletedPath);

                  done();
                }, 500);
              });
            }, 500)
          });
        }, 500)
      });
    });
  });

  it('should download file', function(done){
    tfs.removeFileSync('tmp/README_DOWNLOAD.md');

    var remote = 'https://raw.github.com/tower/fs/master/README.md';

    tfs.downloadFile(remote, 'tmp/README_DOWNLOAD.md', function(error){
      assert(tfs.existsSync('tmp/README_DOWNLOAD.md'));

      done();
    });
  });
});
