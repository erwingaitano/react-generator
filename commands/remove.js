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

function runRemoveComponent(name) {
  const sourceFolder = dirUtility.getSourceFolder('./');

  dir.subdirs(sourceFolder, (err, subdirs) => {
    if (err) throw err;

    try {
      const componentsFolder = subdirs.find(el => /components$/.test(el));
      const folderToEliminate = getFolderToEliminatePath(componentsFolder, name);
      fse.removeSync(folderToEliminate);
      console.log('Component deleted from %s', folderToEliminate);
    } catch (e) {
      console.log(e.message);
    }
  });
}

program
  .command('remove-component <name>')
  .alias('rc')
  .description('Remove a component with all its files.')
  .option('-d, --dir <directory>', 'Directory where to look for the component.')
  .action(runRemoveComponent);

module.exports = {
  getFolderToEliminatePath
};
