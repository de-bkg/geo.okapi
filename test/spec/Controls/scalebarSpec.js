describe('A suite for scalebar control', function () {
    var options;
    var layers;
    var controlName = 'scalebar';
    var cssClass = 'bkgwebmap-scalebar';
    var standardPosition = 'bottom-right';
    var scalebar;

    function getScaleValue() {
        return document.getElementsByClassName('bkgwebmap-scalevalue')[0].innerText;
    }


    beforeEach(function () {
        // Create DOM
        createDomMap();
    });

    it('adds a scalebar control to map', function (done) {
        // Create new control in map
        options = {
            active: true,
            position: 'bottom-right',
            scalebarType: 'mapscaleDistance'
        };

        createMap(controlName, options, null, function (map) {
            scalebar = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
            scalebar.runTest();
            done();
        });
    });

    it('adds a scalebar control in custom div', function (done) {
        // Create new control outside map
        options = {
            active: true,
            div: 'scalebar',
            scalebarType: 'mapscaleDistance'
        };

        createDomDivInBody(options.div);
        createMap(controlName, options, null, function (map) {
            scalebar = new ControlInCustomDiv(map, controlName, cssClass, options, standardPosition);
            scalebar.runTest();
            done();
        });
    });
    it('test scale value', function (done) {
        // Create new control in map
        options = {
            active: true
        };

        layers = {
            baseLayers: [
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
            ],
            overlays: []
        };

        createMap(controlName, options, layers, function () {
            setTimeout(function () {
                expect(getScaleValue()).toMatch(/1 : /);
                done();
            }, 3000);
        });
    });
});
