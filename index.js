#! /usr/bin/env node

'use strict';

const program = require('commander');

// Commands
require('./commands/component');
require('./commands/remove');

program.version(require('./package.json').version);
program.parse(process.argv);
