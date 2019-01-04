describe('A suite for BKG layers', function () {

    it('tests BKG layer configuration from Registry', function (done) {
        var url = 'https://sg.geodatenzentrum.de/gdz_service_registry/webmap/services/webatlasde_light?srsname=EPSG:25832';

        var expected = {
            "type":"WMTS",
            "name":"Web Map Tile Service WebAtlasDE.light",
            "url":"wmts_webatlasde.light/1.0.0/WMTSCapabilities.xml",
            "layer":"webatlasde.light",
            "matrixSet":"DE_EPSG_25832_LIGHT",
            "srsName":"EPSG:25832",
            "visibility":true
        };

        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.onreadystatechange = function (args) {
            if (this.readyState == this.DONE) {
                var result = JSON.parse(this.responseText);

                for (var key in expected) {
                    expect(result[key]).toEqual(expected[key]);
                }

                done();
            }
        };
        request.send();
    });
});
