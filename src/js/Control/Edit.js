/**
 * Create Edit Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_edit}
 */
BKGWebMap.Control.createEdit = function () {
    return function (map, controlName, options, panel) {
        var _this = this;
        var mapId = map.getTarget();
        var interactionSelect;
        var globalLayer;
        var globalFeature;
        var editButtonSaveAttributes;
        var enterColumnInput;
        var enterColumnButton;
        var columnSelect;
        var formatSelect;
        var exportNameInput;

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
        var title = 'Editieren';

        // Tooltip position
        var tooltipClass = 'bkgwebmap-paneltooltip bkgwebmap-paneltooltipleft';
        var tooltipTextClass = 'bkgwebmap-paneltooltiptext bkgwebmap-paneltooltiptextleft';
        if (inPanel && panel.getPanelPosition() === 'right') {
            tooltipClass = 'bkgwebmap-paneltooltip bkgwebmap-paneltooltipright';
            tooltipTextClass = 'bkgwebmap-paneltooltiptext bkgwebmap-paneltooltiptextright';
        }

        // Create DOM
        var editPanel = document.createElement('div');
        editPanel.className = 'bkgwebmap-editpanel ' + tooltipClass;

        editPanel.onclick = function () {
            clearDropdown(layerSelect);
            map.getLayers().forEach(function (layer) {
                _this.getEditableLayer(map, layer);
            });
        };

        var parser = new DOMParser();
        var editPanelIcon = parser.parseFromString(BKGWebMap.PANEL_ICONS.EDIT, 'text/xml');
        editPanelIcon.documentElement.setAttribute('class', 'bkgwebmap-panelicons bkgwebmap-paneliconsopen');
        editPanel.appendChild(editPanelIcon.documentElement);

        var editPanelTooltip = document.createElement('span');
        editPanelTooltip.className = tooltipTextClass;
        editPanelTooltip.innerHTML = title;
        editPanel.appendChild(editPanelTooltip);

        var editPanelContent = document.createElement('div');
        var editPanelContentClass = 'bkgwebmap-editpanelcontent';
        editPanelContent.className = editPanelContentClass + ' bkgwebmap-panelsinglecontent';

        var layerSelect = document.createElement('select');
        layerSelect.className = 'bkgwebmap-layerselect';
        layerSelect.setAttribute('data-bkgwebmap-lasteditlayer', '');

        var selectItem = document.createElement('option');
        selectItem.innerHTML = 'Layer auswählen';
        layerSelect.appendChild(selectItem);

        editPanelContent.appendChild(layerSelect);

        var editAccordionTitle = document.createElement('div');
        editAccordionTitle.innerHTML = 'Editierung';
        editAccordionTitle.className = 'bkgwebmap-editaccordionheader';

        var editAccordionHeader = document.createElement('div');
        editAccordionHeader.className = 'bkgwebmap-customlayerwmsheader';

        var editAccordionMinusDiv = document.createElement('div');
        editAccordionMinusDiv.className = 'bkgwebmap-editaccordionplusminus';
        editAccordionMinusDiv.innerHTML = '+';

        editAccordionHeader.appendChild(editAccordionTitle);
        editAccordionHeader.appendChild(editAccordionMinusDiv);

        editAccordionHeader.addEventListener('click', function () {
            var parent = this.parentNode;
            var minusPlus = parent.getElementsByClassName('bkgwebmap-editaccordionplusminus')[0];
            editInterfaceWrapper.style.display = editInterfaceWrapper.style.display === 'none' ? 'block' : 'none';
            minusPlus.innerHTML = minusPlus.innerHTML === '+' ? '-' : '+';
        });

        editPanelContent.appendChild(editAccordionHeader);

        // edit interface wrapper
        var editInterfaceWrapper = document.createElement('div');
        var editInterfaceSelectLayerSpan = document.createElement('span');
        editInterfaceSelectLayerSpan.innerHTML = 'Layer auswählen!';
        editInterfaceWrapper.appendChild(editInterfaceSelectLayerSpan);
        editInterfaceWrapper.style.display = 'none';
        editPanelContent.appendChild(editInterfaceWrapper);

        var exportAccordionTitle = document.createElement('div');
        exportAccordionTitle.innerHTML = 'Exportieren';
        exportAccordionTitle.className = 'bkgwebmap-exportaccordionheader';

        var exportAccordionHeader = document.createElement('div');
        exportAccordionHeader.className = 'bkgwebmap-customlayerwmsheader';

        var exportAccordionMinusDiv = document.createElement('div');
        exportAccordionMinusDiv.className = 'bkgwebmap-exportaccordionplusminus';
        exportAccordionMinusDiv.innerHTML = '+';

        exportAccordionHeader.appendChild(exportAccordionTitle);
        exportAccordionHeader.appendChild(exportAccordionMinusDiv);

        exportAccordionHeader.addEventListener('click', function () {
            var parent = this.parentNode;
            var minusPlus = parent.getElementsByClassName('bkgwebmap-exportaccordionplusminus')[0];
            exportInterfaceWrapper.style.display = exportInterfaceWrapper.style.display === 'none' ? 'block' : 'none';
            minusPlus.innerHTML = minusPlus.innerHTML === '+' ? '-' : '+';
        });

        editPanelContent.appendChild(exportAccordionHeader);

        var exportInterfaceWrapper = document.createElement('div');
        var exportInterfaceSelectLayerSpan = document.createElement('span');
        exportInterfaceSelectLayerSpan.innerHTML = 'Layer auswählen!';
        exportInterfaceWrapper.insertBefore(exportInterfaceSelectLayerSpan, exportInterfaceWrapper.childNodes[0]);
        exportInterfaceWrapper.style.display = 'none';
        editPanelContent.appendChild(exportInterfaceWrapper);

        var exportInterfaceInnerWrapper = document.createElement('div');
        exportInterfaceInnerWrapper.style.display = 'none';
        exportInterfaceWrapper.appendChild(exportInterfaceInnerWrapper);

        var editButtonPoint = document.createElement('div');
        editButtonPoint.className = 'bkgwebmap-editbutton bkgwebmap-paneltooltip bkgwebmap-paneltooltiptopright';
        editButtonPoint.setAttribute('data-bkgwebmap-editgeom', 'Point');
        var parserIconPoint = new DOMParser();
        var iconPoint = parserIconPoint.parseFromString(BKGWebMap.PANEL_ICONS.EDIT_POINT, 'text/xml');
        editButtonPoint.appendChild(iconPoint.documentElement);
        var editButtonPointTooltip = document.createElement('span');
        editButtonPointTooltip.className = 'bkgwebmap-paneltooltiptext bkgwebmap-paneltooltiptexttopright';
        editButtonPointTooltip.innerHTML = 'Punkte hinzufügen oder verschieben';
        editButtonPoint.appendChild(editButtonPointTooltip);
        tooltipHoverEvent(editButtonPoint);
        editInterfaceWrapper.appendChild(editButtonPoint);

        var editButtonLine = document.createElement('div');
        editButtonLine.className = 'bkgwebmap-editbutton bkgwebmap-paneltooltip bkgwebmap-paneltooltiptopright';
        editButtonLine.setAttribute('data-bkgwebmap-editgeom', 'LineString');
        var parserIconLine = new DOMParser();
        var iconLine = parserIconLine.parseFromString(BKGWebMap.PANEL_ICONS.EDIT_LINE, 'text/xml');
        editButtonLine.appendChild(iconLine.documentElement);
        var editButtonLineTooltip = document.createElement('span');
        editButtonLineTooltip.className = 'bkgwebmap-paneltooltiptext bkgwebmap-paneltooltiptexttopright';
        editButtonLineTooltip.innerHTML = 'Linien hinzufügen oder verschieben';
        editButtonLine.appendChild(editButtonLineTooltip);
        tooltipHoverEvent(editButtonLine);
        editInterfaceWrapper.appendChild(editButtonLine);

        var editButtonPolygon = document.createElement('div');
        editButtonPolygon.className = 'bkgwebmap-editbutton bkgwebmap-paneltooltip bkgwebmap-paneltooltiptopright';
        editButtonPolygon.setAttribute('data-bkgwebmap-editgeom', 'Polygon');
        var parserIconPolygon = new DOMParser();
        var iconPolygon = parserIconPolygon.parseFromString(BKGWebMap.PANEL_ICONS.EDIT_POLYGON, 'text/xml');
        editButtonPolygon.appendChild(iconPolygon.documentElement);
        var editButtonPolygonTooltip = document.createElement('span');
        editButtonPolygonTooltip.className = 'bkgwebmap-paneltooltiptext bkgwebmap-paneltooltiptexttopright';
        editButtonPolygonTooltip.innerHTML = 'Polygone hinzufügen oder verschieben';
        editButtonPolygon.appendChild(editButtonPolygonTooltip);
        tooltipHoverEvent(editButtonPolygon);
        editInterfaceWrapper.appendChild(editButtonPolygon);

        var editButtonAttributes = document.createElement('div');
        editButtonAttributes.className = 'bkgwebmap-editbutton bkgwebmap-paneltooltip bkgwebmap-paneltooltiptopright';
        var parserIconAttributes = new DOMParser();
        var iconAttributes = parserIconAttributes.parseFromString(BKGWebMap.PANEL_ICONS.ATTRIBUTES, 'text/xml');
        editButtonAttributes.appendChild(iconAttributes.documentElement);
        var attributesTooltip = document.createElement('span');
        attributesTooltip.className = 'bkgwebmap-paneltooltiptext bkgwebmap-paneltooltiptexttopright';
        attributesTooltip.innerHTML = 'Attribute';
        editButtonAttributes.appendChild(attributesTooltip);
        tooltipHoverEvent(editButtonAttributes);
        editInterfaceWrapper.appendChild(editButtonAttributes);

        var editButtonDelete = document.createElement('div');
        editButtonDelete.className = 'bkgwebmap-editbutton bkgwebmap-paneltooltip bkgwebmap-paneltooltiptopright';
        var parserIconDelete = new DOMParser();
        var iconDelete = parserIconDelete.parseFromString(BKGWebMap.PANEL_ICONS.DELETE, 'text/xml');
        editButtonDelete.appendChild(iconDelete.documentElement);
        var editButtonDeleteTooltip = document.createElement('span');
        editButtonDeleteTooltip.className = 'bkgwebmap-paneltooltiptext bkgwebmap-paneltooltiptexttopright';
        editButtonDeleteTooltip.innerHTML = 'Features löschen';
        editButtonDelete.appendChild(editButtonDeleteTooltip);
        tooltipHoverEvent(editButtonDelete);
        editInterfaceWrapper.appendChild(editButtonDelete);

        var attributesContainer = document.createElement('div');
        editInterfaceWrapper.appendChild(attributesContainer);

        var deleteAttributesContainer = document.createElement('div');
        editInterfaceWrapper.appendChild(deleteAttributesContainer);

        var addAttributesContainer = document.createElement('div');
        editInterfaceWrapper.appendChild(addAttributesContainer);

        // check if export key exists; if not use default
        if (options.export === undefined) {
            options.export = BKGWebMap.CONTROLS.tools.edit.export;
        }

        var formats = BKGWebMap.CONTROLS.tools.edit.export.formats;
        // check if exporting is activated
        if (options.export.active) {
            if (options.export.formats instanceof Array && options.export.formats.length) {
                formats = options.export.formats;
            }

            var exportVectorButton = document.createElement('div');
            exportVectorButton.className = 'bkgwebmap-editbutton-visible';
            exportVectorButton.innerHTML = 'Layer exportieren';
            exportInterfaceInnerWrapper.appendChild(exportVectorButton);

            formatSelect = document.createElement('select');
            formatSelect.className = 'bkgwebmap-formatselect';

            selectItem = document.createElement('option');
            selectItem.className = 'bkgwebmap-formatselectitem';
            selectItem.innerHTML = 'Format auswählen';
            selectItem.setAttribute('data-bkgwebmap-export-format', 'none');
            formatSelect.appendChild(selectItem);

            var defaultFormats = BKGWebMap.CONTROLS.tools.edit.export.formats;
            var formatLowerCase;
            for (var i = 0; i < defaultFormats.length; i++) {
                if (formats.indexOf(defaultFormats[i]) !== -1) {
                    selectItem = document.createElement('option');
                    selectItem.className = 'bkgwebmap-formatselectitem';
                    selectItem.innerHTML = defaultFormats[i];
                    formatLowerCase = defaultFormats[i].toLowerCase();
                    selectItem.setAttribute('data-bkgwebmap-export-format', formatLowerCase);
                    formatSelect.appendChild(selectItem);
                }
            }

            exportInterfaceInnerWrapper.appendChild(formatSelect);

            exportNameInput = document.createElement('input');
            exportNameInput.type = 'text';
            exportNameInput.className = 'bkgwebmap-attributemaskinput';
            exportNameInput.placeholder = 'Dateinamen eingeben';
            exportInterfaceInnerWrapper.appendChild(exportNameInput);

            var exportNameExtension = document.createElement('span');
            exportInterfaceInnerWrapper.appendChild(exportNameExtension);

            exportVectorButton.onclick = exportVectorLayer;
            formatSelect.onchange = function () {
                var exportFormat = formatSelect.options[formatSelect.selectedIndex].getAttribute('data-bkgwebmap-export-format');
                exportNameExtension.innerHTML = '.' + exportFormat;
            };
        }

        // add all contents to panel
        if (inPanel) {
            panel.addPanelContent(editPanelContent);
        } else {
            editPanel.appendChild(editPanelContent);
            editPanelContent.style.display = 'none';
        }

        function clickControl() {
            if (inPanel) {
                var activeContent = panel.getActiveContent();
                if (activeContent === '') {
                    panel.openPanel();
                    panel.changePanelContent(title, editPanelContentClass);
                    hideEditButtons();
                    _this.activeIcon();
                } else if (activeContent === editPanelContentClass) {
                    panel.closePanel();
                } else {
                    panel.changePanelContent(title, editPanelContentClass);
                    hideEditButtons();
                    _this.activeIcon();
                }
            } else if (editPanelContent.style.display === 'none') {
                editPanelContent.style.display = 'block';
            } else {
                editPanelContent.style.display = 'none';
            }
        }

        this.activeIcon = function () {
            editPanel.classList.add('bkgwebmap-panelactive');
        };

        // clears all elements but the first one in a given select dropdown
        function clearDropdown(select) {
            var elements = select.length;
            for (var i = 0; i < elements - 1; i++) {
                select.remove(1);
            }
        }

        // Event listeners
        var elementForEvent = editPanel;
        if (!inPanel) {
            elementForEvent = editPanel.querySelector('svg');
        }
        elementForEvent.addEventListener('click', clickControl, { passive: true });
        elementForEvent.addEventListener('mouseenter', function () {
            var allTooltips = document.getElementById(mapId).getElementsByClassName('bkgwebmap-paneltooltiptext');
            for (var i = 0; i < allTooltips.length; i++) {
                allTooltips[i].style.visibility = '';
            }
            editPanelTooltip.style.visibility = 'visible';
            setTimeout(function () {
                editPanelTooltip.style.visibility = '';
            }, 1200);
        }, false);

        var editableLayersObject = {};

        _this.getEditableLayer = function (map, layer) {
            var layerProperties;

            // check if layer is a vector or a group
            // if group, iterate through group to find vectors
            // only add layers to dropdown if they are editable
            if (layer instanceof ol.layer.Vector) {
                layerProperties = layer.getProperties();
                if (layerProperties.edit && layer.getVisible() === true) {
                    selectItem = document.createElement('option');
                    selectItem.innerHTML = layerProperties.name;
                    selectItem.setAttribute('data-bkgwebmap-edit-layer', layerProperties.uniqueId);
                    layerSelect.appendChild(selectItem);
                    editableLayersObject[layerProperties.uniqueId] = layer;
                }
            } else if (layer instanceof ol.layer.Group) {
                // only if group is visible loop through it
                if (layer.getVisible() === true) {
                    layer.getLayers().forEach(function (subLayer) {
                        if (subLayer instanceof ol.layer.Vector && subLayer.getVisible() === true) {
                            layerProperties = subLayer.getProperties();
                            if (layerProperties.edit) {
                                selectItem = document.createElement('option');
                                selectItem.innerHTML = layerProperties.name;
                                selectItem.setAttribute('data-bkgwebmap-edit-layer', layerProperties.uniqueId);
                                layerSelect.appendChild(selectItem);
                                editableLayersObject[layerProperties.uniqueId] = subLayer;
                            }
                        }
                    });
                }
            }
        };

        // checks whether there are editable layers
        // this has nothing to do with visibility, but with what is in the config
        _this.editableLayerAvailable = function () {
            var layerProperties;
            var isAvailable = false;

            map.getLayers().forEach(function (layer) {
                if (layer instanceof ol.layer.Vector) {
                    layerProperties = layer.getProperties();
                    if (layerProperties.edit) {
                        isAvailable = true;
                    }
                } else if (layer instanceof ol.layer.Group) {
                    layer.getLayers().forEach(function (subLayer) {
                        if (subLayer instanceof ol.layer.Vector) {
                            layerProperties = subLayer.getProperties();
                            if (layerProperties.edit) {
                                isAvailable = true;
                            }
                        }
                    });
                }
            });

            return isAvailable;
        };

        // empty layer to be used when no editable layer is found
        var emptyLayerSource = new ol.source.Vector();

        var symbol = BKGWebMap.MAP_ICONS_ENCODED.circle.a + '%23ffcc33' + BKGWebMap.MAP_ICONS_ENCODED.circle.b + '%23ffcc33' + BKGWebMap.MAP_ICONS_ENCODED.circle.c;

        var emptyLayerVector = new ol.layer.Vector({
            source: emptyLayerSource,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new ol.style.Icon(({
                    anchor: [0.5, 0.5],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    imgSize: BKGWebMap.MAP_ICONS_ENCODED.circle.size,
                    src: 'data:image/svg+xml;charset=utf8,' + symbol
                }))
            })
        });

        emptyLayerVector.setProperties({
            edit: true,
            name: 'Neue Zeichnung',
            uniqueId: 'emptyLayerDigitizingVector',
            visibility: true
        });

        // adds the empty layer to the map
        // checks first whether the emptyLayer option is activated
        this.addEmptyLayer = function addEmptyLayer() {
            if (options.emptyLayer === true) {
                map.addLayer(emptyLayerVector);
                map.getControls().forEach(function (control) {
                    if (BKGWebMap.Control.LayerSwitcher && control instanceof BKGWebMap.Control.LayerSwitcher) {
                        control.addInLayerSwitcher(emptyLayerVector, false, false, true, null);
                    }
                });

                map.getLayers().forEach(function (layer) {
                    _this.getEditableLayer(map, layer);
                });
            }
        };

        layerSelect.onchange = function () {
            editInterfaceSelectLayerSpan.innerHTML = '';
            exportInterfaceSelectLayerSpan.innerHTML = '';
            removeAllButtonsHighlightings();
            var activeLayerId = getActiveLayerId();

            layerSelect.setAttribute('data-bkgwebmap-lasteditlayer', activeLayerId);
            hideEditButtons();
            if (activeLayerId != null) {
                _this.removeEditInteractions();
                var layerFeatures = editableLayersObject[activeLayerId].getSource().getFeatures();
                var editGeoms = BKGWebMap.Util.findGeometryType(layerFeatures);

                // if the digitizing vector is detected, allow all geoms
                if (activeLayerId === emptyLayerVector.getProperties().uniqueId) {
                    editGeoms = ['Point', 'LineString', 'Polygon'];
                }

                showEditButtons(editGeoms);
                globalLayer = editableLayersObject[activeLayerId];
                exportInterfaceInnerWrapper.style.display = 'block';
            } else {
                editInterfaceSelectLayerSpan.innerHTML = 'Layer auswählen!';
                exportInterfaceSelectLayerSpan.innerHTML = 'Layer auswählen!';
                exportInterfaceInnerWrapper.style.display = 'none';
            }

            createDeleteColumnMask();

            attributesContainer.innerHTML = '';
            addAttributesContainer.innerHTML = '';

            if (activeLayerId !== null) {
                createAddColumnMask();
            }
        };

        function getActiveLayerId() {
            var id = layerSelect.options[layerSelect.selectedIndex].getAttribute('data-bkgwebmap-edit-layer');
            return id;
        }

        function hideEditButtons() {
            editButtonPoint.style.display = 'none';
            editButtonLine.style.display = 'none';
            editButtonPolygon.style.display = 'none';
            editButtonAttributes.style.display = 'none';
            editButtonDelete.style.display = 'none';
        }

        function showEditButtons(editGeoms) {
            if (editGeoms.indexOf('Point') > -1) {
                editButtonPoint.style.display = 'inline-block';
            }
            if (editGeoms.indexOf('LineString') > -1) {
                editButtonLine.style.display = 'inline-block';
            }
            if (editGeoms.indexOf('Polygon') > -1) {
                editButtonPolygon.style.display = 'inline-block';
            }
            editButtonAttributes.style.display = 'inline-block';
            editButtonDelete.style.display = 'inline-block';
        }

        editButtonPoint.onclick = onClickEditButton;
        editButtonLine.onclick = onClickEditButton;
        editButtonPolygon.onclick = onClickEditButton;

        // when edit button is clicked
        function onClickEditButton() {
            var geomType = this.getAttribute('data-bkgwebmap-editgeom');
            higlightEditButton(geomType);
            var activeLayerId = getActiveLayerId();
            _this.removeEditInteractions();
            var layerSource = editableLayersObject[activeLayerId].getSource();
            addEditInteractions(layerSource, geomType);
        }

        function higlightEditButton(geomType) {
            removeAllButtonsHighlightings();
            if (geomType === 'Point') {
                editButtonPoint.classList.add('bkgwebmap-editbutton-active');
            } else if (geomType === 'LineString') {
                editButtonLine.classList.add('bkgwebmap-editbutton-active');
            } else if (geomType === 'Polygon') {
                editButtonPolygon.classList.add('bkgwebmap-editbutton-active');
            }
        }

        function removeAllButtonsHighlightings() {
            editButtonPoint.classList.remove('bkgwebmap-editbutton-active');
            editButtonLine.classList.remove('bkgwebmap-editbutton-active');
            editButtonPolygon.classList.remove('bkgwebmap-editbutton-active');
            editButtonAttributes.classList.remove('bkgwebmap-editbutton-active');
            editButtonDelete.classList.remove('bkgwebmap-editbutton-active');
        }

        var interactionDraw;
        var interactionModify;
        var interactionSnap;

        // adds draw, modify, snap interactions
        function addEditInteractions(layerSource, geomType) {
            _this.removeEditInteractions();
            removeAttributeListener();
            // define interactions
            interactionModify = new ol.interaction.Modify({ source: layerSource });
            interactionSnap = new ol.interaction.Snap({ source: layerSource });
            interactionDraw = new ol.interaction.Draw({
                source: layerSource,
                type: geomType
            });
            interactionDraw.on('drawend', onDrawEnd);
            // add interactions
            map.addInteraction(interactionModify);
            map.addInteraction(interactionSnap);
            map.addInteraction(interactionDraw);
        }

        // show the attribute mask and define a global layer and feature
        function onDrawEnd(e) {
            // get the columns that should be added to the new feature
            var availableProperties = getLayerProperties();

            var attributes = {};
            var columnName;

            // create columns with empty attributes
            for (var key in availableProperties) {
                if (Object.prototype.hasOwnProperty.call(availableProperties, key)) {
                    var propType = typeof (availableProperties[key]);

                    if ((propType === 'string' || propType === 'number') && key.length > 0) {
                        columnName = key;
                        attributes[columnName] = '';
                    }
                }
            }

            // add attributes to the feature
            e.feature.setProperties(attributes);

            var activeLayerId = getActiveLayerId();
            globalLayer = editableLayersObject[activeLayerId];
            globalFeature = e.feature;

            generateAttributesMask(attributes);
        }

        this.removeEditInteractions = function () {
            map.getInteractions().forEach(function (interaction) {
                if (interaction instanceof ol.interaction.Modify) {
                    map.removeInteraction(interaction);
                }
                if (interaction instanceof ol.interaction.Snap) {
                    map.removeInteraction(interaction);
                }
                if (interaction instanceof ol.interaction.Draw) {
                    map.removeInteraction(interaction);
                }

                if (interaction instanceof ol.interaction.Select) {
                    map.removeInteraction(interaction);
                }
                attributesContainer.innerHTML = '';
            });
        };

        editButtonDelete.onclick = addDeleteInteraction;

        function addDeleteInteraction() {
            removeAllButtonsHighlightings();
            editButtonDelete.classList.add('bkgwebmap-editbutton-active');
            var activeLayerId = getActiveLayerId();
            removeAttributeListener();
            _this.removeEditInteractions();
            var layerToBeSelected = editableLayersObject[activeLayerId];

            // multi means when features are overlapping; in that case all below the click will be selected, not just the top one
            interactionSelect = new ol.interaction.Select({
                layers: [layerToBeSelected],
                multi: false,
                hitTolerance: 5
            });
            interactionSelect.on('select', function () {
                var selectedFeature = interactionSelect.getFeatures().item(0);
                interactionSelect.getFeatures().forEach(function (feature) {
                    if (selectedFeature === feature) {
                        var deleteFeature = confirm('Objekt löschen?');
                        if (deleteFeature === true) {
                            layerToBeSelected.getSource().removeFeature(feature);
                            removeAllButtonsHighlightings();
                            _this.removeEditInteractions();
                        }
                    }
                });
            });
            map.addInteraction(interactionSelect);
        }

        editButtonAttributes.onclick = addAttributesInteraction;

        function addAttributesInteraction() {
            removeAllButtonsHighlightings();
            editButtonAttributes.classList.add('bkgwebmap-editbutton-active');
            var activeLayerId = getActiveLayerId();
            removeAttributeListener();
            _this.removeEditInteractions();
            var layerToBeSelected = editableLayersObject[activeLayerId];
            globalLayer = layerToBeSelected;

            // multi means when features are overlapping; in that case all below the click will be selected, not just the top one
            interactionSelect = new ol.interaction.Select({
                layers: [layerToBeSelected],
                multi: false
            });

            interactionSelect.on('select', function () {
                var selectedFeature = interactionSelect.getFeatures().item(0); // get the selected item

                if (selectedFeature === undefined) {
                    attributesContainer.innerHTML = '';
                } else {
                    interactionSelect.getFeatures().forEach(function (feature) {
                        if (selectedFeature === feature) {
                            var layerProperties = selectedFeature.getProperties();
                            globalFeature = selectedFeature;
                            generateAttributesMask(layerProperties);
                        }
                    });
                }
            });
            map.addInteraction(interactionSelect);
        }

        function generateAttributesMask(layerProperties) {
            var inputElement;
            var inputLabel;
            var lineBreak;
            var selectItem;
            attributesContainer.innerHTML = '';

            columnSelect = document.createElement('select');
            columnSelect.className = 'bkgwebmap-columnselect';
            for (var key in layerProperties) {
                if (Object.prototype.hasOwnProperty.call(layerProperties, key)) {
                    var propType = typeof (layerProperties[key]);

                    if ((propType === 'string' || propType === 'number') && key.length > 0) {
                        inputLabel = document.createElement('span');
                        inputLabel.innerHTML = '<b>' + key + '</b>';
                        attributesContainer.appendChild(inputLabel);

                        lineBreak = document.createElement('br');
                        attributesContainer.appendChild(lineBreak);

                        inputElement = document.createElement('input');
                        inputElement.type = 'text';
                        inputElement.value = layerProperties[key];
                        inputElement.className = 'bkgwebmap-attributemaskinput';
                        inputElement.setAttribute('data-bkgwebmap-attributekey', key);
                        attributesContainer.appendChild(inputElement);

                        lineBreak = document.createElement('br');
                        attributesContainer.appendChild(lineBreak);

                        selectItem = document.createElement('option');
                        selectItem.innerHTML = key;
                        selectItem.setAttribute('data-bkgwebmap-column', key);
                        columnSelect.appendChild(selectItem);
                    }
                }
            }

            editButtonSaveAttributes = document.createElement('div');
            editButtonSaveAttributes.className = 'bkgwebmap-editbutton-visible';
            editButtonSaveAttributes.innerHTML = 'Speichern';
            attributesContainer.appendChild(editButtonSaveAttributes);

            editButtonSaveAttributes.onclick = saveAttributes;
        }

        function addAttributeColumn() {
            var newColumnName = enterColumnInput.value;

            if (newColumnName.length === 0) {
                alert('Bitte Spaltennamen eingeben!');
            } else {
                var addColumn = confirm('Soll die Spalte ' + newColumnName + ' in allen Elementen der Ebene hinzugefügt werden?');

                if (addColumn === true) {
                    var newColumn = {};
                    var columnName = enterColumnInput.value;
                    newColumn[columnName] = '';

                    var features = globalLayer.getSource().getFeatures();

                    features.forEach(function (feature) {
                        feature.setProperties(newColumn);
                    });

                    enterColumnInput.value = '';

                    createDeleteColumnMask();

                    if (attributesContainer.innerHTML.length > 0) { // if attributes container is open, refresh it
                        var layerProperties = globalFeature.getProperties();
                        generateAttributesMask(layerProperties);
                    }
                }
            }
        }

        function deleteAttributeColumn() {
            var selectedColumn = columnSelect.options[columnSelect.selectedIndex].getAttribute('data-bkgwebmap-column');
            var deleteColumn = confirm('Soll die Spalte ' + selectedColumn + ' in allen Elementen der Ebene gelöscht werden?');

            if (deleteColumn === true) {
                var features = globalLayer.getSource().getFeatures();
                features.forEach(function (feature) {
                    var properties = feature.getProperties();
                    for (var key in properties) {
                        if (Object.prototype.hasOwnProperty.call(properties, key)) {
                            if (key === selectedColumn) {
                                feature.unset(key);
                                var layerProperties = feature.getProperties();

                                if (attributesContainer.innerHTML.length > 0) { // if attributes container is open, refresh it
                                    generateAttributesMask(layerProperties);
                                }
                            }
                        }
                    }
                });
                createDeleteColumnMask();
            }
        }

        function saveAttributes() {
            var inputElements = attributesContainer.getElementsByTagName('input');
            var key;
            var propertiesObject = {};

            for (var i = 0; i < inputElements.length; i++) {
                key = inputElements[i].getAttribute('data-bkgwebmap-attributekey');
                if (key !== 'newcolumnnameinputfield') {
                    propertiesObject[key] = inputElements[i].value;
                }
            }

            var features = globalLayer.getSource().getFeatures();
            features.forEach(function (feature) {
                if (feature === globalFeature) {
                    feature.setProperties(propertiesObject);
                    alert('Die Attribute wurden erfolgreich gespeichert.');
                }
            });
        }

        // gets the properties of the first feature in a vector
        function getLayerProperties() {
            var activeLayerId = getActiveLayerId();

            if (activeLayerId !== null) {
                var feature = editableLayersObject[activeLayerId].getSource().getFeatures()[0];

                if (feature !== undefined) {
                    var props = feature.getProperties();

                    return props;
                }
            }
        }

        function createDeleteColumnMask() {
            var deleteColumnButton;
            var selectItem;
            columnSelect = document.createElement('select');
            columnSelect.className = 'bkgwebmap-columnselect';

            deleteAttributesContainer.innerHTML = '';

            var layerProperties = getLayerProperties();

            var propertyCount = 0;

            for (var key in layerProperties) {
                if (Object.prototype.hasOwnProperty.call(layerProperties, key)) {
                    var propType = typeof (layerProperties[key]);

                    if ((propType === 'string' || propType === 'number') && key.length > 0) {
                        selectItem = document.createElement('option');
                        selectItem.innerHTML = key;
                        selectItem.setAttribute('data-bkgwebmap-column', key);
                        columnSelect.appendChild(selectItem);

                        propertyCount += 1;
                    }
                }
            }

            if (propertyCount > 0) {
                var dividingLine = document.createElement('hr');
                deleteAttributesContainer.appendChild(dividingLine);

                deleteColumnButton = document.createElement('div');
                deleteColumnButton.className = 'bkgwebmap-editbutton-visible';
                deleteColumnButton.innerHTML = 'Spalte löschen';
                deleteAttributesContainer.appendChild(deleteColumnButton);
                deleteAttributesContainer.appendChild(columnSelect);

                deleteColumnButton.onclick = deleteAttributeColumn;

                deleteAttributesContainer.appendChild(columnSelect);
            }
        }

        function createAddColumnMask() {
            addAttributesContainer.innerHTML = '';

            var dividingLine = document.createElement('hr');
            addAttributesContainer.appendChild(dividingLine);

            enterColumnButton = document.createElement('div');
            enterColumnButton.className = 'bkgwebmap-editbutton-visible';
            enterColumnButton.innerHTML = 'Neue Spalte';
            addAttributesContainer.appendChild(enterColumnButton);

            enterColumnInput = document.createElement('input');
            enterColumnInput.type = 'text';
            enterColumnInput.className = 'bkgwebmap-attributemaskinput';
            enterColumnInput.placeholder = 'Spaltennamen eingeben';
            enterColumnInput.setAttribute('data-bkgwebmap-attributekey', 'newcolumnnameinputfield');
            addAttributesContainer.appendChild(enterColumnInput);

            enterColumnButton.onclick = addAttributeColumn;
        }

        function exportVectorLayer() {
            var exportFormat;
            var features;
            var filename;
            var activeLayerId = getActiveLayerId();

            if (activeLayerId === null) {
                alert('Layer auswählen!');
            } else {
                exportFormat = formatSelect.options[formatSelect.selectedIndex].getAttribute('data-bkgwebmap-export-format');
                if (exportFormat === 'none') {
                    alert('Export Format auswählen!');
                } else {
                    var mapCrs = map.getView().getProjection().getCode();
                    features = editableLayersObject[activeLayerId].getSource().getFeatures();
                    filename = exportNameInput.value;

                    if (filename.length === 0) {
                        filename = 'bkg_export';
                    }

                    switch (exportFormat) {
                    case 'geojson':
                        exportFileGeoJson(mapCrs, features, filename);
                        break;
                    case 'gml':
                        exportFileGml(mapCrs, features, filename);
                        break;
                    case 'gpx':
                        exportFileGpx(mapCrs, features, filename);
                        break;
                    case 'kml':
                        exportFileKml(mapCrs, features, filename);
                        break;
                    case 'wkt':
                        exportFileWkt(mapCrs, features, filename);
                        break;
                        // no default
                    }
                }
            }
        }

        function exportFileGeoJson(mapCrs, features, filename) {
            var format = new ol.format.GeoJSON();
            var exportLayer = format.writeFeatures(features, {
                dataProjection: 'EPSG:4326',
                featureProjection: mapCrs
            });
            var blob = new Blob([exportLayer], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, filename + '.geojson');
        }

        function exportFileGml(mapCrs, features, filename) {
            var format = new ol.format.GML3({
                featureType: ['topp'],
                featureNS: {
                    topp: 'topp'
                },
                srsName: mapCrs
            });

            var exportLayer = format.writeFeatures(features, {
                featureProjection: mapCrs,
                dataProjection: mapCrs
            });

            var blob = new Blob([exportLayer], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, filename + '.gml');
        }

        function exportFileGpx(mapCrs, features, filename) {
            var format = new ol.format.GPX();

            var exportLayer = format.writeFeatures(features, {
                dataProjection: 'EPSG:4326',
                featureProjection: mapCrs
            });

            var blob = new Blob([exportLayer], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, filename + '.gpx');
        }

        function exportFileKml(mapCrs, features, filename) {
            var format = new ol.format.KML();

            var exportLayer = format.writeFeatures(features, {
                dataProjection: 'EPSG:4326',
                featureProjection: mapCrs
            });

            var blob = new Blob([exportLayer], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, filename + '.kml');
        }

        function exportFileWkt(mapCrs, features, filename) {
            var format = new ol.format.WKT();

            var exportLayer = format.writeFeatures(features, {
                dataProjection: 'EPSG:4326',
                featureProjection: mapCrs
            });

            var blob = new Blob([exportLayer], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, filename + '.wkt');
        }

        // deactivates click handler for WMS feature request and GeoSearch
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

        // reactivates click handler for WMS feature request and GeoSearch
        this.addAttributeListener = function () {
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
        };

        // Show/hide tooltips
        function tooltipHoverEvent(tooltipButton) {
            tooltipButton.addEventListener('mouseenter', function () {
                var allTooltips = editPanelContent.getElementsByClassName('bkgwebmap-paneltooltiptext');
                for (var i = 0; i < allTooltips.length; i++) {
                    allTooltips[i].style.visibility = '';
                }

                var currentButton = tooltipButton.getElementsByClassName('bkgwebmap-paneltooltiptext')[0];
                currentButton.style.visibility = 'visible';

                setTimeout(function () {
                    currentButton.style.visibility = '';
                }, 1200);
            });
        }

        /**
         * Change menu with edit layers
         */
        this.adaptLayerMenu = function () {
            if (layerSelect.childElementCount === 2) {
                layerSelect.selectedIndex = 1;
                setTimeout(function () {
                    layerSelect.dispatchEvent(new CustomEvent('change'));
                }, 100);
            } else {
                var lastLayerId = layerSelect.getAttribute('data-bkgwebmap-lasteditlayer');
                var layersWithIds = layerSelect.querySelectorAll('[data-bkgwebmap-edit-layer]');
                if (layersWithIds.length) {
                    for (var i = 0; i < layersWithIds.length; i++) {
                        if (layersWithIds[i].getAttribute('data-bkgwebmap-edit-layer') === lastLayerId) {
                            layerSelect.selectedIndex = i + 1;
                            setTimeout(function () {
                                layerSelect.dispatchEvent(new CustomEvent('change'));
                            }, 100);
                        }
                    }
                }
            }
        };

        // Finalize control
        ol.control.Control.call(this, {
            element: editPanel,
            target: target
        });
    };
};
