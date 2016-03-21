const should = require('should');
const Component = require('./component');

describe('Component', () => {
  describe('#getFileStringTransformed()', () => {
    it('should leave css stuff', () => {
      const compName = '__dump_comp__';
      const testString = `/* CSS */
                      random things inside
                      /* CSS-END */
                      `;
      const expectedString = 'random things inside';

      const resultString = Component.getFileStringTransformed(testString, compName);
      should(resultString.trim()).be.equal(expectedString);
    });

    it('should remove css stuff', () => {
      const compName = '__dump_comp__';
      const testString = `/* CSS */
                      random things
                      /* CSS-END */
                      `;
      const expectedString = '';

      const resultString = Component.getFileStringTransformed(testString, compName, { css: false });
      should(resultString.trim()).be.equal(expectedString);
    });

    it('should replace __COMPONENT_NAME__ with the component name', () => {
      const compName = '__dump_comp__';
      const testString = 'this; is; a test; __COMPONENT_NAME__ string; string;';
      const expectedString = `this; is; a test; ${compName} string; string;`;
      const resultString = Component.getFileStringTransformed(testString, compName);
      should(resultString).be.equal(expectedString);
    });
  });

  describe('#getInfoFromFilenamePath()', () => {
    it('should get right object output', () => {
      const testFilepath1 = '/User/kappa/erwingo.js';
      const expectedResult1 = {
        baseDir: '/User/kappa',
        ext: 'js',
        realExt: 'js'
      };

      const result1 = Component.getInfoFromFilenamePath(testFilepath1);
      result1.should.be.deepEqual(expectedResult1);

      const testFilepath2 = '/User/kappa/ross/erwingo.js.jsx';
      const expectedResult2 = {
        baseDir: '/User/kappa/ross',
        ext: 'js.jsx',
        realExt: 'jsx'
      };

      const result2 = Component.getInfoFromFilenamePath(testFilepath2);
      result2.should.be.deepEqual(expectedResult2);
    });
  });


  describe('#getOutputDirForComponent', () => {
    it('should return the right folderpath for components', (done) => {
      const testPath = './';
      const expectedResult = './';
      const testPath2 = './erwin/go';
      const expectedResult2 = './erwin/go';

      Component.getOutputDirForComponent(testPath, (err, outputDir) => {
        if (err) done(err);
        should(outputDir).be.equal(expectedResult);

        Component.getOutputDirForComponent(testPath2, (err, outputDir) => {
          if (err) done(err);
          should(outputDir).be.equal(expectedResult2);
          done();
        });
      });
    });
  });

  describe('#generateFiles', () => {
    const compName = '__dump_comp__';

    it('should write the component generated files in the output dir', done => {
      const path = require('path');
      const outputDir = './';
      const componentTemplateDir = path.resolve(__dirname, '../templates/component');

      Component.generateFiles(componentTemplateDir, compName, outputDir, null,
        (err, componentName, resultOutputDir) => {
          if (err) done(err);
          should(componentName).be.equal(compName);
          should(resultOutputDir).be.equal(outputDir);
          done();
        });
    });

    after(done => {
      const fse = require('fs-extra');
      const folderToEliminate = `./${compName}`;

      try {
        fse.removeSync(folderToEliminate);
        console.log('Component deleted from %s', folderToEliminate);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  describe('#run', () => {
    it('should return -1 when the value is not present');
  });
});
