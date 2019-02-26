describe('A suite for geosearch control', function () {
    var options;
    var controlName = 'geoSearch';
    var cssClass = 'customgeosearch';
    var standardPosition = 'searchpanel';
    var geoSearch;
    var results;
    var attributeInfo;

    beforeEach(function () {
        // Create DOM and map
        createDomMap();
    });

    it('adds a geosearch control inside panel', function (done) {
        // Create new control in panel
        options = {
            active: true,
            style: cssClass,
            protocol: {},
            selectionFilter: {
                bbox: {}
            },
            reverseGeocoding: {}
        };
        createMap(controlName, options, null, function (map) {
            geoSearch = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
            geoSearch.runTest();

            // Input-Feld in a Container
            var input = document.getElementsByClassName('bkgwebmap-geosearchformdiv')[0].getElementsByTagName('input');
            expect(input.length).toBe(1);
            done();
        });
    });

    it('adds a geoSearch control outside panel', function (done) {
        // Create new control outside panel
        options = {
            active: true,
            div: 'customDiv',
            style: cssClass,
            protocol: {},
            selectionFilter: {
                bbox: {}
            },
            reverseGeocoding: {}
        };
        createDomDivInBody(options.div);
        createMap(controlName, options, null, function (map) {
            geoSearch = new ControlInCustomDiv(map, controlName, cssClass, options, standardPosition);
            // Run test
            geoSearch.runTest(options.length);
            done();
        });
    });

    it('test WFS protocol', function (done) {
        // Create new control in panel
        options = {
            active: true,
            style: cssClass,
            suggestCount: 5,
            resultsCount: 5,
            protocol: {
                type: 'wfs',
                url: 'http://sg.geodatenzentrum.de/wfs_vg250',
                featurePrefix: 'vg250',
                featureType: 'vg250_gem',
                searchAttribute: 'GEN',
                showAttributes: ['GEN', 'BEZ', 'ADE'],
                format: 'GML2'
            },
            reverseGeocoding: {}
        };
        createMap(controlName, options, null, function (map) {
            map.getLayers().forEach(function (layer) {
                if (layer instanceof ol.layer.Vector && layer.getProperties().uniqueId === 'geosearchlayer') {
                    layer.on('postcompose', function (evt) {
                        if (layer.getSource().getFeatures().length !== 0) {
                            expect(layer.getSource().getFeatures().length).toBe(5);
                            done();
                        }
                    });
                }
            });
            document.getElementsByClassName('bkgwebmap-reversegeosearchbutton')[0].click();
        });
    });

    it('test WFS protocol search and templates', function (done) {
        // Create new control in panel
        options = {
            active: true,
            style: cssClass,
            templateList: '<div class="geosearch-test">${GEN}</div>',
            suggestCount: 5,
            resultsCount: 5,
            protocol: {
                type: 'wfs',
                url: 'http://sg.geodatenzentrum.de/wfs_vg250',
                featurePrefix: 'vg250',
                featureType: 'vg250_gem',
                searchAttribute: 'GEN',
                showAttributes: ['GEN', 'BEZ', 'ADE'],
                format: 'GML2'
            },
            reverseGeocoding: {}
        };

        createMap(controlName, options, null, function (map) {
            map.getLayers().forEach(function (layer) {
                if (layer instanceof ol.layer.Vector && layer.getProperties().uniqueId === 'geosearchlayer') {
                    layer.on('postcompose', function (evt) {
                        if (layer.getSource().getFeatures().length !== 0) {
                            expect(layer.getSource().getFeatures().length).toBe(3);
                            if (document.getElementsByClassName('bkgwebmap-geosearchresulttable').length) {
                                results = document.getElementsByClassName('bkgwebmap-geosearchresulttable')[0].getElementsByTagName('td');
                                for (var i = 0; i < results.length; i++) {
                                    attributeInfo = results[i].getElementsByClassName('geosearch-test')[0].innerHTML;
                                    expect(attributeInfo.indexOf('Berlin')).not.toBe(-1);
                                }
                                done();
                            }
                        }
                    });
                }
            });
            document.getElementsByClassName('bkgwebmap-geosearchform')[0].value = 'Berlin';
            document.getElementsByClassName('bkgwebmap-reversegeosearchbutton')[0].click();
        });
    });

    it('test geosearch protocol', function (done) {
        // Create new control in panel
        options = {
            active: true,
            style: cssClass,
            templateList: '<div class="geosearch-test">${text}</div>',
            suggestCount: 5,
            resultsCount: 5,
            protocol: {
                type: 'ortssuche',
                url: 'http://sg.geodatenzentrum.de/gdz_ortssuche'
            },
            reverseGeocoding: {
                active: false
            }
        };
        createMap(controlName, options, null, function (map) {
            map.getLayers().forEach(function (layer) {
                if (layer instanceof ol.layer.Vector && layer.getProperties().uniqueId === 'geosearchlayer') {
                    layer.on('postcompose', function (evt) {
                        if (layer.getSource().getFeatures().length !== 0) {
                            expect(layer.getSource().getFeatures().length).toBe(4);
                            if (document.getElementsByClassName('bkgwebmap-geosearchresulttable').length) {
                                results = document.getElementsByClassName('bkgwebmap-geosearchresulttable')[0].getElementsByTagName('td');
                                for (var i = 0; i < results.length; i++) {
                                    attributeInfo = results[i].getElementsByClassName('geosearch-test')[0].innerHTML;
                                    expect(attributeInfo.indexOf('Berlin')).not.toBe(-1);
                                }
                                done();
                            }
                        }
                    });
                }
            });
            var input = document.getElementsByClassName('bkgwebmap-geosearchform')[0];
            input.value = 'Berlin';
            var keyboardEvent = new Event('keydown');
            keyboardEvent.initEvent('keydown', true, false);
            Object.defineProperty(keyboardEvent, 'key', { value: 'Enter' });
            input.dispatchEvent(keyboardEvent);
        });
    });
});
