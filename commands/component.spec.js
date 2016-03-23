/* eslint prefer-arrow-callback: 0 */
/* eslint func-names: 0 */
'use strict';

const expect = require('chai').expect;
const Component = require('./component');

describe('Component', function () {
  describe('#getFileStringTransformed()', function () {
    it('should leave css stuff', () => {
      const compName = '__dumb_comp__';
      const expectedString = 'random things inside';
      const testString = `/* CSS */${expectedString}/* CSS-END */`;
      const testString2 = `/* CSS */\n${expectedString}\n/* CSS-END */`;
      const testString3 = `/* CSS */\n${expectedString}\na \nb\n c/* CSS-END */`;
      const testString4 = `ee\n /* CSS */\n${expectedString}\n /* CSS-END */\n dummy stuff`;

      const resultString = Component.getFileStringTransformed(testString, compName);
      const resultString2 = Component.getFileStringTransformed(testString2, compName);
      const resultString3 = Component.getFileStringTransformed(testString3, compName);
      const resultString4 = Component.getFileStringTransformed(testString4, compName);

      expect(resultString).to.equal(expectedString);
      expect(resultString2).to.equal(expectedString);
      expect(resultString3).to.equal(`${expectedString}\na \nb\n c`);
      expect(resultString4).to.equal(`ee\n ${expectedString}\n dummy stuff`);
    });

    it('should remove css stuff', () => {
      const compName = '__dumb_comp__';
      const testString = '/* CSS */random things inside/* CSS-END */';
      const testString2 = 'ee\n /* CSS */\n$random things \n/* CSS-END */\n dummy stuff';

      const resultString = Component.getFileStringTransformed(testString, compName,
        { css: false });
      const resultString2 = Component.getFileStringTransformed(testString2, compName,
        { css: false });

      expect(resultString.trim()).to.equal('');
      expect(resultString2.trim()).to.equal(`ee\n  dummy stuff`);
    });

    it('should replace __COMPONENT_NAME__ with the component name', () => {
      const compName = '__dumb_comp__';
      const testString = 'this; is; a test; __COMPONENT_NAME__ string; string;';
      const expectedString = `this; is; a test; ${compName} string; string;`;
      const resultString = Component.getFileStringTransformed(testString, compName);
      expect(resultString).to.equal(expectedString);
    });

    it(`should replace __COMPONENT_NAME__PASCAL_CASE with the
      component name in pascal case`, () => {
      const compName = 'dumb-comp';
      const testString = 'this; is; a test; __COMPONENT_NAME__PASCAL_CASE string; string;';
      const expectedString = 'this; is; a test; DumbComp string; string;';
      const resultString = Component.getFileStringTransformed(testString, compName);
      expect(resultString).to.equal(expectedString);
    });
  });

  describe('#getInfoFromFilenamePath()', function () {
    it('should get right object output', () => {
      const testFilepath1 = '/User/kappa/erwingo.js';
      const expectedResult1 = {
        baseDir: '/User/kappa',
        ext: 'js',
        realExt: 'js'
      };

      const result1 = Component.getInfoFromFilenamePath(testFilepath1);
      expect(result1).to.deep.equal(expectedResult1);

      const testFilepath2 = '/User/kappa/ross/erwingo.js.jsx';
      const expectedResult2 = {
        baseDir: '/User/kappa/ross',
        ext: 'js.jsx',
        realExt: 'jsx'
      };

      const result2 = Component.getInfoFromFilenamePath(testFilepath2);
      expect(result2).to.deep.equal(expectedResult2);
    });
  });

  describe('Following tests generate output files:', function () {
    const compName = '__dumb_comp__';

    describe('#generateFiles()', function () {
      it('should write the component generated files in the output dir', done => {
        const path = require('path');
        const outputDir = './components';
        const componentTemplateDir = path.resolve(__dirname, '../templates/component');

        Component.generateFiles(componentTemplateDir, compName, outputDir, null,
          (err, componentName, resultOutputDir) => {
            if (err) { done(err); return; }
            expect(componentName).to.equal(compName);
            expect(resultOutputDir).to.equal(outputDir);
            done();
          });
      });

      after(done => {
        const fse = require('fs-extra');
        const folderToEliminate = './components';

        fse.removeSync(folderToEliminate);
        done();
      });
    });

    describe('#createComponent()', function () {
      const compName = '__comp__';
      const dumpComponentsPath = 'app/__dump__/components';
      const fse = require('fs-extra');

      before('create a dumb component directory', () => {
        fse.mkdirsSync(`${dumpComponentsPath}/${compName}`);
      });

      it(`should create a component in ${dumpComponentsPath}`, done => {
        Component.createComponent(compName, null, (err, name, dirGenerated) => {
          if (err) { done(err); return; }
          expect(name).to.equal(compName);
          expect(dirGenerated).to.equal(dirGenerated);
          done();
        });
      });

      after(done => {
        fse.removeSync('app');
        done();
      });
    });
  });
});
