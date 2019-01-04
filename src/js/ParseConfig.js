/**
 * @classdesc Class to test if json config file exists and then parse it.
 * @constructor BKGWebMap.ParseConfig
 * */
BKGWebMap.ParseConfig = function () {
    this.exists = false;
    this.json = null;
};

/**
 * Tests if config JSON exists in Server
 * @memberOf BKGWebMap.ParseConfig
 * @param {boolean} configFile - Find if the configuration will be loaded from a file
 * @param {null|string|object} configUrlOrJson - URL of JSON configuration file or object with configuration
 * @param {function} callback - Callback to use JSON
 * @returns {function}
 */
BKGWebMap.ParseConfig.prototype.LoadJSON = function (configFile, configUrlOrJson, callback) {
    var _this = this;

    // Neither JSON as parameter nor JSON file
    if (!configFile && configUrlOrJson === null) {
        _this.exists = false;
        return callback();
    }

    // JSON as parameter
    if (!configFile && configUrlOrJson !== null) {
        _this.exists = true;
        _this.json = configUrlOrJson;
        return callback();
    }

    // JSON file
    var xhr = new XMLHttpRequest();
    xhr.open('GET', configUrlOrJson);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        var json = null;
        if (xhr.status === 200) {
            json = JSON.parse(xhr.responseText);
            _this.exists = true;
            _this.json = json;
        } else if (xhr.status !== 200) {
            _this.exists = false;
            window.console.log(BKGWebMap.ERROR.jsonFile + configUrlOrJson);
        }
        return callback();
    };
    xhr.send();
};

/**
 * Parse map target.
 * @param {string} div - ID of map div.
 * @param {boolean} setTarget - Boolean to check if div ID is defined in setTarget()
 * @returns {string}
 */
BKGWebMap.ParseConfig.prototype.createConfigTarget = function (div, setTarget) {
    var targetInJson = null;
    if (BKGWebMap.Util.hasNestedProperty(this.json, 'map.div')) {
        targetInJson = this.json.map.div;
    }

    // Overwrite div id only if is defined in JSON and setTarget() was not used
    if (targetInJson && !setTarget) {
        div = this.json.map.div;
    }
    return div;
};

/**
 * Parse map view configuration.
 * @param {object} defaultConfigView - Default view configuration.
 * @param {object} userConfigView - View configuration defined in setView().
 * @param {boolean} setView - Boolean to check if setView() is used.
 * @returns {object}
 */
BKGWebMap.ParseConfig.prototype.createConfigView = function (defaultConfigView, userConfigView, setView) {
    // Priority: Code -> JSON -> Defaults

    // Key: name of property / Value: json path in dot notation
    // Place projection as first key
    var keysToParse = {
        projection: 'map.projection',
        extent: null,
        resolution: 'map.resolution',
        zoom: 'map.zoom',
        center: 'map.center',
        resolutions: 'map.resolutions',
        // scales: 'map.scales',
        minResolution: 'map.minResolution',
        maxResolution: 'map.maxResolution',
        minZoom: 'map.minZoom',
        maxZoom: 'map.maxZoom'
    };

    var viewConfig = {};
    var isKeyinCode = {};
    var isKeyInJSON = {};
    var projection = defaultConfigView.projection;

    // Parse function for View parameters that are not possible to be defined in config JSON
    function notDefinedInJSON(_this, keyInCode, paramName) {
        var viewConfigValue;
        if (setView && keyInCode) {
            viewConfigValue = userConfigView[paramName];
        } else {
            switch (paramName) {
            case 'extent':
                // If user uses a different projection than the default
                // without defining extent, do not use default extent.
                // Use an extent of the right projection
                if (viewConfig.projection !== defaultConfigView.projection) {
                    viewConfigValue = BKGWebMap.PROJECTIONS_EXTENTS[viewConfig.projection];
                } else {
                    viewConfigValue = defaultConfigView.extent;
                }
                break;
            default:
                viewConfigValue = defaultConfigView[paramName];
            }
        }
        return viewConfigValue;
    }

    // Parse function for View parameters that are possible to be defined in config JSON
    function definedInJSON(_this, keyInCode, keyInJSON, paramName, jsonPath) {
        var viewConfigValue;
        var lon;
        var lat;
        if (setView && keyInCode) {
            switch (paramName) {
            case 'center':
                lon = BKGWebMap.Util.getObjValueFromStringPath(userConfigView, ('center.lon'));
                lat = BKGWebMap.Util.getObjValueFromStringPath(userConfigView, ('center.lat'));
                if ((lon || lon === 0) && (lat || lat === 0)) {
                    viewConfigValue = [lon, lat];
                }
                break;
            default:
                viewConfigValue = userConfigView[paramName];
            }
        } else if (keyInJSON) {
            if (BKGWebMap.Util.getObjValueFromStringPath(_this.json, jsonPath)) {
                switch (paramName) {
                case 'center':
                    lon = BKGWebMap.Util.getObjValueFromStringPath(_this.json, (jsonPath + '.lon'));
                    lat = BKGWebMap.Util.getObjValueFromStringPath(_this.json, (jsonPath + '.lat'));
                    if (lon && lat) {
                        viewConfigValue = [lon, lat];
                    }
                    break;
                default:
                    viewConfigValue = BKGWebMap.Util.getObjValueFromStringPath(_this.json, jsonPath);
                }
            }
        } else if (paramName === 'projection') {
            return projection;
        }
        return viewConfigValue;
    }

    // OpenLayers: If we have resolution, the property zoom will not be used
    function clearResolution(_this) {
        var resolutionInCode = BKGWebMap.Util.hasNestedProperty(userConfigView, 'resolution');
        var resolutionInJSON = BKGWebMap.Util.hasNestedProperty(_this.json, 'map.resolution');
        var zoomInCode = BKGWebMap.Util.hasNestedProperty(userConfigView, 'zoom');
        var zoomInJSON = BKGWebMap.Util.hasNestedProperty(_this.json, 'map.zoom');

        // Code: zoom(Y), resolution(N)
        // JSON: resolution(Y)
        // Action: Remove resolution
        if (setView && zoomInCode && !resolutionInCode && resolutionInJSON && _this.json.map.resolution) {
            delete viewConfig.resolution;
        }

        // Code: zoom(N), resolution(N)
        // JSON: zoom(Y), resolution(N)
        // Action: Remove resolution
        if (setView && !zoomInCode && !resolutionInCode && zoomInJSON && (!resolutionInJSON || !_this.json.map.resolution)) {
            if (_this.json.map.zoom) {
                delete viewConfig.resolution;
            }
        }
    }

    function clearResolutions() {
        // If resolutions are not defined in setView() or in JSON,
        // use default resolutions according to projection
        if (!viewConfig.resolutions && viewConfig.projection) {
            var projection = ol.proj.get(viewConfig.projection);
            var units = projection.getUnits();
            switch (units) {
            case 'm':
                viewConfig.resolutions = BKGWebMap.RESOLUTIONS;
                break;
            case 'degrees':
                viewConfig.resolutions = BKGWebMap.RESOLUTIONS_DEGREE;
                break;
            default:
                return;
            }
        }

        // If minResolution and maxResolution OR minZoom and maxZoom
        // are defined in setView() or in JSON, them remove resolutions
        if ((viewConfig.minResolution && viewConfig.maxResolution) || (viewConfig.minZoom && viewConfig.maxZoom)) {
            delete viewConfig.resolutions;
        }
    }

    function addExtraKeys() {
        // Add to View all other keys that are defined in setDiv().
        // They will be automatically used, if they are legal OpenLayers options of ol.View().
        if (setView) {
            for (var param in userConfigView) {
                if (!keysToParse[param]) {
                    viewConfig[param] = userConfigView[param];
                }
            }
        }
    }

    for (var param in keysToParse) {
        // Find if parameter is used in setView()
        isKeyinCode[param] = BKGWebMap.Util.hasNestedProperty(userConfigView, param);

        // Find if parameter is defined in config JSON
        if (keysToParse[param]) {
            isKeyInJSON[keysToParse[param]] = BKGWebMap.Util.hasNestedProperty(this.json, keysToParse[param]);
        }

        if (!keysToParse[param]) {
            // Not possible to be defined in config JSON
            viewConfig[param] = notDefinedInJSON(this, isKeyinCode[param], param);
        } else {
            // Possible to be defined in config JSON
            viewConfig[param] = definedInJSON(this, isKeyinCode[param], isKeyInJSON[keysToParse[param]], param, keysToParse[param]);
            if (viewConfig[param] === undefined) {
                // Remove undefined properties
                delete viewConfig[param];
            }
        }
    }

    // Resolve conflicts between resolution and zoom in setView() and in JSON
    clearResolution(this);

    // Resolve problems created by resolutions
    clearResolutions();

    // Add any other OpenLayers options parsed by setView()
    addExtraKeys();

    return viewConfig;
};

/**
 * Create panel control
 * @param {Object} map - OpenLayers map
 * @param {Object|null} controlsConfig - Controls configuration defined by user
 * @param {boolean} setControls - Boolean to check if setControls() is used
 * @param {object} standardPositionControls - Object with standardPositionControls
 * @returns {Object|boolean}
 */
BKGWebMap.ParseConfig.prototype.createControlPanel = function (map, controlsConfig, setControls, standardPositionControls) {
    var controls = {};
    if (this.exists && !setControls && Object.prototype.hasOwnProperty.call(this.json, 'options')) {
        if (Object.prototype.hasOwnProperty.call(this.json, 'options') && (typeof this.json.options === 'object' && this.json.options.constructor === Object)) {
            controls = this.json.options;
        } else {
            controls = BKGWebMap.CONTROLS;
        }
    } else if (setControls) {
        controls = controlsConfig;
    } else {
        controls = BKGWebMap.CONTROLS;
    }

    // Find if we need panel
    var createPanel = BKGWebMap.Util.shouldCreatePanel(controls);

    if (createPanel) {
        var panelPosition = controls.panelPosition;
        var initialize = controls.initialize;
        var Panel = BKGWebMap.Control.FACTORIES.panel();
        var panelControl = new Panel(map, panelPosition, initialize, standardPositionControls);
        // Add panel control
        if (Object.keys(panelControl).length > 0) {
            return panelControl;
        }
    }
    return false;
};

/**
 * Create controls
 * @param {Object} map - OpenLayers map
 * @param {Object|null} controlsConfig - Controls configuration defined by user
 * @param {boolean} setControls - Boolean to check if setControls() is used
 * @param {Object|boolean} panel - Panel object
 * @param {object} standardPositionControls - Object with standardPositionControls
 * @returns {Array}
 */
BKGWebMap.ParseConfig.prototype.createControls = function (map, controlsConfig, setControls, panel, standardPositionControls) {
    var controls = {};
    var controlsArray = [];
    if (this.exists && !setControls && Object.prototype.hasOwnProperty.call(this.json, 'options')) {
        if (Object.prototype.hasOwnProperty.call(this.json.options, 'tools') && (typeof this.json.options.tools === 'object' && this.json.options.tools.constructor === Object)) {
            for (var tool in this.json.options.tools) {
                controls[tool] = this.json.options.tools[tool];
            }
        } else {
            controls = BKGWebMap.CONTROLS.tools;
        }
    } else if (setControls && Object.prototype.hasOwnProperty.call(controlsConfig, 'tools')) {
        controls = controlsConfig.tools;
    } else {
        controls = BKGWebMap.CONTROLS.tools;
    }
    // Filter controls and define order in which they will be generated
    var controlsList = [
        'geoSearch',
        'searchCoordinates',
        'copyCoordinates',
        'showAttributes',
        'legend',
        'layerSwitcher',
        'customLayers',
        'zoom',
        'scalebar',
        'copyright',
        'showCoordinates',
        'staticLinks',
        'staticWindows',
        'fullScreen',
        'measure',
        'edit',
        'share',
        'overviewMap',
        'timeSlider'
    ];

    var SingleControlClass;
    var singleControl;
    for (var i = 0; i < controlsList.length; i++) {
        if (controls[controlsList[i]] && ((typeof controls[controlsList[i]] === 'object' && controls[controlsList[i]].constructor === Object))) {
            SingleControlClass = BKGWebMap.Control.FACTORIES[controlsList[i]]();
            singleControl = new SingleControlClass(map, controlsList[i], controls[controlsList[i]], panel, standardPositionControls);
            // Remove extra classes from FullScreen control DIV and button (to prevent div getting the button style)
            if (singleControl instanceof ol.control.FullScreen && !singleControl.inactive) {
                singleControl.element.classList.remove('bkgwebmap-mapbutton');
                singleControl.element.children[0].classList.remove('bkgwebmap-standardpositioncontrol');
                singleControl.element.children[0].classList.remove('bkgwebmap-standardpositioncontrolleft');
                singleControl.element.children[0].classList.remove('bkgwebmap-standardpositioncontrolright');
            }
            // Add controls
            if (Object.keys(singleControl).length > 0 && !singleControl.inactive) {
                controlsArray.push(singleControl);
                BKGWebMap.Controls[controlsList[i]] = singleControl;
            }
        } else if (controls[controlsList[i]] && controls[controlsList[i]] instanceof Array) {
            var multipleControlsClass = {};
            var multipleControls = {};
            for (var k = 0; k < controls[controlsList[i]].length; k++) {
                multipleControlsClass[k] = BKGWebMap.Control.FACTORIES[controlsList[i]](k);
                multipleControls[k] = new multipleControlsClass[k](map, controlsList[i], controls[controlsList[i]][k], panel, standardPositionControls);
                // Add controls
                if (Object.keys(multipleControls[k]).length > 0 && !multipleControls[k].inactive) {
                    controlsArray.push(multipleControls[k]);
                    BKGWebMap.Controls[controlsList[i] + k] = multipleControls[k];
                }
            }
        }
    }
    return controlsArray;
};

/**
 * Parse styles
 * @param {array} stylesArray - Styles configuration defined by user
 * @param {boolean} defineStyles - Boolean to check if defineStyles() is used
 * @returns {Object}
 */
BKGWebMap.ParseConfig.prototype.createConfigStyles = function (stylesArray, defineStyles) {
    var styles;
    if (this.exists && !defineStyles && Object.prototype.hasOwnProperty.call(this.json, 'styles')) {
        styles = BKGWebMap.Style.createStyles(this.json.styles);
    } else {
        styles = BKGWebMap.Style.createStyles(stylesArray);
    }
    return styles;
};

/**
 * Parse layers configuration
 * @param {object} map - Map object
 * @param {object} defaultConfigLayers - Default layers configuration
 * @param {object|array} userConfigLayers - Layers configuration defined by user
 * @param {boolean} setLayers - Boolean to check if setLayers() is used.
 * @param {function} callback - Callback function
 * @returns {function}
 */
BKGWebMap.ParseConfig.prototype.createConfigLayers = function (map, defaultConfigLayers, userConfigLayers, styles, setLayers, callback) {
    var _this = this;

    var layers = {
        baseLayers: [],
        overlays: []
    };

    // No JSON, no setLayers(): use defaults
    if (!this.exists && !setLayers) {
        userConfigLayers = defaultConfigLayers;
    }

    // Only JSON: use JSON only if key 'layers' is available
    if (this.exists && !setLayers && Object.prototype.hasOwnProperty.call(this.json, 'layers')) {
        userConfigLayers = this.json.layers;
    } else if (this.exists && !setLayers && !Object.prototype.hasOwnProperty.call(this.json, 'layers')) {
        userConfigLayers = defaultConfigLayers;
        // ERROR: layersInJson
        window.console.log(BKGWebMap.ERROR.missingLayersJson);
    }

    // Only setLayers or JSON and setLayers(): use setLayers()
    // If array with ol.layer class, use them as base layers
    if (setLayers && userConfigLayers instanceof Array) {
        userConfigLayers = {
            baseLayers: userConfigLayers
        };
    }

    this.createLayer = function (_this, map, config, layerGroup, styles, bkg, createLayerCallback) {
        var typesList = ['WMS', 'WMTS', 'WFS', 'MARKER', 'CSV', 'XLS', 'GPS', 'BKG', 'GROUP', 'VECTOR', 'NONE'];
        if (config instanceof ol.layer.Base) {
            // ol.layer class
            return createLayerCallback(config);
        } else if (!Object.prototype.hasOwnProperty.call(config, 'type')) {
            // false json without layer 'type' key
            window.console.log(BKGWebMap.ERROR.missingTypeLayersJson);
            return createLayerCallback(undefined);
        } else if (typesList.indexOf(config.type) === -1) {
            // false json with illegal layer type
            window.console.log(BKGWebMap.ERROR.wrongTypeLayersJson + config.type);
            return createLayerCallback(undefined);
        }

        if (layerGroup === 'baseLayers') {
            config.isBaseLayer = true;
        } else if (layerGroup === 'overlays') {
            config.isBaseLayer = false;
        }

        BKGWebMap.Layer.FACTORIES[config.type](_this, map, config, styles, bkg, function (layer) {
            return createLayerCallback(layer);
        });
    };

    // Create instances of ol.layer

    // Find how many layers we need to load (baselayers and overlays)
    var sumLayerListLength = 0;
    if (Object.prototype.hasOwnProperty.call(userConfigLayers, 'baseLayers')) {
        sumLayerListLength += userConfigLayers.baseLayers.length;
    }
    if (Object.prototype.hasOwnProperty.call(userConfigLayers, 'overlays')) {
        sumLayerListLength += userConfigLayers.overlays.length;
    }

    // The requests for the layers can be asynchronous
    // (e.g. when we first make a getCapabilities before loading a WMTS)
    // To preserve the original layer order defined by user, we implement a counter
    var counter = 0;
    for (var layerGroup in layers) {
        if (Object.prototype.hasOwnProperty.call(userConfigLayers, layerGroup)) {
            var layerGroupLength = userConfigLayers[layerGroup].length;
            for (var i = 0; i < layerGroupLength; i++) {
                (function () {
                    var k = i;
                    var _layerGroup = layerGroup;
                    _this.createLayer(_this, map, userConfigLayers[_layerGroup][k], layerGroup, styles, false, function (singleLayer) {
                        counter++;
                        // Do not use false json. There is no problem with an undefined layer. OL does not make any request.
                        if (singleLayer === undefined) {
                            if (counter >= sumLayerListLength) {
                                return callback(layers);
                            }
                            return;
                        }
                        layers[_layerGroup][k] = singleLayer;
                        // Return layers array only if we have loaded all layers
                        if (counter >= sumLayerListLength) {
                            return callback(layers);
                        }
                    });
                }());
            }
        }
    }
};

/**
 * Options for generating and using UUID for secure BKG services
 * @param {Object} securityConfig - Security parameters
 * @param {boolean} setSecurity - If setSecurity() was used in code
 * @param {function} callback - Callback function
 * @returns {function}
 */
BKGWebMap.ParseConfig.prototype.getSecurityOptions = function (map, securityConfig, setSecurity, callback) {
    var security;

    if (this.exists && !setSecurity && Object.prototype.hasOwnProperty.call(this.json, 'options')) {
        if (Object.prototype.hasOwnProperty.call(this.json.options, 'security') && (typeof this.json.options.security === 'object' && this.json.options.security.constructor === Object)) {
            security = this.json.options.security;
        } else {
            security = BKGWebMap.SECURITY;
        }
    } else if (setSecurity) {
        security = securityConfig;
    } else {
        security = BKGWebMap.SECURITY;
    }

    // Check if control should be created
    var addCookieTest = BKGWebMap.CONTROLS.tools.cookieCheck.active;
    if (typeof security.cookieCheck === 'boolean') {
        if (security.cookieCheck === false) {
            BKGWebMap.CONTROLS.tools.cookieCheck.doNotActivate = true;
        }
        addCookieTest = security.cookieCheck;
    }

    if (addCookieTest) {
        var CookieCheckClass = BKGWebMap.Control.FACTORIES.cookieCheck();
        var cookieCheck = new CookieCheckClass(map, 'cookieCheck', {}, null);
        map.addControl(cookieCheck);
        BKGWebMap.Controls.cookieCheck = cookieCheck;
        cookieCheck.activateCookieTest();
    }

    // Polyfill String.prototype.startsWith() for IE11
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (search, pos) {
            return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
        };
    }

    if (!security.UUID && (security.appID && security.appDomain)) {
        BKGWebMap.Util.getSessionToken(security.appID, security.appDomain, function (sessionID) {
            if (sessionID.startsWith('sess-')) {
                security.UUID = sessionID;
            }
            return callback(security);
        });
    } else {
        return callback(security);
    }
};
