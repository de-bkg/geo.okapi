describe('A suite for legend control', function () {
    var options;
    var legend;
    var urlWms;
    var urlLegend;
    var legendInfo;
    var sublayerWms;
    var controlName = 'legend';
    var cssClass = 'bkgwebmap-legend';
    var standardPosition = 'panel';
    var layerName = 'CSV test';
    var customUrl = 'http://geosysnet.de/custom/img/easyxplore/kategorien.jpg';
    var wmsLayerName1 = 'Berlin Postleitzahlen';
    var wmsLayerName2 = 'Wochenmärkte';
    var layers;

    beforeEach(function () {
    // Create DOM
        createDomMap();
    });

    it('adds a legend control inside panel', function (done) {
    // Create new control in panel
        options = {
            active: true
        };

        createMap(controlName, options, null, function (map) {
            legend = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
            legend.runTest();
            done();
        });
    });

    it('adds a legend control outside panel', function (done) {
    // Create new control outside panel
        options = {
            active: true,
            div: 'legendDiv'
        };
        createDomDivInBody(options.div);
        createMap(controlName, options, null, function (map) {
            legend = new ControlInCustomDiv(map, controlName, cssClass, options, standardPosition);
            legend.runTest();
            done();
        });
    });
    it('test legend titel and url', function (done) {
    // Create new control in panel
        options = {
            active: true
        };

        layers = {
            baseLayers: [
                {
                    type: 'NONE'
                }
            ],
            overlays: [
                {
                    type: 'MARKER',
                    name: layerName,
                    visibility: true,
                    srsName: 'EPSG:4326',
                    markers: [
                        {
                            coordinates: {
                                lat: 50.091176,
                                lon: 8.663281
                            },
                            content: '<h3>Zentrale Dienststelle in Frankfurt am Main</h3><p>Bundesamt für Kartographie und Geodäsie<br>Richard-Strauss-Allee 11<br>60598 Frankfurt am Main<br>Deutschland</p>'

                        },
                        {
                            coordinates: {
                                lat: 51.354210,
                                lon: 12.374295
                            },
                            content: '<h3>Außenstelle Leipzig</h3><p>Bundesamt für Kartographie und Geodäsie<br> - Außenstelle Leipzig -<br>Karl-Rothe-Straße 10-14<br>04105 Leipzig<br>Deutschland</p>'
                        }
                    ],
                    minResolution: 0.0001,
                    maxResolution: 156545,
                    edit: true,
                    legendUrl: customUrl
                }
            ]
        };

        createMap(controlName, options, layers, function () {
            var legendTitle = document.getElementsByClassName('bkgwebmap-legendlayertitle')[0].innerHTML;
            expect(legendTitle).toBe(layerName);
            var imgSrc = document.getElementsByClassName('bkgwebmap-legendlayerimg')[0].getElementsByTagName('img')[0].src;
            expect(imgSrc).toBe(customUrl);
            done();
        });
    });
    it('test legend titel wms', function (done) {
    // Create new control in panel
        options = {
            active: true
        };

        layers = {
            baseLayers: [
                {
                    type: 'NONE'
                }
            ],
            overlays: [
                {
                    type: 'WMS',
                    name: 'Berlin',
                    tiles: false,
                    url: 'http://sg.geodatenzentrum.de/wms_vg250',
                    visibility: true,
                    srsName: 'EPSG:3857',
                    layers: [
                        {
                            id: '0',
                            name: wmsLayerName1,
                            layer: 'vg250_lan',
                            style: 'default',
                            selectStyle: true
                        }, {
                            id: '1',
                            name: wmsLayerName2,
                            layer: 'vg250_krs',
                            style: 'polygon',
                            selectStyle: true
                        }
                    ]
                }
            ]
        };

        createMap(controlName, options, layers, function () {
            var nameFound = 0;
            var legendTitles = document.getElementsByClassName('bkgwebmap-legendlayertitlewms');
            for (var i = 0; i < legendTitles.length; i++) {
                var element = legendTitles[i];
                if (element.innerHTML === wmsLayerName1 || wmsLayerName2) {
                    nameFound++;
                }
            }
            expect(nameFound).toBe(2);
            done();
        });
    });
    it('test legend url wms', function (done) {
    // Create new control in panel
        options = {
            active: true
        };

        layers = {
            baseLayers: [
                {
                    type: 'NONE'
                }
            ],
            overlays: [
                {
                    type: 'WMS',
                    name: 'VG250',
                    tiles: false,
                    url: 'https://sg.geodatenzentrum.de/wms_vg250',
                    visibility: true,
                    srsName: 'EPSG:3857',
                    layers: [
                        {
                            id: '0',
                            name: 'Bundesland',
                            layer: 'vg250_lan',
                            style: 'polygon',
                            selectStyle: true
                        }
                    ]
                }
            ]
        };

        createMap(controlName, options, layers, function (map) {
            var styleSublayer = layers.overlays[0].layers[0].style;
            map.getLayers().forEach(function (layer) {
                if (layer instanceof BKGWebMap.Layer.ImageWMS || layer instanceof BKGWebMap.Layer.TileWMS) {
                    legendInfo = layer.getLegendInfo();
                    layer.getLayers().forEach(function (sublayer) {
                        sublayerWms = sublayer.layer;
                    });
                }
            });
            expect(legendInfo instanceof Object).toBeTruthy();
            urlWms = legendInfo[sublayerWms][styleSublayer];
            urlLegend = document.getElementsByClassName('bkgwebmap-legendlayerimg')[0].getElementsByTagName('img')[0].src;
            expect(urlLegend).toBe(urlWms);
            done();
        });
    });
});
