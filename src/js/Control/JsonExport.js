/**
 * Create JsonExport Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_jsonExport}
 */
BKGWebMap.Control.createJsonExport = function () {
    return function (map, options, panel) {
        options = options || {};

        var appName = BKGWebMap.CONTROLS.tools.share.jsonExport.appName;
        if ((typeof options.appName === 'string' || options.appName instanceof String) && options.appName !== '') {
            appName = options.appName;
        }

        var target;
        if (panel.element) {
            target = panel.element.getElementsByClassName('bkgwebmap-sharepanelcontent')[0];
        } else {
            target = panel.getElementsByClassName('bkgwebmap-sharepanelcontent')[0];
        }

        var jsonExport = document.createElement('div');
        jsonExport.className = 'bkgwebmap-jsonexport';

        var exportButton = document.createElement('button');
        exportButton.className = 'bkgwebmap-jsonexportbutton';
        exportButton.innerHTML = 'Konfigurationsdatei exportieren';
        jsonExport.appendChild(exportButton);

        var importDiv = document.createElement('div');
        importDiv.className = 'bkgwebmap-jsonimportfilediv';
        jsonExport.appendChild(importDiv);

        var importButtonLabel = document.createElement('label');
        importButtonLabel.className = 'bkgwebmap-jsonimportfilelabel';
        importButtonLabel.innerHTML = 'Konfigurationsdatei importieren';
        jsonExport.appendChild(importButtonLabel);

        var importButton = document.createElement('input');
        importButton.className = 'bkgwebmap-jsonimportbutton';
        importButton.setAttribute('type', 'file');
        importButton.setAttribute('accept', '.json');

        importButtonLabel.appendChild(importButton);

        // Read configuration from layer properties
        function getLayersConfig(layer) {
            if (layer.getProperties().originalConfig) {
                return layer.getProperties().originalConfig;
            }
        }

        // Create configuration for custom layers
        function getCustomLayer(layer) {
            var singleLayerConfig;

            if (layer instanceof BKGWebMap.Layer.CSV || layer instanceof BKGWebMap.Layer.XLS || layer instanceof BKGWebMap.Layer.GPS) {
                var visible = false;
                var name = 'Custom Layer';
                var style = '';
                var features = layer.getSource().getFeatures();
                var format = new ol.format.GeoJSON();
                var geojson = format.writeFeatures(features, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: map.getView().getProjection().getCode()
                });
                geojson = JSON.parse(geojson);
                if (BKGWebMap.Util.hasNestedProperty(layer.getProperties(), 'originalConfig.visibility')) {
                    visible = layer.getProperties().originalConfig.visibility;
                }
                if (BKGWebMap.Util.hasNestedProperty(layer.getProperties(), 'originalConfig.name')) {
                    name = layer.getProperties().originalConfig.name;
                }
                if (BKGWebMap.Util.hasNestedProperty(layer.getProperties(), 'originalConfig.styleName')) {
                    style = layer.getProperties().originalConfig.styleName;
                }
                singleLayerConfig = {
                    type: 'VECTOR',
                    name: name,
                    visibility: visible,
                    style: style,
                    features: geojson
                };
            } else {
                singleLayerConfig = getLayersConfig(layer);
            }
            return singleLayerConfig;
        }

        // Create layers configuration
        function getLayers() {
            var layers = {
                baseLayers: [],
                overlays: []
            };
            map.getLayers().forEach(function (layer) {
                var singleLayerConfig = getLayersConfig(layer);
                if (layer.getProperties().isBaseLayer === true) {
                    layers.baseLayers.push(singleLayerConfig);
                } else if (layer.getProperties().isBaseLayer === false) {
                    if (BKGWebMap.Util.hasNestedProperty(layer.getProperties(), 'customLayer') && layer.getProperties().customLayer === true) {
                        singleLayerConfig = getCustomLayer(layer);
                    } else if (layer instanceof ol.layer.Group) {
                        singleLayerConfig.layers = [];
                        layer.getLayers().forEach(function (subLayer) {
                            var subLayerConfig = getLayersConfig(subLayer);
                            singleLayerConfig.layers.push(subLayerConfig);
                        });
                    }
                    layers.overlays.push(singleLayerConfig);
                }
            });
            return layers;
        }

        // Export file
        function exportJson() {
            var filename = 'BKG-WebMap';
            var date = new Date();
            var json = {
                description: 'BKG WebMap: Kartenkonfiguration',
                version: BKGWebMap.VERSION,
                generatedAt: date.toLocaleString(),
                appName: appName,
                map: {
                    projection: map.getView().getProjection().getCode(),
                    center: {
                        lat: parseFloat(map.getView().getCenter()[1].toFixed(4)),
                        lon: parseFloat(map.getView().getCenter()[0].toFixed(4))
                    },
                    zoom: map.getView().getZoom(),
                    minResolution: map.getView().getMinResolution(),
                    maxResolution: map.getView().getMaxResolution()
                },
                layers: getLayers()
            };
            var jsonString = JSON.stringify(json, null, 2);
            var blob = new Blob([jsonString], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, filename + '.json');
        }

        // Add persistence configuration to session storage. It will be used to load configuration after refreshing the page.
        function addJsonToSessionStorage(json) {
            try {
                // Save json to sessionStorage
                window.sessionStorage.setItem('bkgwebmap', json);
                // Reload page without PermaLink
                window.location = window.location.protocol + '//' + window.location.host + window.location.pathname;
            } catch (err) {
                alert(BKGWebMap.ERROR.enableCookiesImport);
            }
        }

        // Add EventListeners
        exportButton.addEventListener('click', function () {
            exportJson();
        }, { passive: true });

        importButton.onchange = function (evt) {
            var input = evt.target;
            var reader = new FileReader();
            reader.readAsText(input.files[0]);
            reader.onload = function (event) {
                var json = event.target.result;
                addJsonToSessionStorage(json);
            };
            importButton.value = '';
        };

        // Finalize control
        ol.control.Control.call(this, {
            element: jsonExport,
            target: target
        });
    };
};
