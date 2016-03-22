/* eslint prefer-arrow-callback: 0 */
/* eslint func-names: 0 */

const expect = require('chai').expect;
const Remove = require('./remove');

describe('Remove', function () {
  describe('#removeFolder()', function () {
    it('should remove a folder', done => {
      const dirpath = '/erwin/go';
      Remove.removeFolder(dirpath, (err, folderRemoved) => {
        if (err) { done(err); return; }
        expect(folderRemoved).to.equal(dirpath);
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
        expect(componentPath).to.equal(`${dumpComponentsPath}/${compName}`);
        done();
      });
    });

    it('should throw an error because no directory passed and no src/app folder'
      , done => {
        Remove.removeComponent(compName, null, err => {
          expect(err).to.be.an('error')
            .and.have.property('message').to.contain('NoRootPathError:');
          done();
        });
      });

    after('clean dump __test__ directory if exists', () => {
      fse.removeSync('__test__');
    });
  });
});
