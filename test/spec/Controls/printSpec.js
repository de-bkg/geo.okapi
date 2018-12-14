describe('A suite for print control', function () {
    var options;
    var controlName = 'print';
    var cssClass = 'bkgwebmap-print';
    var standardPosition = 'sharepanel';
    var print;

    beforeEach(function () {
        // Create DOM and map
        createDomMap();
        spyOn(window, 'print');
    });

    it('adds a print control inside share-panel', function (done) {
        options = {
            active: true,
            print: {
                active: true,
                stylesheet: ''
            }
        };

        createMap('share', options, null, function (map) {
            print = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
            print.runTest();
            done();
        });
    });
    it('test if window method print was fired', function (done) {
        options = {
            active: true,
            print: {
                active: true,
                stylesheet: ''
            }
        };
        createMap('share', options, null, function (map) {
            document.getElementsByClassName('bkgwebmap-printmapbutton')[0].dispatchEvent(new Event('click'));
            expect(window.print).toHaveBeenCalled();
            done();
        });
    });
});
