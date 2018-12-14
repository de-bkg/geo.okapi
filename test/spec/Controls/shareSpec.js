describe('A suite for share control', function () {
    var options;
    var controlName = 'share';
    var cssClass = 'bkgwebmap-sharepanel';
    var standardPosition = 'panel';
    var share;

    beforeEach(function () {
        // Create DOM and map
        createDomMap();
    });

    it('adds a share control inside panel', function (done) {
        // Create new control in panel
        options = {
            active: true,
            print: {
                active: true
            }
        };

        createMap(controlName, options, null, function (map) {
            share = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
            share.runTest();
            done();
        });
    });

    it('adds a share-control outside panel', function (done) {
        // Create new control outside panel
        options = {
            active: true,
            div: 'shareDiv'
        };

        createDomDivInBody(options.div);
        createMap(controlName, options, null, function (map) {
            share = new ControlInCustomDiv(map, controlName, cssClass, options, standardPosition);
            share.runTest();
            done();
        });
    });
});
