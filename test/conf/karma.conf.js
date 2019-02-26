// Karma configuration

module.exports = function (config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../../',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'build/libs/geo.okapi.js',
            'test/helpers/**/*.js',
            'test/spec/**/*.js',

            { pattern: 'test/examples/data/*.gpx', included: false, served: true },
            { pattern: 'test/examples/data/*.csv', included: false, watched: true, served: true },
            { pattern: 'test/examples/data/*.xlsx', included: false, watched: true, served: true },
            { pattern: 'test/examples/data/*.json', included: false, watched: true, served: true }
        ],

        proxies: {
            '/points.csv': '/base/test/examples/data/points.csv',
            '/points.xlsx': '/base/test/examples/data/points.xlsx',
            '/Frankfurt.gpx': '/base/test/examples/data/Frankfurt.gpx',
            '/data/bkg-layer-config.json': '/base/test/examples/data/bkg-layer-config.json'
        },


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        // reporters: ['dots', 'verbose', 'html'],
        reporters: ['dots', 'junit', 'html'],

        htmlReporter: {
            outputFile: 'build/reports/test/unitTestsReport.html'
        },

        // the default configuration
        junitReporter: {
            outputDir: 'build/reports/test', // results will be saved as $outputDir/$browserName.xml
            outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
            suite: '', // suite will become the package name attribute in xml testsuite element
            useBrowserName: true, // add browser name to report and classes names
            nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
            classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
            properties: {} // key value pair of properties to add to the <properties> section of the report
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_WARN,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],
        
        phantomjsLauncher: {
            flags: [
                '--web-security=false'
            ]
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        // adjust timeout values for CI
        // TODO: fix this to default
        // migrate ot jest?
        // https://github.com/karma-runner/karma-phantomjs-launcher/issues/126
        captureTimeout: 120000, // it was already there
        browserDisconnectTimeout : 10000,
        browserDisconnectTolerance : 1,
        browserNoActivityTimeout : 10000//by default 10000

    });
};
