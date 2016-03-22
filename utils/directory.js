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
 * Returns the components folder where the component is going to be inserted
 * If no path passed it could be [src|app]/<any>/components or throw error
 * If a path is passed, that would be the componentsFolder
 *
 * @param {String=}  path  Custom path for the component
 * @param {Function} cb    cb(err, componentsFolder)
 */
function getPathForComponent(path, cb) {
  if (path) { cb(null, path); return; }

  const rootPath = getDirectories('./').find(dir => dir === 'src' || dir === 'app');
  const dir = require('node-dir');

  if (!rootPath) {
    const error = new Error('Could not find a src or app folder');
    error.name = 'NotRootPathError';
    cb(error);
  } else {
    dir.subdirs(rootPath, (err, subdirs) => {
      if (err) { cb(err); return; }
      const componentsFolder = subdirs.find(el => /components$/.test(el));

      if (componentsFolder) {
        cb(null, componentsFolder);
      } else {
        const error = new Error('Could not find a sub components folder');
        error.name = 'NotComponentsPathError';
        cb(error);
      }
    });
  }
}

module.exports = {
  getDirectories,
  getPathForComponent
};
