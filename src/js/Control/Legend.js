/**
 * Create Legend Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_legend}
 */
BKGWebMap.Control.createLegend = function () {
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

        var target;
        var inPanel = true;
        if (options.div && options.div !== '') {
            target = options.div;
            inPanel = false;
            elementId = target;
        } else {
            target = panel.element.getElementsByClassName('bkgwebmap-panelbar')[0];
        }

        // Control title for panel
        var title = 'Legende';

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
        var legend = document.createElement('div');
        legend.className = 'bkgwebmap-legend ' + tooltipClass + customClass;

        var parser = new DOMParser();
        var legendIcon = parser.parseFromString(BKGWebMap.PANEL_ICONS.LEGEND, 'text/xml');
        if (inPanel) {
            legendIcon.documentElement.setAttribute('class', 'bkgwebmap-panelicons bkgwebmap-paneliconsopen');
        } else {
            legendIcon.documentElement.setAttribute('class', 'bkgwebmap-panelicons');
        }
        legend.appendChild(legendIcon.documentElement);

        var legendTooltip = document.createElement('span');
        legendTooltip.className = tooltipTextClass;
        legendTooltip.innerHTML = title;
        legend.appendChild(legendTooltip);

        var legendContent = document.createElement('div');
        var legendContentClass = 'bkgwebmap-legendcontent bkgwebmap-selectable';
        legendContent.className = legendContentClass + ' bkgwebmap-panelsinglecontent';
        if (inPanel) {
            panel.addPanelContent(legendContent);
        } else {
            legend.appendChild(legendContent);
            legendContent.style.display = 'none';
        }

        function clickControl() {
            if (inPanel) {
                var activeContent = panel.getActiveContent();
                if (activeContent === '') {
                    panel.openPanel();
                    panel.changePanelContent(title, legendContentClass);
                    _this.activeIcon();
                } else if (activeContent === legendContentClass) {
                    panel.closePanel();
                } else {
                    panel.changePanelContent(title, legendContentClass);
                    _this.activeIcon();
                }
            } else if (legendContent.style.display === 'none') {
                legendContent.style.display = 'block';
            } else {
                legendContent.style.display = 'none';
            }
        }

        this.activeIcon = function () {
            legend.classList.add('bkgwebmap-panelactive');
        };

        function getNewLegendUrl(element, legendInfo, name, newParamsWMS) {
            var styleName;
            for (var i = 0; i < newParamsWMS.LAYERS.length; i++) {
                styleName = '';
                if (name === newParamsWMS.LAYERS[i]) {
                    element.classList.add('bkgwebmap-legendlayeractive');
                    styleName = newParamsWMS.STYLES[i];
                    if (legendInfo && typeof legendInfo[name] === 'object' && legendInfo[name].constructor === Object) {
                        return legendInfo[name][styleName];
                    }
                }
            }
            return undefined;
        }

        function reloadWmsLegend(layer, newParamsWMS) {
            var legendInfo = layer.getLegendInfo();
            var uniqueId = layer.getProperties().uniqueId;
            var wmsLayers = document.getElementById(elementId).querySelectorAll('[data-bkgwebmap-legendlayerid]');

            for (var i = 0; i < wmsLayers.length; i++) {
                var id = wmsLayers[i].getAttribute('data-bkgwebmap-legendlayerid');
                if (uniqueId === id) {
                    var nameElements = wmsLayers[i].querySelectorAll('[data-bkgwebmap-legendlayerwmsname]');
                    for (var k = 0; k < nameElements.length; k++) {
                        nameElements[k].classList.remove('bkgwebmap-legendlayeractive');
                        var name = nameElements[k].getAttribute('data-bkgwebmap-legendlayerwmsname');
                        var newUrl = getNewLegendUrl(nameElements[k], legendInfo, name, newParamsWMS);
                        if (newUrl) {
                            nameElements[k].getElementsByTagName('img')[0].setAttribute('src', newUrl);
                        }
                    }
                }
            }
        }

        /**
         * Add a legend of a new layer
         * @param {object} layer - Layer that should be added
         */
        this.addLayerToLegend = function (layer, inGroup, groupVisibility) {
            if (layer instanceof ol.layer.Group) {
                var groupLayerVisibility = layer.getVisible();
                layer.getLayers().forEach(function (sublayer) {
                    _this.addLayerToLegend(sublayer, true, groupLayerVisibility);
                });
            } else {
                var layerLegendDiv;
                var layerLegendDivTitle;
                var layerLegendDivImgDiv;
                var layerLegendDivImg;
                var url = layer.getProperties().legendUrl;
                var layerActive = false;
                if ((layer instanceof BKGWebMap.Layer.ImageWMS || layer instanceof BKGWebMap.Layer.TileWMS) && !url) {
                    var activateLegend = true;
                    var legendInfo = layer.getLegendInfo();
                    if (!legendInfo) {
                        return;
                    }

                    layerLegendDiv = document.createElement('div');
                    layerLegendDiv.className = 'bkgwebmap-legendlayer';
                    layerLegendDiv.setAttribute('data-bkgwebmap-legendlayerid', layer.getProperties().uniqueId);
                    legendContent.appendChild(layerLegendDiv);

                    layerLegendDivTitle = document.createElement('div');
                    layerLegendDivTitle.className = 'bkgwebmap-legendlayertitle';
                    layerLegendDivTitle.innerHTML = layer.getProperties().name;
                    layerLegendDiv.appendChild(layerLegendDivTitle);

                    var subLayers = layer.getLayers();

                    for (var i = 0; i < subLayers.length; i++) {
                        var legendUrl = '';

                        var layerLegendDivWms = document.createElement('div');
                        if (subLayers[i].visibility && layer.getVisible()) {
                            layerLegendDivWms.className = 'bkgwebmap-legendlayer bkgwebmap-legendlayerwms bkgwebmap-legendlayeractive';
                            layerActive = true;
                        } else {
                            layerLegendDivWms.className = 'bkgwebmap-legendlayer bkgwebmap-legendlayerwms';
                        }
                        layerLegendDivWms.setAttribute('data-bkgwebmap-legendlayerid', subLayers[i].uniqueId);
                        layerLegendDivWms.setAttribute('data-bkgwebmap-legendlayerwmsname', subLayers[i].layer);
                        layerLegendDiv.appendChild(layerLegendDivWms);

                        layerLegendDivTitle = document.createElement('div');
                        layerLegendDivTitle.className = 'bkgwebmap-legendlayertitle bkgwebmap-legendlayertitlewms';
                        layerLegendDivTitle.innerHTML = subLayers[i].name;
                        layerLegendDivWms.appendChild(layerLegendDivTitle);

                        layerLegendDivImgDiv = document.createElement('div');
                        layerLegendDivImgDiv.className = 'bkgwebmap-legendlayerimg';
                        layerLegendDivWms.appendChild(layerLegendDivImgDiv);

                        layerLegendDivImg = document.createElement('img');

                        if (legendInfo && (typeof legendInfo[subLayers[i].layer] === 'string' || legendInfo[subLayers[i].layer] instanceof String)) {
                            legendUrl = legendInfo[subLayers[i].layer];
                        } else if (legendInfo && typeof legendInfo[subLayers[i].layer] === 'object' && legendInfo[subLayers[i].layer].constructor === Object) {
                            if (subLayers[i].style) {
                                legendUrl = legendInfo[subLayers[i].layer][subLayers[i].style];
                            } else {
                                var counter = 0;
                                var defaultUrl = '';
                                for (var styleName in legendInfo[subLayers[i].layer]) {
                                    counter++;
                                    if (counter === 1) {
                                        legendUrl = legendInfo[subLayers[i].layer][styleName];
                                    }
                                    defaultUrl = legendInfo[subLayers[i].layer][styleName];
                                    if (styleName.toLowerCase().indexOf('default') !== -1) {
                                        legendUrl = legendInfo[subLayers[i].layer][styleName];
                                    }
                                }
                                if (counter === 1) {
                                    legendUrl = defaultUrl;
                                }
                            }
                        }
                        if (legendUrl) {
                            layerLegendDivImg.setAttribute('src', legendUrl);
                        } else {
                            activateLegend = false;
                        }

                        layerLegendDivImgDiv.appendChild(layerLegendDivImg);
                    }

                    if (inGroup && !groupVisibility) {
                        layerActive = false;
                    }

                    if (layerActive && legendInfo && activateLegend) {
                        layerLegendDiv.classList.add('bkgwebmap-legendlayeractive');
                    }
                } else if (url) {
                    layerLegendDiv = document.createElement('div');
                    layerActive = layer.getVisible();

                    if (inGroup && !groupVisibility) {
                        layerActive = false;
                    }

                    if (layerActive) {
                        layerLegendDiv.className = 'bkgwebmap-legendlayer bkgwebmap-legendlayeractive';
                    } else {
                        layerLegendDiv.className = 'bkgwebmap-legendlayer';
                    }
                    layerLegendDiv.setAttribute('data-bkgwebmap-legendlayerid', layer.getProperties().uniqueId);
                    legendContent.appendChild(layerLegendDiv);

                    layerLegendDivTitle = document.createElement('div');
                    layerLegendDivTitle.className = 'bkgwebmap-legendlayertitle';
                    layerLegendDivTitle.innerHTML = layer.getProperties().name;
                    layerLegendDiv.appendChild(layerLegendDivTitle);

                    layerLegendDivImgDiv = document.createElement('div');
                    layerLegendDivImgDiv.className = 'bkgwebmap-legendlayerimg';
                    layerLegendDiv.appendChild(layerLegendDivImgDiv);

                    layerLegendDivImg = document.createElement('img');
                    layerLegendDivImg.setAttribute('src', url);
                    layerLegendDivImgDiv.appendChild(layerLegendDivImg);
                }
            }
        };

        /**
         * Remove legend when removing a custom layer
         * @param {object} layer - Layer that should be removed
         */
        this.removeLayerFromLegend = function (layer) {
            var uniqueId = layer.getProperties().uniqueId;
            var legendElements = document.getElementById(elementId).querySelectorAll('[data-bkgwebmap-legendlayerid]');
            for (var k = 0; k < legendElements.length; k++) {
                var legendElementId = legendElements[k].getAttribute('data-bkgwebmap-legendlayerid');
                if (uniqueId === legendElementId) {
                    legendElements[k].parentNode.removeChild(legendElements[k]);
                }
            }
        };

        /**
         * Show/hide legend of a layer
         * @param {object} layer - Layer that should be used
         * @param {boolean} visible - Show or hide legend
         */
        this.changeLegend = function (layer, visible, newParamsWMS, inGroup, groupVisibility) {
            if (layer instanceof ol.layer.Group) {
                layer.getLayers().forEach(function (sublayer) {
                    _this.changeLegend(sublayer, visible, newParamsWMS, true, visible);
                });
            } else {
                var legendLayers = document.getElementById(elementId).getElementsByClassName('bkgwebmap-legendcontent')[0].querySelectorAll('[data-bkgwebmap-legendlayerid]');

                for (var i = 0; i < legendLayers.length; i++) {
                    if (legendLayers[i].getAttribute('data-bkgwebmap-legendlayerid') === layer.getProperties().uniqueId) {
                        if (inGroup) {
                            if (!groupVisibility) {
                                legendLayers[i].classList.remove('bkgwebmap-legendlayeractive');
                            } else if (layer.getVisible()) {
                                legendLayers[i].classList.add('bkgwebmap-legendlayeractive');
                            } else {
                                legendLayers[i].classList.remove('bkgwebmap-legendlayeractive');
                            }
                        } else if (visible) {
                            legendLayers[i].classList.add('bkgwebmap-legendlayeractive');
                        } else {
                            legendLayers[i].classList.remove('bkgwebmap-legendlayeractive');
                        }

                        if (legendLayers[i].getElementsByTagName('img')[0].src === '') {
                            legendLayers[i].classList.remove('bkgwebmap-legendlayeractive');
                        }
                    }
                }

                if (newParamsWMS) {
                    reloadWmsLegend(layer, newParamsWMS);
                }
            }
        };

        // Event listeners
        var elementForEvent = legend;
        if (!inPanel) {
            elementForEvent = legend.querySelector('svg');
        }
        elementForEvent.addEventListener('click', clickControl, { passive: true });
        elementForEvent.addEventListener('mouseenter', function () {
            var allTooltips = document.getElementById(mapId).getElementsByClassName('bkgwebmap-paneltooltiptext');
            for (var i = 0; i < allTooltips.length; i++) {
                allTooltips[i].style.visibility = '';
            }
            legendTooltip.style.visibility = 'visible';
            setTimeout(function () {
                legendTooltip.style.visibility = '';
            }, 1200);
        }, false);

        // Finalize control
        ol.control.Control.call(this, {
            element: legend,
            target: target
        });
    };
};
