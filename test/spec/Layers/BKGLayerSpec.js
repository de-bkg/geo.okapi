describe('A suite for BKG layers', function () {
    var layerConfig;

    beforeEach(function () {
        // Create DOM and map
        createDomMap();
    });

    afterEach(function () {
        localStorage.clear();
    });
    
    it('creates BKG layer', function (done) {
        layerConfig = {
            type: 'BKG',
            name: 'WebAtlasDE',
            ref: 'webatlasde_light',
            visibility: true,
            minResolution: 0.0001,
            maxResolution: 156545
        };

        new BKGWebMap.MapBuilder()
            .setLayers({ baseLayers: [{ type: 'NONE' }], overlays: [layerConfig] })
            .setControls({ tools: {} })
            .create(function (map) {
                map.getLayers().forEach(function (layer) {
                    if (layer.getProperties() && layer.getProperties().hasOwnProperty('originalConfig') && layer.getProperties().originalConfig.bkg) {
                        expect(layer.getVisible()).toBeTruthy();
                        done();
                    }
                });
            });
    });
});
