/**
 * Create PermaLink Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_permaLink}
 */
BKGWebMap.Control.createPermaLink = function () {
    return function (map) {
        var _this = this;

        // Use property 'active' to check later if control is activated. We need to add later the layers.
        this.active = true;

        var layersInHash;
        this.readLayersFromPermaLink = false;

        var mapProjection = map.getView().getProjection().getCode();
        var shouldUpdate = true;

        function replaceMultipleKeys(hash, keys) {
            for (var i = 0; i < keys.length; i++) {
                hash = hash.replace(keys[i], '');
            }
            return hash;
        }

        if (window.location.hash !== '') {
            var keysToReplace = ['#lat=', 'lon=', 'zoom='];
            var hash = replaceMultipleKeys(window.location.hash, keysToReplace);
            var parts = hash.split('&');
            if (parts.length >= 3) {
                var zoom = parseInt(parts[2], 10);
                var center = ol.proj.transform([parseFloat(parts[1]), parseFloat(parts[0])], 'EPSG:4326', mapProjection);
                map.getView().setZoom(zoom);
                map.getView().setCenter(center);
            }
            if (parts.length > 3) {
                _this.readLayersFromPermaLink = true;
                layersInHash = '&' + parts.slice(3).join('&');
            }
        }

        function updatePermalink() {
            if (!shouldUpdate) {
                shouldUpdate = true;
                return;
            }

            var newCenter = map.getView().getCenter();
            var center4326 = ol.proj.transform(newCenter, mapProjection, 'EPSG:4326');
            var lon = center4326[0].toFixed(4);
            var lat = center4326[1].toFixed(4);
            var newZoom = map.getView().getZoom();

            var newHash = '#lat=' + lat + '&lon=' + lon + '&zoom=' + newZoom;
            if (layersInHash) {
                newHash += layersInHash;
            }
            var state = {
                center: newCenter,
                zoom: newZoom,
                layers: layersInHash
            };
            window.history.pushState(state, 'BKG_permaLink', newHash);
        }

        function constructLayersHash(layer) {
            if (layer.getProperties().customLayer || !layer.getProperties().id) {
                return '';
            }
            var id = layer.getProperties().id;
            var visible = layer.getVisible();
            var layerHash = '&' + id + '=' + visible;
            return layerHash;
        }

        // Change layer order and visibility in permalink
        this.changeLayersInPermalink = function () {
            var layersHash = '';
            var singleHash = '';
            map.getLayers().forEach(function (layer) {
                singleHash = constructLayersHash(layer);
                layersHash += singleHash;
                if (layer instanceof ol.layer.Group) {
                    layer.getLayers().forEach(function (layerInGroup) {
                        singleHash = constructLayersHash(layerInGroup);
                        layersHash += singleHash;
                    });
                }
            });
            layersInHash = layersHash;
            updatePermalink();
        };

        // Change layer order in group layer
        function changeGroupOrder(hashParts, groupLayer) {
            var subLayersArray = groupLayer.getLayers().getArray();
            var newSubLayersAray = [];
            var hashPartsTemp;
            for (var i = 1; i < hashParts.length; i++) {
                hashPartsTemp = hashParts[i].split('=');
                for (var k = subLayersArray.length - 1; k >= 0; k--) {
                    if (subLayersArray[k].getProperties().id && subLayersArray[k].getProperties().id === hashPartsTemp[0]) {
                        var visible = (hashPartsTemp[1] === 'true');
                        subLayersArray[k].setVisible(visible);
                        newSubLayersAray.push(subLayersArray[k]);
                        subLayersArray.splice(k, 1);
                    }
                }
            }
            newSubLayersAray = subLayersArray.concat(newSubLayersAray);
            var newCollection = new ol.Collection(newSubLayersAray);
            groupLayer.setLayers(newCollection);
            return groupLayer;
        }

        /**
         * Change layer order using permalink parameteres
         * @param layers
         * @returns {{baseLayers: Array, overlays: Array}}
         */
        this.changeLayersOrder = function (layers) {
            var newLayers = {
                baseLayers: [],
                overlays: []
            };
            var hashParts = layersInHash.split('&');
            var hashPartsTemp;
            var visible;
            for (var i = hashParts.length - 1; i >= 0; i--) {
                hashPartsTemp = hashParts[i].split('=');
                for (var k = layers.overlays.length - 1; k >= 0; k--) {
                    if (layers.overlays[k] && layers.overlays[k].getProperties().id && layers.overlays[k].getProperties().id === hashPartsTemp[0]) {
                        if (layers.overlays[k] instanceof ol.layer.Group) {
                            layers.overlays[k] = changeGroupOrder(hashParts, layers.overlays[k]);
                        }
                        visible = (hashPartsTemp[1] === 'true');
                        layers.overlays[k].setVisible(visible);
                        newLayers.overlays.push(layers.overlays[k]);
                        layers.overlays.splice(k, 1);
                    }
                }

                for (var j = layers.baseLayers.length - 1; j >= 0; j--) {
                    if (layers.baseLayers[j] && layers.baseLayers[j].getProperties().id && layers.baseLayers[j].getProperties().id === hashPartsTemp[0]) {
                        visible = (hashPartsTemp[1] === 'true');
                        layers.baseLayers[j].setVisible(visible);
                        newLayers.baseLayers.push(layers.baseLayers[j]);
                        layers.baseLayers.splice(j, 1);
                    }
                }
            }
            newLayers.overlays = layers.overlays.concat(newLayers.overlays);
            newLayers.baseLayers = layers.baseLayers.concat(newLayers.baseLayers);
            return newLayers;
        };

        map.on('moveend', updatePermalink);

        window.addEventListener('popstate', function (event) {
            if (event.state === null) {
                return;
            }
            map.getView().setCenter(event.state.center);
            map.getView().setZoom(event.state.zoom);
            shouldUpdate = false;
        });
    };
};
