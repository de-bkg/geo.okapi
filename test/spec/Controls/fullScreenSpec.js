describe('A suite for fullScreen control', function () {
    var options;
    var controlName = 'fullScreen';
    var cssClass = 'custom-fullscreen';
    var standardPosition = 'top-right';
    var fullscreen;

    beforeEach(function () {
        // Create DOM
        createDomMap();
    });

    it('adds a fullscreen control to map', function (done) {
        // Create new control in map
        options = {
            active: true,
            style: cssClass
        };

        createMap(controlName, options, null, function (map) {
            fullscreen = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
            fullscreen.runTest(2);
            done();
        });
    });

    it('adds a fullscreen control in custom div', function (done) {
        // Create new control outside map
        options = {
            active: true,
            div: 'fullScreenDiv',
            style: cssClass
        };

        createDomDivInBody(options.div);
        createMap(controlName, options, null, function (map) {
            fullscreen = new ControlInCustomDiv(map, controlName, cssClass, options, standardPosition);
            fullscreen.runTest(2);
            done();
        });
    });
});
