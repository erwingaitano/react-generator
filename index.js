#! /usr/bin/env node

'use strict';

const fse = require('fs-extra');
const path = require('path');
const program = require('commander');
const dir = require('node-dir');

function getDirectories(srcpath) {
  return fse.readdirSync(srcpath)
    .filter(file => fse.statSync(path.join(srcpath, file)).isDirectory());
}

function componentInit(name, options) {
  let outputDir;

  function generateTemplate() {
    fse.copy(path.resolve(__dirname, './templates/component'), `${outputDir}/${name}`, {
      filter(file) {
        if (!options.css && file.split('/').pop().indexOf('.scss') !== -1) return false;
        if (!options.test && file.split('/').pop().indexOf('.spec.js') !== -1) return false;
        if (fse.lstatSync(file).isDirectory()) return true;

        // Here we manipulate the output files (replace strings, etc)
        const tmpFilename = file.split('/').pop().split('.');
        const filenameExt = tmpFilename.slice(1).join('.');
        let ws = fse.readFileSync(file, 'utf8');

        if (!options.css) {
          ws = ws.replace(/[\s\S].*\/\* CSS \*\/([\s\S]*?)\/\* CSS-END \*\/.*[\s\S]/, '\n');
        } else {
          ws = ws.replace(/[\s\S].*\/\* CSS \*\/([\s\S]*?)\/\* CSS-END \*\/.*[\s\S]/, '$1');
        }

        fse.outputFileSync(`${outputDir}/${name}/${name}.${filenameExt}`, ws);
        return false;
      }
    },
    () => {
      console.log(`Component ${name} created!`);
    });
  }

  if (options.dir) {
    outputDir = options.dir;
    generateTemplate();
  } else {
    // If not dir was provided, we set outputDir as look for a (src|app)/**/components folder
    const topLevelDirs = getDirectories('./');
    const sourceFolder = topLevelDirs.find(dir => dir === 'src' || dir === 'app');

    dir.subdirs(sourceFolder, (err, subdirs) => {
      if (err) throw err;
      outputDir = subdirs.find(dir => /components$/.test(dir));
      generateTemplate();
    });
  }
}

program.version(require('./package.json').version);

program
  .command('component <name>')
  .alias('c')
  .description('Generate a component.')
  .option('-d, --dir <directory>', 'Directory where to put the component.')
  .option('', 'If not specified, it defaults to the first components')
  .option('', 'folder inside a ./src folder or to the current directory.')
  .option('-C, --no-css', 'Don\'t generate the scss file.')
  .option('-T, --no-test', 'Don\'t generate the test (component.spec.js) file.')
  .action(componentInit);

program.parse(process.argv);
