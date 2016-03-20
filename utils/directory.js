/**
 * @module
 */

'use strict';

const fse = require('fs-extra');
const path = require('path');

function getDirectories(srcpath) {
  return fse.readdirSync(srcpath)
    .filter(file => fse.statSync(path.join(srcpath, file)).isDirectory());
}

function getSourceFolder(srcpath) {
  // If not options.dir was provided, we set outputDir to the form (src|app|./)/**/components
  // we return src, or app folder in order to avoid find in node_modules or another
  // no-useful directory. But if src nor app folder exists, we default to ./
  return getDirectories(srcpath).find(dir => dir === 'src' || dir === 'app') || './';
}

module.exports = {
  getDirectories,
  getSourceFolder
};
