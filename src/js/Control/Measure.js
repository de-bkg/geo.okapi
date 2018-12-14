/**
 * Create Measure Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_measure}
 */
BKGWebMap.Control.createMeasure = function () {
    return function (map, controlName, options, panel) {
        var _this = this;
        var mapId = map.getTarget();

        // Check if control should be created
        if (options.active === false) {
            return undefined;
        }

        // If no panel exists and no other div ID is defined, do not create this control
        if (!panel && (!options.div || options.div === '')) {
            window.console.log(BKGWebMap.ERROR.noPanelNoDivForControl + controlName);
            return undefined;
        }

        var target;
        var inPanel = true;
        if (options.div && options.div !== '') {
            target = options.div;
            inPanel = false;
        } else {
            target = panel.element.getElementsByClassName('bkgwebmap-panelbar')[0];
        }

        // Control title for panel
        var title = 'Messen';

        // Custom class
        var customClass = '';
        if (options.style && options.style !== '') {
            customClass = ' ' + options.style;
        }

        // Tooltip position
        var tooltipClass = 'bkgwebmap-paneltooltip bkgwebmap-paneltooltipleft';
        var tooltipTextClass = 'bkgwebmap-paneltooltiptext bkgwebmap-paneltooltiptextleft';
        if (inPanel && panel.getPanelPosition() === 'right') {
            tooltipClass = 'bkgwebmap-paneltooltip bkgwebmap-paneltooltipright';
            tooltipTextClass = 'bkgwebmap-paneltooltiptext bkgwebmap-paneltooltiptextright';
        }

        // Create DOM
        var measure = document.createElement('div');
        measure.className = 'bkgwebmap-measure';

        var measureToggle = document.createElement('div');
        measureToggle.className = 'bkgwebmap-measureToggle ' + tooltipClass + customClass;
        measure.appendChild(measureToggle);

        var measureTooltip = document.createElement('span');
        measureTooltip.className = tooltipTextClass;
        measureTooltip.innerHTML = title;
        measureToggle.appendChild(measureTooltip);

        var parser = new DOMParser();
        var measureIcon = parser.parseFromString(BKGWebMap.PANEL_ICONS.MEASURE_AREA, 'text/xml');
        measureIcon.documentElement.setAttribute('class', 'bkgwebmap-panelicons');
        measureToggle.appendChild(measureIcon.documentElement);

        var measureSidePanel = document.createElement('div');
        measureSidePanel.className = 'bkgwebmap-sidemultiplepanel';
        measure.appendChild(measureSidePanel);
        measureSidePanel.style.position = 'relative';
        if (inPanel) {
            measureSidePanel.style.width = document.getElementById(mapId).getElementsByClassName('bkgwebmap-panelbar')[0].style.width;
            if (panel.getPanelPosition() === 'right') {
                measureSidePanel.style.right = '50px';
            } else {
                measureSidePanel.style.left = '50px';
            }
            measureSidePanel.style.top = '-35px';
        }
        measureSidePanel.style.display = 'none';


        var measureDistance = document.createElement('div');
        measureDistance.className = 'bkgwebmap-sidepanelbuttons bkgwebmap-measurebuttons bkgwebmap-measuredistance ' + tooltipClass;

        var newNode = parser.parseFromString(BKGWebMap.PANEL_ICONS.MEASURE_DISTANCE, 'text/xml');
        newNode.documentElement.setAttribute('class', 'bkgwebmap-sidepanelicons');
        measureDistance.appendChild(newNode.documentElement);
        measureSidePanel.appendChild(measureDistance);

        var measureDistanceTooltip = document.createElement('span');
        measureDistanceTooltip.className = tooltipTextClass;
        measureDistanceTooltip.innerHTML = 'Strecke messen';
        measureDistance.appendChild(measureDistanceTooltip);

        var measureArea = document.createElement('div');
        measureArea.className = 'bkgwebmap-sidepanelbuttons bkgwebmap-measurebuttons bkgwebmap-measurearea ' + tooltipClass;
        measureArea.style.marginTop = '10px';

        newNode = parser.parseFromString(BKGWebMap.PANEL_ICONS.MEASURE_AREA, 'text/xml');
        newNode.documentElement.setAttribute('class', 'bkgwebmap-sidepanelicons');
        measureArea.appendChild(newNode.documentElement);
        measureSidePanel.appendChild(measureArea);

        var measureAreaTooltip = document.createElement('span');
        measureAreaTooltip.className = tooltipTextClass;
        measureAreaTooltip.innerHTML = 'Fläche messen';
        measureArea.appendChild(measureAreaTooltip);

        if (inPanel) {
            measureDistance.style.backgroundColor = '#407E40';
            measureArea.style.backgroundColor = '#407E40';
        }

        // Show tooltip on hover and hide all other
        function showHideTooltips(tooltip) {
            var allTooltips = document.getElementById(mapId).getElementsByClassName('bkgwebmap-paneltooltiptext');
            for (var i = 0; i < allTooltips.length; i++) {
                allTooltips[i].style.visibility = '';
            }

            tooltip.style.visibility = 'visible';
            setTimeout(function () {
                tooltip.style.visibility = '';
            }, 1200);
        }

        // Event listeners
        measureToggle.addEventListener('click', function () {
            _this.toggleSidePanels();
        }, true);
        measureArea.addEventListener('click', measureOn, false);
        measureArea.addEventListener('mouseenter', function () {
            showHideTooltips(measureAreaTooltip);
        }, false);
        measureDistance.addEventListener('click', measureOn, false);
        measureDistance.addEventListener('mouseenter', function () {
            showHideTooltips(measureDistanceTooltip);
        }, false);
        measureToggle.addEventListener('mouseenter', function () {
            showHideTooltips(measureTooltip);
        }, false);

        function hightlightMeasureButton(type) {
            if (type === 'area') {
                measureArea.classList.add('bkgwebmap-measureactive');
                removeStyleClass(measureDistance, 'bkgwebmap-measureactive');
            } else if (type === 'distance') {
                measureDistance.classList.add('bkgwebmap-measureactive');
                removeStyleClass(measureArea, 'bkgwebmap-measureactive');
            }
        }

        function removeStyleClass(element, cssClass) {
            if (element.classList.contains(cssClass)) {
                element.classList.remove(cssClass);
            }
        }

        // Functionality
        var measureControl = this;

        this.closeSidePanel = function (print) {
            if (!print) {
                if (draw) {
                    measureClearResults();
                    addAttributeListener();
                }
                measureSidePanel.style.display = 'none';
            } else {
                if (draw) {
                    addAttributeListener();
                }
                measureSidePanel.style.display = 'none';
            }
            removeStyleClass(measure, 'bkgwebmap-panelactive');
            removeStyleClass(measureArea, 'bkgwebmap-measureactive');
            removeStyleClass(measureDistance, 'bkgwebmap-measureactive');
        };

        document.onkeydown = function (evt) {
            evt = evt || window.event;
            var isEscape = false;
            if ('key' in evt) {
                isEscape = (evt.key === 'Escape' || evt.key === 'Esc');
            } else {
                isEscape = (evt.keyCode === 27);
            }
            if (isEscape) {
                if (draw) {
                    measureClearResults();
                    addAttributeListener();
                }
            }
        };

        function deactivateEdit() {
            map.getControls().forEach(function (control) {
                if (BKGWebMap.Control.Edit && control instanceof BKGWebMap.Control.Edit) {
                    control.removeEditInteractions();
                }
            });
        }

        /**
         * Open/close panel with measure buttons
         */
        this.toggleSidePanels = function () {
            deactivateEdit();
            if (inPanel) {
                if (measure.classList.contains('bkgwebmap-panelactive')) {
                    measure.classList.remove('bkgwebmap-panelactive');
                } else {
                    measure.classList.add('bkgwebmap-panelactive');
                }
            }
            panel.closePanel();
            if (measureSidePanel.style.display === 'none') {
                measureSidePanel.style.display = 'block';
            } else if (measureSidePanel.style.display === 'block') {
                measureControl.closeSidePanel();
            }
        };

        // Interaction for drawing
        var draw;
        // Layer for drawing
        var source = new ol.source.Vector();

        var vector = new ol.layer.Vector({
            source: source,
            measureLayer: true,
            uniqueId: 'measurelayer',
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(158, 11, 18, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(158, 11, 18, 1)',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });

        // Overlay to show the help messages
        var helpTooltip;

        // Overlay to show the measurement
        var measureTooltipOverlay;

        function removeAttributeListener() {
            map.getControls().forEach(function (control) {
                if (BKGWebMap.Control.ShowAttributes && control instanceof BKGWebMap.Control.ShowAttributes) {
                    map.un('click', control.clickAttributesActivate);
                }
                if (BKGWebMap.Control.GeoSearch && control instanceof BKGWebMap.Control.GeoSearch) {
                    map.un('click', control.geoSearchClickActivate);
                }
                if (BKGWebMap.Control.CopyCoordinates && control instanceof BKGWebMap.Control.CopyCoordinates) {
                    map.un('click', control.clickCopyCoordinatesActivate);
                }
            });
        }

        function addAttributeListener() {
            map.getControls().forEach(function (control) {
                if (BKGWebMap.Control.ShowAttributes && control instanceof BKGWebMap.Control.ShowAttributes) {
                    map.on('click', control.clickAttributesActivate);
                }
                if (BKGWebMap.Control.GeoSearch && control instanceof BKGWebMap.Control.GeoSearch) {
                    map.on('click', control.geoSearchClickActivate);
                }
                if (BKGWebMap.Control.CopyCoordinates && control instanceof BKGWebMap.Control.CopyCoordinates) {
                    map.on('click', control.clickCopyCoordinatesActivate);
                }
            });
        }

        function measureClearResults() {
            var i;
            map.removeInteraction(draw);
            map.removeOverlay(helpTooltip);
            source.clear();
            // remove tooltips
            var oldStaticTooltips = document.getElementById(mapId).getElementsByClassName('bkgwebmap-measureoverlay-tooltip-static');
            if (oldStaticTooltips.length) {
                for (i = 0; i < oldStaticTooltips.length; i++) {
                    oldStaticTooltips[i].parentNode.remove();
                }
            }
            var oldMeasureTooltips = document.getElementById(mapId).getElementsByClassName('bkgwebmap-measureoverlay-tooltip-measure');
            if (oldMeasureTooltips.length) {
                for (i = 0; i < oldMeasureTooltips.length; i++) {
                    oldMeasureTooltips[i].parentNode.remove();
                }
            }
            map.removeLayer(vector);
        }

        function measureOn() {
            removeAttributeListener();

            if (draw) {
                measureClearResults();
            }
            var typeMeasure;
            if (this.classList.contains('bkgwebmap-measurearea')) {
                typeMeasure = 'Polygon';
                hightlightMeasureButton('area');
            } else {
                typeMeasure = 'LineString';
                hightlightMeasureButton('distance');
            }

            // Currently drawn feature
            var sketch;

            // The help tooltip element
            var helpTooltipElement;

            // The measure tooltip element
            var measureTooltipElement;

            // Message to show when the user is drawing a polygon
            var continuePolygonMsg = 'Polygon-Stützpunkt setzen';

            // Message to show when the user is drawing a line
            var continueLineMsg = 'Linie-Stützpunkt setzen';

            // Handle pointer move
            var pointerMoveHandler = function (evt) {
                if (evt.dragging) {
                    return;
                }

                var helpMsg = 'Klicken, um zu messen';

                if (sketch) {
                    var geom = (sketch.getGeometry());
                    if (geom instanceof ol.geom.Polygon) {
                        helpMsg = continuePolygonMsg;
                    } else if (geom instanceof ol.geom.LineString) {
                        helpMsg = continueLineMsg;
                    }
                }

                helpTooltipElement.innerHTML = helpMsg;
                helpTooltip.setPosition(evt.coordinate);

                helpTooltipElement.classList.remove('hidden');
            };

            map.on('pointermove', pointerMoveHandler);

            map.getViewport().addEventListener('mouseout', function () {
                helpTooltipElement.classList.add('hidden');
            });

            var mapProjection = map.getView().getProjection();

            var wgs84Sphere = new ol.Sphere(6378137);

            // Format length output.
            var formatLength = function (line) {
                var length = 0;
                var coordinates = line.getCoordinates();
                for (var i = 0; i < coordinates.length - 1; i++) {
                    var c1 = ol.proj.transform(coordinates[i], mapProjection, 'EPSG:4326');
                    var c2 = ol.proj.transform(coordinates[i + 1], mapProjection, 'EPSG:4326');
                    length += wgs84Sphere.haversineDistance(c1, c2);
                }
                var output;
                if (length > 100) {
                    output = (Math.round(length / 1000 * 100) / 100) +
                        ' km';
                } else {
                    output = (Math.round(length * 100) / 100) +
                        ' m';
                }
                return output;
            };

            // Format area output.
            var formatArea = function (polygon) {
                var newPolygon = polygon.clone().transform(mapProjection, 'EPSG:4326');
                var coordPolygon = newPolygon.getLinearRing(0).getCoordinates();
                var area = Math.abs(wgs84Sphere.geodesicArea(coordPolygon));
                var output;
                if (area > 10000) {
                    output = (Math.round(area / 1000000 * 100) / 100) +
                        ' km<sup>2</sup>';
                } else {
                    output = (Math.round(area * 100) / 100) +
                        ' m<sup>2</sup>';
                }
                return output;
            };

            function addInteraction() {
                draw = new ol.interaction.Draw({
                    source: source,
                    type: typeMeasure,
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(158, 11, 18, 0.2)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(158, 11, 18, 1)',
                            width: 3
                        }),
                        image: new ol.style.Circle({
                            radius: 5,
                            stroke: new ol.style.Stroke({
                                color: 'rgba(158, 11, 18, 0.7)'
                            }),
                            fill: new ol.style.Fill({
                                color: 'rgba(255, 255, 255, 0.2)'
                            })
                        })
                    })
                });
                map.addInteraction(draw);

                createMeasureTooltip();
                createHelpTooltip();
                var listener;
                draw.on('drawstart', function (evt) {
                    var oldTooltip = document.getElementById(mapId).getElementsByClassName('bkgwebmap-measureoverlay-tooltip-static');
                    if (oldTooltip.length) {
                        for (var i = 0; i < oldTooltip.length; i++) {
                            oldTooltip[i].parentNode.remove();
                        }
                    }
                    source.clear();
                    map.removeLayer(vector);

                    evt.feature.setProperties({
                        id: 'measurefeature'
                    });
                    // Set sketch
                    sketch = evt.feature;


                    var tooltipCoord = evt.coordinate;

                    listener = sketch.getGeometry().on('change', function (event) {
                        var geom = event.target;
                        var output;
                        if (geom instanceof ol.geom.Polygon) {
                            output = formatArea(geom);
                            tooltipCoord = geom.getInteriorPoint().getCoordinates();
                        } else if (geom instanceof ol.geom.LineString) {
                            output = formatLength(geom);
                            tooltipCoord = geom.getLastCoordinate();
                        }
                        measureTooltipElement.innerHTML = output;
                        measureTooltipOverlay.setPosition(tooltipCoord);
                    });
                }, this);

                draw.on('drawend', function () {
                    measureTooltipElement.className = 'bkgwebmap-measureoverlay-tooltip bkgwebmap-measureoverlay-tooltip-static';
                    measureTooltipOverlay.setOffset([0, -30]);
                    // Unset sketch
                    sketch = null;
                    // Unset tooltip so that a new one can be created
                    measureTooltipElement = null;
                    createMeasureTooltip();
                    ol.Observable.unByKey(listener);
                    map.addLayer(vector);
                }, this);
            }


            // Creates a new help tooltip
            function createHelpTooltip() {
                if (helpTooltipElement) {
                    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
                }
                helpTooltipElement = document.createElement('div');
                helpTooltipElement.className = 'bkgwebmap-measureoverlay-tooltip hidden';
                helpTooltip = new ol.Overlay({
                    element: helpTooltipElement,
                    offset: [15, 0],
                    positioning: 'center-left'
                });
                map.addOverlay(helpTooltip);
            }

            // Creates a new measure tooltip
            function createMeasureTooltip() {
                if (measureTooltipElement) {
                    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
                }
                measureTooltipElement = document.createElement('div');
                measureTooltipElement.className = 'bkgwebmap-measureoverlay-tooltip bkgwebmap-measureoverlay-tooltip-measure';
                measureTooltipOverlay = new ol.Overlay({
                    element: measureTooltipElement,
                    offset: [0, -50],
                    positioning: 'bottom-center'
                });
                map.addOverlay(measureTooltipOverlay);
            }

            addInteraction();
        }

        // Finalize control
        ol.control.Control.call(this, {
            element: measure,
            target: target
        });
    };
};
