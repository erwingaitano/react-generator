/**
 * @module
 */

'use strict';

const fse = require('fs-extra');
const path = require('path');

/**
 * Get all top level directories of the given path
 *
 * @param  {String} srcpath  The src where to look for the directories
 * @return {Array}  List     of top level directories
 */
function getDirectories(srcpath) {
  return fse.readdirSync(srcpath)
    .filter(file => fse.statSync(path.join(srcpath, file)).isDirectory());
}

/**
 * Returns sourceFolder in the form src, app or ./
 * This is only for performance reasons, if the path given has a src or app folder,
 * that will be the starting point so we avoid looking in the node_modules or
 * other non desired directories.
 *
 * @param  {String} srcpath  The starting dir where to look for src or app folder
 * @return {String} _        Source folder
 */
function getSourceFolder(srcpath) {
  return getDirectories(srcpath).find(dir => dir === 'src' || dir === 'app') || srcpath;
}

module.exports = {
  getDirectories,
  getSourceFolder
};
