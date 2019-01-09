/**
 * Create LayerSwitcher Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_layerSwitcher}
 */
BKGWebMap.Control.createLayerSwitcher = function () {
    return function (map, controlName, options, panel) {
        var _this = this;

        var mapId = map.getTarget();
        var elementId = mapId;

        // Check if control should be created
        if (options.active === false) {
            return undefined;
        }

        // If no panel exists and no other div ID is defined, do not create this control
        if (!panel && (!options.div || options.div === '')) {
            window.console.log(BKGWebMap.ERROR.noPanelNoDivForControl + controlName);
            return undefined;
        }

        this.permaLinkActivated = false;

        var target;
        var inPanel = true;
        if (options.div && options.div !== '') {
            target = options.div;
            inPanel = false;
            elementId = target;
        } else {
            target = panel.element.getElementsByClassName('bkgwebmap-panelbar')[0];
        }

        var changeOrder = BKGWebMap.CONTROLS.tools.layerSwitcher.changeOrder;
        if (typeof options.changeOrder === 'boolean') {
            changeOrder = options.changeOrder;
        }

        var changeVisibility = BKGWebMap.CONTROLS.tools.layerSwitcher.changeVisibility;
        if (typeof options.changeVisibility === 'boolean') {
            changeVisibility = options.changeVisibility;
        }

        var editStyle = BKGWebMap.CONTROLS.tools.layerSwitcher.editStyle;
        if (typeof options.editStyle === 'boolean') {
            editStyle = options.editStyle;
        }

        var showWMSLayers = BKGWebMap.CONTROLS.tools.layerSwitcher.showWMSLayers;
        if (typeof options.showWMSLayers === 'boolean') {
            showWMSLayers = options.showWMSLayers;
        }

        var openLevel = BKGWebMap.CONTROLS.tools.layerSwitcher.openLevel;
        if (typeof options.openLevel === 'number' && (options.openLevel === 0 || options.openLevel === 1 || options.openLevel === 2)) {
            openLevel = options.openLevel;
        }

        // Control title for panel
        var title = 'Layer';

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
        var layerSwitcher = document.createElement('div');
        layerSwitcher.className = 'bkgwebmap-layerswitcher ' + tooltipClass + customClass;

        var parser = new DOMParser();
        var layerSwitcherIcon = parser.parseFromString(BKGWebMap.PANEL_ICONS.LAYERSWITCHER, 'text/xml');
        // layerSwitcherIcon.documentElement.id = 'bkgwebmap-layerswitchericon';
        if (inPanel) {
            layerSwitcherIcon.documentElement.setAttribute('class', 'bkgwebmap-panelicons bkgwebmap-paneliconsopen');
        } else {
            layerSwitcherIcon.documentElement.setAttribute('class', 'bkgwebmap-panelicons');
        }

        layerSwitcher.appendChild(layerSwitcherIcon.documentElement);

        var layerSwitcherTooltip = document.createElement('span');
        layerSwitcherTooltip.className = tooltipTextClass;
        layerSwitcherTooltip.innerHTML = title;
        layerSwitcher.appendChild(layerSwitcherTooltip);

        var layerSwitcherContent = document.createElement('div');
        var layerSwitcherContentClass = 'bkgwebmap-layerswitchercontent';
        layerSwitcherContent.className = layerSwitcherContentClass + ' bkgwebmap-panelsinglecontent';
        if (inPanel) {
            panel.addPanelContent(layerSwitcherContent);
        } else {
            layerSwitcher.appendChild(layerSwitcherContent);
            layerSwitcherContent.style.display = 'none';
        }

        // Update permalink
        function updatePermaLink() {
            if (!_this.permaLinkActivated) {
                return;
            }
            map.getControls().forEach(function (control) {
                if (BKGWebMap.Control.Share && control instanceof BKGWebMap.Control.Share) {
                    if (Object.prototype.hasOwnProperty.call(control, 'permaLink') && Object.prototype.hasOwnProperty.call(control.permaLink, 'active')) {
                        control.permaLink.changeLayersInPermalink();
                    }
                }
            });
        }

        // Open or close layer menu
        function openCloseMain() {
            if (this.nextSibling.classList.contains('bkgwebmap-layercontentactive')) {
                this.nextSibling.classList.remove('bkgwebmap-layercontentactive');
                if (this.childNodes[1]) {
                    this.childNodes[1].innerHTML = '+';
                }
            } else {
                this.nextSibling.classList.add('bkgwebmap-layercontentactive');
                if (this.childNodes[1]) {
                    this.childNodes[1].innerHTML = '\u2212';
                }
            }
        }

        // Open or close layer div
        function openCloseLayer() {
            if (this.parentNode.parentNode.nextSibling.classList.contains('bkgwebmap-layercontentactive')) {
                this.parentNode.parentNode.nextSibling.classList.remove('bkgwebmap-layercontentactive');
            } else {
                this.parentNode.parentNode.nextSibling.classList.add('bkgwebmap-layercontentactive');
            }
        }

        // Open or close group div
        function openCloseGroup(headerwrapper, iconOpen, iconClosed, nodePosition, activeClass, sibling) {
            var parserGroupIconOpen = new DOMParser();
            var groupIconOpen = parserGroupIconOpen.parseFromString(BKGWebMap.PANEL_ICONS[iconOpen], 'text/xml');
            var parserGroupIconClosed = new DOMParser();
            var groupIconClosed = parserGroupIconClosed.parseFromString(BKGWebMap.PANEL_ICONS[iconClosed], 'text/xml');
            if (sibling.classList.contains(activeClass)) {
                sibling.classList.remove(activeClass);
                headerwrapper.childNodes[nodePosition].innerHTML = '';
                headerwrapper.childNodes[nodePosition].appendChild(groupIconClosed.documentElement);
            } else {
                sibling.classList.add(activeClass);
                headerwrapper.childNodes[nodePosition].innerHTML = '';
                headerwrapper.childNodes[nodePosition].appendChild(groupIconOpen.documentElement);
            }
        }

        // Set layer visibility (also update originalConfig, used for persistence json)
        function setVisible(layer, visible, newParamsWMS) {
            // Find if layer is part of a group
            var inGroup = false;
            var groupVisible = false;
            var element = document.getElementById(layer.getProperties().uniqueId);
            if (element && element.parentNode && element.parentNode.previousSibling && element.parentNode.previousSibling.classList.contains('bkgwebmap-layerswitchergroupheader')) {
                var groupElement = element.parentNode.previousSibling;
                if (groupElement.getElementsByClassName('bkgwebmap-layerheaderinput').length) {
                    inGroup = true;
                    groupVisible = groupElement.getElementsByClassName('bkgwebmap-layerheaderinput')[0].checked;
                }
            }
            layer.setVisible(visible);
            if (!newParamsWMS && layer.getProperties().originalConfig) {
                layer.getProperties().originalConfig.visibility = visible;
            }
            var definedVisibility;
            if ((typeof layer.getSource === 'function' && (layer.getSource() instanceof ol.source.ImageWMS || layer.getSource() instanceof ol.source.TileWMS)) && layer.getLayers().length && BKGWebMap.Util.hasNestedProperty(layer.getProperties(), 'originalConfig.layers')) {
                if (!visible && newParamsWMS != null) {
                    layer.getSource().updateParams({
                        LAYERS: newParamsWMS.LAYERS.join(),
                        STYLES: newParamsWMS.STYLES.join()
                    });
                }
                for (var i = 0; i < layer.getProperties().originalConfig.layers.length; i++) {
                    definedVisibility = false;
                    var k;
                    if (newParamsWMS === null && visible && (layer.getProperties().originalConfig.layers[i].visibility || layer.getProperties().originalConfig.layers[i].visibility === undefined)) {
                        var subLayerName = layer.getProperties().originalConfig.layers[i].layer;
                        if (document.getElementById(layer.get('uniqueId'))) {
                            var inputsSublayers = document.getElementById(layer.get('uniqueId')).querySelectorAll('[data-bkgwebmap-wmssublayer]');
                            for (k = 0; k < inputsSublayers.length; k++) {
                                if (inputsSublayers[k].getAttribute('data-bkgwebmap-wmssublayer') === subLayerName) {
                                    inputsSublayers[k].checked = true;
                                    var event = document.createEvent('HTMLEvents');
                                    event.initEvent('change', true, true);
                                    inputsSublayers[k].dispatchEvent(event);
                                }
                            }
                        }
                    } else if (newParamsWMS) {
                        for (k = 0; k < newParamsWMS.LAYERS.length; k++) {
                            if (layer.getProperties().originalConfig.layers[i].layer && layer.getProperties().originalConfig.layers[i].layer === newParamsWMS.LAYERS[k]) {
                                layer.getProperties().originalConfig.layers[i].visibility = true;
                                definedVisibility = true;
                                if (newParamsWMS.STYLES && newParamsWMS.STYLES[k] !== undefined) {
                                    layer.getProperties().originalConfig.layers[i].style = newParamsWMS.STYLES[k];
                                }
                            }
                            if (!definedVisibility) {
                                layer.getProperties().originalConfig.layers[i].visibility = false;
                            }
                        }
                    }
                }
            } else if (BKGWebMap.Util.hasNestedProperty(layer.getProperties(), 'originalConfig')) {
                layer.getProperties().originalConfig.visibility = visible;
            }

            map.getControls().forEach(function (control) {
                if (BKGWebMap.Control.Legend && control instanceof BKGWebMap.Control.Legend) {
                    control.changeLegend(layer, visible, newParamsWMS, inGroup, groupVisible);
                }
            });
            updatePermaLink();
        }

        // Add a new baselayer and remove the old one
        function addRemoveBaselayer(_this, layer) {
            var baselayerDivs = document.getElementById(elementId).getElementsByClassName('bkgwebmap-baselayerdivselected');
            var id;
            for (var i = 0; i < baselayerDivs.length; i++) {
                map.getLayers().forEach(function (singleLayer) {
                    id = singleLayer.get('uniqueId');
                    if (id === baselayerDivs[i].id) {
                        setVisible(singleLayer, false, null);
                    }
                });
                baselayerDivs[i].classList.remove('bkgwebmap-baselayerdivselected');
            }
            _this.classList.add('bkgwebmap-baselayerdivselected');
            setVisible(layer, true, null);
        }

        // Change icons color on hover
        function mouseEnterLayerIcons(_this) {
            _this.getElementsByTagName('path')[0].style.fill = '#000000';
        }

        function mouseLeaveLayerIcons(_this) {
            _this.getElementsByTagName('path')[0].style.fill = '#757D75';
        }

        // Zoom map to extent
        function zoomToExtent(layer) {
            if (layer.getVisible()) {
                if (layer.getSource() instanceof ol.source.Vector) {
                    if (layer.getSource().getExtent().indexOf(Infinity) !== -1 && layer.fullExtent) {
                        map.getView().fit(layer.fullExtent, { size: map.getSize() });
                        zoomToResolutionLimits(layer, layer.getSource().getExtent());
                    } else {
                        zoomToResolutionLimits(layer, layer.getSource().getExtent());
                    }
                } else if (layer.extent && layer.extent instanceof Array) {
                    zoomToResolutionLimits(layer, layer.extent);
                }
            }
        }

        function zoomToResolutionLimits(layer, extent) {
            var zoom;
            if (layer.getMaxResolution() && typeof layer.getMaxResolution() === 'number' && layer.getMaxResolution() !== Infinity) {
                zoom = Math.ceil(map.getView().getZoomForResolution(layer.getMaxResolution()) * 10) / 10;
                map.getView().fit(extent, { size: map.getSize() });
                map.getView().setZoom(zoom);
            } else {
                map.getView().fit(extent, { size: map.getSize() });
            }
        }


        // Create div for opacity control
        function createOpacityDiv(layer) {
            // Opacity
            var opacityDiv = document.createElement('div');
            opacityDiv.className = 'bkgwebmap-opacitysliderdiv';
            var opacityTitle = document.createTextNode('Transparenz: ');
            var opacityValue = document.createElement('span');
            var opacityBreak = document.createElement('br');
            var opacityInput = document.createElement('input');
            opacityInput.className = 'bkgwebmap-opacityslider';
            opacityInput.setAttribute('type', 'range');
            opacityInput.setAttribute('min', '0');
            opacityInput.setAttribute('max', '1');
            opacityInput.setAttribute('step', '0.1');

            opacityDiv.appendChild(opacityTitle);
            opacityDiv.appendChild(opacityValue);
            opacityDiv.appendChild(opacityBreak);
            opacityDiv.appendChild(opacityInput);

            var currentOpacity = layer.getOpacity();
            opacityInput.value = currentOpacity;
            opacityValue.innerHTML = currentOpacity;

            opacityInput.addEventListener('input', function () {
                currentOpacity = opacityInput.value;
                layer.setOpacity(currentOpacity);
                opacityValue.innerHTML = currentOpacity;
            }, { passive: true });
            // For IE
            opacityInput.addEventListener('change', function () {
                currentOpacity = opacityInput.value;
                layer.setOpacity(currentOpacity);
                opacityValue.innerHTML = currentOpacity;
            }, { passive: true });

            return opacityDiv;
        }

        // Show tooltip on hover and hide all other
        function showHideTooltips(tooltip) {
            var allTooltips = document.getElementById(mapId).getElementsByClassName('bkgwebmap-layertooltip');
            for (var i = 0; i < allTooltips.length; i++) {
                allTooltips[i].style.visibility = '';
            }

            tooltip.style.visibility = 'visible';
            setTimeout(function () {
                tooltip.style.visibility = '';
            }, 1200);
        }

        // Create div for change style control
        function createChangeStyleDiv(layer) {
            var changeStyleDiv = document.createElement('div');
            changeStyleDiv.className = 'bkgwebmap-changestylediv';

            var changeStyleTitleDiv = document.createElement('div');
            changeStyleTitleDiv.innerHTML = 'Symbolisierung:';
            changeStyleDiv.appendChild(changeStyleTitleDiv);

            var changeStyleColorsDiv = document.createElement('div');
            changeStyleColorsDiv.className = 'bkgwebmap-changestylecolorsdiv';
            changeStyleDiv.appendChild(changeStyleColorsDiv);

            var colorsArray = BKGWebMap.MAP_ICONS_COLORS;
            var strokeColor = layer.getStyle().getStroke().getColor();
            var geometryType = BKGWebMap.Util.findGeometryType(layer.getSource().getFeatures());
            for (var i = 0; i < colorsArray.length; i++) {
                var colorDiv = document.createElement('div');
                colorDiv.className = 'bkgwebmap-changestylecolorcheckbox';
                colorDiv.setAttribute('data-bkgwebmap-colorcheckbox', colorsArray[i]);
                colorDiv.setAttribute('data-bkgwebmap-bordercolorcheckbox', strokeColor);

                var iconSvgString;
                if (geometryType.indexOf('Polygon') !== -1) {
                    iconSvgString = BKGWebMap.PANEL_ICONS.CHECKBOX_UNSELECTED.a + colorsArray[i] + BKGWebMap.PANEL_ICONS.CHECKBOX_UNSELECTED.c + strokeColor + BKGWebMap.PANEL_ICONS.CHECKBOX_UNSELECTED.d;
                } else {
                    iconSvgString = BKGWebMap.PANEL_ICONS.CHECKBOX_UNSELECTED.a + colorsArray[i] + BKGWebMap.PANEL_ICONS.CHECKBOX_UNSELECTED.b;
                }
                var parserIconColorNotSelected = new DOMParser();
                var iconColorNotSelected = parserIconColorNotSelected.parseFromString(iconSvgString, 'text/xml');
                colorDiv.appendChild(iconColorNotSelected.documentElement);
                changeStyleColorsDiv.appendChild(colorDiv);

                // Change color
                colorDiv.querySelector('svg').addEventListener('click', function () {
                    changeColor(this, layer, changeStyleColorsDiv);
                });
            }

            var changeStyleSymbolDiv = document.createElement('div');
            changeStyleSymbolDiv.className = 'bkgwebmap-changestylesymboldiv';

            if (geometryType.indexOf('Point') !== -1) {
                changeStyleDiv.appendChild(changeStyleSymbolDiv);
            }

            layer.getSource().on('change', function () {
                var styleCheckboxes;
                var i;
                if (layer.getSource().getState() === 'ready') {
                    geometryType = BKGWebMap.Util.findGeometryType(layer.getSource().getFeatures());

                    if (geometryType.indexOf('Point') !== -1) {
                        changeStyleDiv.appendChild(changeStyleSymbolDiv);
                    } else if (geometryType.indexOf('Polygon') !== -1) {
                        styleCheckboxes = changeStyleDiv.getElementsByClassName('bkgwebmap-changestylecolorcheckbox');
                        for (i = 0; i < styleCheckboxes.length; i++) {
                            styleCheckboxes[i].innerHTML = '';
                            var strokeColor = styleCheckboxes[i].getAttribute('data-bkgwebmap-bordercolorcheckbox');
                            var fillColor = styleCheckboxes[i].getAttribute('data-bkgwebmap-colorcheckbox');
                            var iconSvgString;
                            if (styleCheckboxes[i].classList.contains('selected')) {
                                iconSvgString = BKGWebMap.PANEL_ICONS.CHECKBOX_SELECTED.a + fillColor + BKGWebMap.PANEL_ICONS.CHECKBOX_SELECTED.c + strokeColor + BKGWebMap.PANEL_ICONS.CHECKBOX_SELECTED.d;
                            } else {
                                iconSvgString = BKGWebMap.PANEL_ICONS.CHECKBOX_UNSELECTED.a + fillColor + BKGWebMap.PANEL_ICONS.CHECKBOX_UNSELECTED.c + strokeColor + BKGWebMap.PANEL_ICONS.CHECKBOX_UNSELECTED.d;
                            }
                            var parserIconColorNotSelected = new DOMParser();
                            var iconColorNotSelected = parserIconColorNotSelected.parseFromString(iconSvgString, 'text/xml');
                            styleCheckboxes[i].appendChild(iconColorNotSelected.documentElement);
                            // Change color
                            styleCheckboxes[i].querySelector('svg').addEventListener('click', function () {
                                changeColor(this, layer, changeStyleColorsDiv);
                            });
                        }
                    } else if (geometryType.indexOf('LineString') !== -1) {
                        styleCheckboxes = changeStyleDiv.getElementsByClassName('bkgwebmap-changestylecolorcheckbox');
                        for (i = 0; i < styleCheckboxes.length; i++) {
                            if (styleCheckboxes[i].classList.contains('selected')) {
                                changeColor(styleCheckboxes[i].getElementsByTagName('svg')[0], layer, styleCheckboxes[i].parentNode);
                            }
                        }
                    }
                }
            });

            var symbols = BKGWebMap.MAP_ICONS;
            for (var symbol in symbols) {
                var symbolDiv = document.createElement('div');
                symbolDiv.className = 'bkgwebmap-changestylesymbol';
                symbolDiv.setAttribute('data-bkgwebmap-stylesymbol', symbol);
                var symbolSvgString = BKGWebMap.MAP_ICONS[symbol].a + colorsArray[0] + BKGWebMap.MAP_ICONS[symbol].b + colorsArray[0] + BKGWebMap.MAP_ICONS[symbol].c;
                var parserSymbolSvg = new DOMParser();
                var symbolSvg = parserSymbolSvg.parseFromString(symbolSvgString, 'text/xml');
                symbolDiv.appendChild(symbolSvg.documentElement);
                changeStyleSymbolDiv.appendChild(symbolDiv);

                // Change symbol
                symbolDiv.querySelector('svg').addEventListener('click', function () {
                    changeSymbol(this, layer, changeStyleSymbolDiv);
                });
            }

            return changeStyleDiv;
        }

        // Change color of vector layer
        function changeColor(svg, layer, changeStyleColorsDiv) {
            var newStyle;
            var color = svg.parentNode.getAttribute('data-bkgwebmap-colorcheckbox');
            var strokeColorDefault = svg.parentNode.getAttribute('data-bkgwebmap-bordercolorcheckbox');
            var style = layer.getStyle();
            var strokeColor;
            var anchor;
            var geometryType = BKGWebMap.Util.findGeometryType(layer.getSource().getFeatures());
            svg.parentNode.classList.add('selected');
            if (typeof style === 'function') {
                if (geometryType.indexOf('LineString') !== -1) {
                    strokeColor = color;
                } else {
                    strokeColor = strokeColorDefault;
                }
                anchor = [0.5, 1];
                var svgColor = BKGWebMap.Style.svgColor(color);
                var newSymbol = BKGWebMap.MAP_ICONS_ENCODED.circle.a + svgColor + BKGWebMap.MAP_ICONS_ENCODED.circle.b + '%23FFFFFF' + BKGWebMap.MAP_ICONS_ENCODED.circle.c;
                newStyle = new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: color
                    }),
                    stroke: new ol.style.Stroke({
                        color: strokeColor,
                        width: 1
                    }),
                    image: new ol.style.Icon(({
                        anchor: anchor,
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        imgSize: BKGWebMap.MAP_ICONS_ENCODED.circle.size,
                        src: 'data:image/svg+xml;charset=utf8,' + newSymbol
                    }))
                });
                newStyle.getImage().anchor = anchor;
                layer.setStyle(newStyle);
            } else {
                strokeColor = color;
                // Fill
                if (typeof style.getFill === 'function' && style.getFill() !== null && typeof style.getFill().setColor === 'function') {
                    style.getFill().setColor(color);
                    if (geometryType.indexOf('LineString') !== -1) {
                        style.getStroke().setColor(color);
                    } else {
                        style.getStroke().setColor(strokeColorDefault);
                    }
                }

                // Stroke (only for lines)
                if ((geometryType.indexOf('LineString') !== -1) && (typeof style.getStroke === 'function' && style.getStroke() !== null && typeof style.getStroke().setColor === 'function')) {
                    style.getStroke().setColor(color);
                } else {
                    style.getStroke().setColor(strokeColorDefault);
                }

                // Circle
                if (typeof style.getImage === 'function' && style.getImage() && typeof style.getImage().getFill === 'function') {
                    style.getImage().getFill().setColor(color);
                    var radius = style.getImage().getRadius();
                    style.getImage().setRadius(radius + 1);
                    style.getImage().setRadius(radius);
                }

                // Icon
                if (typeof style.getImage === 'function' && style.getImage() instanceof ol.style.Icon) {
                    var src = style.getImage().getSrc();
                    var size = layer.getStyle().getImage().getSize();

                    anchor = layer.getStyle().getImage().getAnchor();
                    var units = 'pixels';
                    if (!anchor) {
                        anchor = layer.getStyle().getImage().anchor;
                        units = 'fraction';
                    }

                    var oldColor = src.substring(src.indexOf('fill%3A') + 7, src.indexOf('%3Bfill-opacity%3A'));
                    src = src.replace('fill%3A' + oldColor, 'fill%3A' + BKGWebMap.Style.svgColor(color));

                    if (geometryType.indexOf('LineString') !== -1) {
                        strokeColor = color;
                    } else {
                        strokeColor = strokeColorDefault;
                    }

                    newStyle = new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: color
                        }),
                        stroke: new ol.style.Stroke({
                            color: strokeColor,
                            width: 1
                        }),
                        image: new ol.style.Icon(({
                            anchor: anchor,
                            anchorXUnits: units,
                            anchorYUnits: units,
                            imgSize: size,
                            src: src
                        }))
                    });
                    if (units === 'fraction') {
                        newStyle.getImage().anchor = anchor;
                    }
                    layer.setStyle(newStyle);
                }
            }
            layer.changed();

            showColorSelection(svg, layer, changeStyleColorsDiv);
        }

        // Change color icons in menu when selecting a new color
        function showColorSelection(selectedColorIcon, layer, changeStyleColorsDiv) {
            var selectedColor = selectedColorIcon.parentNode.getAttribute('data-bkgwebmap-colorcheckbox');
            var colorDivs = changeStyleColorsDiv.getElementsByClassName('bkgwebmap-changestylecolorcheckbox');
            var strokeColor = selectedColorIcon.parentNode.getAttribute('data-bkgwebmap-bordercolorcheckbox');
            var geometryType = BKGWebMap.Util.findGeometryType(layer.getSource().getFeatures());
            var color;
            var iconSvgString;
            var parserIcon;
            var icon;
            for (var i = 0; i < colorDivs.length; i++) {
                color = colorDivs[i].getAttribute('data-bkgwebmap-colorcheckbox');
                colorDivs[i].innerHTML = '';
                if (color === selectedColor) {
                    if (geometryType.indexOf('Polygon') !== -1) {
                        iconSvgString = BKGWebMap.PANEL_ICONS.CHECKBOX_SELECTED.a + color + BKGWebMap.PANEL_ICONS.CHECKBOX_SELECTED.c + strokeColor + BKGWebMap.PANEL_ICONS.CHECKBOX_SELECTED.d;
                    } else {
                        iconSvgString = BKGWebMap.PANEL_ICONS.CHECKBOX_SELECTED.a + color + BKGWebMap.PANEL_ICONS.CHECKBOX_SELECTED.b;
                    }
                } else if (geometryType.indexOf('Polygon') !== -1) {
                    iconSvgString = BKGWebMap.PANEL_ICONS.CHECKBOX_UNSELECTED.a + color + BKGWebMap.PANEL_ICONS.CHECKBOX_UNSELECTED.c + strokeColor + BKGWebMap.PANEL_ICONS.CHECKBOX_UNSELECTED.d;
                } else {
                    iconSvgString = BKGWebMap.PANEL_ICONS.CHECKBOX_UNSELECTED.a + color + BKGWebMap.PANEL_ICONS.CHECKBOX_UNSELECTED.b;
                }
                parserIcon = new DOMParser();
                icon = parserIcon.parseFromString(iconSvgString, 'text/xml');
                colorDivs[i].appendChild(icon.documentElement);

                colorDivs[i].querySelector('svg').addEventListener('click', function () {
                    changeColor(this, layer, changeStyleColorsDiv);
                });
            }
        }

        // Change symbol icon when selecting a new symbol
        function changeSymbol(svg, layer, changeStyleSymbolDiv) {
            var style = layer.getStyle();
            var symbolName = svg.parentNode.getAttribute('data-bkgwebmap-stylesymbol');
            var colorFill;
            var colorStroke;
            var anchor;
            var newSymbol;
            var newStyle;

            if (typeof style === 'function') {
                colorFill = style.call()[0].getFill().getColor();
                colorStroke = style.call()[0].getStroke().getColor();

                anchor = [0.5, 0.5];
                if (symbolName === 'marker') {
                    anchor = [0.5, 1];
                }

                var svgColorFill = BKGWebMap.Style.svgColor(colorFill);
                var svgColorStroke = BKGWebMap.Style.svgColor(colorStroke);
                newSymbol = BKGWebMap.MAP_ICONS_ENCODED[symbolName].a + svgColorFill + BKGWebMap.MAP_ICONS_ENCODED[symbolName].b + svgColorStroke + BKGWebMap.MAP_ICONS_ENCODED[symbolName].c;

                newStyle = new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: colorFill
                    }),
                    stroke: new ol.style.Stroke({
                        color: colorStroke,
                        width: 1
                    }),
                    image: new ol.style.Icon(({
                        anchor: anchor,
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        imgSize: BKGWebMap.MAP_ICONS_ENCODED[symbolName].size,
                        src: 'data:image/svg+xml;charset=utf8,' + newSymbol
                    }))
                });
                newStyle.getImage().anchor = anchor;
                layer.setStyle(newStyle);
            }
            // Fill
            if (typeof style.getFill === 'function' && style.getFill() !== null && typeof style.getFill().setColor === 'function') {
                colorFill = style.getFill().getColor();
            }

            // Stroke
            if (typeof style.getStroke === 'function' && style.getStroke() !== null && typeof style.getStroke().setColor === 'function') {
                colorStroke = style.getStroke().getColor();
            }

            // Icon
            if (typeof style.getImage === 'function' && style.getImage() instanceof ol.style.Icon) {
                var src = style.getImage().getSrc();
                anchor = [0.5, 0.5];
                if (symbolName === 'marker') {
                    anchor = [0.5, 1];
                }
                var svgColor = src.substring(src.indexOf('fill%3A') + 7, src.indexOf('%3Bfill-opacity%3A'));
                var svgStrokeColor = src.substring(src.indexOf('stroke%3A') + 9, src.indexOf('%3Bstroke-width%3A'));

                newSymbol = BKGWebMap.MAP_ICONS_ENCODED[symbolName].a + svgColor + BKGWebMap.MAP_ICONS_ENCODED[symbolName].b + svgStrokeColor + BKGWebMap.MAP_ICONS_ENCODED[symbolName].c;

                newStyle = new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: colorFill
                    }),
                    stroke: new ol.style.Stroke({
                        color: colorStroke,
                        width: 1
                    }),
                    image: new ol.style.Icon(({
                        anchor: anchor,
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        imgSize: BKGWebMap.MAP_ICONS_ENCODED[symbolName].size,
                        src: 'data:image/svg+xml;charset=utf8,' + newSymbol
                    }))
                });
                newStyle.getImage().anchor = anchor;
                layer.setStyle(newStyle);
            }
            layer.changed();

            showSymbolSelection(svg, layer, changeStyleSymbolDiv);
        }


        function showSymbolSelection(selectedSymbolIcon, layer, changeStyleSymbolDiv) {
            var selectedSymbol = selectedSymbolIcon.parentNode.getAttribute('data-bkgwebmap-stylesymbol');
            var symbolDivs = changeStyleSymbolDiv.getElementsByClassName('bkgwebmap-changestylesymbol');
            var symbol;
            var colorDefault = '#407E40';
            var colorSelect = '#FF0000';
            var iconSvgString;
            var parserIcon;
            var icon;
            for (var i = 0; i < symbolDivs.length; i++) {
                symbol = symbolDivs[i].getAttribute('data-bkgwebmap-stylesymbol');
                symbolDivs[i].innerHTML = '';
                if (symbol === selectedSymbol) {
                    iconSvgString = BKGWebMap.MAP_ICONS[symbol].a + colorSelect + BKGWebMap.MAP_ICONS[symbol].b + colorSelect + BKGWebMap.MAP_ICONS[symbol].c;
                } else {
                    iconSvgString = BKGWebMap.MAP_ICONS[symbol].a + colorDefault + BKGWebMap.MAP_ICONS[symbol].b + colorDefault + BKGWebMap.MAP_ICONS[symbol].c;
                }
                parserIcon = new DOMParser();
                icon = parserIcon.parseFromString(iconSvgString, 'text/xml');
                symbolDivs[i].appendChild(icon.documentElement);

                symbolDivs[i].querySelector('svg').addEventListener('click', function () {
                    changeSymbol(this, layer, changeStyleSymbolDiv);
                });
            }
        }

        // Reload WMS after selecting a layer or changing style
        function reloadWms(layerId) {
            var subLayerNodes = document.getElementById(layerId).querySelectorAll('[data-bkgwebmap-wmssublayer]');
            var inputLayerVisibility = document.getElementById(layerId + 'title').getElementsByClassName('bkgwebmap-layerheaderinput')[0];
            var subLayersToLoad = [];
            var subLayersToSetVisible = [];
            var subLayerName;
            var stylesToLoad = [];
            var stylesToSetVisible = [];
            var id;
            var resolutionLimitsWMS;
            var mapResolution;
            var checkLayerMinResolution;
            var checkLayerMaxResolution;
            var event;
            var newParams;
            for (var i = 0; i < subLayerNodes.length; i++) {
                subLayerName = subLayerNodes[i].getAttribute('data-bkgwebmap-wmssublayer');
                resolutionLimitsWMS = false;
                mapResolution = map.getView().getResolution();
                map.getLayers().forEach(function (layer) {
                    if (layer instanceof ol.layer.Group) {
                        layer.getLayers().forEach(function (grouplayer) {
                            if ((grouplayer.getSource() instanceof ol.source.ImageWMS || grouplayer.getSource() instanceof ol.source.TileWMS) && grouplayer.get('uniqueId') === layerId) {
                                grouplayer.getLayers().forEach(function (singleLayer) {
                                    if (singleLayer.layer === subLayerName) {
                                        checkLayerMinResolution = !((singleLayer.minResolution && mapResolution < singleLayer.minResolution));
                                        checkLayerMaxResolution = !((singleLayer.maxResolution && mapResolution > singleLayer.maxResolution));
                                        resolutionLimitsWMS = !((checkLayerMinResolution && checkLayerMaxResolution));
                                    }
                                });
                            }
                        });
                    } else if ((layer.getSource() instanceof ol.source.ImageWMS || layer.getSource() instanceof ol.source.TileWMS) && layer.get('uniqueId') === layerId) {
                        layer.getLayers().forEach(function (singleLayer) {
                            if (singleLayer.layer === subLayerName) {
                                checkLayerMinResolution = !((singleLayer.minResolution && mapResolution < singleLayer.minResolution));
                                checkLayerMaxResolution = !((singleLayer.maxResolution && mapResolution > singleLayer.maxResolution));
                                resolutionLimitsWMS = !((checkLayerMinResolution && checkLayerMaxResolution));
                            }
                        });
                    }
                });
                if (subLayerNodes[i].checked && !resolutionLimitsWMS && inputLayerVisibility.checked) {
                    subLayersToLoad.push(subLayerName);
                    if (subLayerNodes[i].parentNode.parentNode.parentNode.querySelectorAll('[data-bkgwebmap-wmssublayerstyle]').length) {
                        stylesToLoad.push(subLayerNodes[i].parentNode.parentNode.parentNode.querySelectorAll('[data-bkgwebmap-wmssublayerstyle]')[0].value);
                    } else if (subLayerNodes[i].getAttribute('data-bkgwebmap-defaultstyle')) {
                        stylesToLoad.push(subLayerNodes[i].getAttribute('data-bkgwebmap-defaultstyle'));
                    } else {
                        stylesToLoad.push('');
                    }
                    // If the sublayer not visible on this resolution, just change visibility in original config
                } else if (subLayerNodes[i].checked) {
                    subLayersToSetVisible.push(subLayerName);
                    if (subLayerNodes[i].parentNode.parentNode.parentNode.querySelectorAll('[data-bkgwebmap-wmssublayerstyle]').length) {
                        stylesToSetVisible.push(subLayerNodes[i].parentNode.parentNode.parentNode.querySelectorAll('[data-bkgwebmap-wmssublayerstyle]')[0].value);
                    } else if (subLayerNodes[i].getAttribute('data-bkgwebmap-defaultstyle')) {
                        stylesToSetVisible.push(subLayerNodes[i].getAttribute('data-bkgwebmap-defaultstyle'));
                    } else {
                        stylesToSetVisible.push('');
                    }
                }
            }
            if (!subLayersToLoad.length && !subLayersToSetVisible.length) {
                inputLayerVisibility.checked = false;
                event = document.createEvent('HTMLEvents');
                event.initEvent('change', false, true);
                inputLayerVisibility.dispatchEvent(event);
            }
            map.getLayers().forEach(function (singleLayer) {
                if (singleLayer instanceof ol.layer.Group) {
                    singleLayer.getLayers().forEach(function (singleLayerInGroup) {
                        id = singleLayerInGroup.get('uniqueId');
                        if (id === layerId) {
                            _this.ajaxLoader(singleLayer);
                            if (subLayersToLoad.length) {
                                newParams = { LAYERS: subLayersToLoad, STYLES: stylesToLoad };
                                singleLayerInGroup.getSource().updateParams({
                                    LAYERS: subLayersToLoad.join(),
                                    STYLES: stylesToLoad.join()
                                });
                                if (subLayersToSetVisible.length) {
                                    newParams.LAYERS = subLayersToLoad.concat(subLayersToSetVisible);
                                    newParams.STYLES = stylesToLoad.concat(stylesToSetVisible);
                                }
                                setVisible(singleLayerInGroup, true, newParams);
                            } else if (subLayersToSetVisible.length) {
                                newParams = {};
                                singleLayerInGroup.getSource().updateParams({
                                    LAYERS: '',
                                    STYLES: ''
                                });
                                if (subLayersToSetVisible.length) {
                                    newParams.LAYERS = subLayersToSetVisible;
                                    newParams.STYLES = stylesToSetVisible;
                                }
                                setVisible(singleLayerInGroup, false, newParams);
                            } else {
                                setVisible(singleLayerInGroup, false, null);
                            }
                        }
                    });
                } else {
                    id = singleLayer.get('uniqueId');
                    if (id === layerId) {
                        if (subLayersToLoad.length) {
                            newParams = { LAYERS: subLayersToLoad, STYLES: stylesToLoad };
                            singleLayer.getSource().updateParams({
                                LAYERS: subLayersToLoad.join(),
                                STYLES: stylesToLoad.join()
                            });
                            if (subLayersToSetVisible.length) {
                                newParams.LAYERS = subLayersToLoad.concat(subLayersToSetVisible);
                                newParams.STYLES = stylesToLoad.concat(stylesToSetVisible);
                            }
                            setVisible(singleLayer, true, newParams);
                        } else if (subLayersToSetVisible.length) {
                            newParams = {};
                            singleLayer.getSource().updateParams({
                                LAYERS: '',
                                STYLES: ''
                            });
                            if (subLayersToSetVisible.length) {
                                newParams.LAYERS = subLayersToLoad.concat(subLayersToSetVisible);
                                newParams.STYLES = stylesToLoad.concat(stylesToSetVisible);
                            }
                            setVisible(singleLayer, false, newParams);
                        } else {
                            setVisible(singleLayer, false, null);
                        }
                    }
                }
            });
        }

        // Create dropdown menu for selecting WMS style
        function createStyleDropdown(layerUniqueId, subLayer, subLayerStyles) {
            var dropdownDiv = document.createElement('div');
            var styleTitle = document.createTextNode('Stil: ');
            var dropdown = document.createElement('select');
            dropdown.setAttribute('data-bkgwebmap-wmslayerid', layerUniqueId);
            dropdown.setAttribute('data-bkgwebmap-wmssublayerstyle', subLayer.layer);
            var createDom = false;
            for (var layerName in subLayerStyles) {
                if (Object.prototype.hasOwnProperty.call(subLayerStyles, layerName) && layerName === subLayer.layer) {
                    if (subLayerStyles[layerName].length <= 1) {
                        return undefined;
                    }
                    for (var i = 0; i < subLayerStyles[layerName].length; i++) {
                        var option = document.createElement('option');
                        option.setAttribute('value', subLayerStyles[layerName][i].Name);
                        if (subLayer.style && subLayer.style === subLayerStyles[layerName][i].Name) {
                            option.setAttribute('selected', 'selected');
                        }
                        if (subLayerStyles[layerName][i].Title === '' || subLayerStyles[layerName][i].Title === undefined) {
                            option.innerHTML = subLayerStyles[layerName][i].Name;
                        } else {
                            option.innerHTML = subLayerStyles[layerName][i].Title;
                        }
                        dropdown.appendChild(option);
                        createDom = true;
                    }
                }
            }
            dropdown.onchange = function () {
                var layerId = this.getAttribute('data-bkgwebmap-wmslayerid');
                reloadWms(layerId);
            };
            if (!createDom) {
                return undefined;
            }

            dropdownDiv.appendChild(styleTitle);
            dropdownDiv.appendChild(dropdown);
            return dropdownDiv;
        }

        // Remove a layer from the layer switcher
        function removeLayer() {
            var layerId = this.getAttribute('data-bkgwebmap-layer-unique-id');
            var currentLayerId;
            map.getLayers().forEach(function (layer) {
                currentLayerId = layer.getProperties().uniqueId;
                if (layer.getProperties().customLayer && currentLayerId === layerId) {
                    map.removeLayer(layer);
                    document.getElementById(currentLayerId).remove();

                    map.getControls().forEach(function (control) {
                        if (BKGWebMap.Control.Legend && control instanceof BKGWebMap.Control.Legend) {
                            control.removeLayerFromLegend(layer);
                        }
                        if (BKGWebMap.Control.Copyright && control instanceof BKGWebMap.Control.Copyright) {
                            control.removeLayerFromCopyright();
                        }
                    });
                }
            });
        }

        // Create div to remove a layer
        function createRemoveLayerDiv(layer) {
            var removeLayerDiv = document.createElement('div');
            removeLayerDiv.className = 'bkgwebmap-removelayer bkgwebmap-paneltooltip';
            var parserRemoveLayerDivIcon = new DOMParser();
            var removeLayerDivIcon = parserRemoveLayerDivIcon.parseFromString(BKGWebMap.PANEL_ICONS.TRASH, 'text/xml');
            removeLayerDiv.appendChild(removeLayerDivIcon.documentElement);
            var removeLayerDivTooltip = document.createElement('span');
            removeLayerDivTooltip.className = 'bkgwebmap-paneltooltiptext bkgwebmap-removelayertooltip';
            removeLayerDivTooltip.innerHTML = 'Layer entfernen';
            removeLayerDiv.appendChild(removeLayerDivTooltip);
            var layerId = layer.getProperties().uniqueId;

            removeLayerDiv.setAttribute('data-bkgwebmap-layer-unique-id', layerId);
            removeLayerDiv.addEventListener('click', removeLayer);
            removeLayerDiv.addEventListener('mouseenter', function () {
                showHideTooltips(removeLayerDivTooltip);
            });

            return removeLayerDiv;
        }

        // Create divs for WMS layers
        function createWmsSubLayerDiv(layer, subLayer) {
            var subLayerStyles = layer.getStyleInfo();
            var layerUniqueId = layer.getProperties().uniqueId;
            var defaultStyle = '';
            if (subLayer.style !== undefined && subLayer.style !== null) {
                defaultStyle = subLayer.style;
            }
            var wmsSubLayerDiv = document.createElement('div');
            wmsSubLayerDiv.className = 'bkgwebmap-wmssublayerdiv';

            var inputDiv = document.createElement('div');
            inputDiv.className = 'bkgwebmap-layerheaderwmsinputdiv';
            wmsSubLayerDiv.appendChild(inputDiv);

            var inputLabel = document.createElement('label');
            var parserIconEmpty = new DOMParser();
            var clickIconEmpty = parserIconEmpty.parseFromString(BKGWebMap.PANEL_ICONS.LAYER_HIDDEN, 'text/xml');
            var parserIconFull = new DOMParser();
            var clickIconFull = parserIconFull.parseFromString(BKGWebMap.PANEL_ICONS.LAYER_SHOWN, 'text/xml');
            inputDiv.appendChild(inputLabel);

            var input = document.createElement('input');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('data-bkgwebmap-wmssublayer', subLayer.layer);
            input.setAttribute('data-bkgwebmap-wmslayerid', layerUniqueId);
            input.setAttribute('data-bkgwebmap-defaultstyle', defaultStyle);
            inputLabel.appendChild(input);

            var visible = BKGWebMap.LAYERS.WMS.VISIBLE;
            if (Object.prototype.hasOwnProperty.call(subLayer, 'visibility')) {
                visible = subLayer.visibility;
            }

            var clickIcon = clickIconEmpty;
            if (visible) {
                clickIcon = clickIconFull;
            }
            inputLabel.appendChild(clickIcon.documentElement);

            input.checked = visible;
            input.onchange = function () {
                var label = this.parentNode;
                label.removeChild(label.childNodes[1]);
                parserIconEmpty = new DOMParser();
                clickIconEmpty = parserIconEmpty.parseFromString(BKGWebMap.PANEL_ICONS.LAYER_HIDDEN, 'text/xml');
                parserIconFull = new DOMParser();
                clickIconFull = parserIconFull.parseFromString(BKGWebMap.PANEL_ICONS.LAYER_SHOWN, 'text/xml');
                if (this.checked) {
                    label.appendChild(clickIconFull.documentElement);
                } else {
                    label.appendChild(clickIconEmpty.documentElement);
                }
                var layerId = this.getAttribute('data-bkgwebmap-wmslayerid');
                reloadWms(layerId);
            };

            var layerTitle = document.createElement('div');
            layerTitle.className = 'bkgwebmap-layerheaderwmstitle';
            if (subLayer.name) {
                layerTitle.innerHTML = subLayer.name;
            } else {
                layerTitle.innerHTML = subLayer.layer;
            }
            wmsSubLayerDiv.appendChild(layerTitle);

            if (subLayer.selectStyle && subLayerStyles) {
                var dropdownDom = createStyleDropdown(layerUniqueId, subLayer, subLayerStyles);
                if (dropdownDom) {
                    wmsSubLayerDiv.appendChild(dropdownDom);
                }
            }
            return wmsSubLayerDiv;
        }

        // Create divs for WMS service
        function createWmsLayersDiv(layer, subLayers) {
            var wmsLayersDiv = document.createElement('div');
            wmsLayersDiv.className = 'bkgwebmap-wmslayersdiv';

            for (var i = 0; i < subLayers.length; i++) {
                wmsLayersDiv.appendChild(createWmsSubLayerDiv(layer, subLayers[i]));
            }

            return wmsLayersDiv;
        }

        // Change layer order using arrows
        function changeLayerOrder(_this, delta) {
            var div = _this.parentNode.parentNode.parentNode;
            var parentDiv = div.parentNode;
            var divToOverpass;
            if (delta === 1) {
                divToOverpass = div.previousSibling;
                parentDiv.insertBefore(div, divToOverpass);
            } else if (delta === -1) {
                divToOverpass = div.nextSibling.nextSibling;
                parentDiv.insertBefore(div, divToOverpass);
            }
            var layer;
            var id = div.id;
            var index;
            var i;
            var layersArray = map.getLayers().getArray();
            if (_this.hasAttribute('data-bkgwebmap-group')) {
                var groupId = _this.getAttribute('data-bkgwebmap-group');
                for (i = 0; i < layersArray.length; i++) {
                    if (groupId === layersArray[i].getProperties().uniqueId) {
                        var groupLayer = layersArray[i];
                        var groupLayerArray = groupLayer.getLayers().getArray();
                        for (var k = 0; k < groupLayerArray.length; k++) {
                            if (id === groupLayerArray[k].getProperties().uniqueId) {
                                index = k;
                            }
                        }
                        layer = groupLayer.getLayers().removeAt(index);
                        groupLayer.getLayers().insertAt(index + delta, layer);
                    }
                }
            } else {
                for (i = 0; i < layersArray.length; i++) {
                    if (id === layersArray[i].getProperties().uniqueId) {
                        index = i;
                    }
                }
                layer = map.getLayers().removeAt(index);
                map.getLayers().insertAt(index + delta, layer);
            }
            showHideArrows();

            // Update permalink
            updatePermaLink();
        }

        // Show or hide arrows to change layer order
        function showHideArrows() {
            var i;
            // Show all arrows
            var arrowsDown = document.getElementById(elementId).getElementsByClassName('bkgwebmap-layerheaderdownwrapper');
            for (i = 0; i < arrowsDown.length; i++) {
                arrowsDown[i].style.display = 'table-cell';
            }
            var arrowsUp = document.getElementById(elementId).getElementsByClassName('bkgwebmap-layerheaderupwrapper');
            for (i = 0; i < arrowsUp.length; i++) {
                arrowsUp[i].style.display = 'table-cell';
            }

            // Hide first-last of layers
            var layers = document.getElementById(elementId).getElementsByClassName('bkgwebmap-overlayscontent')[0];
            if (layers && layers.childElementCount) {
                layers.childNodes[0].getElementsByClassName('bkgwebmap-layerheaderupwrapper')[0].style.display = 'none';
                layers.childNodes[layers.childElementCount - 1].getElementsByClassName('bkgwebmap-layerheaderdownwrapper')[0].style.display = 'none';
            }

            // Hide first-last in groups
            var groups = document.getElementById(elementId).getElementsByClassName('bkgwebmap-layerswitchergroupheader');
            for (i = 0; i < groups.length; i++) {
                var layersCount = groups[i].parentNode.childNodes[1].childElementCount;
                if (layersCount) {
                    groups[i].parentNode.childNodes[1].getElementsByClassName('bkgwebmap-layerheaderupwrapper')[0].style.display = 'none';
                    groups[i].parentNode.childNodes[1].getElementsByClassName('bkgwebmap-layerheaderdownwrapper')[layersCount - 1].style.display = 'none';
                }
            }
        }

        // Create arrows to change layer order
        function createLayerUpDownDom(layerDivHeader, groupLayerId) {
            var layerDown = document.createElement('div');
            layerDown.className = 'bkgwebmap-layerheaderdown';
            if (groupLayerId) {
                layerDown.setAttribute('data-bkgwebmap-group', groupLayerId);
            }
            var parserLayerDown = new DOMParser();
            var layerDownIcon = parserLayerDown.parseFromString(BKGWebMap.PANEL_ICONS.ARROW_DOWN, 'text/xml');
            layerDown.appendChild(layerDownIcon.documentElement);
            var layerDownWrapper = document.createElement('div');
            layerDownWrapper.className = 'bkgwebmap-layerheaderdownwrapper';
            layerDownWrapper.appendChild(layerDown);
            layerDivHeader.appendChild(layerDownWrapper);

            var layerUp = document.createElement('div');
            layerUp.className = 'bkgwebmap-layerheaderup';
            if (groupLayerId) {
                layerUp.setAttribute('data-bkgwebmap-group', groupLayerId);
            }
            var parserLayerUp = new DOMParser();
            var layerUpIcon = parserLayerUp.parseFromString(BKGWebMap.PANEL_ICONS.ARROW_UP, 'text/xml');
            layerUp.appendChild(layerUpIcon.documentElement);
            var layerUpWrapper = document.createElement('div');
            layerUpWrapper.className = 'bkgwebmap-layerheaderupwrapper';
            layerUpWrapper.appendChild(layerUp);
            layerDivHeader.appendChild(layerUpWrapper);

            layerDown.addEventListener('click', function () {
                changeLayerOrder(this, -1);
            });
            layerUp.addEventListener('click', function () {
                changeLayerOrder(this, 1);
            });
            layerDown.addEventListener('mouseenter', function () {
                mouseEnterLayerIcons(this);
            });
            layerDown.addEventListener('mouseleave', function () {
                mouseLeaveLayerIcons(this);
            });
            layerUp.addEventListener('mouseenter', function () {
                mouseEnterLayerIcons(this);
            });
            layerUp.addEventListener('mouseleave', function () {
                mouseLeaveLayerIcons(this);
            });
        }

        // Create layer selection menu
        function createLayerMenu(changeVisibilityControl, level, name, id, layer, groupLayerId) {
            // level: main - group - layer - baselayer
            var classToAdd = '';
            var extraClass = '';
            var layerDiv = document.createElement('div');
            var layerDivHeader = document.createElement('div');
            if (level === 'layer') {
                extraClass = ' bkgwebmap-layerswitcherlayerheader ' + id + 'ajax';
                layerDiv.id = id;
                layerDivHeader.id = id + 'title';
            } else if (level === 'group') {
                extraClass = ' bkgwebmap-layerswitchergroupheader';
                layerDiv.id = id;
                layerDivHeader.id = id + 'title';
            } else if (level === 'main') {
                classToAdd = id;
                extraClass = ' bkgwebmap-layerswitchermainheader';
            } else if (level === 'baselayer') {
                extraClass = ' bkgwebmap-layerswitcherbaselayerheader';
                classToAdd = ' ' + id + 'ajax';
                layerDiv.id = id;
                layerDivHeader.id = id + 'title';
            }

            if (classToAdd) {
                layerDiv.className = classToAdd;
            }
            layerDivHeader.className = 'bkgwebmap-layerheader' + extraClass;
            extraClass = '';
            var layerTitle;
            var visible;
            var subLayers;
            var subLayersWMS = false;
            if (level === 'layer') {
                if ((layer.getSource() instanceof ol.source.ImageWMS || layer.getSource() instanceof ol.source.TileWMS) && showWMSLayers) {
                    subLayersWMS = true;
                    subLayers = layer.getLayers();
                }
                extraClass = ' bkgwebmap-layerheaderinputdivlayer';
                layerTitle = document.createElement('div');
                layerTitle.className = 'bkgwebmap-layerheadertitlediv' + extraClass;
                layerTitle.innerHTML = name;

                var subInputDiv = document.createElement('div');
                subInputDiv.className = 'bkgwebmap-layerheaderinputdiv';

                var subInputLabel = document.createElement('label');
                var subParserIconEmpty = new DOMParser();
                var subClickIconEmpty = subParserIconEmpty.parseFromString(BKGWebMap.PANEL_ICONS.LAYER_HIDDEN, 'text/xml');
                var subParserIconFull = new DOMParser();
                var subClickIconFull = subParserIconFull.parseFromString(BKGWebMap.PANEL_ICONS.LAYER_SHOWN, 'text/xml');
                subInputDiv.appendChild(subInputLabel);

                var subInput = document.createElement('input');
                subInput.setAttribute('type', 'checkbox');
                subInput.className = 'bkgwebmap-layerheaderinput';
                subInputLabel.appendChild(subInput);

                layerDivHeader.appendChild(subInputDiv);
                if (subLayersWMS) {
                    visible = layer.getProperties().visible;
                } else {
                    visible = layer.get('visible');
                }
                var subClickIcon = subClickIconEmpty;
                if (visible) {
                    subClickIcon = subClickIconFull;
                }
                subInputLabel.appendChild(subClickIcon.documentElement);
                subInput.checked = visible;
                subInput.onchange = function (e) {
                    var label = this.parentNode;
                    label.removeChild(label.childNodes[1]);
                    subParserIconEmpty = new DOMParser();
                    subClickIconEmpty = subParserIconEmpty.parseFromString(BKGWebMap.PANEL_ICONS.LAYER_HIDDEN, 'text/xml');
                    subParserIconFull = new DOMParser();
                    subClickIconFull = subParserIconFull.parseFromString(BKGWebMap.PANEL_ICONS.LAYER_SHOWN, 'text/xml');
                    if (this.checked) {
                        label.appendChild(subClickIconFull.documentElement);
                    } else {
                        label.appendChild(subClickIconEmpty.documentElement);
                    }
                    setVisible(layer, e.target.checked, null);
                };
                layerDivHeader.appendChild(layerTitle);

                if (layer.getSource() instanceof ol.source.Vector || (typeof layer.extent && layer.extent instanceof Array)) {
                    var zoomToLayer = document.createElement('div');
                    zoomToLayer.className = 'bkgwebmap-layerheaderzoom bkgwebmap-paneltooltip';
                    var parserZoomToLayer = new DOMParser();
                    var zoomToLayerIcon = parserZoomToLayer.parseFromString(BKGWebMap.PANEL_ICONS.ZOOM_IN, 'text/xml');
                    zoomToLayer.appendChild(zoomToLayerIcon.documentElement);
                    var zoomToLayerWrapper = document.createElement('div');
                    zoomToLayerWrapper.className = 'bkgwebmap-layerheaderzoomwrapper';
                    zoomToLayerWrapper.appendChild(zoomToLayer);
                    layerDivHeader.appendChild(zoomToLayerWrapper);

                    var zoomToLayerTooltip = document.createElement('span');
                    zoomToLayerTooltip.className = 'bkgwebmap-paneltooltiptext bkgwebmap-layertooltip';
                    zoomToLayerTooltip.innerHTML = 'Auf die Layer-Ausdehnung zoomen';
                    zoomToLayer.appendChild(zoomToLayerTooltip);

                    zoomToLayer.addEventListener('click', function () {
                        zoomToExtent(layer);
                    });
                    zoomToLayer.addEventListener('mouseenter', function () {
                        mouseEnterLayerIcons(this);
                        showHideTooltips(zoomToLayerTooltip);
                    });
                    zoomToLayer.addEventListener('mouseleave', function () {
                        mouseLeaveLayerIcons(this);
                    });
                }

                if (layer instanceof ol.layer.Vector || changeVisibilityControl) {
                    var adjust = document.createElement('div');
                    adjust.className = 'bkgwebmap-layerheaderadjust bkgwebmap-paneltooltip';
                    var parserAdjustIcon = new DOMParser();
                    var adjustIcon = parserAdjustIcon.parseFromString(BKGWebMap.PANEL_ICONS.GEAR_WHEEL, 'text/xml');
                    adjust.appendChild(adjustIcon.documentElement);
                    var adjustWrapper = document.createElement('div');
                    adjustWrapper.className = 'bkgwebmap-layerheaderadjustwrapper';
                    adjustWrapper.appendChild(adjust);
                    layerDivHeader.appendChild(adjustWrapper);

                    var adjustTooltip = document.createElement('span');
                    adjustTooltip.className = 'bkgwebmap-paneltooltiptext bkgwebmap-layertooltip';
                    adjustTooltip.innerHTML = 'Einstellungen';
                    adjust.appendChild(adjustTooltip);

                    adjust.addEventListener('click', openCloseLayer);
                    adjust.addEventListener('mouseenter', function () {
                        mouseEnterLayerIcons(this);
                        showHideTooltips(adjustTooltip);
                    });
                    adjust.addEventListener('mouseleave', function () {
                        mouseLeaveLayerIcons(this);
                    });
                }

                if (changeOrder) {
                    createLayerUpDownDom(layerDivHeader, groupLayerId);
                }
            } else if (level === 'group') {
                var groupHeaderWrapper = document.createElement('div');

                var inputDiv = document.createElement('div');
                inputDiv.className = 'bkgwebmap-layerheaderinputdiv';

                var inputLabel = document.createElement('label');
                var parserIconEmpty = new DOMParser();
                var clickIconEmpty = parserIconEmpty.parseFromString(BKGWebMap.PANEL_ICONS.LAYER_HIDDEN, 'text/xml');
                var parserIconFull = new DOMParser();
                var clickIconFull = parserIconFull.parseFromString(BKGWebMap.PANEL_ICONS.LAYER_SHOWN, 'text/xml');
                inputDiv.appendChild(inputLabel);

                var input = document.createElement('input');
                input.setAttribute('type', 'checkbox');
                input.className = 'bkgwebmap-layerheaderinput';
                inputLabel.appendChild(input);
                groupHeaderWrapper.appendChild(inputDiv);

                var clickIcon = clickIconEmpty;
                visible = layer.get('visible');
                if (visible) {
                    clickIcon = clickIconFull;
                }
                inputLabel.appendChild(clickIcon.documentElement);

                input.checked = visible;
                input.onchange = function (e) {
                    var label = this.parentNode;
                    label.removeChild(label.childNodes[1]);
                    parserIconEmpty = new DOMParser();
                    clickIconEmpty = parserIconEmpty.parseFromString(BKGWebMap.PANEL_ICONS.LAYER_HIDDEN, 'text/xml');
                    parserIconFull = new DOMParser();
                    clickIconFull = parserIconFull.parseFromString(BKGWebMap.PANEL_ICONS.LAYER_SHOWN, 'text/xml');
                    if (this.checked) {
                        label.appendChild(clickIconFull.documentElement);
                    } else {
                        label.appendChild(clickIconEmpty.documentElement);
                    }
                    setVisible(layer, e.target.checked, null);
                };
                var groupIcon = document.createElement('div');
                groupIcon.className = 'bkgwebmap-layerheadergroupicon';
                var parsergroupIconClosed = new DOMParser();
                var groupIconClosed = parsergroupIconClosed.parseFromString(BKGWebMap.PANEL_ICONS.FOLDER_CLOSED, 'text/xml');
                var parsergroupIconOpen = new DOMParser();
                var groupIconOpen = parsergroupIconOpen.parseFromString(BKGWebMap.PANEL_ICONS.FOLDER_OPEN, 'text/xml');
                if (openLevel === 2) {
                    groupIcon.appendChild(groupIconOpen.documentElement);
                } else {
                    groupIcon.appendChild(groupIconClosed.documentElement);
                }
                groupHeaderWrapper.appendChild(groupIcon);

                layerTitle = document.createElement('div');
                layerTitle.className = 'bkgwebmap-layerheadergrouptext';
                layerTitle.innerHTML = name;
                groupHeaderWrapper.appendChild(layerTitle);

                layerDivHeader.appendChild(groupHeaderWrapper);

                if (changeOrder) {
                    createLayerUpDownDom(layerDivHeader, groupLayerId);
                }

                groupHeaderWrapper.addEventListener('click', function () {
                    openCloseGroup(this, 'FOLDER_OPEN', 'FOLDER_CLOSED', 1, 'bkgwebmap-layercontentactive', this.parentNode.nextSibling);
                });
            } else if (level === 'main') {
                layerTitle = document.createElement('div');
                layerTitle.className = 'bkgwebmap-layerheadermaintext';
                layerTitle.innerHTML = name;
                layerDivHeader.appendChild(layerTitle);

                var plusMinus = document.createElement('div');
                plusMinus.className = 'bkgwebmap-layerheaderplusminus';
                if (openLevel === 1 || openLevel === 2) {
                    plusMinus.innerHTML = '\u2212';
                } else {
                    plusMinus.innerHTML = '+';
                }
                layerDivHeader.appendChild(plusMinus);

                layerDivHeader.addEventListener('click', openCloseMain);
            } else if (level === 'baselayer') {
                layerDiv.className = 'bkgwebmap-baselayerdiv' + classToAdd;
                layerTitle = document.createElement('div');
                layerTitle.className = 'bkgwebmap-layerheadertitlediv bkgwebmap-baselayertitlediv';
                layerTitle.innerHTML = name;
                layerDivHeader.appendChild(layerTitle);

                visible = layer.get('visible');
                if (visible) {
                    addRemoveBaselayer(layerDiv, layer);
                }

                layerDiv.addEventListener('click', function () {
                    addRemoveBaselayer(this, layer);
                });
            } else {
                return undefined;
            }
            layerDiv.appendChild(layerDivHeader);

            if (level !== 'baselayer') {
                var layerContent = document.createElement('div');
                if (level !== 'main') {
                    layerContent.id = id + 'content';
                }
                layerContent.className = 'bkgwebmap-layercontent ' + id + 'content';
                if (level === 'layer') {
                    if (changeVisibilityControl) {
                        layerContent.appendChild(createOpacityDiv(layer));
                    }
                    if (layer instanceof ol.layer.Vector && editStyle) {
                        layerContent.appendChild(createChangeStyleDiv(layer));
                    }
                    if (subLayersWMS) {
                        layerContent.appendChild(createWmsLayersDiv(layer, subLayers));
                    }
                    if (layer.getProperties().customLayer) {
                        layerContent.appendChild(createRemoveLayerDiv(layer));
                    }
                } else if (level === 'main' && (openLevel === 1 || openLevel === 2)) {
                    layerContent.classList.add('bkgwebmap-layercontentactive');
                } else if (level === 'group' && (openLevel === 2)) {
                    layerContent.classList.add('bkgwebmap-layercontentactive');
                }
                layerDiv.appendChild(layerContent);
            }
            return layerDiv;
        }

        function clickControl() {
            if (inPanel) {
                var activeContent = panel.getActiveContent();
                if (activeContent === '') {
                    panel.openPanel();
                    panel.changePanelContent(title, layerSwitcherContentClass);
                    _this.activeIcon();
                } else if (activeContent === layerSwitcherContentClass) {
                    panel.closePanel();
                } else {
                    panel.changePanelContent(title, layerSwitcherContentClass);
                    _this.activeIcon();
                }
            } else if (layerSwitcherContent.style.display === 'none') {
                layerSwitcherContent.style.display = 'block';
            } else {
                layerSwitcherContent.style.display = 'none';
            }
        }

        this.activeIcon = function () {
            layerSwitcher.classList.add('bkgwebmap-panelactive');
        };

        function addLayersInDom(changeVisibilityControl, layer, name, id, baseLayer, group, groupLayerId) {
            var mainDiv;
            if (baseLayer) {
                if (!document.getElementById(elementId).getElementsByClassName('bkgwebmap-baselayers').length) {
                    mainDiv = createLayerMenu(false, 'main', 'Hintergrundkarte', 'bkgwebmap-baselayers', layer, groupLayerId);
                    if (mainDiv) {
                        layerSwitcherContent.insertBefore(mainDiv, layerSwitcherContent.childNodes[0]);
                    }
                }
                var baseLayerDiv = createLayerMenu(false, 'baselayer', name, id, layer);
                if (baseLayerDiv) {
                    document.getElementById(elementId).getElementsByClassName('bkgwebmap-baselayerscontent')[0].insertBefore(baseLayerDiv, document.getElementById(elementId).getElementsByClassName('bkgwebmap-baselayerscontent')[0].childNodes[0]);
                }
            } else {
                if (!document.getElementById(elementId).getElementsByClassName('bkgwebmap-overlays').length) {
                    mainDiv = createLayerMenu(false, 'main', 'Overlays', 'bkgwebmap-overlays', layer, groupLayerId);
                    if (mainDiv) {
                        layerSwitcherContent.appendChild(mainDiv);
                    }
                }
                if (group) {
                    var groupDiv = createLayerMenu(false, 'group', name, id, layer, groupLayerId);
                    if (groupDiv) {
                        document.getElementById(elementId).getElementsByClassName('bkgwebmap-overlayscontent')[0].insertBefore(groupDiv, document.getElementById(elementId).getElementsByClassName('bkgwebmap-overlayscontent')[0].childNodes[0]);
                    }
                } else {
                    var element = createLayerMenu(changeVisibilityControl, 'layer', name, id, layer, groupLayerId);
                    var parent;
                    if (groupLayerId) {
                        parent = groupLayerId + 'content';
                        if (element.getElementsByClassName('bkgwebmap-layerheaderinputdiv').length) {
                            element.getElementsByClassName('bkgwebmap-layerheaderinputdiv')[0].classList.add('bkgwebmap-layerheaderinputdivgroup');
                        }
                        document.getElementById(parent).insertBefore(element, document.getElementById(parent).childNodes[0]);
                    } else {
                        parent = 'bkgwebmap-overlayscontent';
                        document.getElementById(elementId).getElementsByClassName(parent)[0].insertBefore(element, document.getElementById(elementId).getElementsByClassName(parent)[0].childNodes[0]);
                    }
                }
                if (changeOrder) {
                    showHideArrows();
                }
            }
        }

        // Show or hide ajax loader icon
        function showHideAjaxLoader(id, show) {
            if (show) {
                if (document.getElementsByClassName(id + 'ajax').length) {
                    document.getElementsByClassName(id + 'ajax')[0].classList.add('bkgwebmap-ajaxloader');
                }
            } else if (document.getElementById(id + 'title')) {
                if (document.getElementsByClassName(id + 'ajax').length) {
                    document.getElementsByClassName(id + 'ajax')[0].classList.remove('bkgwebmap-ajaxloader');
                }
            }
        }

        /**
         * Add container for Custom Layers Control
         * @returns {HTMLDivElement}
         */
        this.addCustomLayersContainer = function (customLayersContainer) {
            // Add overlays div if it doesn't exist
            if (!document.getElementById(elementId).getElementsByClassName('bkgwebmap-overlays').length) {
                var overlaysDiv = createLayerMenu(false, 'main', 'Overlays', 'bkgwebmap-overlays', '', '');
                if (overlaysDiv) {
                    layerSwitcherContent.appendChild(overlaysDiv);
                }
            }
            layerSwitcherContent.appendChild(customLayersContainer);
        };

        /**
         * Add layers in layer switcher
         * @param {object} layer - layer that should be added
         * @param {boolean} baseLayer - Is it a baselayer
         * @param {string|boolean} groupLayerId - ID of group that layer belongs to.
         */
        /**
         * Add layers in layer switcher
         * @param {object} layer - layer that should be added
         * @param {boolean} baseLayer - Is it a baselayer
         * @param {string|boolean} groupLayerId - ID of group that layer belongs to.
         * @param {boolean} useDefaultChangeVisibility - Should the default value of changeVisibility used
         * @param {boolean|null} customChangeVisibility - Custom value of changeVisibility
         */
        this.addInLayerSwitcher = function (layer, baseLayer, groupLayerId, useDefaultChangeVisibility, customChangeVisibility) {
            var group = false;
            var name = layer.getProperties().name;
            var id = layer.getProperties().uniqueId;
            var changeVisibilityControl = customChangeVisibility;

            if (useDefaultChangeVisibility) {
                changeVisibilityControl = changeVisibility;
            }

            if (layer instanceof ol.layer.Group) {
                group = true;
                addLayersInDom(changeVisibilityControl, layer, name, id, baseLayer, group, groupLayerId);
                layer.getLayers().forEach(function (sublayer) {
                    _this.addInLayerSwitcher(sublayer, baseLayer, id, useDefaultChangeVisibility, customChangeVisibility);
                });
            } else {
                addLayersInDom(changeVisibilityControl, layer, name, id, baseLayer, group, groupLayerId);
            }
        };

        /**
         * Show in layer switcher if a layer is displayed in actual resolution
         * @param {object} layer - Layer that should be used
         */
        this.resolutionLimits = function (layer) {
            if (layer instanceof ol.layer.Group) {
                layer.getLayers().forEach(function (sublayer) {
                    _this.resolutionLimits(sublayer);
                });
            } else {
                var id = layer.getProperties().uniqueId;
                var layerMinResolution = layer.getMinResolution();
                var layerMaxResolution = layer.getMaxResolution();
                var mapResolution = map.getView().getResolution();
                var opacityChanged;
                var elementDOM = document.getElementById(id);
                if (elementDOM && (layerMinResolution > mapResolution || layerMaxResolution < mapResolution)) {
                    elementDOM.style.opacity = 0.5;
                    opacityChanged = true;
                    adjustSelect(elementDOM, true);
                } else if (elementDOM) {
                    elementDOM.style.opacity = 1;
                    adjustSelect(elementDOM, false);
                }
                if ((layer.getSource() instanceof ol.source.ImageWMS || layer.getSource() instanceof ol.source.TileWMS) && layer.getLayers()) {
                    layer.getLayers().forEach(function (sublayer) {
                        var subLayerName = sublayer.layer;
                        var subLayerNodes = document.getElementById(id).querySelectorAll('[data-bkgwebmap-wmssublayer]');
                        for (var i = 0; i < subLayerNodes.length; i++) {
                            if (subLayerName === subLayerNodes[i].getAttribute('data-bkgwebmap-wmssublayer')) {
                                var sublayerDiv = subLayerNodes[i].parentNode.parentNode.parentNode;
                                if (!opacityChanged && ((sublayer.minResolution && sublayer.minResolution > mapResolution) || (sublayer.maxResolution && sublayer.maxResolution < mapResolution))) {
                                    sublayerDiv.style.opacity = 0.5;
                                    adjustSelect(sublayerDiv, true);
                                } else if (!opacityChanged) {
                                    sublayerDiv.style.opacity = 1;
                                    adjustSelect(sublayerDiv, false);
                                } else {
                                    sublayerDiv.style.opacity = 1;
                                    adjustSelect(sublayerDiv, true);
                                }
                            }
                        }
                    });
                }
            }
        };

        function adjustSelect(el, disabled) {
            var selects = el.getElementsByTagName('select');
            if (selects.length) {
                for (var i = 0; i < selects.length; i++) {
                    selects[i].disabled = disabled;
                }
            }
        }

        function checkAjaxLoaded(id, tilesLoaded, tilesPending) {
            if (tilesLoaded === tilesPending) {
                showHideAjaxLoader(id, false);
            }
        }

        /**
         * Add an ajax loader for specific layer
         * @param {object} layer - Layer that should be used
         */
        this.ajaxLoader = function (layer) {
            var id = layer.get('uniqueId');
            if (layer instanceof ol.layer.Group) {
                layer.getLayers().forEach(function (sublayer) {
                    _this.ajaxLoader(sublayer);
                });
            } else if (layer instanceof ol.layer.Tile) {
                var tilesLoaded = 0;
                var tilesPending = 0;
                layer.getSource().on('tileloadstart', function () {
                    showHideAjaxLoader(id, true);
                    tilesPending++;
                });
                layer.getSource().on('tileloadend', function () {
                    tilesLoaded++;
                    checkAjaxLoaded(id, tilesLoaded, tilesPending);
                });
                layer.getSource().on('tileloaderror', function () {
                    tilesLoaded++;
                    checkAjaxLoaded(id, tilesLoaded, tilesPending);
                });
            } else if (layer instanceof ol.layer.Image && !(layer instanceof BKGWebMap.Layer.NONE)) {
                layer.getSource().on('imageloadstart', function () {
                    showHideAjaxLoader(id, true);
                });
                layer.getSource().on('imageloadend', function () {
                    showHideAjaxLoader(id, false);
                });
                layer.getSource().on('imageloaderror', function () {
                    showHideAjaxLoader(id, false);
                });
            } else if (layer instanceof ol.layer.Vector) {
                layer.on('precompose', function () {
                    showHideAjaxLoader(id, true);
                });
                layer.on('postcompose', function () {
                    showHideAjaxLoader(id, false);
                });
            }
        };

        // Event listeners
        var elementForEvent = layerSwitcher;
        if (!inPanel) {
            elementForEvent = layerSwitcher.querySelector('svg');
        }
        elementForEvent.addEventListener('click', clickControl, { passive: true });
        elementForEvent.addEventListener('mouseenter', function () {
            var allTooltips = document.getElementById(elementId).getElementsByClassName('bkgwebmap-paneltooltiptext');
            for (var i = 0; i < allTooltips.length; i++) {
                allTooltips[i].style.visibility = '';
            }
            layerSwitcherTooltip.style.visibility = 'visible';
            setTimeout(function () {
                layerSwitcherTooltip.style.visibility = '';
            }, 1200);
        }, false);

        // Finalize control
        ol.control.Control.call(this, {
            element: layerSwitcher,
            target: target
        });
    };
};
