describe('A suite for showCoordinates control', function () {
    var options;
    var controlName = 'showCoordinates';
    var cssClass = 'bkgwebmap-showcoordinates';
    var standardPosition = 'bottom-right';
    var showCoordinates;

    beforeEach(function () {
        // Create DOM
        createDomMap();
    });

    it('adds a showCoordinates control to map', function (done) {
        // Create new control in map
        options = {
            active: true,
            position: 'bottom-right',
            coordinateSystems: [
                {
                    epsg: 'EPSG:4326',
                    name: 'WGS84'
                }
            ],
            style: ''
        };

        createMap(controlName, options, null, function (map) {
            showCoordinates = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
            showCoordinates.runTest();
            done();
        });
    });

    it('adds a showCoordinates control in custom div', function (done) {
        // Create new control outside map
        options = {
            active: true,
            coordinateSystems: [
                {
                    epsg: 'EPSG:4326',
                    name: 'WGS84'
                }
            ],
            div: 'schowCoordinatesDiv',
            style: ''
        };

        createDomDivInBody(options.div);
        createMap(controlName, options, null, function (map) {
            showCoordinates = new ControlInCustomDiv(map, controlName, cssClass, options, standardPosition);
            showCoordinates.runTest();
            done();
        });
    });
});
