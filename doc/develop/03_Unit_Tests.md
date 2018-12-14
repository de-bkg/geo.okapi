[Back to TOC](README.md)

## Unit tests

For unit tests we use Jasmine Framework (https://jasmine.github.io/) and as test runner we use Karma 
(https://karma-runner.github.io).

### Configure unit tests

The specification files of the tests are located in folder **test/spec**.

The main configuration file is **test/conf/karma.conf.js**. There you can add tests, source files and define browsers to 
use for testing.

**Add files to test:**

```javascript
// list of files / patterns to load in the browser
files: [
    '../../../build/libs/geo.okapi.js',
    '../helpers/**/*.js',
    '../spec/**/*.js'
]
```

We include the custom version of OpenLayers, all source files located in *src/js* and all unit tests in 
*test/spec*. If we follow the guidelines and add new source files or tests to the right folders, we never need to edit 
this file.

**Define browsers to use for unit testing:**

```javascript
// start these browsers
// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
browsers: ['PhantomJS']
```

We use as default the headless browser PhantomJS, but you can add any you want by installing the right Karma launcher 
package (e.g. npm install karma-chrome-launcher) and then adding the name of the browser in this array.

List of Karma browser launchers:  https://npmjs.org/browse/keyword/karma-launcher

### Run unit tests

You can run your tests in node.js environment using Karma as launcher:

```bash
npm run test
```

All results will be shown in the console and a HTML report will be generated in *build/reports/test/unitTestsReport.html*.

[Back to TOC](README.md)