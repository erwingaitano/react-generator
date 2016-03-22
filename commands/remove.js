/**
 * @module Remove
 */

'use strict';

const fse = require('fs-extra');
const program = require('commander');
const dirUtility = require('../utils/directory');

/**
 * Removes a folder
 *
 * @param {String}   folderToEliminate  Folder to eliminate
 * @param {Function} cb                 cb(err, folderToEliminate)
 */
function removeFolder(folderToEliminate, cb) {
  try {
    fse.removeSync(folderToEliminate);
    cb(null, folderToEliminate);
  } catch (e) {
    cb(e);
  }
}

/**
 * Remove a component with all its files
 *
 * @param {String}   name  Component name
 * @param {Function} cb    cb(err, componentPath)
 */
function removeComponent(name, options, cb) {
  const settings = Object.assign({}, options);

  dirUtility.getPathForComponent(settings.dir, (err, componentParentPath) => {
    if (err) { cb(err); return; }

    const componentPath = `${componentParentPath}/${name}`;
    removeFolder(componentPath, cb);
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
  removeFolder,
  removeComponent
};
