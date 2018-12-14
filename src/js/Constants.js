/**
 * BKG WebMap Version
 * @type {string}
 * @constant BKGWebMap.VERSION
 */
BKGWebMap.VERSION = '0.7.4';

/**
 * OpenLayers version used in BKG WebMap
 * @type {string}
 * @constant BKGWebMap.OPENLAYERS_VERSIO
 */
BKGWebMap.OPENLAYERS_VERSION = '4.6.5';

/**
 * Native Projektion of WebAtlasDE
 * @type {string}
 * @constant BKGWebMap.PROJECTION
 */
BKGWebMap.PROJECTION = 'EPSG:25832';

/**
 * Default div id for map
 * @type {string}
 * @constant BKGWebMap.DEFAULT_MAP_DIV
 */
BKGWebMap.DEFAULT_MAP_DIV = 'map';

/**
 * Standard URL for BKG services
 * @type {string}
 * @constant BKGWebMap.BASE_URL
 */
BKGWebMap.BASE_URL = 'https://sg.geodatenzentrum.de/';

/**
 * URL of BKG maps services registry
 * @type {string}
 * @constant BKGWebMap.SERVICE_REGISTRY
 */
BKGWebMap.SERVICE_REGISTRY = ' https://sg.geodatenzentrum.de/gdz_service_registry/webmap/services';

/**
 * Configuration for secure BKG services (/security)
 * @type {Object}
 * @constant BKGWebMap.SECURITY
 * @property {string|null} UUID - BKG UUID (/security/UUID)
 * @property {string|null} appID - BKG Application ID (/security/appID)
 * @property {string|null} appDomain - Domain for BKG Application ID (/security/appDomain)
 */
BKGWebMap.SECURITY = {
    UUID: null,
    appID: null,
    appDomain: null
};

/**
 * Default layer, if user does not define any layer in config
 * @type {Object}
 * @constant BKGWebMap.DEFAULT_LAYER
 * @property {string} type - Type of layer
 * @property {string} name - Name of layer shown in menu.
 * @property {string} ref - Reference of layer in BKG layer registry. This is the name of BKG layer to load.
 * @property {string|null} srsName - Projection of layer. If null, then map projection will be used.
 * @property {boolean} visibility - Initial visibility of layer.
 */
BKGWebMap.DEFAULT_LAYER = {
    type: 'BKG',
    name: 'WebAtlasDE',
    ref: 'webatlasde_light',
    srsName: 'EPSG:25832',
    visibility: true
};

/**
 * Standard extent of Germany in various projections
 * @type {Object}
 * @constant BKGWebMap.EXTENTS
 */
BKGWebMap.EXTENTS = {
    'EPSG:4326': [2.07498609301, 46.4840034677, 18.6083668593, 55.0242047281],
    'EPSG:4258': [2.07498609301, 46.4840034677, 18.6083668593, 55.0242047281],
    'EPSG:3857': [230986.395277, 5858253.27918, 2071473.92327, 7366565.17486],
    'EPSG:4839': [-588294.218731, -816874.468761, 697029.429872, 782107.671922],
    // (U)TM
    'EPSG:25832': [-31457.2, 5171172.3, 1113266.0, 6139784.2],
    'EPSG:25833': [-491561.055747, 5229609.57213, 730630.700903, 6103438.87585],
    'EPSG:4647': [31968542.8007, 5171172.29888, 33113265.9755, 6139784.18944],
    'EPSG:5650': [32331206.6246, 5023799.91841, 33927672.7555, 6400503.87422],
    'EPSG:3034': [3411878.17838, 2238751.12694, 4531884.85677, 3156427.30041],
    'EPSG:3035': [3713155.60384, 2629215.23991, 4870256.61293, 3579362.40517],
    'EPSG:3044': [-31457.1993059, 5171172.29888, 1113265.97552, 6139784.18944],
    'EPSG:3045': [-491561.055747, 5229609.57213, 730630.700903, 6103438.87585],
    // GK
    'EPSG:31466': [2198674.97164, 5156935.03086, 3304138.59087, 6172478.95319],
    'EPSG:31467': [2968406.76329, 5172797.1438, 4113580.06377, 6141807.67656],
    'EPSG:31468': [3738224.07893, 5197527.23054, 4922420.07541, 6119480.25774],
    'EPSG:31469': [4508181.06836, 5231250.21482, 5730855.01451, 6105438.37812],
    'EPSG:5676': [2198674.97164, 5156935.03086, 3304138.59087, 6172478.95319],
    'EPSG:5677': [2968406.76329, 5172797.1438, 4113580.06377, 6141807.67656],
    'EPSG:5678': [3738224.07893, 5197527.23054, 4922420.07541, 6119480.25774],
    'EPSG:5679': [4508181.06836, 5231250.21482, 5730855.01451, 6105438.37812],

    'EPSG:2397': [2801653.04641, 5050072.5876, 4398909.7451, 6362436.76306],
    'EPSG:2398': [3566148.11787, 5046287.77486, 5163397.24898, 6367094.20891],
    'EPSG:2399': [4330719.40757, 5025898.84992, 5927851.03379, 6403177.11818]
};

/**
 * Projected bounds of various coordinate systems
 * @type {Object}
 * @constant BKGWebMap.PROJECTIONS_EXTENTS
 */
BKGWebMap.PROJECTIONS_EXTENTS = {
    'EPSG:4326': [-180.0, -90.0, 180.0, 90.0],
    'EPSG:4258': [-16.1, 32.88, 39.65, 84.17],
    'EPSG:3857': [230986.395277, 5858253.27918, 2071473.92327, 7366565.17486],
    'EPSG:4839': [-2548168.31, -1577095.90, 439849.00, 4105962.24],
    'EPSG:25832': [-1877994.66, 3932281.56, 831544.45, 9437501.54],
    'EPSG:25833': [-2465144.80, 4102893.55, 771164.63, 9406031.62],
    'EPSG:4647': [30121992.97, 3932282.86, 32831544.53, 9437501.55],
    'EPSG:5650': [30534779.40, 4102904.86, 33771164.64, 9406031.63],
    'EPSG:3034': [1584884.54, 1150546.94, 4435373.08, 6675249.46],
    'EPSG:3035': [1896628.62, 1507846.05, 4656644.57, 6827128.02],
    'EPSG:3044': [-1877994.66, 3932281.56, 831544.45, 9437501.54],
    'EPSG:3045': [-2465144.80, 4102893.55, 771164.63, 9406031.62],
    'EPSG:31466': [2490208.09, 5236832.11, 3000085.41, 6134943.54],
    'EPSG:31467': [3263232.43, 5241575.97, 3808980.09, 6117522.79],
    'EPSG:31468': [4036308.74, 5255076.75, 4617579.38, 6108355.90],
    'EPSG:31469': [4809492.54, 5277399.97, 5426067.30, 6107418.61],
    'EPSG:5676': [2490208.09, 5236832.11, 3000085.41, 6134943.54],
    'EPSG:5677': [3263232.43, 5241575.97, 3808980.09, 6117522.79],
    'EPSG:5678': [4036308.74, 5255076.75, 4617579.38, 6108355.90],
    'EPSG:5679': [4809492.54, 5277399.97, 5426067.30, 6107418.61],
    'EPSG:2397': [3731907.99, 5293181.99, 4448849.97, 5746971.47],
    'EPSG:2398': [4506875.07, 5288553.93, 5239562.00, 5712178.87],
    'EPSG:2399': [5281840.36, 5292648.81, 6029811.46, 5686153.47]
};

/**
 * Standard resolutions for UTM32s.
 * These will be used in all coordinate system with meter as unit
 * @type {number[]}
 * @constant BKGWebMap.RESOLUTIONS
 */
BKGWebMap.RESOLUTIONS = [
    4891.96981025128, // AdV-Level 0 (1:17471320.7508974)
    2445.98490512564, // AdV-Level 1 (1:8735660.37544872)
    1222.99245256282, // AdV-Level 2 (1:4367830.18772436)
    611.49622628141, // AdV-Level 3 (1:2183915.09386218)
    305.748113140705, // AdV-Level 4 (1:1091957.54693109)
    152.874056570353, // AdV-Level 5 (1:545978.773465545)
    76.4370282851763, // AdV-Level 6 (1:272989,386732772)
    38.2185141425881, // AdV-Level 7 (1:136494,693366386)
    19.1092570712941, // AdV-Level 8 (1:68247,3466831931)
    9.55462853564703, // AdV-Level 9 (1:34123,6733415966)
    4.77731426782352, // AdV-Level 10 (1:17061,8366707983)
    2.38865713391176, // AdV-Level 11 (1:8530,91833539914)
    1.19432856695588, // AdV-Level 12 (1:4265,45916769957)
    0.59716428347794 // AdV-Level 13 (1:2132,72958384978)
];

/**
 * Extension resolutions for UTM32s.
 * They extend the defined resolutions by 30cm/Pixel and 15cm/Pixel
 * @type {number[]}
 * @constant BKGWebMap.RESOLUTIONS_EXTENDED
 */
BKGWebMap.RESOLUTIONS_EXTENDED = BKGWebMap.RESOLUTIONS.slice();
BKGWebMap.RESOLUTIONS_EXTENDED.push(0.298582141738970);
BKGWebMap.RESOLUTIONS_EXTENDED.push(0.149291070869485);

/**
 * Standard resolutions for WGS84.
 * These will be used in all coordinate system with degrees as unit
 * @type {number[]}
 * @constant BKGWebMap.RESOLUTIONS_DEGREE
 */
BKGWebMap.RESOLUTIONS_DEGREE = [
    0.0439453125, // AdV-Level 0 (1:17471320.7508974)
    0.02197265625, // AdV-Level 1 (1:8735660.37544872)
    0.010986328125, // AdV-Level 2 (1:4367830.18772436)
    0.0054931640625, // AdV-Level 3 (1:2183915.09386218)
    0.00274658203125, // AdV-Level 4 (1:1091957.54693109)
    0.001373291015625, // AdV-Level 5 (1:545978.773465545)
    0.0006866455078125, // AdV-Level 6 (1:272989,386732772)
    0.00034332275390625, // AdV-Level 7 (1:136494,693366386)
    0.000171661376953125, // AdV-Level 8 (1:68247,3466831931)
    0.0000858306884765625, // AdV-Level 9 (1:34123,6733415966)
    0.0000429153442382813, // AdV-Level 10 (1:17061,8366707983)
    0.0000214576721191406, // AdV-Level 11 (1:8530,91833539914)
    0.0000107288360595703, // AdV-Level 12 (1:4265,45916769957)
    0.00000536441802978516 // AdV-Level 13 (1:2132,72958384978)
];

/**
 * Extension resolutions for WGS84.
 * They extend the defined resolutions by 30cm/Pixel and 15cm/Pixel
 * @type {number[]}
 * @constant BKGWebMap.RESOLUTIONS_DEGREE_EXTENDED
 */
BKGWebMap.RESOLUTIONS_DEGREE_EXTENDED = BKGWebMap.RESOLUTIONS_DEGREE.slice();
BKGWebMap.RESOLUTIONS_DEGREE_EXTENDED.push(0.00000268220901489258);
BKGWebMap.RESOLUTIONS_DEGREE_EXTENDED.push(0.00000134110450744629);

/**
 * GetFeatureInfo supported formats. Priority have the first elements of this array.
 * @type {string[]}
 * @constant BKGWebMap.GETFEATUREINFO_FORMATS
 */
BKGWebMap.GETFEATUREINFO_FORMATS = [
    'application/json',
    'application/geojson',
    'text/html'
];

/**
 * Standard colors for map icons.
 * @type {string[]}
 * @constant BKGWebMap.MAP_ICONS_COLORS
 */
BKGWebMap.MAP_ICONS_COLORS = [
    '#407E40',
    '#0374ad',
    '#FF0000',
    '#FFCC00',
    '#6A33D6',
    '#808080',
    '#000000'
];

/**
 * Deafault style for vector layers. It will be used if no style is defined for vector layers.
 * @type {Object}
 * @constant BKGWebMap.DEFAULT_STYLE
 * @property {string} name - Name of style. This should be used as reference for a layer (/styles/items/symbol/name)
 * @property {string} type - Type of style: symbol (/styles/items/symbol/type)
 * @property {string} fillColor - Fill color for vector layers. A hexadecimal value (/styles/items/symbol/fillColor)
 * @property {string} strokeColor - Stroke color for vector layers. A hexadecimal value (/styles/items/symbol/strokeColor)
 * @property {string} symbol - Symbol for vector layers (points) (/styles/items/symbol/symbol)
 */
BKGWebMap.DEFAULT_STYLE = {
    name: 'bkgwebmap-defaultstyle',
    type: 'symbol',
    fillColor: '#407E40',
    strokeColor: '#1E481E',
    symbol: 'circle'
};

/**
 * Default values for layer properties
 * @type {Object}
 * @constant BKGWebMap.LAYERS
 * @property {Object} WMS - Default values for WMS layer
 * @property {Object} WMTS - Default values for WMTS layer
 * @property {Object} WFS - Default values for WFS layer
 * @property {Object} MARKER - Default values for MARKER layer
 * @property {Object} CSV - Default values for CSV layer
 * @property {Object} XLS - Default values for XLS layer
 * @property {Object} GPS - Default values for GPS layer
 * @property {Object} GROUP - Default values for GROUP layer
 * @property {Object} VECTOR - Default values for VECTOR layer
 * @property {Object} NONE - Default values for NONE layer
 */
BKGWebMap.LAYERS = {
    WMS: {
        VERSION: '1.3.0',
        VISIBLE: true,
        SELECT_STYLE: true
    },
    WMTS: {
        VISIBLE: true,
        DEFAULTSTYLE: 'default'
    },
    WFS: {
        VERSION: '1.1.0',
        VISIBLE: true,
        FORMAT: 'GML3',
        EDIT: false,
        TILES: true
    },
    MARKER: {
        PROJECTION: 'EPSG:4326',
        VISIBLE: true,
        EDIT: false
    },
    CSV: {
        PROJECTION: 'EPSG:4326',
        VISIBLE: true,
        HEADER: true,
        ENCODING: 'UTF-8',
        DELIMITER: ';',
        EDIT: false
    },
    XLS: {
        PROJECTION: 'EPSG:4326',
        VISIBLE: true,
        HEADER: true,
        EDIT: false
    },
    GPS: {
        VISIBLE: true,
        EDIT: false
    },
    GROUP: {
        VISIBLE: true
    },
    VECTOR: {
        VISIBLE: true,
        EDIT: false
    },
    NONE: {
        NAME: 'Keine Hintergrundkarte'
    }
};

/**
 * Default parameters for controls
 * @type {Object}
 * @constant BKGWebMap.CONTROLS
 * @property {string} panelPosition - Panel position (/options/panelPosition)
 * @property {string|null} initialize - Tool that should be shown, when starting the Application. If empty or null, then panel will be closed (/options/initialize)
 * @property {Object} tools - Tools in panel (/options/tools)
 */
BKGWebMap.CONTROLS = {
    panelPosition: 'left',
    initialize: null,
    tools: {
        layerSwitcher: {
            active: true,
            div: null,
            style: '',
            editStyle: true,
            changeVisibility: true,
            showWMSLayers: true,
            changeOrder: true,
            openLevel: 0
        },
        customLayers: {
            active: true,
            edit: true,
            changeVisibility: true,
            defaultStyle: '',
            dataTypes: ['BKG', 'WMS', 'WMTS', 'WFS', 'CSV', 'XLS', 'GPS']
        },
        showAttributes: {
            active: true,
            div: null,
            style: ''
        },
        legend: {
            active: false,
            div: null,
            style: ''
        },
        measure: {
            active: false,
            div: null,
            style: ''
        },
        edit: {
            active: false,
            div: null,
            style: '',
            export: {
                active: false,
                formats: ['GEOJSON', 'GML', 'GPX', 'KML', 'WKT']
            }
        },
        zoom: {
            active: true,
            showZoomLevel: false,
            zoomToFullExtent: true,
            history: true,
            position: 'top-left',
            div: null,
            style: ''
        },
        fullScreen: {
            active: true,
            position: 'top-right',
            div: null,
            style: ''
        },
        scalebar: {
            active: true,
            position: 'bottom-right',
            scalebarType: 'mapscaleDistance',
            div: null,
            style: ''
        },
        share: {
            active: false,
            div: null,
            print: {
                active: true,
                stylesheet: ''
            },
            permaLink: {
                active: true
            },
            jsonExport: {
                active: false,
                appName: 'BKG WebMap'
            }

        },
        showCoordinates: {
            active: true,
            position: 'bottom-right',
            div: null,
            style: ''
        },
        staticLinks: [{
            active: false,
            position: 'bottom-left',
            div: null,
            style: ''
        }],
        staticWindows:
            [{
                active: false,
                position: 'top:200px;left:350px;',
                div: null,
                style: '',
                size: [0, 0],
                title: '',
                content: ''
            }],
        copyright: {
            active: true,
            position: 'bottom-left',
            div: null,
            style: '',
            maxHeight: '150px',
            maxWidth: '700px'
        },
        searchCoordinates: {
            active: true,
            div: null,
            style: ''
        },
        geoSearch: {
            active: false,
            div: null,
            style: '',
            protocol: {
                ortssuche: 'http://sg.geodatenzentrum.de/gdz_ortssuche'
            },
            defaultProtocol: 'ortssuche',
            suggestCount: 20,
            resultsCount: 20,
            resultsMaxZoom: 13,
            reverseGeocoding: {
                active: true,
                maxResolution: null,
                minResolution: null,
                maxZoom: null,
                minZoom: null,
                defaultFilter: 'typ:strasse',
                count: 20
            }
        },
        copyCoordinates: {
            active: true,
            div: null,
            style: ''
        },
        cookieCheck: {
            active: false,
            doNotActivate: false,
            url: BKGWebMap.BASE_URL + 'web_bkg_webmap/cookietest/setcookie.php'
        },
        overviewMap: {
            active: true,
            position: 'bottom-right',
            div: null,
            collapsible: true,
            collapsed: false,
            layers: []
        },
        timeSlider: {
            active: false,
            div: null,
            position: 'bottom-right'
        }
    }
};

/**
 * Controls that could be positioned in panel
 * @type {string[]}
 * @constant BKGWebMap.CONTROLS_IN_PANEL
 */
BKGWebMap.CONTROLS_IN_PANEL = [
    'geoSearch',
    'searchCoordinates',
    'layerSwitcher',
    'legend',
    'showAttributes',
    'copyCoordinates',
    'measure',
    'edit',
    'share'
];

/**
 * Valid positions for icons in map
 * @type {string[]}
 * @constant BKGWebMap.STANDARD_POSITION
 */
BKGWebMap.STANDARD_POSITION = [
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right'
];

/**
 * Errors for debugging. They will be shown in browser console.
 * @type {Object}
 * @constant BKGWebMap.ERROR
 */
BKGWebMap.ERROR = {
    mapDiv: 'ERROR - The map div with the following ID was not found: ',
    wrongPersistenceVersion: 'ERROR IN PERSISTENCE - The version of persistence JSON is not the same as the actual BKG WebMap version. You might experience compatibility problems.',
    jsonFile: 'ERROR - The following JSON could not be loaded: ',
    missingLayersJson: 'ERROR IN CONFIG JSON - Key "layers" is not available.',
    missingTypeLayersJson: 'ERROR IN CONFIG - Key "type" in "layers" is not available.',
    wrongTypeLayersJson: 'ERROR IN CONFIG - Illegal value for key "type" in "layers": ',
    wrongUrl: 'ERROR IN CONFIG - Please verify the map service URL of layers: ',
    wmtsGetCapabilities: 'ERROR - The WMTS getCapabilities request could not be made. Please make sure that the URL is right and the server is online.',
    wmtsLayerName: 'ERROR IN CONFIG - Please provide a layer name for the WMTS service.',
    wmtsTileGrid: 'ERROR IN CONFIG - Tile grid of WMTS service missing.',
    wfsTypename: 'ERROR IN CONFIG - Please provide a typeName (namespace:featuretype) for the WFS layers.',
    markersMissing: 'ERROR IN CONFIG - Please verify that you have added coordinates for the markers.',
    csvExcelOptions: 'ERROR IN CONFIG - No options are defined: ',
    csvExcelCoordMissing: 'ERROR IN CONFIG - Please verify that you have added coordinates for layer:  ',
    missingLayersGroup: 'ERROR IN CONFIG - No layers for GROUP are defined.',
    missingRefInBkg: 'ERROR IN CONFIG - No ref for BGK layer is defined',
    missingStyleName: 'ERROR IN CONFIG - No name is defined in the following style configuration: ',
    wrongStyleType: 'ERROR IN CONFIG - Wrong type in the following style configuration: ',
    wrongStyleSymbol: 'ERROR IN CONFIG - Wrong symbol in the following style configuration: ',
    missingStyleSymbol: 'ERROR IN CONFIG - Missing symbol in the following style configuration: ',
    noPanelNoDivForControl: 'ERROR IN CONFIG: No panel available and no other div defined for control: ',
    noLayerSwitcherControl: 'ERROR IN CONFIG: Custom Layers Control could not be added. Please add also Layer Switcher Control',
    geoSearchWrongProtocol: 'ERROR IN GEOSEARCH: Wrong protocol',
    geoSearchUrlMissing: 'ERROR IN GEOSEARCH: Please define url for wfs protocol',
    geoSearchFeaturePrefixMissing: 'ERROR IN GEOSEARCH: Please define featurePrefix for wfs protocol',
    geoSearchFeatureTypeMissing: 'ERROR IN GEOSEARCH: Please define featureType for wfs protocol',
    geoSearchSearchAttributeMissing: 'ERROR IN GEOSEARCH: Please define searchAttribute for wfs protocol',
    xhrError: 'ERROR IN GEOSEARCH: Error in AJAX request',
    enableCookiesImport: 'Konfigurationsdatei importieren: Für diese Funktion werden Cookies benötigt. Bitte aktivieren Sie Cookies im Browser.'
};
