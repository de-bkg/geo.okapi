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
                    url: 'http://sg.geodatenzentrum.de/wms_vg250',
                    visibility: true,
                    srsName: 'EPSG:3857',
                    layers: [
                        {
                            id: '0',
                            name: 'Bundesländer',
                            layer: 'vg250_lan',
                            selectStyle: true
                        },
                        {
                            id: '1',
                            name: 'Regierungsbezirk',
                            layer: 'vg250_rbz',
                            style: 'polygon',
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
                    url: 'http://sg.geodatenzentrum.de/wms_vg250',
                    visibility: true,
                    srsName: 'EPSG:3857',
                    layers: [
                        {
                            id: '0',
                            name: 'Bundesländer',
                            layer: 'vg250_lan',
                            selectStyle: true,
                            visibility: false
                        },
                        {
                            id: '1',
                            name: 'Regierungsbezirk',
                            layer: 'vg250_rbz',
                            style: 'polygon',
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
                    url: 'http://sg.geodatenzentrum.de/wms_vg250',
                    visibility: true,
                    srsName: 'EPSG:3857',
                    layers: [
                        {
                            id: '0',
                            name: 'Bundesländer',
                            layer: 'vg250_lan',
                            selectStyle: true,
                            visibility: true,
                            minResolution: 1000,
                            maxResolution: 2000
                        },
                        {
                            id: '1',
                            name: 'Regierungsbezirk',
                            layer: 'vg250_rbz',
                            style: 'polygon',
                            visibility: true,
                            selectStyle: true,
                            minResolution: 1500
                        }
                    ]
                }
            ]
        };

        createMap(null, null, layers, function (map) {
            map.getView().setZoom(map.getView().getZoomForResolution(100));
            map.getLayers().forEach(function (layer) {
                if ((layer instanceof BKGWebMap.Layer.ImageWMS || layer instanceof BKGWebMap.Layer.TileWMS) && layer.getVisible()) {
                    expect(layer.getVisible()).toBeFalsy();
                }
            });
            map.getView().setZoom(map.getView().getZoomForResolution(1000));
            map.getLayers().forEach(function (layer) {
                if ((layer instanceof BKGWebMap.Layer.ImageWMS || layer instanceof BKGWebMap.Layer.TileWMS) && layer.getVisible()) {
                    expect(layer.getVisible()).toBeTruthy();
                    sublayersWMS = layer.getSource().getParams().LAYERS.split(',');
                    expect(sublayersWMS.length).toBe(1);
                }
            });
            map.getView().setZoom(map.getView().getZoomForResolution(1600));
            map.getLayers().forEach(function (layer) {
                if ((layer instanceof BKGWebMap.Layer.ImageWMS || layer instanceof BKGWebMap.Layer.TileWMS) && layer.getVisible()) {
                    expect(layer.getVisible()).toBeTruthy();
                    sublayersWMS = layer.getSource().getParams().LAYERS.split(',');
                    expect(sublayersWMS.length).toBe(2);
                }
            });
            map.getView().setZoom(map.getView().getZoomForResolution(3000));
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
