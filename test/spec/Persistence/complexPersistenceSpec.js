describe('A suite for complexe persistence', function () {
    var map;
    var configJSON;

    beforeEach(function (done) {
        window.sessionStorage.setItem('bkgwebmap', mockConfigJSON);
        createDomMap();
        new BKGWebMap.MapBuilder()
            .create(function (data) {
                map = data;
                done();
            });
    });

    it('updates BKG WebMap using a configuration JSON', function () {
        // Collect map info
        configJSON = JSON.parse(mockConfigJSON);

        var mapCenter = map.getView().getCenter();
        var lonMap = Number(mapCenter[0].toFixed(2));
        var latMap = Number(mapCenter[1].toFixed(2));

        // Definition of map center in JSON
        var lonJSON = Number(configJSON.map.center.lon.toFixed(2));
        var latJSON = Number(configJSON.map.center.lat.toFixed(2));
        // Layer count in JSON
        var layerCount = configJSON.layers.baseLayers.length + configJSON.layers.overlays.length;

        // Map center
        expect(lonMap).toBe(lonJSON);
        expect(latMap).toBe(latJSON);
        // Zoom
        expect(map.getView().getZoom()).toBe(configJSON.map.zoom);
        // Count layers
        expect(map.getLayers().getArray().length).toBe(layerCount);
        // Custom vector layer
        expect(map.getLayers().getArray()[0] instanceof ol.layer.Vector).toBe(true);
        // Custom vector layer source
        expect(map.getLayers().getArray()[0].getSource() instanceof ol.source.Vector).toBe(true);
    });
});
