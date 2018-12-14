describe('A suite for timeslider control', function () {
    var options;
    var layer;
    var layers;
    var paramsBefore;
    var paramsAfter;
    var controlName = 'timeSlider';
    var cssClass = 'bkgwebmap-timeslider';
    var standardPosition = 'bottom-right';
    var timeslider;

    beforeEach(function () {
        // Create DOM
        createDomMap();
    });

    it('adds a timeslider control to map', function (done) {
        // Create new control in map
        options = {
            active: true
        };

        createMap(controlName, options, null, function (map) {
            timeslider = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
            timeslider.runTest();
            done();
        });
    });

    it('adds a timeslider control in custom div', function (done) {
        // Create new control outside map
        options = {
            active: true,
            div: 'timeslider'
        };

        createDomDivInBody(options.div);
        createMap(controlName, options, null, function (map) {
            timeslider = new ControlInCustomDiv(map, controlName, cssClass, options, standardPosition);
            timeslider.runTest();
            done();
        });
    });
    it('test default params', function (done) {
        // Create new control in map
        options = {
            active: true
        };

        layers = {
            baseLayers: [
                {
                    type: 'NONE'
                }
            ],
            overlays: [
                {
                    type: 'WMS',
                    name: 'Berlin',
                    tiles: false,
                    url: 'https://web-mapping.com/geoserver/bkg/wms',
                    visibility: true,
                    layers: [{
                        name: 'Time Points Layer',
                        layer: 'time_points'
                    }],
                    time: {
                        active: true
                    }
                }
            ]
        };

        createMap(controlName, options, layers, function () {
            var valueTimeSliderInput = document.getElementsByClassName('bkgwebmap-timesliderinput')[0].value;
            expect(valueTimeSliderInput).toBe('0');
            var valueTimeSliderOutput = document.getElementsByClassName('bkgwebmap-timeslidervalue')[0].innerHTML;
            expect(valueTimeSliderOutput).toContain('10.3.2016');
            expect(document.getElementsByClassName('bkgwebmap-timesliderperiod')[0].disabled).not.toBeTruthy();
            done();
        });
    });
    it('test config params', function (done) {
        // Create new control in map
        options = {
            active: true
        };

        layers = {
            baseLayers: [
                {
                    type: 'NONE'
                }
            ],
            overlays: [
                {
                    type: 'WMS',
                    name: 'Berlin',
                    tiles: false,
                    url: 'https://web-mapping.com/geoserver/bkg/wms',
                    visibility: true,
                    layers: [{
                        name: 'Time Points Layer',
                        layer: 'time_points'
                    }],
                    time: {
                        active: true,
                        values: '2016-03-10/2016-03-15/P1D',
                        mode: 'time',
                        default: '2016-03-12'
                    }
                }
            ]
        };

        createMap(controlName, options, layers, function () {
            var valueTimeSliderInput = document.getElementsByClassName('bkgwebmap-timesliderinput')[0].value;
            expect(valueTimeSliderInput).toBe('2');
            var valueTimeSliderOutput = document.getElementsByClassName('bkgwebmap-timeslidervalue')[0].innerHTML;
            expect(valueTimeSliderOutput).toContain('12.3.2016');
            expect(document.getElementsByClassName('bkgwebmap-timesliderperiod')[0].disabled).toBeTruthy();
            done();
        });
    });
    it('test update params WMS', function (done) {
        // Create new control in map
        options = {
            active: true
        };

        layers = {
            baseLayers: [
                {
                    type: 'NONE'
                }
            ],
            overlays: [
                {
                    type: 'WMS',
                    name: 'Berlin',
                    tiles: false,
                    url: 'https://web-mapping.com/geoserver/bkg/wms',
                    visibility: true,
                    layers: [{
                        name: 'Time Points Layer',
                        layer: 'time_points'
                    }],
                    time: {
                        active: true,
                        values: '2016-03-10T23:00:00.000Z,2016-03-15T23:00:00.000Z'
                    }
                }
            ]
        };

        createMap(controlName, options, layers, function (map) {
            map.getLayers().forEach(function (singleLayer) {
                if (singleLayer instanceof BKGWebMap.Layer.ImageWMS || singleLayer instanceof BKGWebMap.Layer.TileWMS) {
                    layer = singleLayer;
                }
            });
            document.getElementsByClassName('bkgwebmap-timesliderinput')[0].value = 0;
            document.getElementsByClassName('bkgwebmap-timesliderinput')[0].dispatchEvent(new Event('change'));
            paramsBefore = layer.getSource().getParams().TIME;
            document.getElementsByClassName('bkgwebmap-timesliderinput')[0].value = 1;
            document.getElementsByClassName('bkgwebmap-timesliderinput')[0].dispatchEvent(new Event('change'));
            paramsAfter = layer.getSource().getParams().TIME;
            expect(paramsBefore).not.toBe(paramsAfter);
            done();
        });
    });
});
