describe('A suite for customLayers control', function () {
    var map;
    var options;
    var controlName = 'customLayers';
    var cssClass = 'bkgwebmap-customlayers';
    var standardPosition = 'layerswitcher';
    var customLayers;
    var control;
    var layerOptions = {};

    beforeAll(function (done) {
        // Create DOM
        createDomMap();
        new BKGWebMap.MapBuilder()
            .setLayers({ baseLayers: [{ type: 'NONE' }], overlays: [] })
            .setControls({
                tools: {
                    layerSwitcher: {
                        active: true,
                        style: 'customLayerSwitcher',
                        editStyle: false,
                        changeVisibility: true,
                        showWMSLayers: true,
                        changeOrder: true,
                        openLevel: 1
                    },
                    customLayers: {
                        active: true,
                        editStyle: true,
                        changeVisibility: true,
                        defaultStyle: ''
                    }
                }
            })
            .create(function (data) {
                map = data;
                return done();
            });
    });

    it('adds a control in layerswitcher', function () {
        customLayers = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
        customLayers.runTest();
    });
    it('test create BKG layer', function (done) {
        map.getControls().forEach(function (_control) {
            if (_control instanceof BKGWebMap.Control.CustomLayers) {
                control = _control;
            }
        });
        layerOptions = {
            type: 'BKG',
            visibility: true,
            name: 'webatlasde_light_test',
            ref: 'webatlasde_light'
        };
        control.createLayer(control, map, layerOptions, 'overlays', null, false, function (layer) {
            expect(layer.getProperties().originalConfig.bkg).toBeTruthy();
            expect(layer.getProperties().name).toBe(layerOptions.name);
            expect(layer.getProperties().isBaseLayer).toBeFalsy();
            done();
        });
    });
    it('test create WMS layer', function (done) {
        map.getControls().forEach(function (_control) {
            if (_control instanceof BKGWebMap.Control.CustomLayers) {
                control = _control;
            }
        });
        layerOptions = {
            type: 'WMS',
            name: 'WMS_test',
            url: 'http://gismonster.com/geoserver/kurs/wms',
            visibility: true,
            tiles: false,
            layers: [
                {
                    name: 'Bundesländer',
                    layer: 'Bundeslaender'
                },
                {
                    name: 'Berliner Bezirke',
                    layer: 'berliner_bezirke'
                }
            ]
        };
        control.createLayer(control, map, layerOptions, 'overlays', null, false, function (layer) {
            expect(layer instanceof BKGWebMap.Layer.ImageWMS || layer instanceof BKGWebMap.Layer.TileWMS).toBeTruthy();
            expect(layer.getSource().getParams().LAYERS.split(',').length).toBe(layerOptions.layers.length);
            expect(layer.getProperties().name).toBe(layerOptions.name);
            expect(layer.getProperties().isBaseLayer).toBeFalsy();
            done();
        });
    });
    it('test create WMTS layer', function (done) {
        map.getControls().forEach(function (_control) {
            if (_control instanceof BKGWebMap.Control.CustomLayers) {
                control = _control;
            }
        });
        layerOptions = {
            type: 'WMTS',
            name: 'WMTS_test',
            url: 'http://sg.geodatenzentrum.de/wmts_webatlasde/1.0.0/WMTSCapabilities.xml',
            visibility: true,
            layer: 'webatlasde',
            matrixSet: 'DE_EPSG_25832_ADV'
        };
        control.createLayer(control, map, layerOptions, 'overlays', null, false, function (layer) {
            expect(layer instanceof BKGWebMap.Layer.WMTS).toBeTruthy();
            expect(layer.getProperties().name).toBe(layerOptions.name);
            expect(layer.getProperties().isBaseLayer).toBeFalsy();
            done();
        });
    });
    it('test create WFS layer', function (done) {
        map.getControls().forEach(function (_control) {
            if (_control instanceof BKGWebMap.Control.CustomLayers) {
                control = _control;
            }
        });
        layerOptions = {
            type: 'WFS',
            name: 'WFS_test',
            visibility: true,
            url: 'https://web-mapping.com/geoserver/ows',
            typename: 'kurs:lines',
            srsName: 'EPSG:3857',
            version: '1.1.0'
        };
        control.createLayer(control, map, layerOptions, 'overlays', null, false, function (layer) {
            expect(layer instanceof BKGWebMap.Layer.WFS).toBeTruthy();
            expect(layer.getProperties().name).toBe(layerOptions.name);
            expect(layer.getProperties().isBaseLayer).toBeFalsy();
            done();
        });
    });
    it('test create CSV layer', function (done) {
        map.getControls().forEach(function (_control) {
            if (_control instanceof BKGWebMap.Control.CustomLayers) {
                control = _control;
            }
        });
        layerOptions = {
            type: 'CSV',
            name: 'CSV test',
            url: 'points.csv',
            visibility: true,
            srsName: 'EPSG:4326',
            csvOptions: {
                header: true,
                columnsToParse: ['name', 'place', 'infos'],
                LatColumn: 'lat',
                LonColumn: 'lon',
                delimiter: ';',
                encoding: 'UTF-8'
            }
        };
        control.createLayer(control, map, layerOptions, 'overlays', 'blueSymbols', false, function (layer) {
            expect(layer instanceof BKGWebMap.Layer.CSV).toBeTruthy();
            expect(layer.getProperties().name).toBe(layerOptions.name);
            expect(layer.getProperties().isBaseLayer).toBeFalsy();
            done();
        });
    });
    it('test create XLS layer', function (done) {
        map.getControls().forEach(function (_control) {
            if (_control instanceof BKGWebMap.Control.CustomLayers) {
                control = _control;
            }
        });
        layerOptions = {
            type: 'XLS',
            name: 'Excel test',
            url: 'points.xlsx',
            visibility: true,
            srsName: 'EPSG:4326',
            excelOptions: {
                header: false,
                columnNames: ['a', 'b', ''],
                columnsToParse: [3, 4, 5],
                LatColumn: 1,
                LonColumn: 2
            }
        };
        control.createLayer(control, map, layerOptions, 'overlays', 'blueSymbols', false, function (layer) {
            expect(layer instanceof BKGWebMap.Layer.XLS).toBeTruthy();
            expect(layer.getProperties().name).toBe(layerOptions.name);
            expect(layer.getProperties().isBaseLayer).toBeFalsy();
            done();
        });
    });
    it('test create GPS layer', function (done) {
        map.getControls().forEach(function (_control) {
            if (_control instanceof BKGWebMap.Control.CustomLayers) {
                control = _control;
            }
        });
        layerOptions = {
            type: 'GPS',
            name: 'GPS Layer',
            url: 'Frankfurt.gpx',
            visibility: true
        };
        control.createLayer(control, map, layerOptions, 'overlays', 'blueSymbols', false, function (layer) {
            expect(layer instanceof BKGWebMap.Layer.GPS).toBeTruthy();
            expect(layer.getProperties().name).toBe(layerOptions.name);
            expect(layer.getProperties().isBaseLayer).toBeFalsy();
            done();
        });
    });
});
