/**
 * @namespace BKGWebMap.Layer
 * @type {object}
 */
BKGWebMap.Layer = BKGWebMap.Layer || {};

/**
 * WMS image layer constructor
 * @param {WMS} config - Configuration (/layers/baseLayers|overlays/items/WMS and tiles: false)
 * @constructor
 */
BKGWebMap.Layer.ImageWMS = function (config) {
    this.getLayers = function () {
        return config.layers;
    };
    this.getStyleInfo = function () {
        return config.styleInfo;
    };
    this.getLegendInfo = function () {
        return config.legendInfo;
    };
    this.getTimeInfo = function () {
        return config.timeInfo;
    };
    ol.layer.Image.call(this, config);
};

/**
 * WMS tile layer constructor
 * @param {WMS} config - Configuration (/layers/baseLayers|overlays/items/WMS and tiles: true)
 * @constructor
 */
BKGWebMap.Layer.TileWMS = function (config) {
    this.getLayers = function () {
        return config.layers;
    };
    this.getStyleInfo = function () {
        return config.styleInfo;
    };
    this.getLegendInfo = function () {
        return config.legendInfo;
    };
    this.getTimeInfo = function () {
        return config.timeInfo;
    };
    ol.layer.Tile.call(this, config);
};

/**
 * WMTS layer constructor
 * @param {WMTS} config - Configuration (/layers/baseLayers|overlays/items/WMTS)
 * @constructor
 */
BKGWebMap.Layer.WMTS = function (config) {
    ol.layer.Tile.call(this, config);
};

/**
 * WFS layer constructor
 * @param {WFS} config - Configuration (/layers/baseLayers|overlays/items/WFS)
 * @constructor
 */
BKGWebMap.Layer.WFS = function (config) {
    ol.layer.Vector.call(this, config);
};

/**
 * MARKER layer constructor
 * @param {MARKER} config - Configuration (/layers/baseLayers|overlays/items/MARKER)
 * @constructor
 */
BKGWebMap.Layer.MARKER = function (config) {
    ol.layer.Vector.call(this, config);
};

/**
 * CSV layer constructor
 * @param {CSV} config - Configuration (/layers/baseLayers|overlays/items/CSV)
 * @constructor
 */
BKGWebMap.Layer.CSV = function (config) {
    ol.layer.Vector.call(this, config);
};

/**
 * XLS layer constructor
 * @param {XLS} config - Configuration (/layers/baseLayers|overlays/items/XLS)
 * @constructor
 */
BKGWebMap.Layer.XLS = function (config) {
    ol.layer.Vector.call(this, config);
};

/**
 * GPS layer constructor
 * @param {GPS} config - Configuration (/layers/baseLayers|overlays/items/GPS)
 * @constructor
 */
BKGWebMap.Layer.GPS = function (config) {
    ol.layer.Vector.call(this, config);
};

/**
 * VECTOR layer constructor
 * @param {object} config - Configuration for custom Vector layers imported by user. This class used to persist these layers. The geometry is saved as GeoJSON in this configuration object.
 * @constructor
 */
BKGWebMap.Layer.VECTOR = function (config) {
    ol.layer.Vector.call(this, config);
};

/**
 * GROUP layer constructor
 * @param {GROUP} config - (/layers/baseLayers/items/GPS)
 * @constructor
 */
BKGWebMap.Layer.GROUP = function (config) {
    ol.layer.Group.call(this, config);
};

/**
 * NONE (Empty) layer constructor
 * @param {NONE} config - Configuration (/layers/baseLayers/items/NONE)
 * @constructor
 */
BKGWebMap.Layer.NONE = function (config) {
    ol.layer.Image.call(this, config);
};

/**
 * Create WMS layer
 * @typedef {function} LAYER_FACTORIES_WMS
 * @param {BKGWebMap.ParseConfig} createConfig - BKGWebMap.ParseConfig object
 * @param {object} map - Map object
 * @param {WMS} config - WMS configuration
 * @param {object} styles - Object with styles ({@link symbol_style}|{@link custom_style})
 * @param {boolean} bkg - This layer is generated from a BKG Layer
 * @param {function} callback - Callback function. It will be called when all information of layer are parsed.
 * @returns {object}
 */
/**
 * Create WMTS layer
 * @typedef {function} LAYER_FACTORIES_WMTS
 * @param {BKGWebMap.ParseConfig} createConfig - BKGWebMap.ParseConfig object
 * @param {object} map - Map object
 * @param {WMTS} config - WMTS configuration
 * @param {object} styles - Object with styles ({@link symbol_style}|{@link custom_style})
 * @param {boolean} bkg - This layer is generated from a BKG Layer
 * @param {function} callback - Callback function. It will be called when all information of layer are parsed.
 * @returns {object}
 */
/**
 * Create WFS layer
 * @typedef {function} LAYER_FACTORIES_WFS
 * @param {BKGWebMap.ParseConfig} createConfig - BKGWebMap.ParseConfig object
 * @param {object} map - Map object
 * @param {WFS} config - WFS configuration
 * @param {object} styles - Object with styles ({@link symbol_style}|{@link custom_style})
 * @param {boolean} bkg - This layer is generated from a BKG Layer
 * @param {function} callback - Callback function. It will be called when all information of layer are parsed.
 * @returns {object}
 */
/**
 * Create MARKER layer
 * @typedef {function} LAYER_FACTORIES_MARKER
 * @param {BKGWebMap.ParseConfig} createConfig - BKGWebMap.ParseConfig object
 * @param {object} map - Map object
 * @param {MARKER} config - MARKER configuration
 * @param {object} styles - Object with styles ({@link symbol_style}|{@link custom_style})
 * @param {boolean} bkg - This layer is generated from a BKG Layer
 * @param {function} callback - Callback function. It will be called when all information of layer are parsed.
 * @returns {object}
 */
/**
 * Create CSV layer
 * @typedef {function} LAYER_FACTORIES_MARKER
 * @param {BKGWebMap.ParseConfig} createConfig - BKGWebMap.ParseConfig object
 * @param {object} map - Map object
 * @param {CSV} config - CSV configuration
 * @param {object} styles - Object with styles ({@link symbol_style}|{@link custom_style})
 * @param {boolean} bkg - This layer is generated from a BKG Layer
 * @param {function} callback - Callback function. It will be called when all information of layer are parsed.
 * @returns {object}
 */
/**
 * Create XLS layer
 * @typedef {function} LAYER_FACTORIES_XLS
 * @param {BKGWebMap.ParseConfig} createConfig - BKGWebMap.ParseConfig object
 * @param {object} map - Map object
 * @param {XLS} config - XLS configuration
 * @param {object} styles - Object with styles ({@link symbol_style}|{@link custom_style})
 * @param {boolean} bkg - This layer is generated from a BKG Layer
 * @param {function} callback - Callback function. It will be called when all information of layer are parsed.
 * @returns {object}
 */
/**
 * Create GPS layer
 * @typedef {function} LAYER_FACTORIES_GPS
 * @param {BKGWebMap.ParseConfig} createConfig - BKGWebMap.ParseConfig object
 * @param {object} map - Map object
 * @param {GPS} config - GPS configuration
 * @param {object} styles - Object with styles ({@link symbol_style}|{@link custom_style})
 * @param {boolean} bkg - This layer is generated from a BKG Layer
 * @param {function} callback - Callback function. It will be called when all information of layer are parsed.
 * @returns {object}
 */
/**
 * Create VECTOR layer
 * @typedef {function} LAYER_FACTORIES_VECTOR
 * @param {BKGWebMap.ParseConfig} createConfig - BKGWebMap.ParseConfig object
 * @param {object} map - Map object
 * @param {object} config - VECTOR configuration
 * @param {object} styles - Object with styles ({@link symbol_style}|{@link custom_style})
 * @param {boolean} bkg - This layer is generated from a BKG Layer
 * @param {function} callback - Callback function. It will be called when all information of layer are parsed.
 * @returns {object}
 */
/**
 * Create GROUP layer
 * @typedef {function} LAYER_FACTORIES_GROUP
 * @param {BKGWebMap.ParseConfig} createConfig - BKGWebMap.ParseConfig object
 * @param {object} map - Map object
 * @param {GROUP} config - GROUP configuration
 * @param {object} styles - Object with styles ({@link symbol_style}|{@link custom_style})
 * @param {boolean} bkg - This layer is generated from a BKG Layer
 * @param {function} callback - Callback function. It will be called when all information of layer are parsed.
 * @returns {object}
 */
/**
 * Create BKG layer
 * @typedef {function} LAYER_FACTORIES_BKG
 * @param {BKGWebMap.ParseConfig} createConfig - BKGWebMap.ParseConfig object
 * @param {object} map - Map object
 * @param {BKG} config - BKG configuration
 * @param {object} styles - Object with styles ({@link symbol_style}|{@link custom_style})
 * @param {boolean} bkg - This layer is generated from a BKG Layer
 * @param {function} callback - Callback function. It will be called when all information of layer are parsed.
 * @returns {object}
 */
/**
 * Create NONE (empty) layer
 * @typedef {function} LAYER_FACTORIES_NONE
 * @param {BKGWebMap.ParseConfig} createConfig - BKGWebMap.ParseConfig object
 * @param {object} map - Map object
 * @param {NONE} config - NONE configuration
 * @param {object} styles - Object with styles ({@link symbol_style}|{@link custom_style})
 * @param {boolean} bkg - This layer is generated from a BKG Layer
 * @param {function} callback - Callback function. It will be called when all information of layer are parsed.
 * @returns {object}
 */
/**
 * Factory functions to generate layers
 * @type {object}
 * @memberof BKGWebMap.Layer
 * @property {function} WMS - Method to create WMS layer. See {@link LAYER_FACTORIES_WMS}
 * @property {function} WMTS - Method to create WMTS layer. See {@link LAYER_FACTORIES_WMTS}
 * @property {function} WFS - Method to create WFS layer. See {@link LAYER_FACTORIES_WFS}
 * @property {function} MARKER - Method to create MARKER layer. See {@link LAYER_FACTORIES_MARKER}
 * @property {function} CSV - Method to create CSV layer. See {@link LAYER_FACTORIES_MARKER}
 * @property {function} XLS - Method to create XLS layer. See {@link LAYER_FACTORIES_XLS}
 * @property {function} GPS - Method to create GPS layer. See {@link LAYER_FACTORIES_GPS}
 * @property {function} VECTOR - Method to create VECTOR layer. See {@link LAYER_FACTORIES_VECTOR}
 * @property {function} GROUP - Method to create GROUP layer. See {@link LAYER_FACTORIES_GROUP}
 * @property {function} BKG - Method to create BKG layer. See {@link LAYER_FACTORIES_BKG}
 * @property {function} NONE - Method to create NONE layer. See {@link LAYER_FACTORIES_NONE}
 *
 */
BKGWebMap.Layer.FACTORIES = {
    WMS: function (createConfig, map, config, styles, bkg, callback) {
        var originalConfig = BKGWebMap.Util.deepCopy(config);
        delete originalConfig.isBaseLayer;
        config.originalConfig = originalConfig;

        config.uniqueId = BKGWebMap.Util.uniqueId();

        if (!config.id) {
            config.id = BKGWebMap.Util.generateLayerId();
        }

        // For export json
        if (config.bkg) {
            bkg = config.bkg;
        } else if (bkg) {
            originalConfig.bkg = bkg;
        }

        var i;
        var source;
        var url = config.url;
        var sourceParams = {};
        var version = BKGWebMap.LAYERS.WMS.VERSION;
        var projection = BKGWebMap.PROJECTION;
        var copyright = '';
        var styleInfo = {};
        var legendInfo = {};
        var timeInfo = {};
        function defineLayer(source, config, extent) {
            var layer;
            if (config.tiles === false) {
                layer = new BKGWebMap.Layer.ImageWMS(config);
            } else {
                layer = new BKGWebMap.Layer.TileWMS(config);
            }
            if (extent) {
                layer.extent = extent;
            }
            layer.setSource(source);
            // Update request according to resolution limits
            resolutionLimitsSublayers(layer, config);

            return callback(layer);
        }

        function resolutionLimitsSublayers(layer, config) {
            if (BKGWebMap.Util.hasNestedProperty(layer.getProperties(), 'originalConfig.layers')) {
                config = layer.getProperties().originalConfig;
            }
            var updateParams;
            for (var i = 0; i < config.layers.length; i++) {
                if (config.layers[i].minResolution || config.layers[i].maxResolution) {
                    updateParams = true;
                }
            }
            if (updateParams) {
                map.getView().on('change:resolution', function () {
                    var mapResolution = map.getView().getResolution();
                    var visibility = config.visibility === undefined ? true : config.visibility;
                    var sublayersArray = config.layers.reduce(function (filtered, singleLayer) {
                        var checkLayerMinResolution = !((singleLayer.minResolution && mapResolution < singleLayer.minResolution));
                        var checkLayerMaxResolution = !((singleLayer.maxResolution && mapResolution > singleLayer.maxResolution));
                        if (singleLayer.visibility !== false && checkLayerMinResolution && checkLayerMaxResolution) {
                            filtered.push(singleLayer.layer);
                        }
                        return filtered;
                    }, []);
                    var sublayersStyleArray = config.layers.reduce(function (filtered, singleLayer) {
                        var checkLayerMinResolution = !((singleLayer.minResolution && mapResolution < singleLayer.minResolution));
                        var checkLayerMaxResolution = !((singleLayer.maxResolution && mapResolution > singleLayer.maxResolution));
                        if (singleLayer.visibility !== false && checkLayerMinResolution && checkLayerMaxResolution) {
                            filtered.push(singleLayer.style);
                        }
                        return filtered;
                    }, []);
                    layer.getSource().updateParams({ LAYERS: sublayersArray.join(), STYLES: sublayersStyleArray.join() });
                    if (!sublayersArray.length) {
                        layer.setVisible(false);
                    } else {
                        layer.setVisible(visibility);
                    }
                });
            }
        }

        // Visible
        config.visible = BKGWebMap.LAYERS.WMS.VISIBLE;
        if (typeof config.visibility === 'boolean' && config.visibility === false) {
            config.visible = config.visibility;
        }
        delete config.visibility;

        // Copyright
        if (config.copyright && typeof config.copyright === 'string' && config.copyright !== '') {
            copyright = config.copyright;
        }

        // Source -> URL
        if (typeof url !== 'string' || url === '') {
            window.console.log(BKGWebMap.ERROR.wrongUrl + config.type);
            return callback(undefined);
        }

        // If function is called through a BKG layer, try to use UUID
        if (bkg && BKGWebMap.SECURITY.UUID) {
            url = url + '__' + BKGWebMap.SECURITY.UUID;
        }

        // Source -> version
        if (config.version && (config.version === '1.1.0' || config.version === '1.1.1')) {
            version = config.version;
        }

        // Source -> Projection (srsName)
        if (config.srsName && typeof config.srsName === 'string' && config.srsName !== '') {
            projection = config.srsName;
        }

        if (!config.layers || !(config.layers instanceof Array)) {
            return callback(undefined);
        }

        // Add visibility, unique id and selectStyle url for sublayers. Get default legend URL.
        for (i = 0; i < config.layers.length; i++) {
            if (!Object.prototype.hasOwnProperty.call(config.layers[i], 'visibility')) {
                config.layers[i].visibility = BKGWebMap.LAYERS.WMS.VISIBLE;
            }
            if (!Object.prototype.hasOwnProperty.call(config.layers[i], 'selectStyle')) {
                config.layers[i].selectStyle = BKGWebMap.LAYERS.WMS.SELECT_STYLE;
            }
            config.layers[i].uniqueId = BKGWebMap.Util.uniqueId();

            if (config.layers[i].legendUrl && (typeof config.layers[i].legendUrl === 'string' || config.layers[i].legendUrl instanceof String) && config.layers[i].legendUrl !== '') {
                legendInfo[config.layers[i].layer] = config.layers[i].legendUrl;
            } else {
                legendInfo[config.layers[i].layer] = '';
            }
        }

        // Filter sublayers. Request only the ones that should be visible
        var mapResolution = map.getView().getResolution();
        var sublayersArray = config.layers.reduce(function (filtered, singleLayer) {
            var checkLayerMinResolution = !((singleLayer.minResolution && mapResolution < singleLayer.minResolution));
            var checkLayerMaxResolution = !((singleLayer.maxResolution && mapResolution > singleLayer.maxResolution));
            if (singleLayer.visibility !== false && checkLayerMinResolution && checkLayerMaxResolution) {
                filtered.push(singleLayer.layer);
            }
            return filtered;
        }, []);

        // Filter styles
        var sublayersStyleArray = config.layers.reduce(function (filtered, singleLayer) {
            var checkLayerMinResolution = !((singleLayer.minResolution && mapResolution < singleLayer.minResolution));
            var checkLayerMaxResolution = !((singleLayer.maxResolution && mapResolution > singleLayer.maxResolution));
            if (singleLayer.visibility !== false && checkLayerMinResolution && checkLayerMaxResolution) {
                filtered.push(singleLayer.style);
            }
            return filtered;
        }, []);

        // Use all sublayers to get layer extent
        var allSublayersArray = config.layers.reduce(function (filtered, singleLayer) {
            filtered.push(singleLayer.layer);
            return filtered;
        }, []);

        // Source params (If the user has tried to use a params property in config, use it! Hidden feature..)
        if (config.params && (typeof config.params === 'object' && config.params.constructor === Object)) {
            sourceParams = config.params;
        } else {
            sourceParams = {
                LAYERS: sublayersArray.join(),
                VERSION: version,
                STYLES: sublayersStyleArray.join()
            };
        }

        // Object with source options
        var sourceOptionsImage = {
            url: url,
            params: sourceParams,
            projection: projection
        };
        var sourceOptionsTile = {
            url: url,
            params: {
                LAYERS: sublayersArray.join(),
                VERSION: version,
                STYLES: sublayersStyleArray.join()
            },
            projection: projection
        };

        // Source -> All other possible source OpenLayers options should be added silently to source class
        // They are not part of BKG WebMap Documentation.
        var extraSourceOptionsImage = [
            'attributions',
            'crossOrigin',
            'hidpi',
            'serverType',
            'imageLoadFunction',
            'logo',
            'ratio',
            'resolutions'
        ];
        var extraSourceOptionsTile = [
            'attributions',
            'cacheSize',
            'crossOrigin',
            'gutter',
            'hidpi',
            'logo',
            'tileClass',
            'tileGrid',
            'reprojectionErrorThreshold',
            'serverType',
            'tileLoadFunction',
            'urls',
            'wrapX',
            'transition'
        ];

        if (Object.prototype.hasOwnProperty.call(config, 'tiles') && config.tiles === false) {
            for (i = 0; i < extraSourceOptionsImage.length; i++) {
                if (config[extraSourceOptionsImage[i]]) {
                    sourceOptionsImage[extraSourceOptionsImage[i]] = config[extraSourceOptionsImage[i]];
                }
            }
            // Image WMS
            ol.inherits(BKGWebMap.Layer.ImageWMS, ol.layer.Image);
            source = new ol.source.ImageWMS(sourceOptionsImage);
        } else {
            for (i = 0; i < extraSourceOptionsTile.length; i++) {
                if (config[extraSourceOptionsTile[i]]) {
                    sourceOptionsTile[extraSourceOptionsTile[i]] = config[extraSourceOptionsTile[i]];
                }
            }
            // Tile WMS
            ol.inherits(BKGWebMap.Layer.TileWMS, ol.layer.Tile);
            source = new ol.source.TileWMS(sourceOptionsTile);
        }

        function parseLayersInfoWMS(arrayLayers, config, extentParsed, mapEPSG, extent, mapProjection) {
            for (var i = 0; i < arrayLayers.length; i++) {
                if (arrayLayers[i].Layer && arrayLayers[i].Layer instanceof Array && arrayLayers[i].Layer.length) {
                    parseLayersInfoWMS(arrayLayers[i].Layer, config, extentParsed, mapEPSG, extent, mapProjection);
                } else if (allSublayersArray.indexOf(arrayLayers[i].Name) !== -1) {
                    // extent
                    if (arrayLayers[i].BoundingBox instanceof Array) {
                        var tempBbox = arrayLayers[i].BoundingBox;
                        for (var x = 0; x < tempBbox.length; x++) {
                            if (tempBbox[x].crs === mapEPSG && tempBbox[x].extent instanceof Array) {
                                ol.extent.extend(extent, tempBbox[x].extent);
                                extentParsed = true;
                            }
                        }
                    }
                    if (!extentParsed && arrayLayers[i].EX_GeographicBoundingBox instanceof Array) {
                        var tempExtent = ol.proj.transformExtent(arrayLayers[i].EX_GeographicBoundingBox, 'EPSG:4326', mapProjection);
                        ol.extent.extend(extent, tempExtent);
                    }
                }


                // Style
                for (var k = 0; k < config.layers.length; k++) {
                    if (config.layers[k].layer === arrayLayers[i].Name) {
                        if (arrayLayers[i].Style && arrayLayers[i].Style instanceof Array) {
                            styleInfo[arrayLayers[i].Name] = arrayLayers[i].Style;

                            // Get legend url
                            if (legendInfo[arrayLayers[i].Name] === '') {
                                legendInfo[arrayLayers[i].Name] = {};
                                for (var j = 0; j < arrayLayers[i].Style.length; j++) {
                                    if (arrayLayers[i].Style[j].LegendURL) {
                                        legendInfo[arrayLayers[i].Name][arrayLayers[i].Style[j].Name] = arrayLayers[i].Style[j].LegendURL[0].OnlineResource;
                                    }
                                }
                            }
                        }
                        if (config.time && config.time.active && arrayLayers[i].Dimension && arrayLayers[i].Dimension instanceof Array) {
                            for (var d = 0; d < arrayLayers[i].Dimension.length; d++) {
                                if (arrayLayers[i].Dimension[d].name === 'time') {
                                    timeInfo[arrayLayers[i].Name] = arrayLayers[i].Dimension[d];
                                }
                            }
                        }
                    }
                }
            }
        }

        // GetCapabilities to get extent and copyright
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url + '?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var parser = new ol.format.WMSCapabilities();
                var result = parser.read(xhr.responseText);
                var mapProjection = map.getView().getProjection();
                var mapEPSG = mapProjection.getCode();
                var extent = ol.extent.createEmpty();
                var extentParsed = false;
                if (BKGWebMap.Util.hasNestedProperty(result, 'Capability.Layer.Layer')) {
                    if (result.Capability.Layer.Layer && result.Capability.Layer.Layer instanceof Array && result.Capability.Layer.Layer.length > 0) {
                        var arrayLayers = result.Capability.Layer.Layer;
                        parseLayersInfoWMS(arrayLayers, config, extentParsed, mapEPSG, extent, mapProjection);
                    }
                }

                if (BKGWebMap.Util.hasNestedProperty(result, 'Capability.Request.GetFeatureInfo.Format') && result.Capability.Request.GetFeatureInfo.Format.length) {
                    var formats = result.Capability.Request.GetFeatureInfo.Format;
                    for (var m = 0; m < BKGWebMap.GETFEATUREINFO_FORMATS.length; m++) {
                        if (formats.indexOf(BKGWebMap.GETFEATUREINFO_FORMATS[m]) !== -1) {
                            config.GetFeatureInfoFormat = BKGWebMap.GETFEATUREINFO_FORMATS[m];
                            break;
                        }
                    }
                }

                if (extent.indexOf(Infinity) !== -1) {
                    extent = null;
                }

                if (!copyright) {
                    if (BKGWebMap.Util.hasNestedProperty(result, 'Service.Fees') && result.Service.Fees !== '' && result.Service.Fees !== 'NONE') {
                        copyright += result.Service.Fees + ' ';
                    }
                    if (BKGWebMap.Util.hasNestedProperty(result, 'Service.AccessConstraints') && result.Service.AccessConstraints !== '' && result.Service.AccessConstraints !== 'NONE') {
                        copyright += result.Service.AccessConstraints + ' ';
                    }
                }
                config.styleInfo = styleInfo;
                config.legendInfo = legendInfo;
                config.timeInfo = timeInfo;
                if (copyright) {
                    config.copyright = copyright;
                }
                defineLayer(source, config, extent);
            }
        };
        xhr.onerror = function () {
            defineLayer(source, config);
        };
        xhr.send();
    },
    WMTS: function (createConfig, map, config, styles, bkg, callback) {
        var originalConfig = BKGWebMap.Util.deepCopy(config);
        delete originalConfig.isBaseLayer;
        config.originalConfig = originalConfig;

        config.uniqueId = BKGWebMap.Util.uniqueId();

        if (!config.id) {
            config.id = BKGWebMap.Util.generateLayerId();
        }

        // For export json
        if (config.bkg) {
            bkg = config.bkg;
        } else if (bkg) {
            originalConfig.bkg = bkg;
        }

        var i;
        var url = config.url;
        var wmtsLayer = config.layer;
        var copyright = '';

        // Source -> Projection (srsName)
        var layerProjection;
        if (config.srsName && typeof config.srsName === 'string' && config.srsName !== '') {
            layerProjection = config.srsName;
        } else {
            layerProjection = map.getView().getProjection();
        }

        function defineLayer(sourceOptions, extent) {
            var source = new ol.source.WMTS(sourceOptions);
            ol.inherits(BKGWebMap.Layer.WMTS, ol.layer.Tile);
            var layer = new BKGWebMap.Layer.WMTS(config);
            if (extent) {
                extent = ol.proj.transformExtent(extent, 'EPSG:4326', layerProjection);
                if (extent[0] === extent[2]) {
                    extent = ol.proj.transformExtent(BKGWebMap.EXTENTS['EPSG:4326'], 'EPSG:4326', layerProjection);
                    source.tileGrid.B = extent;
                }
                layer.extent = extent;
            }
            layer.setSource(source);
            return callback(layer);
        }

        // Layer
        if (typeof wmtsLayer !== 'string' || wmtsLayer === '') {
            window.console.log(BKGWebMap.ERROR.wmtsLayerName);
            return callback(undefined);
        }

        // Visible
        config.visible = BKGWebMap.LAYERS.WMTS.VISIBLE;
        if (typeof config.visibility === 'boolean' && config.visibility === false) {
            config.visible = config.visibility;
        }
        delete config.visibility;

        // Copyright
        if (config.copyright && typeof config.copyright === 'string' && config.copyright !== '') {
            copyright = config.copyright;
        }

        // Source -> URL
        var xhr;
        if (typeof url !== 'string' || url === '') {
            window.console.log(BKGWebMap.ERROR.wrongUrl + config.type);
            return callback(undefined);
        } else if (url.slice(url.length - 4, url.length) === '.xml') {
            // If the link ends with .xml, then access WMTS from a GetCapabilities response
            xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var parser = new ol.format.WMTSCapabilities();
                    var result = parser.read(xhr.responseText);
                    var extent;
                    var legendUrl;
                    if (BKGWebMap.Util.hasNestedProperty(result, 'Contents.Layer') && result.Contents.Layer.length) {
                        if (result.Contents.Layer[0].WGS84BoundingBox && result.Contents.Layer[0].WGS84BoundingBox.length === 4) {
                            for (var j = 0; j < result.Contents.Layer.length; j++) {
                                var layerConfig = result.Contents.Layer[j];
                                if (wmtsLayer !== layerConfig.Identifier) {
                                    continue;
                                }
                                if (layerConfig.WGS84BoundingBox && layerConfig.WGS84BoundingBox.length === 4) {
                                    extent = layerConfig.WGS84BoundingBox;
                                }
                            }
                        }
                    }
                    if (!copyright) {
                        if (BKGWebMap.Util.hasNestedProperty(result, 'ServiceIdentification.Fees') && result.ServiceIdentification.Fees !== '' && result.ServiceIdentification.Fees !== 'NONE') {
                            copyright += result.ServiceIdentification.Fees + ' ';
                        }
                        if (BKGWebMap.Util.hasNestedProperty(result, 'ServiceIdentification.AccessConstraints') && result.ServiceIdentification.AccessConstraints !== '' && result.ServiceIdentification.AccessConstraints !== 'NONE') {
                            copyright += result.ServiceIdentification.AccessConstraints + ' ';
                        }
                    }
                    if (!config.legendUrl && BKGWebMap.Util.hasNestedProperty(result, 'Contents.Layer') && result.Contents.Layer.length) {
                        if (result.Contents.Layer[0].Style && result.Contents.Layer[0].Style.length && result.Contents.Layer[0].Style[0].LegendURL && result.Contents.Layer[0].Style[0].LegendURL.length) {
                            legendUrl = result.Contents.Layer[0].Style[0].LegendURL[0].href;
                        }
                    }
                    if (legendUrl) {
                        config.legendUrl = legendUrl;
                    }
                    var options = ol.source.WMTS.optionsFromCapabilities(result, {
                        layer: wmtsLayer,
                        matrixSet: config.matrixSet
                    });

                    // If function is called through a BKG layer, try to use UUID
                    if (bkg && BKGWebMap.SECURITY.UUID && options.urls instanceof Array) {
                        for (var i = 0; i < options.urls.length; i++) {
                            options.urls[i] = options.urls[i].replace('/tile/', '__' + BKGWebMap.SECURITY.UUID + '/tile/');
                        }
                    }
                    if (copyright) {
                        config.copyright = copyright;
                    }
                    defineLayer(options, extent);
                } else if (xhr.status !== 200) {
                    return callback(undefined);
                }
            };

            xhr.onerror = function () {
                window.console.log(BKGWebMap.ERROR.wmtsGetCapabilities);
                return callback(undefined);
            };

            xhr.send();
        } else {
            // Create WMTS request manually
            var projection = BKGWebMap.PROJECTION;
            var style = BKGWebMap.LAYERS.WMTS.DEFAULTSTYLE;
            var tileGrid;

            // Source -> Projection (srsName)
            if (config.srsName && typeof config.srsName === 'string' && config.srsName !== '') {
                projection = config.srsName;
            }

            if (!config.tileGrid || typeof config.tileGrid !== 'object') {
                window.console.log(BKGWebMap.ERROR.wmtsTileGrid);
                return callback(undefined);
            } else if (config.tileGrid instanceof ol.tilegrid.WMTS) {
                tileGrid = config.tileGrid;
            } else {
                tileGrid = new ol.tilegrid.WMTS(config.tileGrid);
            }

            if (config.style && typeof config.style === 'string' && config.style !== '') {
                style = config.style;
            }

            // If function is called through a BKG layer, try to use UUID
            if (bkg && BKGWebMap.SECURITY.UUID) {
                url = url + '__' + BKGWebMap.SECURITY.UUID;
            }

            // Object with source options
            var sourceOptions = {
                url: url,
                layer: wmtsLayer,
                projection: projection,
                tileGrid: tileGrid,
                style: style
            };

            // All other possible WMTS source options, even those not included in Documentation
            var extraSourceOptions = [
                'attributions',
                'cacheSize',
                'crossOrigin',
                'logo',
                'reprojectionErrorThreshold',
                'requestEncoding',
                'tileClass',
                'tilePixelRatio',
                'version',
                'format',
                'matrixSet',
                'dimensions',
                'tileLoadFunction',
                'urls',
                'wrapX',
                'transition'
            ];

            for (i = 0; i < extraSourceOptions.length; i++) {
                if (config[extraSourceOptions[i]]) {
                    sourceOptions[extraSourceOptions[i]] = config[extraSourceOptions[i]];
                }
            }

            // GetCapabilities to get extent
            xhr = new XMLHttpRequest();
            xhr.open('GET', url + '/1.0.0/WMTSCapabilities.xml');
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var parser = new ol.format.WMTSCapabilities();
                    var result = parser.read(xhr.responseText);
                    var extent;
                    var legendUrl;
                    if (BKGWebMap.Util.hasNestedProperty(result, 'Contents.Layer') && result.Contents.Layer.length) {
                        if (result.Contents.Layer[0].WGS84BoundingBox && result.Contents.Layer[0].WGS84BoundingBox.length === 4) {
                            for (var j = 0; j < result.Contents.Layer.length; j++) {
                                var layerConfig = result.Contents.Layer[j];
                                if (wmtsLayer !== layerConfig.Identifier) {
                                    continue;
                                }
                                if (layerConfig.WGS84BoundingBox && layerConfig.WGS84BoundingBox.length === 4) {
                                    extent = layerConfig.WGS84BoundingBox;
                                }
                            }
                        }
                    }
                    if (!copyright) {
                        if (BKGWebMap.Util.hasNestedProperty(result, 'ServiceIdentification.Fees') && result.ServiceIdentification.Fees !== '' && result.ServiceIdentification.Fees !== 'NONE') {
                            copyright += result.ServiceIdentification.Fees + ' ';
                        }
                        if (BKGWebMap.Util.hasNestedProperty(result, 'ServiceIdentification.AccessConstraints') && result.ServiceIdentification.AccessConstraints !== '' && result.ServiceIdentification.AccessConstraints !== 'NONE') {
                            copyright += result.ServiceIdentification.AccessConstraints + ' ';
                        }
                    }
                    if (copyright) {
                        config.copyright = copyright;
                    }

                    if (!config.legendUrl && BKGWebMap.Util.hasNestedProperty(result, 'Contents.Layer') && result.Contents.Layer.length) {
                        if (result.Contents.Layer[0].Style.length && result.Contents.Layer[0].Style[0].LegendURL.length) {
                            legendUrl = result.Contents.Layer[0].Style[0].LegendURL[0].href;
                        }
                    }
                    if (legendUrl) {
                        config.legendUrl = legendUrl;
                    }
                    defineLayer(sourceOptions, extent);
                }
            };
            xhr.onerror = function () {
                defineLayer(sourceOptions);
            };
            xhr.send();
        }
    },
    WFS: function (createConfig, map, config, styles, bkg, callback) {
        var originalConfig = BKGWebMap.Util.deepCopy(config);
        delete originalConfig.isBaseLayer;
        config.originalConfig = originalConfig;

        config.uniqueId = BKGWebMap.Util.uniqueId();

        if (!config.id) {
            config.id = BKGWebMap.Util.generateLayerId();
        }

        // Style
        var styleObject = BKGWebMap.Style.createStyles([BKGWebMap.DEFAULT_STYLE]);
        var style = styleObject['bkgwebmap-defaultstyle'];
        if (styles && Object.prototype.hasOwnProperty.call(styles, config.style)) {
            config.styleName = config.style;
            style = styles[config.style];
        }
        config.style = style;

        var copyright = '';
        var url = config.url;
        var wfsDataProjection = BKGWebMap.PROJECTION;
        var mapProjection = map.getView().getProjection().getCode();
        var version = BKGWebMap.LAYERS.WFS.VERSION;
        var format = BKGWebMap.LAYERS.WFS.FORMAT;
        var edit = BKGWebMap.LAYERS.WFS.EDIT;
        var typename = config.typename;
        var tiles = BKGWebMap.LAYERS.WFS.TILES;

        var formats = {
            GEOJSON: {
                olClass: new ol.format.GeoJSON(),
                outputFormat: 'application/json'
            },
            GML2: {
                olClass: new ol.format.GML2(),
                outputFormat: 'gml2'
            },
            GML3: {
                olClass: new ol.format.WFS(),
                outputFormat: 'gml3'
            }
        };

        // Copyright
        if (config.copyright && typeof config.copyright === 'string' && config.copyright !== '') {
            copyright = config.copyright;
        }

        // Edit is always false for WFS
        config.edit = edit;

        // Source -> URL
        if (typeof url !== 'string' || url === '') {
            window.console.log(BKGWebMap.ERROR.wrongUrl + config.type);
            return callback(undefined);
        }

        // Source -> Projection (srsName)
        if (config.srsName && typeof config.srsName === 'string' && config.srsName !== '') {
            wfsDataProjection = config.srsName;
        }

        // Source -> typename
        if (typeof typename !== 'string' || url === '') {
            window.console.log(BKGWebMap.ERROR.wfsTypename);
            return callback(undefined);
        }

        // Be sure to use only once '?' in url
        if (url.charAt(url.length - 1) !== '?') {
            url += '?';
        }

        // Source -> version
        if (config.version && typeof config.version === 'string' && config.version !== '') {
            version = config.version;
        }

        // Source -> format
        if (config.format && (config.format === 'GML2' || config.format === 'GML3' || config.format === 'GEOJSON')) {
            format = config.format;
        }

        // Tiles
        if (typeof config.tiles === 'boolean') {
            tiles = config.tiles;
        }

        // Visible
        config.visible = BKGWebMap.LAYERS.WFS.VISIBLE;
        if (typeof config.visibility === 'boolean' && config.visibility === false) {
            config.visible = config.visibility;
        }
        delete config.visibility;

        ol.inherits(BKGWebMap.Layer.WFS, ol.layer.Vector);
        var layer = new BKGWebMap.Layer.WFS(config);

        var bboxDataProjection;
        if (version === '1.0.0') {
            bboxDataProjection = '';
        } else {
            bboxDataProjection = ',' + wfsDataProjection;
        }

        var strategy;
        if (tiles) {
            strategy = ol.loadingstrategy.tile(ol.tilegrid.createXYZ());
        } else {
            strategy = ol.loadingstrategy.bbox;
        }
        var typenameKey = (version === '2.0.0') ? 'typenames' : 'typename';
        var sourceOptions = {
            format: formats[format].olClass,
            loader: function (extent) {
                var extentTransform = ol.proj.transformExtent(extent, mapProjection, wfsDataProjection);
                var urlString = [
                    url,
                    'service=WFS',
                    'version=' + version,
                    'request=GetFeature',
                    typenameKey + '=' + typename,
                    'outputFormat=' + formats[format].outputFormat,
                    'srsname=' + wfsDataProjection,
                    'bbox=' + extentTransform.join(',') + bboxDataProjection
                ].join('&');

                var xhr = new XMLHttpRequest();
                xhr.open('GET', urlString);
                var onError = function () {
                    source.removeLoadedExtent(extent);
                    return undefined;
                };
                xhr.onerror = onError;
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        source.addFeatures(source.getFormat().readFeatures(xhr.responseText, {
                            dataProjection: wfsDataProjection,
                            featureProjection: mapProjection
                        }));
                    } else {
                        onError();
                    }
                };
                xhr.send();
            },
            strategy: strategy
        };

        // All other possible WFS source options, even those not included in Documentation
        var extraSourceOptions = [
            'attributions',
            'logo',
            'overlaps',
            'useSpatialIndex',
            'wrapX'
        ];
        for (var i = 0; i < extraSourceOptions.length; i++) {
            if (config[extraSourceOptions[i]]) {
                sourceOptions[extraSourceOptions[i]] = config[extraSourceOptions[i]];
            }
        }
        var source = new ol.source.Vector(sourceOptions);
        layer.setSource(source);

        // GetCapabilities to get copyright
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url + 'REQUEST=GetCapabilities&VERSION=1.3.0&SERVICE=wfs');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var parser = new DOMParser();
                var resultXml = parser.parseFromString(xhr.responseText, 'text/xml');
                var result = BKGWebMap.Util.xmlToJson(resultXml);
                var extent = new ol.extent.createEmpty();
                if (BKGWebMap.Util.hasNestedProperty(result, 'wfs:WFS_Capabilities.FeatureTypeList.FeatureType') && result['wfs:WFS_Capabilities'].FeatureTypeList.FeatureType instanceof Array) {
                    var featuresWFS = result['wfs:WFS_Capabilities'].FeatureTypeList.FeatureType;
                    for (var i = 0; i < featuresWFS.length; i++) {
                        if (BKGWebMap.Util.hasNestedProperty(featuresWFS[i], 'ows:WGS84BoundingBox.ows:LowerCorner.#text') && BKGWebMap.Util.hasNestedProperty(featuresWFS[i], 'ows:WGS84BoundingBox.ows:UpperCorner.#text')) {
                            var extentFeature = [parseFloat(featuresWFS[i]['ows:WGS84BoundingBox']['ows:LowerCorner']['#text'].split(' ')[0]), parseFloat(featuresWFS[i]['ows:WGS84BoundingBox']['ows:LowerCorner']['#text'].split(' ')[1]), parseFloat(featuresWFS[i]['ows:WGS84BoundingBox']['ows:UpperCorner']['#text'].split(' ')[0]), parseFloat(featuresWFS[i]['ows:WGS84BoundingBox']['ows:UpperCorner']['#text'].split(' ')[1])];
                            var transformExtent = ol.proj.transformExtent(extentFeature, 'EPSG:4326', mapProjection);
                            extent = new ol.extent.extend(extent, transformExtent);
                        }
                    }
                }
                layer.fullExtent = extent;
                if (!copyright) {
                    if (BKGWebMap.Util.hasNestedProperty(result, 'wfs:WFS_Capabilities.ows:ServiceIdentification.ows:Fees.#text') && result['wfs:WFS_Capabilities']['ows:ServiceIdentification']['ows:Fees']['#text'] !== '' && result['wfs:WFS_Capabilities']['ows:ServiceIdentification']['ows:Fees']['#text'] !== 'NONE') {
                        copyright += result['wfs:WFS_Capabilities']['ows:ServiceIdentification']['ows:Fees']['#text'] + ' ';
                    } else if (BKGWebMap.Util.hasNestedProperty(result, 'WFS_Capabilities.ows:ServiceIdentification.ows:Fees.#text') && result.WFS_Capabilities['ows:ServiceIdentification']['ows:Fees']['#text'] !== '' && result.WFS_Capabilities['ows:ServiceIdentification']['ows:Fees']['#text'] !== 'NONE') {
                        copyright += result.WFS_Capabilities['ows:ServiceIdentification']['ows:Fees']['#text'] + ' ';
                    }
                    if (BKGWebMap.Util.hasNestedProperty(result, 'wfs:WFS_Capabilities.ows:ServiceIdentification.ows:AccessConstraints.#text') && result['wfs:WFS_Capabilities']['ows:ServiceIdentification']['ows:AccessConstraints']['#text'] !== '' && result['wfs:WFS_Capabilities']['ows:ServiceIdentification']['ows:AccessConstraints']['#text'] !== 'NONE') {
                        copyright += result['wfs:WFS_Capabilities']['ows:ServiceIdentification']['ows:AccessConstraints']['#text'] + ' ';
                    } else if (BKGWebMap.Util.hasNestedProperty(result, 'WFS_Capabilities.ows:ServiceIdentification.ows:AccessConstraints.#text') && result.WFS_Capabilities['ows:ServiceIdentification']['ows:AccessConstraints']['#text'] !== '' && result.WFS_Capabilities['ows:ServiceIdentification']['ows:AccessConstraints']['#text'] !== 'NONE') {
                        copyright += result.WFS_Capabilities['ows:ServiceIdentification']['ows:AccessConstraints']['#text'] + ' ';
                    }
                }
                if (copyright) {
                    config.copyright = copyright;
                }
                return callback(layer);
            }
        };
        xhr.onerror = function () {
            return callback(layer);
        };
        xhr.send();
    },
    MARKER: function (createConfig, map, config, styles, bkg, callback) {
        var originalConfig = BKGWebMap.Util.deepCopy(config);
        delete originalConfig.isBaseLayer;
        config.originalConfig = originalConfig;

        config.uniqueId = BKGWebMap.Util.uniqueId();

        if (!config.id) {
            config.id = BKGWebMap.Util.generateLayerId();
        }

        var i;
        var features = [];
        var copyright = '';
        var edit = BKGWebMap.LAYERS.MARKER.EDIT;

        // Copyright
        if (config.copyright && typeof config.copyright === 'string' && config.copyright !== '') {
            copyright = config.copyright;
        }

        // Edit
        if (typeof config.edit !== 'boolean') {
            config.edit = edit;
        }

        // Style
        var styleObject = BKGWebMap.Style.createStyles([BKGWebMap.DEFAULT_STYLE]);
        var style = styleObject['bkgwebmap-defaultstyle'];
        if (Object.prototype.hasOwnProperty.call(styles, config.style)) {
            config.styleName = config.style;
            style = styles[config.style];
        }
        config.style = style;

        var mapProjection = map.getView().getProjection().getCode();
        var markerProjection = BKGWebMap.LAYERS.MARKER.PROJECTION;

        // Source -> Projection (srsName)
        if (config.srsName && typeof config.srsName === 'string' && config.srsName !== '') {
            markerProjection = config.srsName;
        }

        // Visible
        config.visible = BKGWebMap.LAYERS.MARKER.VISIBLE;
        if (typeof config.visibility === 'boolean' && config.visibility === false) {
            config.visible = config.visibility;
        }
        delete config.visibility;

        // Source -> Features
        if (!config.markers || !(config.markers instanceof Array)) {
            window.console.log(BKGWebMap.ERROR.markersMissing);
            return callback(undefined);
        }
        for (i = 0; i < config.markers.length; i++) {
            if (config.markers[i] instanceof ol.Feature) {
                // In case the user has used directly the class ol.Feature (hidden feature...)
                features.push(config.markers[i]);
            } else if (config.markers[i].coordinates && config.markers[i].coordinates.lat && typeof config.markers[i].coordinates.lat === 'number' && config.markers[i].coordinates.lon && typeof config.markers[i].coordinates.lon === 'number') {
                features.push(new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.transform([config.markers[i].coordinates.lon, config.markers[i].coordinates.lat], markerProjection, mapProjection)),
                    name: config.markers[i].content
                }));
            }
        }

        if (features.length === 0) {
            window.console.log(BKGWebMap.ERROR.markersMissing);
            return callback(undefined);
        }

        ol.inherits(BKGWebMap.Layer.MARKER, ol.layer.Vector);
        var layer = new BKGWebMap.Layer.MARKER(config);

        var sourceOptions = {
            features: features
        };
        // All other possible Vector source options, even those not included in Documentation
        var extraSourceOptions = [
            'attributions',
            'logo',
            'overlaps',
            'useSpatialIndex',
            'wrapX'
        ];
        for (i = 0; i < extraSourceOptions.length; i++) {
            if (config[extraSourceOptions[i]]) {
                sourceOptions[extraSourceOptions[i]] = config[extraSourceOptions[i]];
            }
        }

        var source = new ol.source.Vector(sourceOptions);
        layer.setSource(source);

        if (copyright) {
            config.copyright = copyright;
        }

        return callback(layer);
    },
    CSV: function (createConfig, map, config, styles, bkg, callback) {
        var originalConfig = BKGWebMap.Util.deepCopy(config);
        delete originalConfig.isBaseLayer;
        config.originalConfig = originalConfig;

        config.uniqueId = BKGWebMap.Util.uniqueId();

        if (!config.id) {
            config.id = BKGWebMap.Util.generateLayerId();
        }

        var url = config.url;
        var mapProjection = map.getView().getProjection().getCode();
        var csvProjection = BKGWebMap.LAYERS.CSV.PROJECTION;
        var copyright = '';
        var edit = BKGWebMap.LAYERS.CSV.EDIT;

        // Copyright
        if (config.copyright && typeof config.copyright === 'string' && config.copyright !== '') {
            copyright = config.copyright;
        }

        // Edit
        if (typeof config.edit !== 'boolean') {
            config.edit = edit;
        }

        // Style
        var styleObject = BKGWebMap.Style.createStyles([BKGWebMap.DEFAULT_STYLE]);
        var style = styleObject['bkgwebmap-defaultstyle'];
        if (Object.prototype.hasOwnProperty.call(styles, config.style)) {
            config.styleName = config.style;
            style = styles[config.style];
        }
        config.style = style;

        // Source -> Projection (srsName)
        if (config.srsName && typeof config.srsName === 'string' && config.srsName !== '') {
            csvProjection = config.srsName;
        }

        // Options
        if (!config.csvOptions || ((typeof config.csvOptions !== 'object' && config.csvOptions.constructor !== Object))) {
            window.console.log(BKGWebMap.ERROR.csvExcelOptions + config.type);
            return callback(undefined);
        }

        // Visible
        config.visible = BKGWebMap.LAYERS.CSV.VISIBLE;
        if (typeof config.visibility === 'boolean' && config.visibility === false) {
            config.visible = config.visibility;
        }
        delete config.visibility;

        // Source -> URL
        if (typeof url === 'string' && url === '') {
            window.console.log(BKGWebMap.ERROR.wrongUrl + config.type);
            return callback(undefined);
        } else if (url instanceof Array) {
            // Used from custom layers control
            // createFeaturesFromJson(url);
            BKGWebMap.Layer.Util.parseCsvExcelJson('CSV', url, config, config.csvOptions, csvProjection, mapProjection, copyright, callback);
        }

        // Load csv
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        var onError = function () {
            return callback(undefined);
        };
        xhr.onerror = onError;
        xhr.onload = function () {
            if (xhr.status === 200) {
                // Encoding
                var encoding = BKGWebMap.LAYERS.CSV.ENCODING;
                if (config.csvOptions && config.csvOptions.encoding && typeof config.csvOptions.encoding === 'string' && config.csvOptions.encoding !== '') {
                    encoding = config.csvOptions.encoding;
                }

                // Delimiter
                var delimiter = BKGWebMap.LAYERS.CSV.DELIMITER;
                if (config.csvOptions && config.csvOptions.delimiter && typeof config.csvOptions.delimiter === 'string' && config.csvOptions.delimiter !== '') {
                    delimiter = config.csvOptions.delimiter;
                }

                var reader = new FileReader();
                reader.readAsText(xhr.response, encoding);
                reader.onload = function (e) {
                    var result = 'sep=' + delimiter + '\n' + e.target.result;
                    var workbook = XLSX.read(result, { type: 'binary' });
                    var sheet = workbook.Sheets[workbook.SheetNames[0]];
                    var json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                    BKGWebMap.Layer.Util.parseCsvExcelJson('CSV', json, config, config.csvOptions, csvProjection, mapProjection, copyright, callback);
                };
            } else {
                onError();
            }
        };
        if (!(url instanceof Array)) {
            xhr.send();
        }
    },
    XLS: function (createConfig, map, config, styles, bkg, callback) {
        var originalConfig = BKGWebMap.Util.deepCopy(config);
        delete originalConfig.isBaseLayer;
        config.originalConfig = originalConfig;

        config.uniqueId = BKGWebMap.Util.uniqueId();

        if (!config.id) {
            config.id = BKGWebMap.Util.generateLayerId();
        }

        var url = config.url;
        var mapProjection = map.getView().getProjection().getCode();
        var excelProjection = BKGWebMap.LAYERS.XLS.PROJECTION;
        var copyright = '';
        var edit = BKGWebMap.LAYERS.XLS.EDIT;

        // Copyright
        if (config.copyright && typeof config.copyright === 'string' && config.copyright !== '') {
            copyright = config.copyright;
        }

        // Edit
        if (typeof config.edit !== 'boolean') {
            config.edit = edit;
        }

        // Style
        var styleObject = BKGWebMap.Style.createStyles([BKGWebMap.DEFAULT_STYLE]);
        var style = styleObject['bkgwebmap-defaultstyle'];
        if (Object.prototype.hasOwnProperty.call(styles, config.style)) {
            config.styleName = config.style;
            style = styles[config.style];
        }
        config.style = style;

        // Source -> Projection (srsName)
        if (config.srsName && typeof config.srsName === 'string' && config.srsName !== '') {
            excelProjection = config.srsName;
        }

        // Options
        if (!config.excelOptions || ((typeof config.excelOptions !== 'object' && config.excelOptions.constructor !== Object))) {
            window.console.log(BKGWebMap.ERROR.csvExcelOptions + config.type);
            return callback(undefined);
        }

        // Visible
        config.visible = BKGWebMap.LAYERS.XLS.VISIBLE;
        if (typeof config.visibility === 'boolean' && config.visibility === false) {
            config.visible = config.visibility;
        }
        delete config.visibility;

        // Source -> URL
        if (typeof url === 'string' && url === '') {
            window.console.log(BKGWebMap.ERROR.wrongUrl + config.type);
            return callback(undefined);
        } else if (url instanceof Array) {
            // Used from custom layers control
            BKGWebMap.Layer.Util.parseCsvExcelJson('XLS', url, config, config.excelOptions, excelProjection, mapProjection, copyright, callback);
        }

        // Load excel
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'arraybuffer';
        var onError = function () {
            return callback(undefined);
        };
        xhr.onerror = onError;
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = new Uint8Array(xhr.response);
                var workbook = XLSX.read(response, { type: 'array' });
                // Get data from first Sheet ONLY
                var data = workbook.Sheets[workbook.SheetNames[0]];
                var json = XLSX.utils.sheet_to_json(data, { header: 1 });
                BKGWebMap.Layer.Util.parseCsvExcelJson('XLS', json, config, config.excelOptions, excelProjection, mapProjection, copyright, callback);
            } else {
                onError();
            }
        };
        if (!(url instanceof Array)) {
            xhr.send();
        }
    },
    GPS: function (createConfig, map, config, styles, bkg, callback) {
        var originalConfig = BKGWebMap.Util.deepCopy(config);
        delete originalConfig.isBaseLayer;
        config.originalConfig = originalConfig;

        config.uniqueId = BKGWebMap.Util.uniqueId();

        if (!config.id) {
            config.id = BKGWebMap.Util.generateLayerId();
        }

        var url = config.url;
        var copyright = '';
        var edit = BKGWebMap.LAYERS.GPS.EDIT;
        var mapProjection = map.getView().getProjection().getCode();
        var gpsProjection = 'EPSG:4326';

        // Copyright
        if (config.copyright && typeof config.copyright === 'string' && config.copyright !== '') {
            copyright = config.copyright;
        }

        // Edit
        if (typeof config.edit !== 'boolean') {
            config.edit = edit;
        }

        // Style
        var styleObject = BKGWebMap.Style.createStyles([BKGWebMap.DEFAULT_STYLE]);
        var style = styleObject['bkgwebmap-defaultstyle'];
        if (Object.prototype.hasOwnProperty.call(styles, config.style)) {
            config.styleName = config.style;
            style = styles[config.style];
        }
        config.style = style;

        // Visible
        config.visible = BKGWebMap.LAYERS.GPS.VISIBLE;
        if (typeof config.visibility === 'boolean' && config.visibility === false) {
            config.visible = config.visibility;
        }
        delete config.visibility;

        // Source -> URL
        if (typeof url === 'string' && url === '') {
            window.console.log(BKGWebMap.ERROR.wrongUrl + config.type);
            return callback(undefined);
        } else if (url instanceof Array) {
            // Used from custom layers control
            BKGWebMap.Layer.Util.createFeaturesForGps(url[0], config, gpsProjection, mapProjection, callback);
        } else {
            ol.inherits(BKGWebMap.Layer.GPS, ol.layer.Vector);
            var layer = new BKGWebMap.Layer.GPS(config);

            var source = new ol.source.Vector({
                url: url,
                format: new ol.format.GPX()
            });
            layer.setSource(source);

            if (copyright) {
                config.copyright = copyright;
            }

            return callback(layer);
        }
    },
    VECTOR: function (createConfig, map, config, styles, bkg, callback) {
        var mapProjection = map.getView().getProjection().getCode();
        var copyright = '';
        var geojson;
        var edit = BKGWebMap.LAYERS.VECTOR.EDIT;

        config.uniqueId = BKGWebMap.Util.uniqueId();

        if (!config.id) {
            config.id = BKGWebMap.Util.generateLayerId();
        }

        if (!config.features || ((typeof config.features !== 'object' && config.features.constructor !== Object))) {
            return callback(undefined);
        }

        geojson = config.features;

        // Copyright
        if (config.copyright && typeof config.copyright === 'string' && config.copyright !== '') {
            copyright = config.copyright;
        }

        // Edit
        if (typeof config.edit !== 'boolean') {
            config.edit = edit;
        }


        // Style
        var styleObject = BKGWebMap.Style.createStyles([BKGWebMap.DEFAULT_STYLE]);
        var style = styleObject['bkgwebmap-defaultstyle'];
        if (Object.prototype.hasOwnProperty.call(styles, config.style)) {
            config.styleName = config.style;
            style = styles[config.style];
        }
        config.style = style;

        // Visible
        config.visible = BKGWebMap.LAYERS.VECTOR.VISIBLE;
        if (typeof config.visibility === 'boolean' && config.visibility === false) {
            config.visible = config.visibility;
        }
        delete config.visibility;

        ol.inherits(BKGWebMap.Layer.VECTOR, ol.layer.Vector);
        var layer = new BKGWebMap.Layer.VECTOR(config);

        if (copyright) {
            config.copyright = copyright;
        }

        var source = new ol.source.Vector();
        layer.setSource(source);

        var format = new ol.format.GeoJSON();

        var features = format.readFeatures(geojson, {
            dataProjection: 'EPSG:4326',
            featureProjection: mapProjection
        });

        source.addFeatures(features);
        return callback(layer);
    },
    GROUP: function (createConfig, map, config, styles, bkg, callback) {
        var originalConfig = BKGWebMap.Util.deepCopy(config);
        delete originalConfig.isBaseLayer;
        delete originalConfig.layers;
        config.originalConfig = originalConfig;

        config.uniqueId = BKGWebMap.Util.uniqueId();

        if (!config.id) {
            config.id = BKGWebMap.Util.generateLayerId();
        }

        var layers = [];
        var layerListLength = config.layers.length;
        var counter = 0;

        var layerGroup;
        if (config.isBaseLayer === true) {
            layerGroup = 'baseLayers';
        } else {
            layerGroup = 'overlays';
        }

        // Visible
        config.visible = BKGWebMap.LAYERS.GROUP.VISIBLE;
        if (typeof config.visibility === 'boolean' && config.visibility === false) {
            config.visible = config.visibility;
        }
        delete config.visibility;

        // Layers
        if (!config.layers || !(config.layers instanceof Array) || config.layers.length === 0) {
            window.console.log(BKGWebMap.ERROR.missingLayersGroup);
            return callback(undefined);
        }

        for (var i = 0; i < layerListLength; i++) {
            (function () {
                var k = i;
                createConfig.createLayer(createConfig, map, config.layers[k], layerGroup, styles, bkg, function (singleLayer) {
                    counter++;
                    if (singleLayer !== undefined) {
                        singleLayer.setProperties({
                            isBaseLayer: false,
                            uniqueId: BKGWebMap.Util.uniqueId()
                        });
                    }
                    layers[k] = singleLayer;

                    // Use layers array only if we have loaded all layers
                    if (counter === layerListLength) {
                        // Remove undefined from layers array
                        for (var j = layers.length - 1; j >= 0; j--) {
                            if (layers[j] === undefined) {
                                layers.splice(j, 1);
                            }
                        }

                        layers.reverse();

                        // Change layers property of config object
                        config.layers = layers;

                        ol.inherits(BKGWebMap.Layer.GROUP, ol.layer.Group);
                        var layer = new BKGWebMap.Layer.GROUP(config);

                        return callback(layer);
                    }
                });
            }());
        }
    },
    BKG: function (createConfig, map, config, styles, bkg, callback) {
        var originalConfig = BKGWebMap.Util.deepCopy(config);
        delete originalConfig.isBaseLayer;
        config.originalConfig = originalConfig;

        config.uniqueId = BKGWebMap.Util.uniqueId();

        if (!config.id) {
            config.id = BKGWebMap.Util.generateLayerId();
        }

        var projection = map.getView().getProjection().getCode();
        var registryUrl = BKGWebMap.SERVICE_REGISTRY;
        var ref = config.ref;
        var properties = {};
        var layerGroup;
        if (config.isBaseLayer === true) {
            layerGroup = 'baseLayers';
        } else {
            layerGroup = 'overlays';
        }

        // Find if we already have CookieCheck control. If not, add it and activate it only if there is no UUID (or appID).
        var cookieCheckControl = false;
        if (!BKGWebMap.SECURITY.UUID && !BKGWebMap.CONTROLS.tools.cookieCheck.doNotActivate) {
            map.getControls().forEach(function (control) {
                if (BKGWebMap.Control.CookieCheck && control instanceof BKGWebMap.Control.CookieCheck) {
                    cookieCheckControl = true;
                    if (!control.active) {
                        control.activateCookieTest();
                    }
                }
            });
            if (!cookieCheckControl) {
                var CookieCheckClass = BKGWebMap.Control.FACTORIES.cookieCheck();
                var cookieCheck = new CookieCheckClass(map, 'cookieCheck', {}, null);
                map.addControl(cookieCheck);
                BKGWebMap.Controls.cookieCheck = cookieCheck;
                cookieCheck.activateCookieTest();
            }
        }

        // ref
        if (typeof ref !== 'string' || ref === '') {
            window.console.log(BKGWebMap.ERROR.missingRefInBkg);
            return callback(undefined);
        }

        // Source -> Projection (srsName)
        if (config.srsName && typeof config.srsName === 'string' && config.srsName !== '') {
            projection = config.srsName;
        }

        // Properties that overwrite preconfigured values
        if (config.properties || ((typeof config.properties === 'object' && config.properties.constructor === Object))) {
            properties = config.properties;
        }

        // Use parameters for GET request
        var params = '/' + ref + '?srsname=' + projection;

        // Find layer info from registry
        var xhr = new XMLHttpRequest();
        xhr.open('GET', registryUrl + params);
        var onError = function () {
            return callback(undefined);
        };
        xhr.onerror = onError;
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.onload = function () {
            var jsonConfig = null;
            if (xhr.status === 200) {
                jsonConfig = JSON.parse(xhr.responseText);

                // Create URL
                // Source -> URL
                if (typeof jsonConfig.url !== 'string' || jsonConfig.url === '') {
                    window.console.log(BKGWebMap.ERROR.wrongUrl + config.type);
                    return callback(undefined);
                }

                // Be sure to have only one slash in url
                if (jsonConfig.url.slice(0, 1) === '/') {
                    jsonConfig.url = jsonConfig.url.slice(1);
                }
                if (BKGWebMap.BASE_URL.slice(BKGWebMap.BASE_URL.length - 1, BKGWebMap.BASE_URL.length) !== '/') {
                    BKGWebMap.BASE_URL += '/';
                }

                jsonConfig.url = BKGWebMap.BASE_URL + jsonConfig.url;

                // Ovewrite name
                if (config.name && typeof config.name === 'string' && config.srsName !== '') {
                    jsonConfig.name = config.name;
                }

                // Ovewrite default visibility
                if (typeof config.visibility === 'boolean') {
                    jsonConfig.visibility = config.visibility;
                }

                // Ovewrite opacity
                if (config.opacity && typeof config.opacity === 'number') {
                    jsonConfig.opacity = config.opacity;
                }

                // Ovewrite minResolution
                if (config.minResolution && typeof config.minResolution === 'number') {
                    jsonConfig.minResolution = config.minResolution;
                }

                // Ovewrite maxResolution
                if (config.maxResolution && typeof config.maxResolution === 'number') {
                    jsonConfig.maxResolution = config.maxResolution;
                }

                // Add legendUrl
                if (config.legendUrl && typeof config.legendUrl === 'string' && config.legendUrl !== '') {
                    jsonConfig.legendUrl = config.legendUrl;
                }

                // Add copyright
                if (config.copyright && typeof config.copyright === 'string' && config.copyright !== '') {
                    jsonConfig.copyright = config.copyright;
                }

                // Add user id
                if (config.id && typeof config.id === 'string' && config.id !== '') {
                    jsonConfig.id = config.id;
                }

                // Use properties that overwrite preconfigured values
                jsonConfig = BKGWebMap.Util.extend(jsonConfig, properties);

                createConfig.createLayer(createConfig, map, jsonConfig, layerGroup, styles, true, function (singleLayer) {
                    return callback(singleLayer);
                });
            } else {
                onError();
            }
        };
        xhr.send();
    },
    NONE: function (createConfig, map, config, styles, bkg, callback) {
        var originalConfig = BKGWebMap.Util.deepCopy(config);
        delete originalConfig.isBaseLayer;
        config.originalConfig = originalConfig;

        config.name = BKGWebMap.LAYERS.NONE.NAME;
        config.visible = false;
        config.uniqueId = BKGWebMap.Util.uniqueId();

        if (!config.id) {
            config.id = BKGWebMap.Util.generateLayerId();
        }

        ol.inherits(BKGWebMap.Layer.NONE, ol.layer.Image);
        var layer = new BKGWebMap.Layer.NONE(config);
        layer.setSource(null);
        return callback(layer);
    }
};

/**
 * Helper functions for layers
 * @namespace BKGWebMap.Layer.Util
 * @type {object}
 */
BKGWebMap.Layer.Util = BKGWebMap.Layer.Util || {};

/**
 * Create features for CSV and XLS layers
 * @param {array} json - Data from CSV or XLS
 * @param {CSV|XLS} config - CSV/XLS Configuration
 * @param {string} type - Layer type (CSV/XLS)
 * @param {string} dataProjection - Projection of coordinates in CSV/XLS
 * @param {string} mapProjection - Map projection
 * @returns {object|undefined}
 */
BKGWebMap.Layer.Util.createFeaturesForCsvExcel = function (json, config, type, dataProjection, mapProjection) {
    var features = [];
    var i;

    // Header
    var header = BKGWebMap.LAYERS[type].HEADER;
    if (typeof config.header === 'boolean') {
        header = config.header;
    }
    var headerArray = [];

    var startPosition = 0;
    if (header) {
        startPosition = 1;
        headerArray = json[0];
    } else {
        startPosition = 0;
        if (config.columnNames && config.columnNames instanceof Array) {
            headerArray = config.columnNames;
        }
    }

    // Columns to parse
    var columns = null;
    var typeOfcolumnsToParse;
    if (config.columnsToParse && config.columnsToParse instanceof Array) {
        columns = config.columnsToParse;
        typeOfcolumnsToParse = typeof columns[0];
    }

    // Create an array with column positions using header names
    if (columns && typeOfcolumnsToParse === 'string' && json[0] instanceof Array) {
        var tempColumns = [];
        var position;
        for (i = 0; i < columns.length; i++) {
            position = json[0].indexOf(columns[i]);
            if (position !== -1) {
                tempColumns.push(position + 1);
            }
        }
        columns = tempColumns;
    }

    if (!columns && json[0] instanceof Array) {
        columns = [];
        for (i = 0; i < json[0].length; i++) {
            columns.push(i + 1);
        }
    }

    if (config.LatColumn && config.LonColumn && json[0] instanceof Array) {
        var latColumn;
        var lonColumn;
        var lat;
        var lon;

        if (typeof config.LatColumn === 'string') {
            var latPosition = json[0].indexOf(config.LatColumn);
            if (latPosition !== -1) {
                latColumn = latPosition + 1;
            }

            var lonPosition = json[0].indexOf(config.LonColumn);
            if (lonPosition !== -1) {
                lonColumn = lonPosition + 1;
            }
        } else {
            latColumn = config.LatColumn;
            lonColumn = config.LonColumn;
        }

        for (i = startPosition; i < json.length; i++) {
            if (!json[i][latColumn - 1] || !json[i][lonColumn - 1]) {
                continue;
            }
            lat = parseFloat(json[i][latColumn - 1].replace(',', '.').replace(' ', ''));
            lon = parseFloat(json[i][lonColumn - 1].replace(',', '.').replace(' ', ''));
            if (isNaN(lat) || isNaN(lon)) {
                continue;
            }
            var properties = {};
            for (var k = 0; k < columns.length; k++) {
                var key = '';
                var value = '';
                if (typeof columns[k] === 'number') {
                    if (header) {
                        // Try to use titles from 1st line
                        if (header && headerArray[columns[k] - 1] !== undefined) {
                            key = headerArray[columns[k] - 1];
                        }
                    } else if (headerArray[k] !== undefined && headerArray[k] !== '') {
                        // Try to use titles defined by user (columnNames)
                        key = headerArray[k];
                    } else {
                        key = 'key' + k;
                    }
                    if (json[i][columns[k] - 1] !== undefined) {
                        value = json[i][columns[k] - 1];
                    }
                    properties[key] = value;
                }
            }
            properties.geometry = new ol.geom.Point(ol.proj.transform([lon, lat], dataProjection, mapProjection));
            features.push(new ol.Feature(properties));
        }
        return features;
    }
    return undefined;
};

/**
 * Parse JSON with CSV/XLS data
 * @param {string} format - Layer type (CSV/XLS)
 * @param {array} json - Array with CSV/XLS data
 * @param {CSV|XLS} config - CSV/XLS Configuration
 * @param {object} options - Options used to parse data from XLS/CSV
 * @param {string} featureProjection - EPSG Code of data projection in XLS/CSV
 * @param {string} mapProjection - EPSG Code of map projection
 * @param {string|undefined} copyright - Data copyright
 * @param {function} callback - Callback function. It will be called when all information of layer are parsed.
 * @returns {function}
 */
BKGWebMap.Layer.Util.parseCsvExcelJson = function (format, json, config, options, featureProjection, mapProjection, copyright, callback) {
    var features = BKGWebMap.Layer.Util.createFeaturesForCsvExcel(json, options, config.type, featureProjection, mapProjection);
    if (features.length === 0) {
        window.console.log(BKGWebMap.ERROR.csvExcelCoordMissing + config.type);
        return callback(undefined);
    }

    ol.inherits(BKGWebMap.Layer[format], ol.layer.Vector);
    var layer = new BKGWebMap.Layer[format](config);

    var sourceOptions = {
        features: features
    };
    // All other possible Vector source options, even those not included in Documentation
    var extraSourceOptions = [
        'attributions',
        'logo',
        'overlaps',
        'useSpatialIndex',
        'wrapX'
    ];
    for (var i = 0; i < extraSourceOptions.length; i++) {
        if (config[extraSourceOptions[i]]) {
            sourceOptions[extraSourceOptions[i]] = config[extraSourceOptions[i]];
        }
    }

    var source = new ol.source.Vector(sourceOptions);
    layer.setSource(source);

    if (copyright) {
        config.copyright = copyright;
    }

    return callback(layer);
};

/**
 * Create features for GPS through a custom layer
 * @param {object} gpx - GPX data
 * @param {GPS} config - GPS Configuration
 * @param {string} gpsProjection - EPSG Code of GPX data projection
 * @param mapProjection - EPSG Code of map projection
 * @param {function} callback - Callback function. It will be called when all information of layer are parsed.
 * @returns {function}
 */
BKGWebMap.Layer.Util.createFeaturesForGps = function (gpx, config, gpsProjection, mapProjection, callback) {
    ol.inherits(BKGWebMap.Layer.GPS, ol.layer.Vector);
    var layer = new BKGWebMap.Layer.GPS(config);
    var gpxFormat = new ol.format.GPX();
    var source = new ol.source.Vector();
    layer.setSource(source);

    var features = gpxFormat.readFeatures(gpx, {
        dataProjection: gpsProjection,
        featureProjection: mapProjection
    });
    source.addFeatures(features);
    return callback(layer);
};

/**
 * Find configuration for layers that are programmatically added
 * @param {object} layer - Layer added
 * @returns {object|string}
 */
BKGWebMap.Layer.Util.programmaticLayerConfig = function (layer) {
    var config = {};
    var layersArray;
    var i;
    var urls;

    if (layer.getSource() instanceof ol.source.ImageWMS) {
        config.type = 'WMS';
        config.tiles = false;
        config.layers = [];
        if (layer.getSource().getParams().LAYERS) {
            layersArray = layer.getSource().getParams().LAYERS.split(',');
            if (layersArray.length) {
                for (i = 0; i < layersArray.length; i++) {
                    config.layers.push({
                        layer: layersArray[i]
                    });
                }
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
        if (layer.getProperties().name) {
            config.name = layer.getProperties().name;
        } else {
            config.name = 'WMS Layer';
        }

        if (layer.getProperties().copyright) {
            config.copyright = layer.getProperties().copyright;
        }

        if (layer.getProperties().legendUrl) {
            config.legendUrl = layer.getProperties().legendUrl;
        }

        if (typeof layer.getSource().getUrl === 'function') {
            var url = layer.getSource().getUrl();
            if (url) {
                config.url = url;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
        return config;
    } else if (layer.getSource() instanceof ol.source.TileWMS) {
        config.type = 'WMS';
        config.tiles = true;
        config.layers = [];
        if (layer.getSource().getParams().LAYERS) {
            layersArray = layer.getSource().getParams().LAYERS.split(',');
            if (layersArray.length) {
                for (i = 0; i < layersArray.length; i++) {
                    config.layers.push({
                        layer: layersArray[i]
                    });
                }
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
        if (layer.getProperties().name) {
            config.name = layer.getProperties().name;
        } else {
            config.name = 'WMS Layer';
        }

        if (layer.getProperties().copyright) {
            config.copyright = layer.getProperties().copyright;
        }

        if (layer.getProperties().legendUrl) {
            config.legendUrl = layer.getProperties().legendUrl;
        }

        if (typeof layer.getSource().getUrls === 'function') {
            urls = layer.getSource().getUrls();
            if (urls.length) {
                config.url = urls[0];
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
        return config;
    } else if (layer.getSource() instanceof ol.source.WMTS) {
        if (typeof layer.getSource().getLayer === 'function') {
            var layerToLoad = layer.getSource().getLayer();
            if (layerToLoad) {
                config.layer = layerToLoad;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }

        if (layer.getProperties().name) {
            config.name = layer.getProperties().name;
        } else {
            config.name = 'WMTS Layer';
        }

        if (typeof layer.getSource().getUrls === 'function') {
            urls = layer.getSource().getUrls();
            if (urls.length) {
                config.url = urls[0];
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }


        if (typeof layer.getSource().getMatrixSet === 'function') {
            var matrixSet = layer.getSource().getMatrixSet();
            if (matrixSet) {
                config.matrixSet = matrixSet;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }

        if (typeof layer.getSource().getTileGrid === 'function') {
            var tileGrid = layer.getSource().getTileGrid();
            if (tileGrid) {
                config.tileGrid = tileGrid;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
        return config;
    } else if (layer instanceof ol.layer.Vector) {
        var uniqueId = BKGWebMap.Util.uniqueId();
        return uniqueId;
    }
};
