describe('A suite for copyCoordinates control', function () {
    var options;
    var controlName = 'copyCoordinates';
    var cssClass = 'bkgwebmap-copycoordinates';
    var standardPosition = 'infopanel';
    var copyCoordinates;


    beforeEach(function () {
        // Create DOM
        createDomMap();
    });

    it('adds a copyCoordinates control inside panel', function (done) {
        // Create new control inside panel
        options = {
            active: true,
            coordinateSystems: [
                {
                    epsg: 'EPSG:4326',
                    name: 'WGS84'
                }
            ],
            div: null,
            style: ''
        };

        createMap(controlName, options, null, function (map) {
            copyCoordinates = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
            copyCoordinates.runTest();
            done();
        });
    });

    it('adds a copyCoordinates control outside panel', function (done) {
        // Create new control outside panel
        options = {
            active: true,
            coordinateSystems: [
                {
                    epsg: 'EPSG:4326',
                    name: 'WGS84'
                }
            ],
            div: 'copyCoordinatesDiv',
            style: ''
        };
        createDomDivInBody(options.div);
        createMap(controlName, options, null, function (map) {
            copyCoordinates = new ControlInCustomDiv(map, controlName, cssClass, options, standardPosition);
            copyCoordinates.runTest();
            done();
        });
    });
});
