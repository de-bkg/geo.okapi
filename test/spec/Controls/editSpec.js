describe('A suite for edit control', function () {
    var options;
    var controlName = 'edit';
    var cssClass = 'bkgwebmap-editpanel';
    var standardPosition = 'panel';
    var edit;

    beforeEach(function () {
        // Create DOM
        createDomMap();
    });

    it('adds an edit control inside panel', function (done) {
        // Create new control in panel
        options = {
            active: true,
            export: {
                active: true,
                formats: ['GEOJSON', 'GML', 'GPX', 'KML', 'WKT']
            }
        };

        createMap(controlName, options, null, function (map) {
            edit = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
            edit.runTest();
            done();
        });
    });

    it('adds a edit-control outside panel', function (done) {
        // Create new control outside panel
        options = {
            active: true,
            div: 'editDiv',
            export: {
                active: true,
                formats: ['GEOJSON', 'GML', 'GPX', 'KML', 'WKT']
            }
        };
        createDomDivInBody(options.div);
        createMap(controlName, options, null, function (map) {
            edit = new ControlInCustomDiv(map, controlName, cssClass, options, standardPosition);
            edit.runTest();
            done();
        });
    });
});
