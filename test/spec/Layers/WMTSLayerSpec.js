describe('A suite for WMTS layers', function () {
    var layerConfig;
    beforeEach(function () {
        // Create DOM and map
        createDomMap();
    });
    it('creates WMTS layer', function (done) {
        layerConfig = {
            type: 'WMTS',
            name: 'WMTS layer',
            url: 'http://sg.geodatenzentrum.de/wmts_webatlasde.light',
            layer: 'webatlasde.light',
            matrixSet: 'DE_EPSG_25832_LIGHT',
            format: 'image/png',
            visibility: true,
            srsName: 'EPSG:25832',
            style: 'default',
            tileGrid: {
                origin: [-46133.17, 6301219.54],
                resolutions: [4891.969810252, 2445.984905126, 1222.9924525615997, 611.4962262807999, 305.74811314039994, 152.87405657047998, 76.43702828523999, 38.21851414248, 19.109257071295996, 9.554628535647998, 4.777314267823999],
                matrixIds: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10']
            },
            wrapX: true
        };
        layerTest(layerConfig, 'WMTS', done);
    });
});
