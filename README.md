# react-generator

Command line utility to generate folder-file templates for react projects

[![Build Status](https://travis-ci.org/erwingaitano/react-generator.svg?branch=master)](https://travis-ci.org/erwingaitano/react-generator)
[![Coverage Status](https://coveralls.io/repos/github/erwingaitano/react-generator/badge.svg?branch=master)](https://coveralls.io/github/erwingaitano/react-generator?branch=master)

## Installation

This is meant to be globally installed:

```
$ npm install -g react-generator
```

## Usage

```
$ react-generator component myComponent
```

Creates a folder *myComponent* in one of these folders: `./app/**/components`, `./src/**/components` or `./`, containing the files:
  * myComponent.scss
  * myComponent.js
  * myComponent.spec.js

You can also pass a folder dir using the option --dir:

```
$ react-generator component myComponent --dir  my/custom/path
```

Remove a component

```
$ react-generator remove-component myComponent
```


For more info or help:

```
$ react-generator --help
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Run the tests `npm run test`
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin my-new-feature`
6. Submit a pull request :D

## License

MIT License

Copyright (c) 2016 Erwin Gaitan O

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.