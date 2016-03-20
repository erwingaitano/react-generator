'use strict';

const fse = require('fs-extra');
const program = require('commander');
const dir = require('node-dir');
const utils = require('../utils');

function removeComponentInit(name) {
  const sourceFolder = utils.getSourceFolder('./');

  dir.subdirs(sourceFolder, (err, subdirs) => {
    if (err) throw err;

    let dirpath = subdirs.find(el => /components$/.test(el));
    if (dirpath) dirpath += `/${name}`;
    else dirpath = `./${name}`;
    try {
      fse.removeSync(dirpath);
      console.log('Component deleted from %s', dirpath);
    } catch (e) {
      console.log(e.message);
    }
  });
}

program
  .command('remove-component <name>')
  .alias('rc')
  .description('Remove a component with all its files.')
  .action(removeComponentInit);
