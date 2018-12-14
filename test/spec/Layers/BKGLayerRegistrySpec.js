describe('A suite for BKG layers', function () {
    var url;
    var response;
    var request;
    it('tests BKG layer configuration from Registry', function (done) {
        url = 'https://sg.geodatenzentrum.de/gdz_service_registry/webmap/services/webatlasde_light?srsname=EPSG:25832';
        response = '{"type":"WMTS","name":"Web Map Tile Service WebAtlasDE.light","url":"wmts_webatlasde.light/1.0.0/WMTSCapabilities.xml","layer":"webatlasde.light","matrixSet":"DE_EPSG_25832_LIGHT","srsName":"EPSG:25832","visibility":true}';
        request = new XMLHttpRequest();
        request.open('GET', url);
        request.onreadystatechange = function (args) {
            if (this.readyState == this.DONE) {
                expect(this.responseText).toContain(response);
                done();
            }
        };
        request.send();
    });
});
