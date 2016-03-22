/* eslint prefer-arrow-callback: 0 */
/* eslint func-names: 0 */

const should = require('should');
const Directory = require('./directory');

describe('Utils/Directory', function () {
  describe('#getDirectories()', function () {
    it('should get the top level directories of the root', () => {
      const path = require('path');
      /**
       * Get all top level directories of the given path
       *
       * @param  {String} srcpath  The src where to look for the directories
       * @return {Array}  List     of top level directories
       */
      const directories = Directory.getDirectories(path.resolve(__dirname, '..'));
      should(directories).containDeep(['commands', 'templates', 'utils']);
    });
  });
});
