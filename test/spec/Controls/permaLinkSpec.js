describe('A suite for permalink', function () {
    var options;
    var hash;
    var layers;
    var lonURL = '9.9670';
    var latURL = '51.5825';
    var zoom = 10;


    beforeEach(function () {
        // Create DOM
        createDomMap();
    });

    it('test url permalink is disabled', function (done) {
        options = {
            active: true,
            print: {
                active: false
            },
            permaLink: {
                active: false
            },
            jsonExport: {
                active: false
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
                    id: 'csvLayer',
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

        createMap('share', options, layers, function () {
            hash = window.location.hash;
            expect(hash).not.toMatch(/lon/);
            expect(hash).not.toMatch(/lat/);
            expect(hash).not.toMatch(/zoom/);
            expect(hash).not.toMatch(/csvLayer/);
            done();
        });
    });

    it('test url permalink active', function (done) {
        options = {
            active: true,
            print: {
                active: false
            },
            permaLink: {
                active: true
            },
            jsonExport: {
                active: false
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
                    id: 'csvLayer',
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

        createMapView('share', options, layers, function () {
            hash = window.location.hash;
            expect(hash).toMatch(/lon=0/);
            expect(hash).toMatch(/lat=0/);
            expect(hash).toMatch(/zoom=4/);
            expect(hash).toMatch(/csvLayer=true/);
            done();
        });
    });
    it('test load url', function (done) {
        window.location.hash = 'lat=' + latURL + '&lon=' + lonURL + '&zoom=' + zoom;

        options = {
            active: true,
            print: {
                active: false
            },
            permaLink: {
                active: true
            },
            jsonExport: {
                active: false
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
                    id: 'csvLayer',
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

        createMap('share', options, layers, function (map) {
            var mapProjection = map.getView().getProjection().getCode();
            var mapCenter = ol.proj.transform(map.getView().getCenter(), mapProjection, 'EPSG:4326');
            var lonMap = mapCenter[0].toFixed(4);
            var latMap = mapCenter[1].toFixed(4);

            expect(lonMap).toBe(lonURL);
            expect(latMap).toBe(latURL);
            // Zoom
            expect(map.getView().getZoom()).toBe(zoom);
            done();
        });
    });
});
