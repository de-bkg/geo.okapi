/**
 * Imports the development dependencies
 * <br/>
 *
 * Created by thalheim on 30.10.2018.
 *
 * @author <a href="dirk.thalheim@bkg.bund.de">Dirk Thalheim</a>
 * @version $ - $
 */

var base = '../';
var dependencies = [
    // external dependencies
    'node_modules/xlsx/dist/xlsx.full.min.js',
    'node_modules/file-saver/FileSaver.js',
    'node_modules/proj4/dist/proj4.js',
    'node_modules/openlayers/build/ol-custom.js',
    // internal dependencies
    'src/js/DefinitionsProj4.js',
    'src/js/okapi.js',
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
    'src/js/MapBuilder.js'
];

for (var i = 0; i < dependencies.length; i++) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = base + dependencies[i];

    document.getElementsByTagName('head')[0].appendChild(script);
}

var styles = [
    'node_modules/openlayers/dist/ol.css',
    'src/css/app.css'
];

for (var i = 0; i < styles.length; i++) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = base + styles[i];

    document.getElementsByTagName('head')[0].appendChild(link);
}
