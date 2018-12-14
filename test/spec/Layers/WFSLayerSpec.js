describe('A suite for WFS layers', function () {
    var layerConfig = {};
    layerConfig.wfs1_0_0 = {
        type: 'WFS',
        name: 'WFS Lines 1.0.0',
        id: 'lines1_0_0',
        visibility: true,
        url: 'https://web-mapping.com/geoserver/ows',
        typename: 'kurs:lines',
        srsName: 'EPSG:3857',
        version: '1.0.0'
    };

    layerConfig.wfs1_1_0 = {
        type: 'WFS',
        name: 'WFS Lines 1.1.0',
        id: 'lines1_1_0',
        visibility: true,
        url: 'https://web-mapping.com/geoserver/ows',
        typename: 'kurs:lines',
        srsName: 'EPSG:3857',
        version: '1.1.0'
    };

    layerConfig.wfs2_0_0 = {
        type: 'WFS',
        name: 'WFS Lines 2.0.0',
        id: 'lines2_0_0',
        visibility: true,
        url: 'https://web-mapping.com/geoserver/ows',
        typename: 'kurs:lines',
        srsName: 'EPSG:3857',
        version: '2.0.0'
    };
    beforeEach(function () {
        // Create DOM and map
        createDomMap();
    });
    it('test WFS layer 1.0.0', function (done) {
        layerTest(layerConfig.wfs1_0_0, 'WFS', done);
    });
    it('test WFS layer 1.1.0', function (done) {
        layerTest(layerConfig.wfs1_1_0, 'WFS', done);
    });
    it('test WFS layer 2.0.0', function (done) {
        layerTest(layerConfig.wfs2_0_0, 'WFS', done);
    });
});
