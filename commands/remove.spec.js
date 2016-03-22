/* eslint prefer-arrow-callback: 0 */
/* eslint func-names: 0 */

const Remove = require('./remove');
const should = require('should');

describe('Remove', function () {
  describe('#removeFolder()', function () {
    it('should remove a folder', done => {
      const dirpath = '/erwin/go';
      Remove.removeFolder(dirpath, (err, folderRemoved) => {
        if (err) { done(err); return; }
        should(folderRemoved).equal(dirpath);
        done();
      });
    });
  });

  describe('#removeComponent()', function () {
    const fse = require('fs-extra');
    const compName = '__comp__';
    const dumpComponentsPath = '__test__/__dump__/components';

    before('create a dumb component directory', () => {
      fse.mkdirsSync(`${dumpComponentsPath}/${compName}`);
    });

    it('should remove the component and its files', done => {
      Remove.removeComponent(compName, { dir: dumpComponentsPath }, (err, componentPath) => {
        if (err) {done(err); return; }
        should(componentPath).be.equal(`${dumpComponentsPath}/${compName}`);
        done();
      });
    });

    it('should throw an error because no directory passed and no sub components folder'
      , done => {
        Remove.removeComponent(compName, null, err => {
          should(err).containDeep({ name: 'NotFoundError' });
          done();
        });
      });

    after('clean dump __test__ directory if exists', () => {
      fse.removeSync('__test__');
    });
  });
});
