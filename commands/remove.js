'use strict';

const fse = require('fs-extra');
const path = require('path');
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
    fse.removeSync();
    console.log('Component deleted from %s!', dirpath);
  });
}

program
  .command('remove-component <name>')
  .alias('rc')
  .description('Remove a component with all its files.')
  .action(removeComponentInit);
