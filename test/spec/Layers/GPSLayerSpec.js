describe('A suite for GPS layers', function () {
    var layerConfig;
    beforeEach(function () {
        // Create DOM and map
        createDomMap();
    });
    it('creates GPS layer from .gpx', function (done) {
        layerConfig = {
            type: 'GPS',
            name: 'GPS Layer',
            url: 'Frankfurt.gpx',
            visibility: true,
            minResolution: 0.0001,
            maxResolution: 156545,
            edit: false,
            export: false
        };

        layerTest(layerConfig, 'GPS', done);
    });
});
