/**
 * @module Component
 */

'use strict';

const fse = require('fs-extra');
const path = require('path');
const program = require('commander');
const dir = require('node-dir');
const utils = require('../utils');

/**
 * <Pure> Returns a fileString with all the template boilerplate replaced.
 *
 * @param  {myCystomString} fileString   File template string
 * @param  {String}         compName     Component name
 * @param  {Object=}        options
 * @param  {Bool}           options.css  Should have css stuff
 * @return {String}         _            fileString transformed
 */
function getFileStringTransformed(fileString, compName, options) {
  let output;
  const settings = Object.assign({
    css: true
  }, options);

  if (!settings.css) {
    output = fileString.replace(/[\s\S].*\/\* CSS \*\/([\s\S]*?)\/\* CSS-END \*\/.*[\s\S]/, '\n');
  } else {
    output = fileString.replace(/[\s\S].*\/\* CSS \*\/([\s\S]*?)\/\* CSS-END \*\/.*[\s\S]/, '$1');
  }

  output = output.replace(/__COMPONENT_NAME__/g, compName);
  return output;
}

/**
 * <Pure> Get relevant info from the file
 *
 * @param  {String} filepath  The path of the file
 * @return {Object}
 */
function getInfoFromFilenamePath(filepath) {
  const tmpFilenamePath = filepath.split('/');
  const tmpFilename = tmpFilenamePath.pop().split('.');

  return {
    baseDir: tmpFilenamePath.join('/'),

    // ext returns the part of the filename after the first dot. Eg: ('file.js.jsx') => 'js.jsx'
    ext: tmpFilename.slice(1).join('.'),

    // ext returns the real ext. Eg: ('file.js.jsx') => 'jsx'
    realExt: tmpFilename.pop()
  };
}

/**
 * Get dirpath for the components folder
 *
 * @param {String=}  dirpath  Folder where components will be inserted
 * @param {Function} cb       Callback returning the outputDir
 */
function getOutputDirForComponent(dirpath, cb) {
  if (dirpath) {
    const outputDir = dirpath;
    cb(null, outputDir);
  } else {
    const sourceFolder = utils.getSourceFolder('./');
    dir.subdirs(sourceFolder, (err, subdirs) => {
      if (err) throw err;

      // If no components subfolder is found, we create the component in the current dir
      const outputDir = subdirs.find(el => /components$/.test(el)) || './';
      cb(null, outputDir);
    });
  }
}

/**
 * Generate the files from the template files and write them in the outputdir path
 *
 * @param {String}   dirname       Component template folder containing the files
 * @param {String}   compName      Component name
 * @param {String}   outputDir     Directory where the component will be copied
 * @param {Object=}  options
 * @param {Bool}     options.css   Should have css stuff
 * @param {Bool}     options.test  Should have test stuff
 * @param {Function} cb            Callback returning the compName and outputDir
 */
function generateFiles(dirname, compName, outputDir, options, cb) {
  const settings = Object.assign({
    css: true,
    test: true
  }, options);

  fse.copy(dirname, `${outputDir}/${compName}`, {
    filter(file) {
      if (!settings.css && file.split('/').pop().indexOf('.scss') !== -1) return false;
      if (!settings.test && file.split('/').pop().indexOf('.spec.js') !== -1) return false;
      if (fse.lstatSync(file).isDirectory()) return true;

      const fileStats = getInfoFromFilenamePath(file);
      const fileString = fse.readFileSync(file, 'utf8');
      const fileStringTransformed = getFileStringTransformed(fileString, compName,
        { css: settings.css });

      fse.outputFileSync(`${outputDir}/${compName}/${compName}.${fileStats.ext}`,
        fileStringTransformed);
      return false;
    }
  },
  () => cb(null, compName, outputDir));
}

function run(name, options) {
  getOutputDirForComponent(options.dir, (err, outputDir) => {
    const componentTemplateDir = path.resolve(__dirname, '../templates/component');
    generateFiles(componentTemplateDir, name, outputDir, options, (err, name, outputDir) => {
      if (err) {
        console.log(err.message);
        return;
      }

      console.log('Component %s created in %s/%s', name, outputDir, name);
    });
  });
}

program
  .command('component <name>')
  .alias('c')
  .description('Generate a component.')
  .option('-d, --dir <directory>', 'Directory where to put the component.')
  .option('', 'If not specified, it defaults to the first components')
  .option('', 'folder inside a ./src, ./app folder or to the current dir.')
  .option('-C, --no-css', 'Don\'t generate the scss file.')
  .option('-T, --no-test', 'Don\'t generate the test (component.spec.js) file.')
  .action(run);

module.exports = {
  getFileStringTransformed,
  getInfoFromFilenamePath,
  getOutputDirForComponent,
  generateFiles
};
