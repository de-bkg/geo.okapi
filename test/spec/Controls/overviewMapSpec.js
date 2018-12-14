describe('A suite for overviewMap control', function () {
    var options;
    var layers;
    var controlName = 'overviewMap';
    var cssClass = 'bkgwebmap-overviewmap';
    var standardPosition = 'bottom-right';
    var overviewMap;

    beforeEach(function () {
        // Create DOM
        createDomMap();
    });

    it('adds a overviewMap control to map', function (done) {
        // Create new control in map
        options = {
            active: true
        };

        createMap(controlName, options, null, function (map) {
            setTimeout(function () {
                overviewMap = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
                overviewMap.runTest();
                done();
            }, 500);
        });
    });

    it('adds a overviewMap control in custom div', function (done) {
        // Create new control outside map
        options = {
            active: true,
            div: 'overviewMap'
        };

        createDomDivInBody(options.div);
        createMap(controlName, options, null, function (map) {
            setTimeout(function () {
                overviewMap = new ControlInCustomDiv(map, controlName, cssClass, options, standardPosition);
                overviewMap.runTest();
                done();
            }, 500);
        });
    });
    it('test layers in overviewMap', function (done) {
        // Create new control in map
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

        createMap(controlName, options, layers, function (map) {
            setTimeout(function () {
                map.getControls().forEach(function (control) {
                    if (control instanceof BKGWebMap.Control.OverviewMap) {
                        overviewMap = control;
                    }
                });
                expect(map.getLayers().getArray()).toBe(overviewMap.om.getMap().getLayers().getArray());
                done();
            }, 500);
        });
    });
});
