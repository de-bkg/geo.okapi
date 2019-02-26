describe('A suite for copyright control', function () {

    var options;
    var controlName = 'copyright';
    var cssClass = 'bkgwebmap-copyright';
    var standardPosition = 'bottom-left';
    var copyright;
    var layers;

    beforeEach(function () {
        // Create DOM and map
        createDomMap();
    });

    it('adds a copyright control to map', function (done) {
        // Create new control in map
        new BKGWebMap.MapBuilder()
            .setLayers({ baseLayers: [{ type: 'NONE' }], overlays: [] })
            .setControls({
                tools: {
                    copyright: { active: true, position: 'bottom-left' }
                }
            })
            .create(function (map) {
                var controlPresent = false;
                map.getControls().forEach(function (control) {
                    if (control instanceof BKGWebMap.Control['Copyright']) {
                        controlPresent = true;
                    }
                });
                expect(controlPresent).toBe(true);

                // Container-Div is added
                var container = document.getElementsByClassName('bkgwebmap-copyright');
                expect(container.length).toBe(1);

                // Container is in standard position
                var elements = document.getElementsByClassName('bkgwebmap-position-bottom-left')[0].getElementsByClassName('bkgwebmap-copyright');
                expect(elements.length).toBe(1);

                done();
            });
    });

    it('adds a copyright control in custom div', function (done) {
        // Create new control outside map
        var options = {
            active: true,
            div: 'copyright'
        };

        createDomDivInBody(options.div);
        createMap(controlName, options, null, function (map) {
            copyright = new ControlInCustomDiv(map, controlName, cssClass, options, standardPosition);
            copyright.runTest();
            done();
        });
    });
    it('test copyright info', function (done) {
        // Create new control in map
        options = {
            active: true
        };
        layers = {
            baseLayers: [
                {
                    type: 'BKG',
                    name: 'WebAtlasDE',
                    ref: 'webatlasde_light',
                    visibility: true,
                    minResolution: 0.0001,
                    maxResolution: 156545
                }
            ],
            overlays: []
        };

        createMap(controlName, options, layers, function (map) {
            var copyrightListItems = document.getElementsByClassName('bkgwebmap-copyrightlistitem').length;
            expect(copyrightListItems).not.toBe(0);
            done();
        });
    });
});
