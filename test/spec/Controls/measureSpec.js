describe('A suite for measure control', function () {
    var options;
    var controlName = 'measure';
    var cssClass = 'bkgwebmap-measure';
    var standardPosition = 'panel';
    var measure;

    beforeEach(function () {
        // Create DOM
        createDomMap();
    });

    it('adds a measure control inside panel', function (done) {
        // Create new control in panel
        options = {
            active: true
        };
        createMap(controlName, options, null, function (map) {
            measure = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
            measure.runTest();
            done();
        });
    });

    it('adds a measure control outside panel', function (done) {
        // Create new control outside panel
        options = {
            active: true,
            div: 'measureDiv'
        };
        createDomDivInBody(options.div);
        createMap(controlName, options, null, function (map) {
            measure = new ControlInCustomDiv(map, controlName, cssClass, options, standardPosition);
            measure.runTest();
            done();
        });
    });
});
