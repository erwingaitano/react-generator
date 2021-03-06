/**
 * @module Component
 */

'use strict';

const fse = require('fs-extra');
const path = require('path');
const program = require('commander');
const dirUtility = require('../utils/directory');

/**
 * -Pure- Returns a fileString with all the template boilerplate replaced.
 *
 * @param  {String}  fileString   File template string
 * @param  {String}  compName     Component name
 * @param  {Object=} options
 * @param  {Bool}    options.css  Should have css stuff
 * @return {String}  _            fileString transformed
 */
function getFileStringTransformed(fileString, compName, options) {
  let output;
  const settings = Object.assign({
    css: true
  }, options);

  if (settings.css) {
    output = fileString.replace(/\/\* CSS \*\/\s*([\s|\S]*?)\s*\/\* CSS-END \*\//, '$1');
  } else {
    output = fileString.replace(/\/\* CSS \*\/([\s|\S]*?)\/\* CSS-END \*\/ *\n?([\s|\S]*)/, '$2');
  }

  // component title
  const firstLetter = compName.charAt(0).toUpperCase();
  let compNamePascalCase = compName.slice(1);
  compNamePascalCase = compNamePascalCase.replace(/-(\w)/g, (v) => v.slice(1).toUpperCase());

  output = output.replace(/__COMPONENT_NAME__PASCAL_CASE/g, firstLetter + compNamePascalCase);
  output = output.replace(/__COMPONENT_NAME__/g, compName);
  return output;
}

/**
 * -Pure- Get relevant info from the file
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
 * Generate the files from the template files and write them in the outputdir path
 *
 * @param {String}   templatePath  Component template folder containing the files
 * @param {String}   compName      Component name
 * @param {String}   outputDir     Directory where the component will be copied
 * @param {Object=}  options
 * @param {Bool}     options.css   Should have css stuff
 * @param {Bool}     options.test  Should have test stuff
 * @param {Function} cb            cb(err, compName, outputDir)
 */
function generateFiles(templatePath, compName, outputDir, options, cb) {
  const settings = Object.assign({
    css: true,
    test: true
  }, options);

  fse.copy(templatePath, `${outputDir}/${compName}`, {
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

/**
 * Create a component <name> in the relevant directory
 *
 * @param {String}   name     Name of the component
 * @param {Object=}  options  Options from the command line
 * @param {Function} cb       cb(err, name, dirGenerated);
 */
function createComponent(name, options, cb) {
  const settings = Object.assign({}, options);
  dirUtility.getPathForComponent(settings.dir, (err, outputDir) => {
    if (err) { cb(err); return; }

    const componentTemplateDir = path.resolve(__dirname, '../templates/component');
    generateFiles(componentTemplateDir, name, outputDir, options, (err, name, outputDir) => {
      if (err) { cb(err); return; }

      const dirGenerated = outputDir.concat('/').replace(/\/\/$/, '/') + name;
      if (cb) cb(null, name, dirGenerated);
    });
  });
}

/**
 * Command line instructions
 */
 /* istanbul ignore next */
program
  .command('component <name>')
  .alias('c')
  .description('Generate a component.')
  .option('-d, --dir <directory>', 'Directory where to put the component.')
  .option('', 'If not specified, it defaults to the first components')
  .option('', 'folder inside a ./src, ./app folder or to the current dir.')
  .option('-C, --no-css', 'Don\'t generate the scss file.')
  .option('-T, --no-test', 'Don\'t generate the test (component.spec.js) file.')
  .action((name, options) => {
    createComponent(name, options, (err, name, dirGenerated) => {
      if (err) throw err;
      console.log('Component %s created in %s', name, dirGenerated);
    });
  });

module.exports = {
  getFileStringTransformed,
  getInfoFromFilenamePath,
  generateFiles,
  createComponent
};
