// JavaScript files of BKG WebMap
var jsFiles = [
    'src/js/DefinitionsProj4.js',
    'src/js/BKGWebMap.js',
    'src/js/Constants.js',
    'src/js/Icons.js',
    'src/js/Util.js',
    'src/js/Control/Control.js',
    'src/js/Control/CookieCheck.js',
    'src/js/Control/StandardPosition.js',
    'src/js/Control/Panel.js',
    'src/js/Control/SearchPanel.js',
    'src/js/Control/InfoPanel.js',
    'src/js/Control/LayerSwitcher.js',
    'src/js/Control/CustomLayers.js',
    'src/js/Control/ShowAttributes.js',
    'src/js/Control/Zoom.js',
    'src/js/Control/Legend.js',
    'src/js/Control/FullScreen.js',
    'src/js/Control/ShowCoordinates.js',
    'src/js/Control/CopyCoordinates.js',
    'src/js/Control/StaticLinks.js',
    'src/js/Control/StaticWindows.js',
    'src/js/Control/Scalebar.js',
    'src/js/Control/Copyright.js',
    'src/js/Control/Measure.js',
    'src/js/Control/Edit.js',
    'src/js/Control/GeoSearch.js',
    'src/js/Control/SearchCoordinates.js',
    'src/js/Control/Print.js',
    'src/js/Control/PermaLink.js',
    'src/js/Control/JsonExport.js',
    'src/js/Control/Share.js',
    'src/js/Control/OverviewMap.js',
    'src/js/Control/TimeSlider.js',
    'src/js/Control/Marker.js',
    'src/js/Style.js',
    'src/js/View.js',
    'src/js/Layer.js',
    'src/js/ParseConfig.js',
    'src/js/MapBuilder.js',
    'src/js/okapi.js'
];

// CSS files of BKG WebMap
var cssFiles = [
    'src/css/app.css'
];

// JavaScript files of libraries
var jsLibraries = [
    'build/libs/xlsx.full.min.js',
    'build/libs/FileSaver.js',
    'build/libs/proj4.js',
    'build/libs/ol-custom.js'
];

// CSS files of libraries
var cssLibraries = [
    'build/libs/ol-custom.css'
];

// Concatenate lists of BKG WebMap files and libraries
var jsAllFiles = jsLibraries.concat(jsFiles);
var cssAllFiles = cssLibraries.concat(cssFiles);

// Path for builds
var buildPath = 'build/libs/';

var buildify = require('buildify');
var pjson = require('./package.json');

// Create build without Libraries
buildify()
    .concat(jsFiles)
    .wrap('config/template.no.libs.js', {version: pjson.version})
    .save(buildPath + 'geo.okapi.no.libs.js')
    .uglify()
    .wrap('config/template.no.libs.js', {version: pjson.version})
    .save(buildPath + 'geo.okapi.no.libs.min.js');
buildify()
    .concat(cssFiles)
    .save(buildPath + 'geo.okapi.no.libs.css')
    .cssmin()
    .save(buildPath + 'geo.okapi.no.libs.min.css');

// Create build with Libraries
buildify()
    .concat(jsAllFiles)
    .wrap('config/template.libs.js', {version: pjson.version})
    .save(buildPath + 'geo.okapi.js')
    .uglify()
    .wrap('config/template.libs.js', {version: pjson.version})
    .save(buildPath + 'geo.okapi.min.js');
buildify()
    .concat(cssAllFiles)
    .save(buildPath + 'geo.okapi.css')
    .cssmin()
    .save(buildPath + 'geo.okapi.min.css');

