describe('A suite for showAttributes control', function () {
    var options;
    var controlName = 'showAttributes';
    var cssClass = 'bkgwebmap-showattributes';
    var standardPosition = 'infopanel';
    var showAttributes;

    beforeEach(function () {
        // Create DOM
        createDomMap();
    });

    it('adds a showAttributes control inside panel', function (done) {
        // Create new control in panel
        options = {
            active: true
        };

        createMap(controlName, options, null, function (map) {
            showAttributes = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
            showAttributes.runTest();
            done();
        });
    });

    it('adds a showAttributes-control outside panel', function (done) {
        // Create new control outside panel
        var options = {
            active: true,
            div: 'showAttributesDiv'
        };
        createDomDivInBody(options.div);
        createMap(controlName, options, null, function (map) {
            showAttributes = new ControlInCustomDiv(map, controlName, cssClass, options, standardPosition);
            showAttributes.runTest();
            done();
        });
    });
});
