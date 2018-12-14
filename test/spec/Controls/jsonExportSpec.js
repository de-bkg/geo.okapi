describe('A suite for jsonExport control', function () {
    var options;
    var controlName = 'jsonExport';
    var cssClass = 'bkgwebmap-jsonexport';
    var standardPosition = 'sharepanel';
    var jsonExport;
    var layers;
    var testJson;
    var testBlob;
    beforeEach(function () {
        // Create DOM
        createDomMap();
        saveAs = jasmine.createSpy();
    });

    it('adds an export json control inside share-panel', function (done) {
        options = {
            active: true,
            print: {
                active: false
            },
            permaLink: {
                active: false
            },
            jsonExport: {
                active: true
            }
        };
        createMap('share', options, null, function (map) {
            jsonExport = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
            jsonExport.runTest();
            done();
        });
    });
    it('test json export', function (done) {
        options = {
            active: true,
            print: {
                active: false
            },
            permaLink: {
                active: false
            },
            jsonExport: {
                active: true
            }
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
                    name: 'Marker Leipzig',
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
                    edit: false
                }
            ]
        };
        createMapView('share', options, layers, function (map) {
            var date = new Date();

            testJson = {
                description: 'BKG WebMap: Kartenkonfiguration',
                version: BKGWebMap.VERSION,
                generatedAt: date.toLocaleString(),
                appName: 'BKG WebMap',
                map: {
                    projection: 'EPSG:4326',
                    center: {
                        lat: parseFloat(map.getView().getCenter()[1].toFixed(4)),
                        lon: parseFloat(map.getView().getCenter()[0].toFixed(4))
                    },
                    zoom: 4,
                    minResolution: map.getView().getMinResolution(),
                    maxResolution: map.getView().getMaxResolution()
                },
                layers: {
                    baseLayers: [
                        {
                            type: 'NONE'
                        }
                    ],
                    overlays: [
                        {
                            type: 'MARKER',
                            name: 'Marker Leipzig',
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
                            edit: false
                        }
                    ]
                }
            };
            testBlob = new Blob([JSON.stringify(testJson, null, 2)], { type: 'text/plain;charset=utf-8' });

            document.getElementsByClassName('bkgwebmap-jsonexportbutton')[0].dispatchEvent(new Event('click'));
            expect(saveAs).toHaveBeenCalled();
            expect(saveAs).toHaveBeenCalledWith(testBlob, 'BKG-WebMap.json');
            done();
        });
    });
});
