describe('A suite for WMS layers', function () {
    var stylesWMS;
    var urlsWMS;
    beforeEach(function () {
        // Create DOM and map
        createDomMap();
    });
    it('creates WMS layer with two sublayers', function (done) {
        var layers = {
            baseLayers: [
                {
                    type: 'NONE'
                }
            ],
            overlays: [
                {
                    type: 'WMS',
                    name: 'Berlin',
                    tiles: true,
                    url: 'http://gismonster.com/geoserver/kurs/wms',
                    visibility: true,
                    srsName: 'EPSG:3857',
                    layers: [
                        {
                            id: '0',
                            name: 'Bundesländer',
                            layer: 'Bundeslaender',
                            selectStyle: true,
                            visibility: true
                        },
                        {
                            id: '1',
                            name: 'Berliner Bezirke',
                            layer: 'berliner_bezirke',
                            style: 'grass',
                            visibility: true,
                            selectStyle: true
                        }
                    ]
                }
            ]
        };

        createMap(null, null, layers, function (map) {
            map.getLayers().forEach(function (layer) {
                if (layer instanceof BKGWebMap.Layer.ImageWMS || layer instanceof BKGWebMap.Layer.TileWMS) {
                    stylesWMS = layer.getSource().getParams().STYLES.split(',');
                    urlsWMS = layer.getSource().getUrls();
                    sublayersWMS = layer.getSource().getParams().LAYERS.split(',');
                }
            });
            expect(stylesWMS.length).toBe(2);
            expect(sublayersWMS.length).toBe(2);
            expect(urlsWMS.length).toBe(1);
            expect(urlsWMS[0]).toBe(layers.overlays[0].url);
            done();
        });
    });
    it('creates WMS layer with one sublayer', function (done) {
        var layers = {
            baseLayers: [
                {
                    type: 'NONE'
                }
            ],
            overlays: [
                {
                    type: 'WMS',
                    name: 'Berlin',
                    tiles: true,
                    url: 'http://gismonster.com/geoserver/kurs/wms',
                    visibility: true,
                    srsName: 'EPSG:3857',
                    layers: [
                        {
                            id: '0',
                            name: 'Bundesländer',
                            layer: 'Bundeslaender',
                            selectStyle: true,
                            visibility: false
                        },
                        {
                            id: '1',
                            name: 'Berliner Bezirke',
                            layer: 'berliner_bezirke',
                            style: 'grass',
                            visibility: true,
                            selectStyle: true
                        }
                    ]
                }
            ]
        };

        createMapView(null, null, layers, function (map) {
            map.getLayers().forEach(function (layer) {
                if (layer instanceof BKGWebMap.Layer.ImageWMS || layer instanceof BKGWebMap.Layer.TileWMS) {
                    stylesWMS = layer.getSource().getParams().STYLES.split(',');
                    urlsWMS = layer.getSource().getUrls();
                    sublayersWMS = layer.getSource().getParams().LAYERS.split(',');
                }
            });
            expect(stylesWMS.length).toBe(1);
            expect(sublayersWMS.length).toBe(1);
            expect(urlsWMS.length).toBe(1);
            expect(urlsWMS[0]).toBe(layers.overlays[0].url);
            done();
        });
    });
    it('test wms sublayers max/min resolution', function (done) {
        var layers = {
            baseLayers: [
                {
                    type: 'NONE'
                }
            ],
            overlays: [
                {
                    type: 'WMS',
                    name: 'Berlin',
                    tiles: true,
                    url: 'http://gismonster.com/geoserver/kurs/wms',
                    visibility: true,
                    srsName: 'EPSG:3857',
                    layers: [
                        {
                            id: '0',
                            name: 'Bundesländer',
                            layer: 'Bundeslaender',
                            selectStyle: true,
                            visibility: true,
                            minResolution: 10000,
                            maxResolution: 20000
                        },
                        {
                            id: '1',
                            name: 'Berliner Bezirke',
                            layer: 'berliner_bezirke',
                            style: 'grass',
                            visibility: true,
                            selectStyle: true,
                            minResolution: 15000
                        }
                    ]
                }
            ]
        };

        createMap(null, null, layers, function (map) {
            map.getView().setZoom(map.getView().getZoomForResolution(1000));
            map.getLayers().forEach(function (layer) {
                if ((layer instanceof BKGWebMap.Layer.ImageWMS || layer instanceof BKGWebMap.Layer.TileWMS) && layer.getVisible()) {
                    expect(layer.getVisible()).toBeFalsy();
                }
            });
            map.getView().setZoom(map.getView().getZoomForResolution(10000));
            map.getLayers().forEach(function (layer) {
                if ((layer instanceof BKGWebMap.Layer.ImageWMS || layer instanceof BKGWebMap.Layer.TileWMS) && layer.getVisible()) {
                    expect(layer.getVisible()).toBeTruthy();
                    sublayersWMS = layer.getSource().getParams().LAYERS.split(',');
                    expect(sublayersWMS.length).toBe(1);
                }
            });
            map.getView().setZoom(map.getView().getZoomForResolution(16000));
            map.getLayers().forEach(function (layer) {
                if ((layer instanceof BKGWebMap.Layer.ImageWMS || layer instanceof BKGWebMap.Layer.TileWMS) && layer.getVisible()) {
                    expect(layer.getVisible()).toBeTruthy();
                    sublayersWMS = layer.getSource().getParams().LAYERS.split(',');
                    expect(sublayersWMS.length).toBe(2);
                }
            });
            map.getView().setZoom(map.getView().getZoomForResolution(30000));
            map.getLayers().forEach(function (layer) {
                if ((layer instanceof BKGWebMap.Layer.ImageWMS || layer instanceof BKGWebMap.Layer.TileWMS) && layer.getVisible()) {
                    expect(layer.getVisible()).toBeTruthy();
                    sublayersWMS = layer.getSource().getParams().LAYERS.split(',');
                    expect(sublayersWMS.length).toBe(1);
                }
            });
            done();
        });
    });
});
