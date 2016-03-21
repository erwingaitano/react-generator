/* eslint prefer-arrow-callback: 0 */
/* eslint func-names: 0 */

const Remove = require('./remove');
const should = require('should');

describe('Remove', function () {
  describe('#getFolderToEliminatePath()', function () {
    it('should return the folderpath to eliminate', function () {
      const compName = '__comp__';
      const dirpath = '/erwin/go';
      const path = Remove.getFolderToEliminatePath(dirpath, compName);
      should(path).be.equal(`/erwin/go/${compName}`);

      const path2 = Remove.getFolderToEliminatePath(null, compName);
      should(path2).be.equal(`./${compName}`);
    });
  });

  describe('#removeComponent()', function () {
    const fse = require('fs-extra');
    const compName = '__comp__';
    const dumpComponentsPath = './__test__/__dump__/components';

    before('create a dumb component directory', () => {
      fse.mkdirsSync(`${dumpComponentsPath}/${compName}`);
    });

    it('should remove the component and its files', done => {
      Remove.removeComponent(compName, (err, componentPath) => {
        if (err) {done(err); return; }
        should(componentPath).be.equal(`${dumpComponentsPath}/${compName}`);
        done();
      });
    });

    after('clean dump component directory if exists', () => {
      fse.removeSync(`${dumpComponentsPath}/${compName}`);
    });
  });
});
