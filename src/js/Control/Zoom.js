/**
 * Create Zoom Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_zoom}
 */
BKGWebMap.Control.createZoom = function () {
    return function (map, controlName, options, panel, standardPositionControls) {
        var mapDivId = map.getTarget();

        // Check if control should be created
        if (options.active === false) {
            return undefined;
        }

        // Find div ID for control
        var target;
        if (options.div && options.div !== '') {
            target = options.div;
        }
        var position;
        var cssPosition = false;

        if (typeof options.onlyFullScreen === 'boolean' && options.onlyFullScreen === true) {
            this.onlyFullScreen = true;
        }

        if (target === undefined) {
            if (typeof options.position === 'string' && BKGWebMap.STANDARD_POSITION.indexOf(options.position) !== -1) {
                position = options.position;
            } else if (typeof options.position === 'string' && options.position.match(/top|left|bottom|right/)) {
                cssPosition = true;
                position = BKGWebMap.Util.cssParser(options.position);
            } else {
                position = BKGWebMap.CONTROLS.tools.zoom.position;
            }
        }

        var onlyFullScreenClass = '';
        if (this.onlyFullScreen) {
            onlyFullScreenClass = ' bkgwebmap-onlyfullscreen ';
        }

        var zoom = document.createElement('div');
        zoom.className = 'bkgwebmap-zoom ol-unselectable ol-control' + onlyFullScreenClass;

        var tooltipExtraClass = ' bkgwebmap-tooltipinmaptext';
        if (position !== undefined) {
            if (!cssPosition && standardPositionControls[position]) {
                var targetClass = standardPositionControls[position].getClass();
                target = document.getElementById(mapDivId).getElementsByClassName(targetClass)[0];
                var rightLeft = position.split('-')[1];
                zoom.classList.add('bkgwebmap-standardpositioncontrol', 'bkgwebmap-standardpositioncontrol' + rightLeft);
                if (rightLeft === 'right') {
                    tooltipExtraClass = ' bkgwebmap-tooltipzoomright';
                }
            } else if (cssPosition) {
                for (var prop in position) {
                    zoom.style[prop] = position[prop];
                }
            } else {
                return undefined;
            }
        }

        var showZoomLevel = BKGWebMap.CONTROLS.tools.zoom.showZoomLevel;
        if (typeof options.showZoomLevel === 'boolean') {
            showZoomLevel = options.showZoomLevel;
        }

        var zoomToFullExtent = BKGWebMap.CONTROLS.tools.zoom.zoomToFullExtent;
        if (typeof options.zoomToFullExtent === 'boolean') {
            zoomToFullExtent = options.zoomToFullExtent;
        }

        var history = BKGWebMap.CONTROLS.tools.zoom.history;
        if (typeof options.history === 'boolean') {
            history = options.history;
        }

        // Custom class
        var customClass = '';
        if (options.style && options.style !== '') {
            customClass = options.style;
            zoom.classList.add(customClass);
        }

        // Create DOM

        // Zoom
        var zoomButtons = document.createElement('div');
        zoomButtons.className = 'bkgwebmap-zoombuttonswrapper';
        var buttonPlus = document.createElement('button');
        buttonPlus.className = 'bkgwebmap-mapbutton';
        buttonPlus.innerHTML = '+';
        var buttonMinus = document.createElement('button');
        buttonMinus.className = 'bkgwebmap-mapbutton';
        buttonMinus.innerHTML = '\u2212';

        // Zoom level
        var buttonZoomLevel = document.createElement('button');
        buttonZoomLevel.className = 'bkgwebmap-mapbutton bkgwebmap-zoomlevel';
        buttonZoomLevel.innerHTML = map.getView().getZoom();
        buttonZoomLevel.style.display = 'inline';
        zoomButtons.appendChild(buttonPlus);
        zoomButtons.appendChild(buttonMinus);
        if (showZoomLevel) {
            zoomButtons.appendChild(buttonZoomLevel);
        }

        // Zoom to full extent
        var zoomToFullExtentDiv = document.createElement('div');
        zoomToFullExtentDiv.className = 'bkgwebmap-zoombuttonswrapper';
        var buttonZoomToFullExtent = document.createElement('button');
        buttonZoomToFullExtent.className = 'bkgwebmap-mapbutton bkgwebmap-zoomtofullextent bkgwebmap-paneltooltip';
        var parser = new DOMParser();
        var iconZoomToFullExtent = parser.parseFromString(BKGWebMap.PANEL_ICONS.ZOOM_TO_FULL_EXTENT, 'text/xml');
        buttonZoomToFullExtent.appendChild(iconZoomToFullExtent.documentElement);
        zoomToFullExtentDiv.appendChild(buttonZoomToFullExtent);

        var zoomToFullExtentTooltip = document.createElement('span');
        zoomToFullExtentTooltip.className = 'bkgwebmap-paneltooltiptext' + tooltipExtraClass;
        zoomToFullExtentTooltip.innerHTML = 'Auf&nbspdie&nbspvolle<br><br>Ausdehnung&nbspzoomen';
        buttonZoomToFullExtent.appendChild(zoomToFullExtentTooltip);

        // History
        var historyDiv = document.createElement('div');
        historyDiv.className = 'bkgwebmap-zoombuttonswrapper';
        var buttonPrevious = document.createElement('button');
        buttonPrevious.className = 'bkgwebmap-mapbutton bkgwebmap-paneltooltip';
        var parserZoomPrevious = new DOMParser();
        var iconPreviousNode = parserZoomPrevious.parseFromString(BKGWebMap.PANEL_ICONS.ZOOM_PREVIOUS, 'text/xml');
        buttonPrevious.appendChild(iconPreviousNode.documentElement);
        buttonPrevious.style.display = 'inline';
        var buttonPreviousTooltip = document.createElement('span');
        buttonPreviousTooltip.className = 'bkgwebmap-paneltooltiptext' + tooltipExtraClass;
        buttonPreviousTooltip.innerHTML = 'Letzte&nbspAnsicht';
        buttonPrevious.appendChild(buttonPreviousTooltip);
        var buttonNext = document.createElement('button');
        buttonNext.className = 'bkgwebmap-mapbutton bkgwebmap-paneltooltip';
        var parserZoomNext = new DOMParser();
        var iconNextNode = parserZoomNext.parseFromString(BKGWebMap.PANEL_ICONS.ZOOM_NEXT, 'text/xml');
        buttonNext.appendChild(iconNextNode.documentElement);
        buttonNext.style.display = 'inline';
        var buttonNextTooltip = document.createElement('span');
        buttonNextTooltip.className = 'bkgwebmap-paneltooltiptext' + tooltipExtraClass;
        buttonNextTooltip.innerHTML = 'Nächste&nbspAnsicht';
        buttonNext.appendChild(buttonNextTooltip);
        historyDiv.appendChild(buttonPrevious);
        historyDiv.appendChild(buttonNext);

        // Control div
        zoom.appendChild(zoomButtons);
        if (zoomToFullExtent) {
            zoom.appendChild(zoomToFullExtentDiv);
        }
        if (history) {
            zoom.appendChild(historyDiv);
            activateHistory();
        }

        // Change zoom level
        function changeZoom(delta) {
            var currentZoom = map.getView().getZoom();
            var view = map.getView();
            if (view.getAnimating()) {
                view.cancelAnimations();
            }
            view.animate({
                zoom: currentZoom + delta,
                duration: 250,
                easing: ol.easing.easeOut
            });
        }

        // Zoom to extent
        function zoomToExtent() {
            var extent = ol.extent.createEmpty();

            map.getLayers().forEach(function (layer) {
                if (layer instanceof ol.layer.Group) {
                    layer.getLayers().forEach(function (groupLayer) {
                        if (groupLayer instanceof ol.layer.Vector) {
                            ol.extent.extend(extent, groupLayer.getSource().getExtent());
                        } else if (layer.extent && layer.extent instanceof Array) {
                            ol.extent.extend(extent, layer.extent);
                        }
                    });
                } else if (layer instanceof ol.layer.Vector) {
                    ol.extent.extend(extent, layer.getSource().getExtent());
                } else if (layer.extent && layer.extent instanceof Array) {
                    ol.extent.extend(extent, layer.extent);
                }
            });

            map.getView().fit(extent, map.getSize());
        }

        // Activate history function
        function activateHistory() {
            buttonPrevious.disabled = true;
            buttonNext.disabled = true;

            var history = [];
            var currentIndex = -1;
            var shouldSave = false;
            var delay = 360; // OpenLayers render delay
            map.on('moveend', function () {
                if (shouldSave === false) {
                    if (currentIndex < history.length - 1) {
                        for (var i = history.length - 1; i > currentIndex; i--) {
                            history.pop();
                        }
                    }
                    history.push({
                        extent: map.getView().calculateExtent(map.getSize()),
                        size: map.getSize(),
                        zoom: map.getView().getZoom()
                    });
                    currentIndex += 1;
                    disableButtons();
                } else {
                    disableButtons();
                }
            });

            function disableButtons() {
                if (currentIndex === 0) {
                    buttonPrevious.disabled = true;
                } else {
                    buttonPrevious.disabled = false;
                }
                if (history.length - 1 === currentIndex) {
                    buttonNext.disabled = true;
                } else {
                    buttonNext.disabled = false;
                }
            }

            function navigationHistoryNext() {
                if (currentIndex < history.length - 1) {
                    shouldSave = true;
                    map.getView().fit(history[currentIndex + 1].extent, history[currentIndex + 1].size);
                    map.getView().setZoom(history[currentIndex + 1].zoom);
                    setTimeout(function () {
                        shouldSave = false;
                    }, delay);
                    currentIndex += 1;
                }
            }

            function navigationHistoryPrevious() {
                if (currentIndex > 0) {
                    shouldSave = true;
                    map.getView().fit(history[currentIndex - 1].extent, history[currentIndex - 1].size);
                    map.getView().setZoom(history[currentIndex - 1].zoom);
                    setTimeout(function () {
                        shouldSave = false;
                    }, delay);
                    currentIndex -= 1;
                }
            }

            function showTooltip(buttonTooltip) {
                var allTooltips = document.getElementsByClassName('bkgwebmap-paneltooltiptext');
                for (var i = 0; i < allTooltips.length; i++) {
                    allTooltips[i].style.visibility = '';
                }
                buttonTooltip.style.visibility = 'visible';
                setTimeout(function () {
                    buttonTooltip.style.visibility = '';
                }, 1200);
            }

            // History event listeners
            buttonNext.addEventListener('click', navigationHistoryNext, { passive: true });
            buttonPrevious.addEventListener('click', navigationHistoryPrevious, { passive: true });
            buttonPrevious.addEventListener('mouseenter', function () {
                showTooltip(buttonPreviousTooltip);
            }, false);
            buttonNext.addEventListener('mouseenter', function () {
                showTooltip(buttonNextTooltip);
            }, false);
            buttonZoomToFullExtent.addEventListener('mouseenter', function () {
                showTooltip(zoomToFullExtentTooltip);
            }, false);
        }

        // Event listeners
        buttonPlus.addEventListener('click', function () {
            changeZoom(1);
        }, { passive: true });
        buttonMinus.addEventListener('click', function () {
            changeZoom(-1);
        }, { passive: true });
        if (showZoomLevel) {
            map.getView().on('change:resolution', function () {
                var zoomLevel = map.getView().getZoom();
                buttonZoomLevel.innerHTML = Math.round(zoomLevel);
            });
        }
        if (zoomToFullExtent) {
            buttonZoomToFullExtent.addEventListener('click', zoomToExtent, { passive: true });
        }

        // Finalize control
        ol.control.Control.call(this, {
            element: zoom,
            target: target
        });
    };
};
