  // describe('#getOutputDirForComponent()', function () {
  //   it('should return the right folderpath for components', done => {
  //     const testPath = './';
  //     const expectedResult = '.';
  //     const testPath2 = './erwin/go';
  //     const expectedResult2 = './erwin/go';

  //     Component.getOutputDirForComponent(testPath, (err, outputDir) => {
  //       if (err) { done(err); return; }
  //       should(outputDir).be.equal(expectedResult);

  //       Component.getOutputDirForComponent(testPath2, (err, outputDir) => {
  //         if (err) { done(err); return; }
  //         should(outputDir).be.equal(expectedResult2);
  //         done();
  //       });
  //     });
  //   });

  //   it('should return error if no components folder found and no dir provided',
  //     done => {
  //       Component.getOutputDirForComponent(null, err => {
  //         should(err).containDeep({ name: 'NotFoundError' });
  //         done();
  //       });
  //     });

  //   it('should return error if no dir provided and app nor src folder exists');
  //   it(`should return error if no dir provided and app or src do exist but
  //       no components folder`);

  //   it('should return inside components folder it exists and no dir provided', done => {
  //     const fse = require('fs-extra');
  //     const dumbDir = '__test__/__dump__/components';

  //     fse.mkdirsSync(dumbDir);
  //     Component.getOutputDirForComponent(null, (err, outputDir) => {
  //       if (err) { done(err); return; }
  //       should(outputDir).be.equal(dumbDir);
  //       fse.removeSync('__test__');
  //       done();
  //     });
  //   });
  // });

