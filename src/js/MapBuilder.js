/**
 * @classdesc Factory-Class to create a Webmapping Application.
 *
 * It creates a Webmapping Application using the configuration provided.
 * To configure the map, you can use the following methods:
 * setLayers(), setControls(), setTarget(), setView(), defineStyles(), setSecurity(), loadConfig().
 * You can initialize the map using the method create().
 *
 * @constructor BKGWebMap.MapBuilder
 * */
BKGWebMap.MapBuilder = function () {
    /**
     * Find if initialize methods have been used
     * @type {object}
     * @memberOf BKGWebMap.MapBuilder
     * @property {boolean} setTarget - Method setTarget()
     * @property {boolean} setView - Method setView()
     * @property {boolean} setLayers - Method setLayers()
     * @property {boolean} defineStyles - Method defineStyles()
     * @property {boolean} setControls - Method setControls()
     * @property {boolean} loadConfig - Method loadConfig()
     * @property {boolean} setSecurity - Method setSecurity()
     */
    this.called = {
        setTarget: false,
        setView: false,
        setLayers: false,
        defineStyles: false,
        setControls: false,
        loadConfig: false,
        setSecurity: false
    };

    /**
     * Standard configuration for view object.
     * @type {object}
     * @memberOf BKGWebMap.MapBuilder
     * @property {string} projection - Default map projection.
     * @property {array} extent - Default map extent.
     */
    this.DEFAULT_VIEW_CONFIG = {
        projection: BKGWebMap.PROJECTION,
        extent: BKGWebMap.EXTENTS[BKGWebMap.PROJECTION]
    };

    /**
     * Standard configuration for layers
     * @type {Object}
     * @memberOf BKGWebMap.MapBuilder
     * @property {array} baseLayers - Array with default baselayers configuration
     */
    this.DEFAULT_LAYERS_CONFIG = {
        baseLayers: [
            BKGWebMap.DEFAULT_LAYER
        ]
    };

    /**
     * OpenLayers map object.
     * @memberOf BKGWebMap.MapBuilder
     * @type {ol.Map|null}
     */
    this.map = null;

    /**
     * ID of HTML-Element that contains the map.
     * @memberOf BKGWebMap.MapBuilder
     * @type {string}
     */
    this.div = BKGWebMap.DEFAULT_MAP_DIV;

    /**
     * Configuration of view object.
     * @memberOf BKGWebMap.MapBuilder
     * @type {object|null}
     */
    this.viewConfig = null;

    /**
     * Configuration of controls object.
     * @memberOf BKGWebMap.MapBuilder
     * @type {object|null}
     */
    this.controlsConfig = null;

    /**
     * Configuration of layers object.
     * @memberOf BKGWebMap.MapBuilder
     * @type {object|null}
     */

    this.layersConfig = null;

    /**
     * Find if the configuration will be loaded from a file
     * @memberOf BKGWebMap.MapBuilder
     * @type {boolean}
     */
    this.configFile = false;

    /**
     * URL of JSON configuration file or object with configuration
     * @memberOf BKGWebMap.MapBuilder
     * @type (null|string|object)
     */
    this.configUrlOrJson = null;

    /**
     * Array with styles configuration that will be used for vector layers
     * @type {array}
     */
    this.stylesArray = [];

    /**
     * BKG WebMap controls
     * @type {array|null}
     */
    this.controls = null;

    /**
     * Object with style names and OpenLayers style classes.
     * @type {object|null}
     */
    this.styles = null;

    /**
     * Current class name
     * @type {string}
     * @constant BKGWebMap.MapBuilder.CLASS_NAME
     */
    this.CLASS_NAME = 'BKGWebMap.MapBuilder';
};

/**
 * Sets the HTML-Element that contains the map
 * @memberOf BKGWebMap.MapBuilder
 * @param {string} div - ID of HMTL-Element that contains the map
 * @returns {BKGWebMap.MapBuilder}
 */
BKGWebMap.MapBuilder.prototype.setTarget = function (div) {
    if (typeof div !== 'undefined' && div !== '') {
        this.div = div;
        this.called.setTarget = true;
    }
    return this;
};

/**
 * Parse configuration for view.
 * Parses the view configuration which is used for creating the map view when calling create.
 * @memberOf BKGWebMap.MapBuilder
 * @param {object|ol.View} viewConfig - Object with configuration parameters for view or ol.View class
 * @param {string} viewConfig.projection - Map projection (/map/projection)
 * @param {object} viewConfig.center - Initial center of map (The coordinate system is defined through the projection) (/map/center)
 * @param {number} viewConfig.center.lat - Map center latitude. (/map/center/lat)
 * @param {number} viewConfig.center.lon - Map center longitude. (/map/center/lon)
 * @param {number|null} viewConfig.resolution - Initial resolution. If null, zoom will be used. (/map/resolution)
 * @param {number[]|null} viewConfig.resolutions - Array with numbers. If set, scales, maxResolution, minResolution, minZoom, and maxZoom are ignored. (/map/resolutions)
 * @param {number[]|null} viewConfig.scales - Array with numbers. It will be used only if resolutions is null. If set, maxResolution, minResolution, minZoom, and maxZoom are ignored. (/map/scales)
 * @param {integer|null} viewConfig.zoom - Initial zoom. It will be used only if resolution is null. (/map/zoom)
 * @param {number[]|null} viewConfig.mapExtent - Initial map extent. Array with numbers: [minX, minY, maxX, maxY] (/map/mapExtent)
 * @param {number|null} viewConfig.maxResolution - Maximum resolution. It will be used only if resolutions and scales are null. If null, maxZoom will be used. (/map/maxResolution)
 * @param {number|null} viewConfig.minResolution - Minimum resolution. It will be used only if resolutions and scales are null. If null, minZoom will be used. (/map/minResolution)
 * @param {integer|null} viewConfig.maxZoom - Maximum zoom. It will be used only if maxResolution, resolutions and scales are null. (/map/maxZoom)
 * @param {integer|null} viewConfig.minZoom - Minimum zoom. It will be used only if minResolution, resolutions and scales are null. (/map/minZoom)
 * @returns {BKGWebMap.MapBuilder}
 */
BKGWebMap.MapBuilder.prototype.setView = function (viewConfig) {
    if (viewConfig && ((typeof viewConfig === 'object' && viewConfig.constructor === Object) || viewConfig instanceof ol.View)) {
        this.viewConfig = viewConfig;
        this.called.setView = true;
    } else {
        this.viewConfig = this.DEFAULT_VIEW_CONFIG;
    }
    return this;
};

/**
 * Parses the controls configuration which is used for creating the interactive control elements of the map when calling create.
 * @memberOf BKGWebMap.MapBuilder
 *
 * @param {object} controlsConfig - Object with configuration parameters for controls. (/options)
 *
 * @param {string} controlsConfig.panelPosition - Panel position (Values: "left", "right") (/options/panelPosition)
 * @param {string|null} controlsConfig.initialize - Tool that should be shown, when starting the Application. If empty or null, then panel will be closed. (Values: "geoSearch", "searchCoordinates", "layerSwitcher", "legend", "showAttributes", "copyCoordinates", "measure", "edit", "share") (/options/initialize)
 * @param {object} controlsConfig.tools - Tools in panel. (/options/tools)
 *
 * @param {object} controlsConfig.tools.geoSearch - Search a place through name. (/options/tools/geoSearch). See properties in {@link geoSearch_options}
 * @param {object} controlsConfig.tools.searchCoordinates - Tools in panel. (/options/tools/searchCoordinates). See properties in {@link searchCoordinates_options}
 * @param {object} controlsConfig.tools.layerSwitcher - Layer menu. (/options/tools/layerSwitcher). See properties in {@link layerSwitcher_options}
 * @param {object} controlsConfig.tools.customLayers - User can add new layers. (/options/tools/customLayers). See properties in {@link customLayers_options}
 * @param {object} controlsConfig.tools.legend - Show legend. (/options/tools/legend). See properties in {@link legend_options}
 * @param {object} controlsConfig.tools.showAttributes - Show attributes with click on map. (/options/tools/showAttributes). See properties in {@link showAttributes_options}
 * @param {object} controlsConfig.tools.copyCoordinates - Tool to copy coordinates. (/options/tools/copyCoordinates). See properties in {@link copyCoordinates_options}
 * @param {object} controlsConfig.tools.measure - Measure tool. (/options/tools/measure). See properties in {@link measure_options}
 * @param {object} controlsConfig.tools.edit - Edit vector layers tool. (/options/tools/edit). See properties in {@link edit_options}
 * @param {object} controlsConfig.tools.share - Share map. (/options/tools/share). See properties in {@link share_options}
 * @param {object} controlsConfig.tools.zoom - Zoom control. (/options/tools/zoom). See properties in {@link zoom_options}
 * @param {object} controlsConfig.tools.scalebar - Scalebar control. (/options/tools/scalebar). See properties in {@link scalebar_options}
 * @param {object} controlsConfig.tools.copyright - Copyright control. (/options/tools/copyright). See properties in {@link copyright_options}
 * @param {object} controlsConfig.tools.showCoordinates - Show coordinates of cursor position. (/options/tools/showCoordinates). See properties in {@link showCoordinates_options}
 * @param {object[]} controlsConfig.tools.staticLinks - Static links on map. (/options/tools/staticLinks) <br> See properties <b>of each Object in Array</b> in {@link staticLinks_options}
 * @param {object[]} controlsConfig.tools.staticWindows - Static windows on map. (/options/tools/staticWindows) <br> See properties <b>of each Object in Array</b> in {@link staticWindows_options}
 * @param {object} controlsConfig.tools.fullScreen - Full screen tool. (/options/tools/fullScreen). See properties in {@link fullScreen_options}
 * @param {object} controlsConfig.tools.overviewMap - Overview map tool. (/options/tools/overviewMap). See properties in {@link overviewMap_options}
 * @param {object} controlsConfig.tools.timeSlider - Timeslider tool for WMS-T. (/options/tools/timeSlider). See properties in {@link timeSlider_options}
 *
 * @returns {BKGWebMap.MapBuilder}
 */
BKGWebMap.MapBuilder.prototype.setControls = function (controlsConfig) {
    if (controlsConfig && (typeof controlsConfig === 'object' && controlsConfig.constructor === Object) || controlsConfig instanceof Array) {
        this.controlsConfig = controlsConfig;
        this.called.setControls = true;
    }
    return this;
};

/**
 * WMS layer (/layers/baseLayer|overlays/items/WMS)
 * @typedef {object} WMS
 * @property {string} type - Type of layer: WMS (/layers/baseLayer|overlays/items/WMS/type)
 * @property {string|null} id - Unique ID. It will be used in permaLink and persistence JSON. If not available, it will be added by Framework. (/layers/baseLayer|overlays/items/WMS/id)
 * @property {string} name - Name of layer shown in Menu. (/layers/baseLayer|overlays/items/WMS/name)
 * @property {string} url - Service-URL. (/layers/baseLayer|overlays/items/WMS/url)
 * @property {object[]} layers - Layers of specific service that should be loaded. If empty, then all available layers will be loaded. (/layers/baseLayer|overlays/items/WMS/layers) <br> <b>Below are properties of each Object in Array:</b>
 * @property {string|null} layers.id - Unique ID. (/layers/baseLayer|overlays/items/WMS/layers/id)
 * @property {string} layers.name - Name of layer shown in Menu. (/layers/baseLayer|overlays/items/WMS/layers/name)
 * @property {string} layers.layer - Name of layer to load. (/layers/baseLayer|overlays/items/WMS/layers/layer)
 * @property {boolean} layers.visibility - Initial visibility of layer. (/layers/baseLayer|overlays/items/WMS/layers/visibility)
 * @property {string|null} layers.style - Style of layer. (/layers/baseLayer|overlays/items/WMS/layers/style)
 * @property {boolean} layers.selectStyle - The user is able to select a style for this layer. (/layers/baseLayer|overlays/items/WMS/layers/selectStyle)
 * @property {string|null} layers.legendUrl - URL for legend. If empty or null, legend will be loaded using GetLegendGraphic. (/layers/baseLayer|overlays/items/WMS/layers/legendUrl)
 * @property {number} layers.minResolution - Minimum resolution. (/layers/baseLayer|overlays/items/WMS/layers/minResolution)
 * @property {number} layers.maxResolution - Maximum resolution. (/layers/baseLayer|overlays/items/WMS/layers/maxResolution)
 * @property {boolean} visibility - Selected visibility of layer. (/layers/baseLayer|overlays/items/WMS/visibility)
 * @property {boolean} tiles - Load tiles or single image. (/layers/baseLayer|overlays/items/WMS/tiles)
 * @property {string|null} version - WMS version. If null, 1.3.0 will be used. (Values: "1.1.0", "1.1.1", 1.3.0") (/layers/baseLayer|overlays/items/WMS/version)
 * @property {string|null} srsName - Projection of layer. If null, then EPSG 25832 will be used. (/layers/baseLayer|overlays/items/WMS/srsName)
 * @property {number} minResolution - Minimum resolution. (/layers/baseLayer|overlays/items/WMS/minResolution)
 * @property {number} maxResolution - Maximum resolution. (/layers/baseLayer|overlays/items/WMS/maxResolution)
 * @property {number} opacity - Default Opacity. (Values: 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1)(/layers/baseLayer|overlays/items/WMS/opacity)
 * @property {string|null} legendUrl - URL for legend. If empty or null, legend will be loaded using GetLegendGraphic. It has priority over legendUrl in each WMS-Layer (/layers/WMS/layers/items/legendUrl). (/layers/baseLayer|overlays/items/WMS/legendUrl)
 * @property {string|null} copyright - Copyright. If null or empty it will be parsed from GetCapabilities. (/layers/baseLayer|overlays/items/WMS/copyright)
 * @property {object} time - Time options for WMS-T. (/layers/baseLayer|overlays/items/WMS/time)
 * @property {boolean} time.active - Activate tool. (/layers/baseLayer|overlays/items/WMS/time/active)
 * @property {string} time.values - Specify time range and interval in ISO 8601 format. Example: '2016-03-10T23:00:00.000Z/2016-03-15T23:00:00.000Z/P1D'. Infos: https://en.wikipedia.org/wiki/ISO_8601. (/layers/baseLayer|overlays/items/WMS/time/values)
 * @property {string} time.mode - Time slider mode. Values: 'period|time'. If not defined, both modes will be used.
 * @property {string} time.default - Default value for time slider
 */
/**
 * WTMS layer (/layers/baseLayer|overlays/items/WTMS)
 * @typedef {object} WMTS
 * @property {string} type - Type of layer: WMTS (/layers/baseLayer|overlays/items/WMTS/type)
 * @property {string|null} id - Unique ID. It will be used in permaLink and persistence JSON. If not available, it will be added by Framework. (/layers/baseLayer|overlays/items/WMTS/id)
 * @property {string} name - Name of layer shown in Menu. (/layers/baseLayer|overlays/items/WMTS/name)
 * @property {string} url - Service-URL. (/layers/baseLayer|overlays/items/WMTS/url)
 * @property {string} layer - Service-URL. If the URL ends with .xml, then make a getCapabilites request and use the response to load the layer.(/layers/baseLayer|overlays/items/WMTS/layer)
 * @property {boolean} visibility - Initial visibility of layer. (/layers/baseLayer|overlays/items/WMTS/visibility)
 * @property {string|null} srsName - Projection of layer. If null, then EPSG 25832 will be used. (/layers/baseLayer|overlays/items/WMTS/srsName)
 * @property {object} tileGrid - Tile grid options (/layers/baseLayer|overlays/items/WMTS/tileGrid)
 * @property {array|null} tileGrid.origin - Tile grid origin. Array with numbers [lon, lat] or null. (/layers/baseLayer|overlays/items/WMTS/tileGrid/origin)
 * @property {array|null} tileGrid.resolutions - Array with numbers. (/layers/baseLayer|overlays/items/WMTS//tileGrid/resolutions)
 * @property {array|null} tileGrid.matrixIds - Array with strings. The length of this array needs to match the length of the resolutions array. (/layers/baseLayer|overlays/items/WMTS//tileGrid/matrixIds)
 * @property {string|null} version - WMTS version. Always 1.0.0 (/layers/baseLayer|overlays/items/WMTS/version)
 * @property {number} minResolution - Minimum resolution. (/layers/baseLayer|overlays/items/WMTS/minResolution)
 * @property {number} maxResolution - Maximum resolution. (/layers/baseLayer|overlays/items/WMTS/maxResolution)
 * @property {string|null} style - Style of WMTS. If null, default will be loaded. (/layers/baseLayer|overlays/items/WMTS/style)
 * @property {string|null} matrixSet - Matrix set. (/layers/baseLayer|overlays/items/WMTS/matrixSet)
 * @property {number} opacity - Default Opacity. (Values: 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1)(/layers/baseLayer|overlays/items/WMTS/opacity)
 * @property {string|null} copyright - Copyright. If null or empty it will be parsed from GetCapabilities. (/layers/baseLayer|overlays/items/WMTS/copyright)
 * @property {string|null} legendUrl - URL for legend. (/layers/WMS/layers/items/legendUrl). (/layers/baseLayer|overlays/items/WMTS/legendUrl)
 */
/**
 * WFS layer (/layers/baseLayer|overlays/items/WFS)
 * @typedef {object} WFS
 * @property {string} type - Type of layer: WFS (/layers/baseLayer|overlays/items/WFS/type)
 * @property {string|null} id - Unique ID. It will be used in permaLink and persistence JSON. If not available, it will be added by Framework. (/layers/baseLayer|overlays/items/WFS/id)
 * @property {string} name - Name of layer shown in Menu. (/layers/baseLayer|overlays/items/WFS/name)
 * @property {string} typename - Typename of WFS (namespace:featuretype). (/layers/baseLayer|overlays/items/WFS/typename)
 * @property {string} url - Service-URL. (/layers/baseLayer|overlays/items/WFS/url)
 * @property {boolean} visibility - Initial visibility of layer. (/layers/baseLayer|overlays/items/WFS/visibility)
 * @property {string|null} srsName - Projection of layer. If null, then EPSG 25832 will be used. (/layers/baseLayer|overlays/items/WFS/srsName)
 * @property {string|null} format - Format for WFS layers. If null, then GML3 will be used. (Values: "GEOJSON", "GML2" ,"GML3") (/layers/baseLayer|overlays/items/WFS/format)
 * @property {string|null} version - WFS version. If null, 1.1.0 will be used. (Values: "1.0.0", "1.1.0", 2.0.0") (/layers/baseLayer|overlays/items/WFS/version)
 * @property {boolean} tiles - Load layer using tile strategy. (/layers/baseLayer|overlays/items/WFS/tiles)
 * @property {number} minResolution - Minimum resolution. (/layers/baseLayer|overlays/items/WFS/minResolution)
 * @property {number} maxResolution - Maximum resolution. (/layers/baseLayer|overlays/items/WFS/maxResolution)
 * @property {boolean} edit - Enable edit layer. Always false. (/layers/baseLayer|overlays/items/WFS/edit)
 * @property {string|null} style - Style of WFS. Use /styles/items/name. (/layers/baseLayer|overlays/items/WFS/style)
 * @property {number} opacity - Default Opacity. (Values: 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1)(/layers/baseLayer|overlays/items/WFS/opacity)
 * @property {string|null} copyright - Copyright. If null or empty it will be parsed from GetCapabilities. (/layers/baseLayer|overlays/items/WFS/copyright)
 * @property {string|null} legendUrl - URL for legend. (/layers/baseLayer|overlays/items/WFS/legendUrl)
 */
/**
 * MARKER layer (/layers/baseLayer|overlays/items/MARKER)
 * @typedef {object} MARKER
 * @property {string} type - Type of layer: MARKER (/layers/baseLayer|overlays/items/MARKER/type)
 * @property {string|null} id - Unique ID. It will be used in permaLink and persistence JSON. If not available, it will be added by Framework. (/layers/baseLayer|overlays/items/MARKER/id)
 * @property {string} name - Name of layer shown in Menu. (/layers/baseLayer|overlays/items/MARKER/name)
 * @property {boolean} visibility - Initial visibility of layer. (/layers/baseLayer|overlays/items/MARKER/visibility)
 * @property {string|null} srsName - Projection of layer. If null, then EPSG 4326 will be used. (/layers/baseLayer|overlays/items/MARKER/srsName)
 * @property {object[]} markers - List of markers. (/layers/baseLayer|overlays/items/MARKER/markers) <br> <b>Below are properties of each Object in Array:</b>
 * @property {object} coordinates - Coordinates of marker. The coordinate system is defined through srsName.  (/layers/baseLayer|overlays/items/MARKER/coordinates)
 * @property {number} coordinates.lat - Marker latitude. (/layers/baseLayer|overlays/items/MARKER/coordinates/lat)
 * @property {number} coordinates.lon - Marker longitude. (/layers/baseLayer|overlays/items/MARKER/coordinates/lon)
 * @property {string} markers.content - Content for info area. Markup is allowed. (/layers/baseLayer|overlays/items/MARKER/markers/content)
 * @property {number} minResolution - Minimum resolution. (/layers/baseLayer|overlays/items/MARKER/minResolution)
 * @property {number} maxResolution - Maximum resolution. (/layers/baseLayer|overlays/items/MARKER/maxResolution)
 * @property {boolean} edit - Enable edit layer. Always false. (/layers/baseLayer|overlays/items/MARKER/edit)
 * @property {string|null} style - Style of WFS. Use /styles/items/name. (/layers/baseLayer|overlays/items/MARKER/style)
 * @property {number} opacity - Default Opacity. (Values: 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1)(/layers/baseLayer|overlays/items/MARKER/opacity)
 * @property {string|null} copyright - Copyright. If null or empty it will be parsed from GetCapabilities. (/layers/baseLayer|overlays/items/MARKER/copyright)
 * @property {string|null} legendUrl - URL for legend. (/layers/baseLayer|overlays/items/MARKER/legendUrl)
 */
/**
 * CSV layer (/layers/baseLayer|overlays/items/CSV)
 * @typedef {object} CSV
 * @property {string} type - Type of layer: CSV (/layers/baseLayer|overlays/items/CSV/type)
 * @property {string|null} id - Unique ID. It will be used in permaLink and persistence JSON. If not available, it will be added by Framework. (/layers/baseLayer|overlays/items/CSV/id)
 * @property {string} name - Name of layer shown in Menu. (/layers/baseLayer|overlays/items/CSV/name)
 * @property {string} url - URL of CSV file. (/layers/baseLayer|overlays/items/CSV/url)
 * @property {boolean} visibility - Initial visibility of layer. (/layers/baseLayer|overlays/items/CSV/visibility)
 * @property {string|null} srsName - Projection of layer. If null, then EPSG 4326 will be used. (/layers/baseLayer|overlays/items/CSV/srsName)
 * @property {object} csvOptions - Options only for CSV layer. (/layers/baseLayer|overlays/items/CSV/csvOptions)
 * @property {boolean} csvOptions.header - Should the first row be used as header. (/layers/baseLayer|overlays/items/CSV/csvOptions/header)
 * @property {string} csvOptions.delimiter - Delimiter used in CSV file (default: ";"). (/layers/baseLayer|overlays/items/CSV/csvOptions/delimiter)
 * @property {integer[]} csvOptions.columnsToParse - Names (strings) or positions (integer) of columns that should be used as attributes. 1 is the start position. If null, then all columns will be used. (/layers/baseLayer|overlays/items/CSV/csvOptions/columnsToParse)
 * @property {integer[]} csvOptions.columnNames - ADefine custom column names. Used only if header is false. The length should be the same as in columnsToParse.. (/layers/baseLayer|overlays/items/CSV/csvOptions/columnNames)
 * @property {string|integer} csvOptions.LatColumn - Name (string) or position (integer) of column with coordinates (Lat). The coordinate system is defined through srsName. (/layers/baseLayer|overlays/items/CSV/csvOptions/LatColumn)
 * @property {string|integer} csvOptions.LonColumn - Name (string) or position (integer) of column with coordinates (Lon). The coordinate system is defined through srsName. (/layers/baseLayer|overlays/items/CSV/csvOptions/LonColumn)
 * @property {string} csvOptions.encoding - The encoding to use when opening the file (default: "UTF-8"). (/layers/baseLayer|overlays/items/CSV/csvOptions/encoding)
 * @property {number} minResolution - Minimum resolution. (/layers/baseLayer|overlays/items/CSV/minResolution)
 * @property {number} maxResolution - Maximum resolution. (/layers/baseLayer|overlays/items/CSV/maxResolution)
 * @property {boolean} edit - Enable edit layer. Always false. (/layers/baseLayer|overlays/items/CSV/edit)
 * @property {string|null} style - Style of WFS. Use /styles/items/name. (/layers/baseLayer|overlays/items/CSV/style)
 * @property {number} opacity - Default Opacity. (Values: 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1)(/layers/baseLayer|overlays/items/CSV/opacity)
 * @property {string|null} copyright - Copyright. If null or empty it will be parsed from GetCapabilities. (/layers/baseLayer|overlays/items/CSV/copyright)
 * @property {string|null} legendUrl - URL for legend. (/layers/baseLayer|overlays/items/CSV/legendUrl)
 */
/**
 * XLS layer (/layers/baseLayer|overlays/items/XLS)
 * @typedef {object} XLS
 * @property {string} type - Type of layer: XLS (/layers/baseLayer|overlays/items/XLS/type)
 * @property {string|null} id - Unique ID. It will be used in permaLink and persistence JSON. If not available, it will be added by Framework. (/layers/baseLayer|overlays/items/XLS/id)
 * @property {string} name - Name of layer shown in Menu. (/layers/baseLayer|overlays/items/XLS/name)
 * @property {string} url - URL of Excel file. (/layers/baseLayer|overlays/items/XLS/url)
 * @property {boolean} visibility - Initial visibility of layer. (/layers/baseLayer|overlays/items/XLS/visibility)
 * @property {string|null} srsName - Projection of layer. If null, then EPSG 4326 will be used. (/layers/baseLayer|overlays/items/XLS/srsName)
 * @property {object} excelOptions - Options only for XLS layer. (/layers/baseLayer|overlays/items/XLS/csvOptions)
 * @property {boolean} excelOptions.header - Should the first row be used as header. (/layers/baseLayer|overlays/items/XLS/excelOptions/header)
 * @property {integer[]} excelOptions.columnsToParse - Names (strings) or positions (integer) of columns that should be used as attributes. 1 is the start position. If null, then all columns will be used. (/layers/baseLayer|overlays/items/XLS/excelOptions/columnsToParse)
 * @property {integer[]} excelOptions.columnNames - ADefine custom column names. Used only if header is false. The length should be the same as in columnsToParse.. (/layers/baseLayer|overlays/items/XLS/excelOptions/columnNames)
 * @property {string|integer} excelOptions.LatColumn - Name (string) or position (integer) of column with coordinates (Lat). The coordinate system is defined through srsName. (/layers/baseLayer|overlays/items/XLS/excelOptions/LatColumn)
 * @property {string|integer} excelOptions.LonColumn - Name (string) or position (integer) of column with coordinates (Lon). The coordinate system is defined through srsName. (/layers/baseLayer|overlays/items/XLS/excelOptions/LonColumn)
 * @property {number} minResolution - Minimum resolution. (/layers/baseLayer|overlays/items/XLS/minResolution)
 * @property {number} maxResolution - Maximum resolution. (/layers/baseLayer|overlays/items/XLS/maxResolution)
 * @property {boolean} edit - Enable edit layer. Always false. (/layers/baseLayer|overlays/items/XLS/edit)
 * @property {string|null} style - Style of WFS. Use /styles/items/name. (/layers/baseLayer|overlays/items/XLS/style)
 * @property {number} opacity - Default Opacity. (Values: 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1)(/layers/baseLayer|overlays/items/XLS/opacity)
 * @property {string|null} copyright - Copyright. If null or empty it will be parsed from GetCapabilities. (/layers/baseLayer|overlays/items/XLS/copyright)
 * @property {string|null} legendUrl - URL for legend. (/layers/baseLayer|overlays/items/XLS/legendUrl)
 */
/**
 * GPS layer (/layers/baseLayer|overlays/items/GPS)
 * @typedef {object} GPS
 * @property {string} type - Type of layer: GPS (/layers/baseLayer|overlays/items/GPS/type)
 * @property {string|null} id - Unique ID. It will be used in permaLink and persistence JSON. If not available, it will be added by Framework. (/layers/baseLayer|overlays/items/GPS/id)
 * @property {string} name - Name of layer shown in Menu. (/layers/baseLayer|overlays/items/GPS/name)
 * @property {string} url - URL of GPX file. (/layers/baseLayer|overlays/items/GPS/url)
 * @property {boolean} visibility - Initial visibility of layer. (/layers/baseLayer|overlays/items/GPS/visibility)
 * @property {number} minResolution - Minimum resolution. (/layers/baseLayer|overlays/items/GPS/minResolution)
 * @property {number} maxResolution - Maximum resolution. (/layers/baseLayer|overlays/items/GPS/maxResolution)
 * @property {boolean} edit - Enable edit layer. Always false. (/layers/baseLayer|overlays/items/GPS/edit)
 * @property {string|null} style - Style of WFS. Use /styles/items/name. (/layers/baseLayer|overlays/items/GPS/style)
 * @property {number} opacity - Default Opacity. (Values: 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1)(/layers/baseLayer|overlays/items/GPS/opacity)
 * @property {string|null} copyright - Copyright. If null or empty it will be parsed from GetCapabilities. (/layers/baseLayer|overlays/items/GPS/copyright)
 * @property {string|null} legendUrl - URL for legend. (/layers/baseLayer|overlays/items/GPS/legendUrl)
 */
/**
 * BKG layer (/layers/baseLayer|overlays/items/BKG)
 * @typedef {object} BKG
 * @property {string} type - Type of layer: BKG (/layers/baseLayer|overlays/items/BKG/type)
 * @property {string|null} id - Unique ID. It will be used in permaLink and persistence JSON. If not available, it will be added by Framework. (/layers/baseLayer|overlays/items/BKG/id)
 * @property {string} name - Name of layer shown in Menu. (/layers/baseLayer|overlays/items/BKG/name)
 * @property {string} ref - Reference of layer in BKG layer registry. This is the name of BKG layer to load. (/layers/baseLayer|overlays/items/BKG/ref)
 * @property {boolean} visibility - Initial visibility of layer. (/layers/baseLayer|overlays/items/BKG/visibility)
 * @property {string|null} srsName - Projection of layer. If null, then map projection will be used. (/layers/baseLayer|overlays/items/BKG/srsName)
 * @property {number} minResolution - Minimum resolution. (/layers/baseLayer|overlays/items/BKG/minResolution)
 * @property {number} maxResolution - Maximum resolution. (/layers/baseLayer|overlays/items/BKG/maxResolution)
 * @property {object} properties - Updates for the layer that will overwrite the preconfigured values. The complete set of available properties depends on the preconfigured layer class. (/layers/baseLayer|overlays/items/BKG/properties)
 * @property {number} opacity - Default Opacity. (Values: 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1)(/layers/baseLayer|overlays/items/BKG/opacity)
 * @property {string|null} copyright - Copyright. If null or empty it will be parsed from GetCapabilities. (/layers/baseLayer|overlays/items/BKG/copyright)
 * @property {string|null} legendUrl - URL for legend. (/layers/baseLayer|overlays/items/BKG/legendUrl)
 */
/**
 * GROUP layer (/layers/overlays/items/GROUP)
 * @typedef {object} GROUP
 * @property {string} type - Type of layer: GROUP (/layers/overlays/items/GROUP/type)
 * @property {string|null} id - Unique ID. It will be used in permaLink and persistence JSON. If not available, it will be added by Framework. (/layers/overlays/items/GROUP/id)
 * @property {string} name - Name of group. (/layers/overlays/items/GROUP/name)
 *
 * @property {object[]} layers - List of layers in a group. The position in this list will determine the position on map. (Array values: {@link WMS}, {@link WMTS}, {@link WFS}, {@link MARKER}, {@link CSV}, {@link CSV}, {@link XLS}, {@link GPS}, {@link BKG}) (/layers/overlays/items/GROUP/layers)
 *
 * @property {boolean} visibility - Initial visibility of layer. (/layers/overlays/items/GROUP/visibility)
 */
/**
 * NONE layer (/layers/baseLayer/items/NONE)
 * @typedef {object} NONE
 * @property {string} type - Type of layer: NONE (/layers/baseLayer/items/NONE/type)
 * @property {string|null} id - Unique ID. It will be used in permaLink and persistence JSON. If not available, it will be added by Framework. (/layers/baseLayer/items/NONE/id)
 */
/**
 * Parses layer configuration used for creating map layers when calling create.
 * @memberOf BKGWebMap.MapBuilder
 * @param {object|array} layersConfig -Object with configuration parameters for layers or array with ol.layer class. If OpenLayers classes are directly used, all layers are in basemaps group. (/layers)
 * @param {WMS[]|WMTS[]|WFS[]|MARKER[]|CSV[]|XLS[]|GPS[]|BKG[]|NONE[]} layersConfig.baseLayers - Base layers. The order of layers will be used in menu. The array can have any of the following layer definitions: WMS, WMTS, WFS, MARKER, CSV, XLS, GPS, BKG, NONE (/layers/baseLayers)
 * @param {WMS[]|WMTS[]|WFS[]|MARKER[]|CSV[]|XLS[]|GPS[]|BKG[]|GROUP[]} layersConfig.overlays - Layers and group of layers that will be loaded as overlays. The order of layers will be used in menu. The array can have any of the following layer definitions: WMS, WMTS, WFS, MARKER, CSV, XLS, GPS, BKG, GROUP (/layers/overlays)
 * @returns {BKGWebMap.MapBuilder}
 */
BKGWebMap.MapBuilder.prototype.setLayers = function (layersConfig) {
    // Parse only objects or arrays
    if (layersConfig && ((typeof layersConfig === 'object' && layersConfig.constructor === Object) || layersConfig instanceof Array)) {
        this.layersConfig = layersConfig;
        this.called.setLayers = true;
    } else {
        this.layersConfig = this.DEFAULT_LAYERS_CONFIG;
    }
    return this;
};

/**
 * GROUP layer (/styles/items/symbol)
 * @typedef {object} symbol_style
 * @property {string} name - Name of style. This should be used as reference for a layer. (/styles/items/symbol/name)
 * @property {string} type - Type of style: symbol. (/styles/items/symbol/type)
 * @property {string} fillColor - Fill color for vector layers. A hexadecimal value. (/styles/items/symbol/fillColor)
 * @property {string} strokeColor - Stroke color for vector layers. A hexadecimal value. (/styles/items/symbol/strokeColor)
 * @property {string} symbol - Symbol for vector layers (points). (Values: "marker", "star", "circle", "dottedCircle", "pentagon") (/styles/items/symbol/symbol)
 */
/**
 * GROUP layer (/styles/items/custom)
 * @typedef {object} custom_style
 * @property {string} name - Name of style. This should be used as reference for a layer. (/styles/items/custom/name)
 * @property {string} type - Type of style: custom. (/styles/items/custom/type)
 * @property {object} fill - Properties of OpenLayers Class ol.style.Fill. (/styles/items/custom/fill)
 * @property {object} stroke - SProperties of OpenLayers Class ol.style.Stroke. (/styles/items/custom/stroke)
 * @property {object} image - Styling points. Use only one key of the following. If more than one keys are used, this is the reading order: regularShape->icon->circle (last overwrites first) (/styles/items/custom/image)
 * @property {object} image.circle - Properties of OpenLayers Class ol.style.Circle (/styles/items/custom/image/circle)
 * @property {object} image.icon - Properties of OpenLayers Class ol.style.Icon (/styles/items/custom/image/icon)
 * @property {object} image.regularShape - Properties of OpenLayers Class ol.style.RegularShape (/styles/items/custom/image/regularShape)
 */
/**
 * Parse styles used for vector layers
 * @param {symbol_style[]|custom_style[]} stylesConfig - Array with style configuration (/styles)
 * @returns {BKGWebMap.MapBuilder}
 */
BKGWebMap.MapBuilder.prototype.defineStyles = function (stylesConfig) {
    // Parse only arrays
    if (stylesConfig && stylesConfig instanceof Array) {
        this.stylesArray = stylesConfig;
        this.called.defineStyles = true;
    }
    return this;
};

/**
 * Parse configuration for security. Define cookieCheck and information about secure BKG Services.
 * @memberOf BKGWebMap.MapBuilder
 * @param {object} securityConfig - Security options. (/security)
 * @param {boolean} securityConfig.cookieCheck - Should the application use cookie test. (/security/cookieCheck)
 * @param {string} securityConfig.UUID - BKG UUID. (/security/UUID)
 * @param {string} securityConfig.appID - BKG Application ID. (/security/appID)
 * @param {string} securityConfig.appDomain - Domain for BKG Application ID. (/security/appDomain)
 * @returns {BKGWebMap.MapBuilder}
 */
BKGWebMap.MapBuilder.prototype.setSecurity = function (securityConfig) {
    if (securityConfig && (typeof securityConfig === 'object' && securityConfig.constructor === Object)) {
        this.securityConfig = securityConfig;
        this.called.setSecurity = true;
    }
    return this;
};

/**
 * Parses a configuration JSON for BKG WebMap. It can be either the URL of a JSON file or the JSON itself.
 * @memberOf BKGWebMap.MapBuilder
 * @param {string|object} config - JSON or filename or JSON with BKG WebMap configuration. (/)
 * @return {BKGWebMap.MapBuilder}
 */
BKGWebMap.MapBuilder.prototype.loadConfig = function (config) {
    if (typeof config === 'string' || config instanceof String) {
        this.configFile = true;
        this.configUrlOrJson = config;
    } else if (config && typeof config === 'object' && config.constructor === Object) {
        this.configFile = false;
        this.configUrlOrJson = config;
    }
    this.called.loadConfig = true;
    return this;
};

/**
 * Callback for getting ready map object. You can use the parameter to change the map.
 * @callback createCallback
 * @param {ol.Map} _this.map - OpenLayer map object.
 */
/**
 * Creates the map with current configuration and returns MapBuilder object.
 * @memberOf BKGWebMap.MapBuilder
 * @param {createCallback} callback - Callback for getting ready map object. You can use it to change the map.
 * @returns {BKGWebMap.MapBuilder}
 */
BKGWebMap.MapBuilder.prototype.create = function (callback) {
    var _this = this;

    // Find and parse config json
    var jsonConfig = new BKGWebMap.ParseConfig();

    // Test if we load app using an user-imported JSON file
    // The content if file is saved in sessionStorage
    try {
        if (window.sessionStorage.getItem('bkgwebmap')) {
            _this.configFile = false;

            // Read sessionStorage 'bkgwebmap' key
            var json = window.sessionStorage.getItem('bkgwebmap');
            _this.configUrlOrJson = JSON.parse(json);

            _this.viewConfig = null;
            _this.layersConfig = null;
            _this.called.setTarget = false;
            _this.called.setView = false;
            _this.called.setLayers = false;
            _this.called.loadConfig = true;

            // Remove sessionStorage 'bkgwebmap' key
            window.sessionStorage.removeItem('bkgwebmap');

            if (_this.configUrlOrJson.version && _this.configUrlOrJson.version !== BKGWebMap.VERSION) {
                window.console.log(BKGWebMap.ERROR.wrongPersistenceVersion);
            }
        }
    } catch (err) {
        window.console.log(BKGWebMap.ERROR.enableCookiesImport);
    }

    jsonConfig.LoadJSON(_this.configFile, _this.configUrlOrJson, function () {
        _this.map = new ol.Map({
            controls: ol.control.defaults({
                attribution: false,
                zoom: false,
                rotate: false
            })
        });

        _this.map.getInteractions().forEach(function (interaction) {
            if (interaction instanceof ol.interaction.KeyboardPan) {
                _this.map.removeInteraction(interaction);
            }
        });


        if (_this.called.setView) {
            _this.div = jsonConfig.createConfigTarget(_this.div, _this.called.setTarget);
            // If OpenLayers class ol.View is used, do not parse View from json
            if (!(_this.viewConfig instanceof ol.View)) {
                _this.viewConfig = jsonConfig.createConfigView(_this.DEFAULT_VIEW_CONFIG, _this.viewConfig, _this.called.setView);
            }
        } else if (jsonConfig.exists) {
            _this.div = jsonConfig.createConfigTarget(_this.div, _this.called.setTarget);
            // If OpenLayers class ol.View is used, do not parse View from json
            if (!(_this.viewConfig instanceof ol.View)) {
                _this.viewConfig = jsonConfig.createConfigView(_this.DEFAULT_VIEW_CONFIG, _this.viewConfig, _this.called.setView);
            }
        } else {
            _this.viewConfig = _this.DEFAULT_VIEW_CONFIG;
        }

        var mapDiv = document.getElementById(_this.div);

        // Error: mapDiv
        if (mapDiv === null || mapDiv === undefined) {
            window.console.log(BKGWebMap.ERROR.mapDiv + _this.div);
            return;
        }

        _this.map.setTarget(_this.div);

        // ***** View *****
        // Create and use view
        var view;
        if (_this.viewConfig instanceof ol.View) {
            view = _this.viewConfig;
        } else {
            view = BKGWebMap.View.create(_this.viewConfig);
        }

        // Define right extent for map projection
        var projectionCode = view.getProjection().getCode();
        var projection = ol.proj.get(projectionCode);
        projection.setExtent(BKGWebMap.PROJECTIONS_EXTENTS[projectionCode]);

        _this.map.setView(view);

        // If there either zoom nor resolution defined, find best resolution for map
        if (!_this.viewConfig.zoom && !_this.viewConfig.resolution && !(_this.viewConfig instanceof ol.View)) {
            _this.viewConfig.resolution = BKGWebMap.View.findBestResolution(_this.viewConfig, _this.map);
            view.setResolution(_this.viewConfig.resolution);
        }

        // Use mapExent and if there is no center defined, fit map to default extent
        if (_this.viewConfig.mapExtent && _this.viewConfig.mapExtent instanceof Array) {
            view.fit(_this.viewConfig.mapExtent, { size: _this.map.getSize() });

            view.calculateExtent(_this.map.getSize());
        } else if (!_this.viewConfig.center && !(_this.viewConfig instanceof ol.View)) {
            view.fit(BKGWebMap.EXTENTS[_this.viewConfig.projection], { size: _this.map.getSize() });
        }
        // ***************

        // ***** Styles *****
        _this.styles = jsonConfig.createConfigStyles(_this.stylesArray, _this.called.defineStyles);
        // ******************

        // ***** Security *****
        // Generate UUID first and then load layers and controls
        jsonConfig.getSecurityOptions(_this.map, _this.securityConfig, _this.called.setSecurity, function (security) {
            BKGWebMap.SECURITY = security;

            // ***** Controls *****
            // Create control for standard control icons position
            var standardPositionControls = {};
            var standardPositions = BKGWebMap.Control.FACTORIES.standardPosition();
            for (var standardPosition in standardPositions) {
                standardPositionControls[standardPosition] = new standardPositions[standardPosition](_this.map, standardPosition);
                if (Object.keys(standardPositionControls[standardPosition]).length > 0) {
                    _this.map.addControl(standardPositionControls[standardPosition]);
                }
            }
            // Firstly add panel if it is defined in config and get a boolean indicating if a panel exists
            var panel = jsonConfig.createControlPanel(_this.map, _this.controlsConfig, _this.called.setControls, standardPositionControls);
            if (panel) {
                _this.map.addControl(panel);
            }
            // Then add all other controls
            var controls = jsonConfig.createControls(_this.map, _this.controlsConfig, _this.called.setControls, panel, standardPositionControls);
            BKGWebMap.Util.each(controls, function (index, control) {
                if (control) {
                    _this.map.addControl(control);
                }
            });

            // Find if we have layerswitcher, custom layers, legend, copyright and edit control
            var layerSwitcher;
            var customLayers;
            var legend;
            var copyright;
            var edit;
            var permaLink;
            var overviewMap;
            var timeSlider;
            _this.map.getControls().forEach(function (control) {
                if (BKGWebMap.Control.LayerSwitcher && control instanceof BKGWebMap.Control.LayerSwitcher) {
                    layerSwitcher = control;
                    _this.map.getView().on('change:resolution', function () {
                        _this.map.getLayers().forEach(function (layer) {
                            layerSwitcher.resolutionLimits(layer);
                        });
                    });
                }
                if (BKGWebMap.Control.CustomLayers && control instanceof BKGWebMap.Control.CustomLayers) {
                    customLayers = control;
                    customLayers.initializeControl(layerSwitcher, _this.styles);
                }
                if (BKGWebMap.Control.Legend && control instanceof BKGWebMap.Control.Legend) {
                    legend = control;
                }
                if (BKGWebMap.Control.Copyright && control instanceof BKGWebMap.Control.Copyright) {
                    copyright = control;
                }
                if (BKGWebMap.Control.Edit && control instanceof BKGWebMap.Control.Edit) {
                    edit = control;
                }
                if (BKGWebMap.Control.Share && control instanceof BKGWebMap.Control.Share) {
                    if (Object.prototype.hasOwnProperty.call(control, 'permaLink') && Object.prototype.hasOwnProperty.call(control.permaLink, 'active')) {
                        permaLink = control.permaLink;
                    }
                }
                if (BKGWebMap.Control.OverviewMap && control instanceof BKGWebMap.Control.OverviewMap) {
                    overviewMap = control;
                }
                if (BKGWebMap.Control.TimeSlider && control instanceof BKGWebMap.Control.TimeSlider) {
                    timeSlider = control;
                }
                if (BKGWebMap.Control.FullScreen && control instanceof BKGWebMap.Control.FullScreen) {
                    control.fullScreenListener();
                }
            });
            // ********************

            // *****Layers*****
            jsonConfig.createConfigLayers(_this.map, _this.DEFAULT_LAYERS_CONFIG, _this.layersConfig, _this.styles, _this.called.setLayers, function (layers) {
                var readLayersFromPermaLink = false;
                if (permaLink) {
                    readLayersFromPermaLink = permaLink.readLayersFromPermaLink;
                }
                if (permaLink && readLayersFromPermaLink) {
                    layers = permaLink.changeLayersOrder(layers);
                }

                BKGWebMap.Util.reverseEach(layers.baseLayers, function (index, layer) {
                    if (layer) {
                        _this.map.addLayer(layer);
                        if (layerSwitcher) {
                            layerSwitcher.addInLayerSwitcher(layer, true, false, true, null);
                            layerSwitcher.resolutionLimits(layer);
                            layerSwitcher.ajaxLoader(layer);
                        }
                        if (legend) {
                            legend.addLayerToLegend(layer);
                        }
                        if (copyright) {
                            copyright.addLayerInCopyright(layer);
                        }
                        if (timeSlider) {
                            timeSlider.addLayerInTimeSlider(layer);
                        }
                    }
                });
                BKGWebMap.Util.reverseEach(layers.overlays, function (index, layer) {
                    if (layer) {
                        _this.map.addLayer(layer);
                        if (layerSwitcher) {
                            layerSwitcher.addInLayerSwitcher(layer, false, false, true, null);
                            layerSwitcher.resolutionLimits(layer);
                            layerSwitcher.ajaxLoader(layer);
                        }
                        if (legend) {
                            legend.addLayerToLegend(layer);
                        }
                        if (copyright) {
                            copyright.addLayerInCopyright(layer);
                        }
                        if (edit) {
                            edit.getEditableLayer(_this.map, layer);
                            var editableLayerAvailable = edit.editableLayerAvailable();
                            if (editableLayerAvailable === false) {
                                edit.addEmptyLayer();
                            }
                        }
                        if (timeSlider) {
                            timeSlider.addLayerInTimeSlider(layer);
                        }
                    }
                });

                if (!layers.overlays.length && edit) {
                    var editableLayerAvailable = edit.editableLayerAvailable();
                    if (editableLayerAvailable === false) {
                        edit.addEmptyLayer();
                    }
                }
                if (permaLink && !readLayersFromPermaLink) {
                    permaLink.changeLayersInPermalink();
                }

                if (layerSwitcher) {
                    layerSwitcher.permaLinkActivated = true;
                }

                if (overviewMap) {
                    setTimeout(function () {
                        overviewMap.activateOverviewMap();
                    }, 500);
                }

                // Open panel if needed
                if (panel) {
                    panel.initialize();
                }

                // Add layer event
                _this.map.getLayers().on('add', function (event) {
                    function createLayer(map, config, layerGroup, styles, bkg, createLayerCallback) {
                        config.isBaseLayer = false;
                        BKGWebMap.Layer.FACTORIES[config.type](null, map, config, styles, bkg, function (layer) {
                            return createLayerCallback(layer);
                        });
                    }

                    function adjustControls(addedLayer) {
                        _this.map.getControls().forEach(function (control) {
                            var changeVisibility = BKGWebMap.CONTROLS.tools.customLayers.changeVisibility;
                            if (BKGWebMap.Control.CustomLayers && control instanceof BKGWebMap.Control.CustomLayers) {
                                changeVisibility = control.changeVisibility;
                            }
                            if (BKGWebMap.Control.LayerSwitcher && control instanceof BKGWebMap.Control.LayerSwitcher) {
                                control.addInLayerSwitcher(addedLayer, false, false, false, changeVisibility);
                                control.resolutionLimits(addedLayer);
                                control.ajaxLoader(addedLayer);
                            }
                            if (BKGWebMap.Control.Legend && control instanceof BKGWebMap.Control.Legend) {
                                control.addLayerToLegend(addedLayer, false, false, true);
                            }
                            if (BKGWebMap.Control.Copyright && control instanceof BKGWebMap.Control.Copyright) {
                                control.addLayerInCopyright(addedLayer);
                            }
                        });
                    }
                    var layer = event.element;
                    if (layer.getProperties().measureLayer) {
                        return;
                    }
                    if (!layer.getProperties().uniqueId) {
                        _this.map.removeLayer(layer);
                        var config = BKGWebMap.Layer.Util.programmaticLayerConfig(layer);
                        if (config) {
                            if (typeof config === 'object') {
                                createLayer(_this.map, config, 'overlays', null, false, function (layerToAdd) {
                                    _this.map.addLayer(layerToAdd);
                                    adjustControls(layerToAdd);
                                });
                            } else if (typeof config === 'string' && config !== '') {
                                layer.setProperties({ uniqueId: config });
                                _this.map.addLayer(layer);
                                adjustControls(layer);
                            }
                        }
                    }
                });

                if (callback) {
                    return callback(_this.map);
                }
            });
            // ***************

            return undefined;
        });
        // ********************
    });
    return this;
};

/**
 * Getter: It returns the map object, but it is not ready with all elements. Better use the callback of create(): {@link createCallback}
 * @type {function}
 * @memberOf BKGWebMap.MapBuilder
 * @returns {ol.Map}
 */
BKGWebMap.MapBuilder.prototype.getMap = function () {
    return this.map;
};
