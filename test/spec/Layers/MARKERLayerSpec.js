describe('A suite for MARKER layers', function () {
    var layerConfig;
    beforeEach(function () {
        // Create DOM and map
        createDomMap();
    });
    it('creates MARKER layer', function (done) {
        layerConfig = {
            type: 'MARKER',
            name: 'Marker Layer',
            visibility: true,
            srsName: 'EPSG:4326',
            markers: [{
                coordinates: {
                    lat: 50.091176,
                    lon: 8.663281
                },
                content: '<p>Zentrale Dienststelle in Frankfurt am Main</p>'
            },
            {
                coordinates: {
                    lat: 51.354210,
                    lon: 12.374295
                },
                content: '<p>Außenstelle Leipzig</p>'
            }],
            minResolution: 0.0001,
            maxResolution: 156545,
            edit: false,
            export: false
        };

        layerTest(layerConfig, 'MARKER', done);
    });
});
