describe('A suite for searchCoordinates control', function () {
    var options;
    var controlName = 'searchCoordinates';
    var cssClass = 'bkgwebmap-searchcoordinates';
    var standardPosition = 'searchpanel';
    var searchCoordinates;
    var center;

    beforeEach(function () {
        // Create DOM
        createDomMap();
    });

    it('adds a searchCoordinates control inside panel', function (done) {
        // Create new control in panel
        options = {
            active: true,
            coordinateSystems: [
                {
                    epsg: 'EPSG:4326',
                    name: 'WGS84'
                }
            ]
        };
        createMap(controlName, options, null, function (map) {
            searchCoordinates = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
            searchCoordinates.runTest();
            done();
        });
    });

    it('adds a searchCoordinates control outside panel', function (done) {
        // Create new control outside panel
        options = {
            active: true,
            div: 'searchCoordinatesDiv',
            coordinateSystems: [
                {
                    epsg: 'EPSG:4326',
                    name: 'WGS84'
                }
            ]
        };
        createDomDivInBody(options.div);
        createMap(controlName, options, null, function (map) {
            searchCoordinates = new ControlInCustomDiv(map, controlName, cssClass, options, standardPosition);
            searchCoordinates.runTest();
            done();
        });
    });
    it('test zoom to coordinates', function (done) {
        // Create new control in panel
        options = {
            active: true,
            coordinateSystems: [
                {
                    epsg: 'EPSG:4326',
                    name: 'WGS84'
                }
            ]
        };
        createMap(controlName, options, null, function (map) {
            center = map.getView().getCenter();
            document.getElementsByClassName('bkgwebmap-searchcoordinateslon')[0].value = 0;
            document.getElementsByClassName('bkgwebmap-searchcoordinateslat')[0].value = 0;
            document.getElementsByClassName('bkgwebmap-searchcoordinatesbutton')[0].click();
            expect(map.getView().getCenter()).not.toEqual(center);
            done();
        });
    });
});
