function layerTest(layerConfig, type, callback) {
    new BKGWebMap.MapBuilder()
        .setLayers({ baseLayers: [{ type: 'NONE' }], overlays: [layerConfig] })
        .setControls({ tools: {} })
        .create(function (map) {
            var layerProperties;
            var layerType;
            var layerName;
            var layerVisibility;

            map.getLayers().forEach(function (layer) {
                if (layer instanceof BKGWebMap.Layer[type] && layer.getProperties()) {
                    layerProperties = layer.getProperties();
                    layerType = layerProperties.type;
                    layerName = layerProperties.name;
                    layerVisibility = layer.getVisible();
                }
                if (layer instanceof BKGWebMap.Layer.MARKER) {
                    expect(layer instanceof ol.layer.Vector).toBe(true);
                    expect(layer.getSource().getFeatures().length).toBe(layerConfig.markers.length);
                    // Create arrays with feature- and marker-content to compare
                    var i;
                    var markersContent = [];
                    var featuresContent = [];
                    for (i = 0; i < layerConfig.markers.length; i++) {
                        markersContent.push(layerConfig.markers[i].content);
                    }
                    for (i = 0; i < layer.getSource().getFeatures().length; i++) {
                        featuresContent.push(layer.getSource().getFeatures()[i].get('name'));
                    }
                    expect(featuresContent).toEqual(markersContent);
                }
            });
            expect(layerType).toBe(type);
            expect(layerName).toBe(layerConfig.name);
            expect(layerVisibility).toBeTruthy();
            callback();

        });
}

