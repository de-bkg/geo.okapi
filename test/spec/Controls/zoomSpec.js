describe('A suite for zoom control', function () {
    var options;
    var controlName = 'zoom';
    var cssClass = 'bkgwebmap-zoom';
    var standardPosition = 'top-left';
    var zoom;

    function getZoomLevel() {
        return document.getElementsByClassName('bkgwebmap-zoomlevel')[0].innerText;
    }

    beforeEach(function () {
        // Create DOM
        createDomMap();
    });

    it('adds a zoom control to map', function (done) {
        options = {
            active: true,
            showZoomLevel: true,
            zoomToFullExtent: true,
            history: true,
            position: 'top-left',
            div: null,
            style: ''
        };
        // Create new control in map
        createMap(controlName, options, null, function (map) {
            zoom = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
            zoom.runTest();
            done();
        });
    });

    it('adds a zoom-control in custom div', function (done) {
        // Create new control outside map
        options = {
            active: true,
            showZoomLevel: true,
            zoomToFullExtent: true,
            history: true,
            div: 'zoomDiv'
        };

        createDomDivInBody(options.div);
        createMap(controlName, options, null, function (map) {
            zoom = new ControlInCustomDiv(map, controlName, cssClass, options, standardPosition);
            zoom.runTest();
            done();
        });
    });

    it('changes zoom level', function (done) {
        options = {
            active: true,
            showZoomLevel: true,
            zoomToFullExtent: true,
            history: true,
            position: 'top-left',
            style: ''
        };

        createMapView(controlName, options, null, function (map) {
            // Test zoom
            expect(getZoomLevel()).toBe('4');
            // Change zoom
            map.getView().setZoom(1);
            // Test zoom
            expect(getZoomLevel()).toBe('1');
            done();
        });
    });
});
