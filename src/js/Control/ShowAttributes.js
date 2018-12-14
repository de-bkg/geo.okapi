/**
 * Create ShowAttributes Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_showAttributes}
 */
BKGWebMap.Control.createShowAttributes = function () {
    return function (map, controlName, options, panel) {
        var mapId = map.getTarget();
        var _this = this;

        // Check if control should be created
        if (options.active === false) {
            return undefined;
        }

        // If no panel exists and no other div ID is defined, do not create this control
        if (!panel && (!options.div || options.div === '')) {
            window.console.log(BKGWebMap.ERROR.noPanelNoDivForControl + controlName);
            return undefined;
        }


        var markerControl;
        var copyCoordinates;
        map.getControls().forEach(function (control) {
            if (BKGWebMap.Control.Marker && control instanceof BKGWebMap.Control.Marker) {
                markerControl = control;
            }
            if (BKGWebMap.Control.CopyCoordinates && control instanceof BKGWebMap.Control.CopyCoordinates) {
                copyCoordinates = control;
            }
        });

        if (!markerControl) {
            var Marker = BKGWebMap.Control.FACTORIES.marker();
            markerControl = new Marker(map);
            map.addControl(markerControl);
        }

        map.once('postrender', function () {
            map.getControls().forEach(function (control) {
                if (BKGWebMap.Control.CopyCoordinates && control instanceof BKGWebMap.Control.CopyCoordinates) {
                    copyCoordinates = control;
                }
            });
        });

        // Select feature interaction
        var selectStyle = new ol.style.Style({
            fill: new ol.style.Fill({
                color: '#FFFF00'
            }),
            stroke: new ol.style.Stroke({
                color: '#FFFF00',
                width: 2
            }),
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: '#FFFF00'
                }),
                stroke: new ol.style.Stroke({
                    color: '#FF0000',
                    width: 1
                }),
                radius: 7
            })
        });

        var interactionSelect = new ol.interaction.Select({
            condition: ol.events.condition.singleClick,
            style: selectStyle,
            multi: true,
            filter: function (feature, layer) {
                if (feature && feature.getProperties().id === 'measurefeature') {
                    return false;
                }

                if (layer && (layer.getProperties().uniqueId === 'geosearchlayer' || layer.getProperties().uniqueId === 'measurelayer')) {
                    return false;
                }
                return true;
            }
        });

        map.addInteraction(interactionSelect);

        var target;
        var inPanel = true;
        if (options.div && options.div !== '') {
            target = options.div;
            inPanel = false;
        }
        var startMessage = 'Mit einem Klick können Sie Attributinformationen abfragen. Die abgefragten Informationen werden dann hier angezeigt.';
        var noResultsMessage = 'Die Abfrage an der gesuchten Position ergab kein Ergebnis.';

        // Custom class
        var customClass = '';
        if (options.style && options.style !== '') {
            customClass = ' ' + options.style;
        }

        // Control in panel
        var infoPanel = getInfoPanel();
        if (inPanel) {
            if (!infoPanel) {
                infoPanel = createInfopanel();
            }
            target = panel.element.getElementsByClassName('bkgwebmap-infopanelcontent')[0];
        }

        var showAttributes = document.createElement('div');
        showAttributes.className = 'bkgwebmap-showattributes' + customClass;

        var standardInfo = document.createElement('div');
        standardInfo.className = 'bkgwebmap-showattributestandard';
        standardInfo.innerHTML = startMessage;

        var infoDiv = document.createElement('div');
        infoDiv.className = 'bkgwebmap-showattributesdiv';

        var markerButton = document.createElement('button');
        markerButton.className = 'bkgwebmap-deletemarker';
        markerButton.innerHTML = 'Marker löschen';

        showAttributes.appendChild(standardInfo);
        showAttributes.appendChild(infoDiv);

        function clickControl() {
            if (inPanel) {
                var activeContent = panel.getActiveContent();
                if (activeContent === '') {
                    panel.openPanel();
                    panel.changePanelContent('Info', 'bkgwebmap-infopanelcontent');
                    infoPanel.activeIcon();
                } else if (activeContent === 'bkgwebmap-infopanelcontent') {
                    panel.closePanel();
                } else {
                    panel.changePanelContent('Info', 'bkgwebmap-infopanelcontent');
                    infoPanel.activeIcon();
                }
            } else if (showAttributes.style.display === 'none') {
                showAttributes.style.display = 'block';
            } else {
                showAttributes.style.display = 'none';
            }
        }

        function addToDom(infoToShow) {
            var i;
            var html = '';
            for (var layer in infoToShow) {
                if (Object.prototype.hasOwnProperty.call(infoToShow, layer)) {
                    html += '<div class="bkgwebmap-showattributestitle">';
                    html += '<div class="bkgwebmap-layerheadermaintext">';
                    html += layer;
                    html += '</div>';
                    html += '<div class="bkgwebmap-layerheaderplusminus">';
                    html += '+';
                    html += '</div>';
                    html += '</div>';
                    html += '<table class="bkgwebmap-showattributestable bkgwebmap-selectable bkgwebmap-showattributestablehidden">';

                    var properties = infoToShow[layer];
                    for (i = 0; i < properties.length; i++) {
                        for (var key in properties[i]) {
                            html += '<tr><td class="bkgwebmap-showattributeshighlight">' + key + ':</td> <td>' + properties[i][key] + '</td></tr>';
                        }
                        if (properties.length > 1 && i < properties.length - 1) {
                            html += '<tr><td class="bkgwebmap-showattributesblock"></td></tr>';
                        }
                    }
                    html += '</table>';
                }
            }

            if (html) {
                infoDiv.innerHTML += html;
                standardInfo.style.display = 'none';
                infoDiv.style.display = 'block';
            } else if (infoDiv.innerHTML === '') {
                infoDiv.style.display = 'none';
                standardInfo.style.display = 'block';
            }

            var titleDivs = document.getElementById(mapId).getElementsByClassName('bkgwebmap-showattributestitle');
            for (i = 0; i < titleDivs.length; i++) {
                titleDivs[i].onclick = function () {
                    if (this.nextSibling.classList.contains('bkgwebmap-showattributestablehidden')) {
                        this.nextSibling.classList.remove('bkgwebmap-showattributestablehidden');
                        if (this.childNodes[1]) {
                            this.childNodes[1].innerHTML = '\u2212';
                        }
                    } else {
                        this.nextSibling.classList.add('bkgwebmap-showattributestablehidden');
                        if (this.childNodes[1]) {
                            this.childNodes[1].innerHTML = '+';
                        }
                    }
                };
            }
        }

        function addHtmlToDom(name, htmlToShow) {
            var html = '';
            if (name) {
                html += '<div class="bkgwebmap-showattributestitle">' + name + '</div>';
            }
            if (htmlToShow) {
                html += '<div class="bkgwebmap-showattributestable bkgwebmap-showattributestablehidden">';
                html += htmlToShow;
                html += '</div>';
                infoDiv.innerHTML += html;
                standardInfo.style.display = 'none';
                infoDiv.style.display = 'block';
            } else if (infoDiv.innerHTML === '') {
                infoDiv.style.display = 'none';
                standardInfo.style.display = 'block';
            }

            var titleDivs = document.getElementById(mapId).getElementsByClassName('bkgwebmap-showattributestitle');
            for (var i = 0; i < titleDivs.length; i++) {
                titleDivs[i].onclick = function () {
                    if (this.nextSibling.classList.contains('bkgwebmap-showattributestablehidden')) {
                        this.nextSibling.classList.remove('bkgwebmap-showattributestablehidden');
                    } else {
                        this.nextSibling.classList.add('bkgwebmap-showattributestablehidden');
                    }
                };
            }
        }

        function getVectorInfo(pixel) {
            interactionSelect.getFeatures().clear();
            var selectActive = false;
            map.getInteractions().forEach(function (interaction) {
                if (interaction === interactionSelect) {
                    selectActive = true;
                }
                if (!selectActive) {
                    map.addInteraction(interactionSelect);
                }
            });

            var layers = {};
            map.forEachFeatureAtPixel(pixel, function (feature, featureLayer) {
                interactionSelect.getFeatures().push(feature);

                if (!featureLayer) {
                    return;
                }
                if (feature.getGeometry() instanceof ol.geom.Point) {
                    var newMarkerCoord = feature.getGeometry().getCoordinates();
                    markerControl.setMarker(_this, newMarkerCoord);
                }
                var name = featureLayer.get('name');
                var properties = feature.getProperties();
                var object = {};
                for (var key in properties) {
                    if (Object.prototype.hasOwnProperty.call(properties, key) && properties[key] && typeof properties[key] !== 'object') {
                        object[key] = properties[key];
                    }
                }
                if (BKGWebMap.Util.hasNestedProperty(layers, name)) {
                    layers[name].push(object);
                } else {
                    layers[name] = [object];
                }
            });
            return layers;
        }

        function showRasterInfo(name, json) {
            if (json.features && json.features.length) {
                var layers = {};
                layers[name] = [];
                for (var i = 0; i < json.features.length; i++) {
                    var object = {};
                    if (!json.features[i].properties) {
                        continue;
                    }
                    for (var key in json.features[i].properties) {
                        if (Object.prototype.hasOwnProperty.call(json.features[i].properties, key) && json.features[i].properties[key] && typeof json.features[i].properties[key] !== 'object') {
                            object[key] = json.features[i].properties[key];
                        }
                    }
                    layers[name].push(object);
                }
                return layers;
            }
            return undefined;
        }

        function getRasterInfo(coordinates, layer, callback) {
            var viewResolution = map.getView().getResolution();
            var mapProjection = map.getView().getProjection();
            var infoFormat = BKGWebMap.GETFEATUREINFO_FORMATS[0];
            if (layer.getProperties().GetFeatureInfoFormat) {
                infoFormat = layer.getProperties().GetFeatureInfoFormat;
            }
            var url = layer.getSource().getGetFeatureInfoUrl(coordinates, viewResolution, mapProjection, { INFO_FORMAT: infoFormat });

            if (url) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.setRequestHeader('Content-Type', infoFormat);
                xhr.onload = function () {
                    var json;
                    if (xhr.status === 200) {
                        if (infoFormat.indexOf('json') !== -1) {
                            try {
                                json = JSON.parse(xhr.responseText);
                                return callback(json);
                            } catch (e) {
                                json = undefined;
                            }
                        } else {
                            return callback(xhr.responseText);
                        }
                    } else if (xhr.status !== 200) {
                        json = undefined;
                    }

                    if (json) {
                        return callback(json);
                    }
                };
                xhr.send();
            }
        }

        function createInfopanel() {
            var InfoPanelClass = BKGWebMap.Control.FACTORIES.infoPanel();
            var infoPanel = new InfoPanelClass(map, 'infoPanel', null, panel);
            map.addControl(infoPanel);
            return infoPanel;
        }

        function getInfoPanel() {
            var theControl = false;
            map.getControls().forEach(function (control) {
                if (BKGWebMap.Control.InfoPanel && control instanceof BKGWebMap.Control.InfoPanel) {
                    theControl = control;
                }
            });
            return theControl;
        }

        /**
         * Activate click event to request layer attributes
         * @param evt
         */
        this.clickAttributesActivate = function (evt) {
            // Show marker when clicking
            if (!copyCoordinates) {
                if (document.getElementById(mapId).getElementsByClassName('bkgwebmap-deletemarker').length) {
                    document.getElementById(mapId).getElementsByClassName('bkgwebmap-deletemarker')[0].remove();
                }
                markerControl.setMarker(_this, evt.coordinate);
                var markerButtonClone = markerButton.cloneNode(true);
                showAttributes.prepend(markerButtonClone);
                markerButtonClone.onclick = function () {
                    markerControl.deleteMarker();
                    markerButtonClone.remove();
                };
            }

            standardInfo.innerHTML = noResultsMessage;
            infoDiv.innerHTML = '';

            // Open info panel
            if (inPanel) {
                panel.openPanel();
                var activeContent = panel.getActiveContent();
                if (activeContent !== 'bkgwebmap-infopanelcontent') {
                    clickControl();
                }
            }

            // Vector layers
            var vectorInfo = getVectorInfo(evt.pixel);
            addToDom(vectorInfo);

            // Raster layers
            var coordinates = map.getCoordinateFromPixel(evt.pixel);
            map.getLayers().forEach(function (layer) {
                if (layer instanceof ol.layer.Group) {
                    if (layer.getVisible()) {
                        layer.getLayers().forEach(function (sublayer) {
                            if ((sublayer.getSource() instanceof ol.source.ImageWMS || sublayer.getSource() instanceof ol.source.TileWMS) && sublayer.getVisible()) {
                                getRasterInfo(coordinates, sublayer, function (json) {
                                    var name = sublayer.get('name');
                                    if (typeof json === 'object') {
                                        addToDom(showRasterInfo(name, json));
                                    } else if (typeof json === 'string') {
                                        addHtmlToDom(name, json);
                                    }
                                });
                            }
                        });
                    }
                } else if ((layer.getSource() instanceof ol.source.ImageWMS || layer.getSource() instanceof ol.source.TileWMS) && layer.getVisible()) {
                    getRasterInfo(coordinates, layer, function (json) {
                        var name = layer.get('name');
                        if (typeof json === 'object') {
                            addToDom(showRasterInfo(name, json));
                        } else if (typeof json === 'string') {
                            addHtmlToDom(name, json);
                        }
                    });
                }
            });
        };

        map.on('click', this.clickAttributesActivate);

        // Finalize control
        ol.control.Control.call(this, {
            element: showAttributes,
            target: target
        });
    };
};
