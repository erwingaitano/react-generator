/**
 * @module Remove
 */

'use strict';

const fse = require('fs-extra');
const program = require('commander');
const dir = require('node-dir');
const dirUtility = require('../utils/directory');

/**
 * -Pure- Returns the folderpath to eliminate.
 *
 * @param  {String=} dirpath  Component parent folder
 * @param  {String}  name     Component name
 * @return {String}  _        The component dirpath
 */
function getFolderToEliminatePath(dirpath, name) {
  if (!dirpath) dirpath = '.';
  return `${dirpath}/${name}`;
}

/**
 * Remove a component with all its files
 *
 * @param {String}   name  Component name
 * @param {Function} cb    cb(err, componentPath)
 */
function removeComponent(name, options, cb) {
  const settings = Object.assign({
    dir: './'
  }, options);

  const sourceFolder = dirUtility.getSourceFolder(settings.dir);
  console.log(sourceFolder);
  dir.subdirs(sourceFolder, (err, subdirs) => {
    if (err) cb(err);

    try {
      const componentsFolder = subdirs.find(el => /components$/.test(el));
      const folderToEliminate = getFolderToEliminatePath(componentsFolder, name);
      fse.removeSync(folderToEliminate);
      cb(null, folderToEliminate);
    } catch (e) {
      cb(e);
    }
  });
}

/**
 * Command line instructions
 */
/* istanbul ignore next */
program
  .command('remove-component <name>')
  .alias('rc')
  .description('Remove a component with all its files.')
  .option('-d, --dir <directory>', 'Directory where to look for the component.')
  .action((name, options) => {
    removeComponent(name, options, (err, componentPath) => {
      console.log('Component deleted from %s', componentPath);
    });
  });

module.exports = {
  getFolderToEliminatePath,
  removeComponent
};
