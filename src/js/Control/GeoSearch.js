/**
 * Create GeoSearch Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_geoSearch}
 */
BKGWebMap.Control.createGeoSearch = function () {
    return function (map, controlName, options, panel) {
        options = options || {};

        var geoSearchElement;
        var mapId = map.getTarget();
        var xhr = new XMLHttpRequest();
        var url;
        var useSelectionFilterBbox = false;
        var selectionFilter = {};
        var reverseGeoButtonDiv;
        var reverseGeoSearchTooltip;
        var searchButtonDiv;
        var searchTooltip;
        var filter;
        var wfsFeaturePrefix;
        var wfsFeatureType;
        var wfsSearchAttribute;
        var wfsShowAttributes;
        var wfsAutocomplete = true;
        var wfsProtocolFormat = 'GML3';
        var formatsList = {
            GEOJSON: {
                olClass: new ol.format.GeoJSON(),
                outputFormat: 'application/json'
            },
            GML2: {
                olClass: new ol.format.GML2(),
                outputFormat: 'GML2'
            },
            GML3: {
                olClass: new ol.format.WFS(),
                outputFormat: 'GML3'
            }
        };
        var gdzOrtssuchePropsToShow = ['text', 'typ'];
        var templatePopup;
        var templateList;
        var div;
        if (options.templatePopup) {
            div = document.createElement('div');
            div.innerHTML = options.templatePopup;
            templatePopup = div.innerHTML;
        }
        if (options.templateList) {
            div = document.createElement('div');
            div.innerHTML = options.templateList;
            templateList = div.innerHTML;
        }

        // Check if control should be created
        if (options.active === false) {
            return undefined;
        }

        // If no panel exists and no other div ID is defined, do not create this control
        if (!panel && (!options.div || options.div === '')) {
            window.console.log(BKGWebMap.ERROR.noPanelNoDivForControl + controlName);
            return undefined;
        }

        // Control div
        var target;
        var inPanel = true;
        if (options.div && options.div !== '') {
            target = options.div;
            inPanel = false;
        }

        // Parse protocol properties
        var protocol = BKGWebMap.CONTROLS.tools.geoSearch.defaultProtocol;
        if (options.protocol && (typeof options.protocol.type === 'string' || options.protocol.type instanceof String) && options.protocol.type !== '') {
            protocol = options.protocol.type;
        }
        if (options.protocol && (typeof options.protocol.url === 'string' || options.protocol.url instanceof String) && options.protocol.url !== '') {
            url = options.protocol.url;
        } else if (protocol === 'wfs') {
            window.console.log(BKGWebMap.ERROR.geoSearchUrlMissing);
            return undefined;
        } else {
            url = BKGWebMap.CONTROLS.tools.geoSearch.protocol[protocol];
        }

        // Add UUID
        if (BKGWebMap.SECURITY.UUID) {
            url = url + '__' + BKGWebMap.SECURITY.UUID;
        }

        // Parse count
        var suggestCount = BKGWebMap.CONTROLS.tools.geoSearch.suggestCount;
        if (typeof options.suggestCount === 'number') {
            suggestCount = options.suggestCount;
        }
        var resultsCount = BKGWebMap.CONTROLS.tools.geoSearch.resultsCount;
        if (typeof options.resultsCount === 'number') {
            resultsCount = options.resultsCount;
        }

        // Max zoom for results
        var resultsMaxZoom = BKGWebMap.CONTROLS.tools.geoSearch.resultsMaxZoom;
        if (typeof options.resultsMaxZoom === 'number') {
            resultsMaxZoom = options.resultsMaxZoom;
        }

        // Define wfs protocol properties
        if (protocol === 'wfs') {
            wfsAutocomplete = false;
            // featurePrefix
            if ((typeof options.protocol.featurePrefix === 'string' || options.protocol.featurePrefix instanceof String) && options.protocol.featurePrefix !== '') {
                wfsFeaturePrefix = options.protocol.featurePrefix;
            } else {
                window.console.log(BKGWebMap.ERROR.geoSearchFeaturePrefixMissing);
                return undefined;
            }
            // featureType
            if ((typeof options.protocol.featureType === 'string' || options.protocol.featureType instanceof String) && options.protocol.featureType !== '') {
                wfsFeatureType = options.protocol.featureType;
            } else {
                window.console.log(BKGWebMap.ERROR.geoSearchFeatureTypeMissing);
                return undefined;
            }
            // searchAttribute
            if ((typeof options.protocol.searchAttribute === 'string' || options.protocol.searchAttribute instanceof String) && options.protocol.searchAttribute !== '') {
                wfsSearchAttribute = options.protocol.searchAttribute;
            } else {
                window.console.log(BKGWebMap.ERROR.geoSearchSearchAttributeMissing);
                return undefined;
            }
            // showAttributes
            if (options.protocol.showAttributes instanceof Array && options.protocol.showAttributes.length) {
                wfsShowAttributes = options.protocol.showAttributes;
            } else {
                wfsShowAttributes = [wfsSearchAttribute];
            }

            // format
            if ((typeof options.protocol.format === 'string' || options.protocol.format instanceof String) && options.protocol.format !== '') {
                wfsProtocolFormat = options.protocol.format;
            }
        } else if (protocol === 'ortssuche') {
            // Define filter
            if (options.protocol && (typeof options.protocol.filter === 'string' || options.protocol.filter instanceof String) && options.protocol.filter !== '') {
                filter = options.protocol.filter;
            }

            // Define BBOX filter that can be selected by user
            if (BKGWebMap.Util.hasNestedProperty(options, 'protocol.bbox.coordinates')) {
                if (options.protocol.bbox.coordinates instanceof Array) {
                    selectionFilter.bbox = {};
                    selectionFilter.bbox.coordinates = options.protocol.bbox.coordinates;
                    useSelectionFilterBbox = true;
                }
                if (BKGWebMap.Util.hasNestedProperty(options, 'protocol.bbox.projection') && (typeof options.protocol.bbox.projection === 'string' || options.protocol.bbox.projection instanceof String)) {
                    selectionFilter.bbox.projection = options.protocol.bbox.projection;
                } else {
                    selectionFilter.bbox.projection = map.getView().getProjection().getCode();
                }
            }
        }

        // Reverse geocoding
        var reverseGeocoding = BKGWebMap.CONTROLS.tools.geoSearch.reverseGeocoding;
        if (typeof options.reverseGeocoding === 'object' && options.reverseGeocoding.constructor === Object) {
            reverseGeocoding = options.reverseGeocoding;
            if (typeof reverseGeocoding.active !== 'boolean') {
                reverseGeocoding.active = BKGWebMap.CONTROLS.tools.geoSearch.reverseGeocoding.active;
            }
        }

        // Custom class
        var customClass = '';
        if (options.style && options.style !== '') {
            customClass = options.style;
        }

        // Control in panel
        var searchPanelControl = searchPanelExists();
        if (inPanel) {
            if (!searchPanelControl) {
                createSearchpanel();
            }
            target = panel.element.getElementsByClassName('bkgwebmap-searchpanelcontent')[0];
        }

        // Add form for search
        var geoSearchFormDiv = document.createElement('div');
        geoSearchFormDiv.className = 'bkgwebmap-geosearchformdiv';
        var geoSearchForm = document.createElement('input');
        geoSearchForm.className = 'bkgwebmap-geosearchform';
        geoSearchForm.setAttribute('type', 'text');
        geoSearchForm.setAttribute('placeholder', 'Ort eingeben...');
        geoSearchFormDiv.appendChild(geoSearchForm);

        // search button
        searchButtonDiv = document.createElement('div');
        searchButtonDiv.className = 'bkgwebmap-geosearchbutton bkgwebmap-paneltooltip';
        var searchIconParser = new DOMParser();
        var searchIcon = searchIconParser.parseFromString(BKGWebMap.PANEL_ICONS.SEARCH_GEOCODING, 'text/xml');
        searchButtonDiv.appendChild(searchIcon.documentElement);
        geoSearchFormDiv.appendChild(searchButtonDiv);

        searchTooltip = document.createElement('span');
        searchTooltip.className = 'bkgwebmap-paneltooltiptext';
        searchTooltip.innerHTML = 'Suche';
        searchButtonDiv.appendChild(searchTooltip);

        // Add reverse geocoding button
        if (protocol !== 'wfs' && reverseGeocoding.active) {
            reverseGeoButtonDiv = document.createElement('div');
            reverseGeoButtonDiv.className = 'bkgwebmap-reversegeosearchbutton bkgwebmap-reversegeoactive bkgwebmap-paneltooltip';
            var reverseGeoSearchIconParser = new DOMParser();
            var reverseGeoSearchIcon = reverseGeoSearchIconParser.parseFromString(BKGWebMap.PANEL_ICONS.REVERSE_GEOCODING, 'text/xml');
            reverseGeoButtonDiv.appendChild(reverseGeoSearchIcon.documentElement);
            geoSearchFormDiv.appendChild(reverseGeoButtonDiv);

            reverseGeoSearchTooltip = document.createElement('span');
            reverseGeoSearchTooltip.className = 'bkgwebmap-paneltooltiptext';
            reverseGeoSearchTooltip.innerHTML = 'Reverse Geokodierung';
            reverseGeoButtonDiv.appendChild(reverseGeoSearchTooltip);

            geoSearchForm.classList.add('bkgwebmap-geosearchformreverse');

            configureReverseGeocoding();
        }

        // Button to delete results
        var deleteResultsButtonDiv = document.createElement('div');
        deleteResultsButtonDiv.className = 'bkgwebmap-geosearchdelete bkgwebmap-paneltooltip';
        var deleteResultsIconParser = new DOMParser();
        var deleteResultsIcon = deleteResultsIconParser.parseFromString(BKGWebMap.PANEL_ICONS.DELETE_SEARCH, 'text/xml');
        deleteResultsButtonDiv.appendChild(deleteResultsIcon.documentElement);
        geoSearchFormDiv.appendChild(deleteResultsButtonDiv);

        var deleteResultsTooltip = document.createElement('span');
        deleteResultsTooltip.className = 'bkgwebmap-paneltooltiptext';
        deleteResultsTooltip.innerHTML = 'Ergebnisse löschen';
        deleteResultsButtonDiv.appendChild(deleteResultsTooltip);

        var geoSearchContent = document.createElement('div');
        if (inPanel) {
            geoSearchContent.className = 'bkgwebmap-geosearchcontent ' + customClass;
        } else {
            geoSearchContent.className = 'bkgwebmap-geosearchcontent';
        }

        var suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'bkgwebmap-geosearchsuggestion';
        geoSearchContent.appendChild(suggestionDiv);

        var resultDiv = document.createElement('div');
        resultDiv.className = 'bkgwebmap-geosearchresult';
        resultDiv.innerHTML = '';
        geoSearchContent.appendChild(resultDiv);

        if (inPanel) {
            document.getElementById(mapId).getElementsByClassName('bkgwebmap-paneltitlewrapper')[0].insertBefore(geoSearchFormDiv, document.getElementById(mapId).getElementsByClassName('bkgwebmap-paneltitlebutton')[0]);
            geoSearchElement = geoSearchContent;
        } else {
            var geoSearchWrapper = document.createElement('div');
            geoSearchWrapper.className = customClass;
            geoSearchWrapper.appendChild(geoSearchFormDiv);
            geoSearchWrapper.appendChild(geoSearchContent);
            geoSearchElement = geoSearchWrapper;
        }

        // Popup
        var popupDiv = document.createElement('div');
        popupDiv.className = 'bkgwebmap-geosearchpopup';
        var popupCloser = document.createElement('a');
        popupCloser.className = 'bkgwebmap-geosearchpopupcloser';
        popupCloser.setAttribute('href', '#');
        popupDiv.appendChild(popupCloser);
        var popupContent = document.createElement('div');
        popupContent.className = 'bkgwebmap-geosearchpopupcontent bkgwebmap-selectable';
        popupDiv.appendChild(popupContent);

        var popup = new ol.Overlay({
            element: popupDiv,
            offset: [0, -20]
        });
        map.addOverlay(popup);

        // Create style for vector layer
        function createVectorStyle() {
            var svgFillColor = '%230374ad';
            var svgStrokeColor = '%23FFFFFF';
            var symbol = BKGWebMap.MAP_ICONS_ENCODED.marker.a + svgFillColor + BKGWebMap.MAP_ICONS_ENCODED.marker.b + svgStrokeColor + BKGWebMap.MAP_ICONS_ENCODED.marker.c;
            var vectorStyle = new ol.style.Style({
                image: new ol.style.Icon(({
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    imgSize: BKGWebMap.MAP_ICONS_ENCODED.marker.size,
                    src: 'data:image/svg+xml;charset=utf8,' + symbol
                }))
            });
            return vectorStyle;
        }

        function createSelectionStyle() {
            var svgFillColor = '%23ff0000';
            var svgStrokeColor = '%23FFFFFF';
            var symbol = BKGWebMap.MAP_ICONS_ENCODED.marker.a + svgFillColor + BKGWebMap.MAP_ICONS_ENCODED.marker.b + svgStrokeColor + BKGWebMap.MAP_ICONS_ENCODED.marker.c;
            var vectorStyle = new ol.style.Style({
                image: new ol.style.Icon(({
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    imgSize: BKGWebMap.MAP_ICONS_ENCODED.marker.size,
                    src: 'data:image/svg+xml;charset=utf8,' + symbol
                }))
            });
            return vectorStyle;
        }

        var vectorStyle = createVectorStyle();
        var selectionStyle = createSelectionStyle();

        var vectorLayer = createVectorLayer();
        vectorLayer.setZIndex(1001);
        map.addLayer(vectorLayer);

        var selectInteraction = new ol.interaction.Select({
            layers: [vectorLayer],
            condition: ol.events.condition.pointerMove,
            style: selectionStyle,
            hitTolerance: 10
        });

        selectInteraction.on('select', function (event) {
            var selectedId;
            var table;
            var rowId;
            if (event.target.getFeatures().getArray().length) {
                selectedId = event.target.getFeatures().getArray()[0].getProperties().featureId;
            }
            if (resultDiv.childNodes.length) {
                table = resultDiv.childNodes[0];
                if (table.childNodes.length) {
                    for (var i = 0; i < table.childNodes.length; i++) {
                        rowId = table.childNodes[i].getAttribute('data-bkgwebmap-searchid');
                        if (rowId === selectedId) {
                            table.childNodes[i].classList.add('bkgwebmap-geosearchresultselect');
                        } else {
                            table.childNodes[i].classList.remove('bkgwebmap-geosearchresultselect');
                        }
                    }
                }
            }
        });

        map.addInteraction(selectInteraction);

        // Create layer for results
        function createVectorLayer() {
            var vectorSource = new ol.source.Vector();
            var layer = new ol.layer.Vector({
                source: vectorSource,
                style: vectorStyle,
                uniqueId: 'geosearchlayer'
            });
            layer.setProperties({ edit: false });
            return layer;
        }

        // Create search panel if it doesn't exist
        function createSearchpanel() {
            var SearchPanelClass = BKGWebMap.Control.FACTORIES.searchPanel();
            var searchPanel = new SearchPanelClass(map, 'searchpanel', true, panel);
            map.addControl(searchPanel);
            return searchPanel;
        }

        // Find if search panel exists
        function searchPanelExists() {
            var exists = false;
            map.getControls().forEach(function (control) {
                if (BKGWebMap.Control.SearchPanel && control instanceof BKGWebMap.Control.SearchPanel) {
                    exists = true;
                }
            });
            return exists;
        }

        // Delete search results list and features
        function deleteResults() {
            vectorLayer.getSource().clear();
            geoSearchForm.value = '';
            suggestionDiv.style.display = 'none';
            resultDiv.innerHTML = '';
            popupContent.innerHTML = '';
            popup.setPosition(undefined);
        }

        // Get center of features extent (polygons to points)
        function getCenterOfExtent(Extent) {
            var X = Extent[0] + (Extent[2] - Extent[0]) / 2;
            var Y = Extent[1] + (Extent[3] - Extent[1]) / 2;
            return [X, Y];
        }

        // Add geojson to vector layer
        function addGeojson(geojson) {
            var vectorSource = vectorLayer.getSource();
            vectorSource.clear();
            var format = new ol.format.GeoJSON();
            var features = format.readFeatures(geojson);
            var computedExtent = ol.extent.createEmpty();
            features.forEach(function (feature) {
                var createPolygon = false;
                var bbox;
                var extent;
                if (BKGWebMap.Util.hasNestedProperty(feature.getProperties(), 'bbox.type') && BKGWebMap.Util.hasNestedProperty(feature.getProperties(), 'bbox.coordinates')) {
                    var bboxType = feature.getProperties().bbox.type;
                    if (bboxType === 'Polygon') {
                        bbox = feature.getProperties().bbox.coordinates;
                        if (bbox instanceof Array) {
                            createPolygon = true;
                        }
                    }
                }

                if (createPolygon) {
                    var polygon = new ol.geom.Polygon(bbox);
                    extent = polygon.getExtent();
                } else {
                    extent = feature.getGeometry().getExtent();
                }
                var center = getCenterOfExtent(extent);
                var properties = feature.getProperties();
                properties.extent = extent;

                var point = new ol.geom.Point(center);
                var pointFeature = new ol.Feature({
                    geometry: point
                });
                pointFeature.setProperties(properties);
                pointFeature.setProperties({
                    featureId: BKGWebMap.Util.uniqueId()
                });
                vectorSource.addFeature(pointFeature);
                ol.extent.extend(computedExtent, extent);
            });
            if (features.length) {
                map.getView().fit(computedExtent, { size: map.getSize() });
            }
            createResultTable(vectorLayer);
        }

        // geosearch
        function geosearch(queryString) {
            if (queryString === null || queryString.trim().length === 0) { return; }

            var projection = map.getView().getProjection().getCode();

            var queryFilter = '';
            if (filter) {
                queryFilter = '&filter=' + filter;
            }

            var geojsonUrl = url + '/geosearch.json?query=' + queryString + queryFilter + '&count=' + resultsCount + '&srsName=' + projection;
            if (useSelectionFilterBbox) {
                geojsonUrl += '&bbox=' + selectionFilter.bbox.coordinates;
            }
            getGeoJson(queryString, geojsonUrl);
        }

        // Get geojson with ajax request
        function getGeoJson(suggestionName, geojsonUrl) {
            suggestionDiv.innerHTML = '';
            geoSearchForm.value = suggestionName;
            popupContent.innerHTML = '';
            popup.setPosition(undefined);

            xhr.open('GET', geojsonUrl);

            xhr.onload = function () {
                if (xhr.status === 200) {
                    var geojson = JSON.parse(xhr.responseText);
                    addGeojson(geojson);
                }
            };

            xhr.onerror = function () {
                window.console.log(BKGWebMap.ERROR.xhrError);
            };

            xhr.send();
        }

        function highlightFeature(id) {
            var selectedFeature;
            vectorLayer.getSource().getFeatures().forEach(function (feature) {
                feature.setStyle(null);
                var featureId = feature.getProperties().featureId;
                if (featureId === id) {
                    selectedFeature = feature;
                }
            });
            if (selectedFeature) {
                selectedFeature.setStyle(selectionStyle);
            }
        }

        function unHighlightFeatures() {
            vectorLayer.getSource().getFeatures().forEach(function (feature) {
                feature.setStyle(null);
            });
        }

        function zoomToFeature(id) {
            var selectedFeature;
            vectorLayer.getSource().getFeatures().forEach(function (feature) {
                feature.setStyle(null);
                var featureId = feature.getProperties().featureId;
                if (featureId === id) {
                    selectedFeature = feature;
                }
            });

            if (selectedFeature) {
                var content = getPopupContent(selectedFeature);
                if (content) {
                    var coordinates = selectedFeature.getGeometry().getCoordinates();
                    popupContent.innerHTML = content;
                    popup.setPosition(coordinates);
                    if (selectedFeature.getProperties().extent) {
                        map.getView().fit(selectedFeature.getProperties().extent, { size: map.getSize() });
                    } else if (selectedFeature.getGeometry().getExtent()) {
                        map.getView().fit(selectedFeature.getGeometry().getExtent(), { size: map.getSize() });
                    }
                    map.getView().setCenter(coordinates);
                    map.getView().setZoom(resultsMaxZoom);
                } else {
                    popupContent.innerHTML = '';
                    popup.setPosition(undefined);
                }
            }
        }

        // Create result table
        function createResultTable(vectorLayer) {
            popupContent.innerHTML = '';
            popup.setPosition(undefined);

            resultDiv.innerHTML = '';

            var table = document.createElement('table');
            table.className = 'bkgwebmap-geosearchresulttable bkgwebmap-selectable';

            vectorLayer.getSource().getFeatures().forEach(function (feature) {
                var properties = feature.getProperties();
                var propertiesToShow;
                var tr;
                var td;
                var text;
                var textDiv;
                tr = document.createElement('tr');
                tr.setAttribute('data-bkgwebmap-searchid', properties.featureId);
                table.appendChild(tr);
                td = document.createElement('td');
                tr.appendChild(td);
                if (templateList) {
                    var coordinates = feature.getGeometry().getCoordinates();
                    td.innerHTML = getContentWithTemplate(templateList, properties, coordinates);
                } else {
                    if (protocol === 'wfs') {
                        propertiesToShow = wfsShowAttributes;
                    } else if (protocol === 'ortssuche') {
                        propertiesToShow = gdzOrtssuchePropsToShow;
                    }
                    for (var i = 0; i < propertiesToShow.length; i++) {
                        if (Object.prototype.hasOwnProperty.call(properties, propertiesToShow[i])) {
                            text = properties[propertiesToShow[i]];
                            textDiv = document.createElement('div');
                            if (i !== 0) {
                                textDiv.className = 'bkgwebmap-geosearchresulttype';
                            }
                            textDiv.innerHTML = text;
                            td.appendChild(textDiv);
                        }
                    }
                }
                tr.addEventListener('mouseover', function () {
                    var id = this.getAttribute('data-bkgwebmap-searchid');
                    this.classList.add('bkgwebmap-geosearchresultselect');
                    map.removeInteraction(selectInteraction);
                    highlightFeature(id);
                });
                tr.addEventListener('mouseout', function () {
                    this.classList.remove('bkgwebmap-geosearchresultselect');
                    unHighlightFeatures();
                    map.addInteraction(selectInteraction);
                });
                tr.addEventListener('click', function () {
                    var id = this.getAttribute('data-bkgwebmap-searchid');
                    zoomToFeature(id);
                });
            });
            showResultTable(table);
        }

        // Create suggestion list shown as html table
        function createSuggestionTable(suggestion) {
            suggestionDiv.innerHTML = '';

            var table = document.createElement('table');
            table.className = 'bkgwebmap-geosearchsuggestiontable';

            var tr;
            var td;
            var link;
            var data;

            if (!suggestion.length) {
                table.innerHTML = 'Keine Ergebnisse!';
            }

            for (var i = 0; i < suggestion.length; i++) {
                if (Object.prototype.hasOwnProperty.call(suggestion[i], 'highlighted') && Object.prototype.hasOwnProperty.call(suggestion[i], 'suggestion')) {
                    tr = document.createElement('tr');
                    tr.setAttribute('data-bkgwebmap-suggestion', suggestion[i].suggestion);
                    table.appendChild(tr);
                    td = document.createElement('td');
                    link = document.createElement('a');
                    link.setAttribute('href', '#');
                    td.appendChild(link);
                    data = document.createElement('span');
                    data.className = 'bkgwebmap-geosearchsuggestiondata';
                    link.appendChild(data);
                    data.innerHTML = suggestion[i].highlighted;

                    tr.appendChild(td);

                    tr.addEventListener('click', function () {
                        var suggestionName = this.getAttribute('data-bkgwebmap-suggestion');
                        geosearch(suggestionName);
                    });

                    tr.addEventListener('mouseenter', function () {
                        this.childNodes[0].childNodes[0].focus();
                        var allRows = document.getElementById(mapId).getElementsByClassName('bkgwebmap-geosearchsuggestiontable')[0].querySelectorAll('[data-bkgwebmap-suggestion]');
                        for (var i = 0; i < allRows.length; i++) {
                            allRows[i].classList.remove('bkgwebmap-geosearchhighlight');
                        }
                        this.classList.add('bkgwebmap-geosearchhighlight');
                    });

                    link.addEventListener('focus', function () {
                        var rowFocus = this.parentElement.parentElement;
                        rowFocus.addEventListener('keydown', pressArrows);
                    });
                }
            }
            return table;
        }

        // Press up-down arrows in suggestion table
        function pressArrows(event) {
            var allRows;
            var i;
            if (event.key && event.keyCode === 40) {
                event.preventDefault();

                allRows = document.getElementById(mapId).getElementsByClassName('bkgwebmap-geosearchsuggestiontable')[0].querySelectorAll('[data-bkgwebmap-suggestion]');
                var nextSibling = event.target.parentNode.parentNode.nextSibling;
                if (nextSibling) {
                    for (i = 0; i < allRows.length; i++) {
                        allRows[i].classList.remove('bkgwebmap-geosearchhighlight');
                    }

                    nextSibling.classList.add('bkgwebmap-geosearchhighlight');
                    nextSibling.childNodes[0].childNodes[0].focus();
                }
            } else if (event.key && event.keyCode === 38) {
                event.preventDefault();

                allRows = document.getElementById(mapId).getElementsByClassName('bkgwebmap-geosearchsuggestiontable')[0].querySelectorAll('[data-bkgwebmap-suggestion]');
                var previousSibling = event.target.parentNode.parentNode.previousSibling;
                if (previousSibling) {
                    for (i = 0; i < allRows.length; i++) {
                        allRows[i].classList.remove('bkgwebmap-geosearchhighlight');
                    }

                    previousSibling.classList.add('bkgwebmap-geosearchhighlight');
                    previousSibling.childNodes[0].childNodes[0].focus();
                }
            }
        }

        // Get search results using gdz_ortssuche protocol
        function getGdzOrtssuche(searchString, suggestionCallback) {
            var requestUrl;
            var querySelectionFilterBbox = '';
            var queryFilter = '';
            if (useSelectionFilterBbox) {
                querySelectionFilterBbox = '&bbox=' + selectionFilter.bbox.coordinates + '&srsName=' + selectionFilter.bbox.projection;
            }

            if (filter) {
                queryFilter = '&filter=' + filter;
            }

            requestUrl = url + '/suggest.json?query=' + searchString + '&count=' + suggestCount + querySelectionFilterBbox + queryFilter;

            xhr.open('GET', requestUrl);

            xhr.onload = function () {
                if (xhr.status === 200) {
                    var suggestion = JSON.parse(xhr.responseText);

                    suggestionCallback(createSuggestionTable(suggestion));
                }
            };

            xhr.onerror = function () {
                window.console.log(BKGWebMap.ERROR.xhrError);
            };

            xhr.send();
        }

        // Show result table and hide suggestions
        function showResultTable(table) {
            resultDiv.appendChild(table);
            suggestionDiv.style.display = 'none';
            resultDiv.style.display = 'block';
        }

        // Show suggestion table and hide results
        function showSuggestionTable(table) {
            suggestionDiv.appendChild(table);
            suggestionDiv.style.display = 'block';
        }

        // Activate reverse geocoding
        function activateReverseGeocoding() {
            reverseGeoButtonDiv.addEventListener('click', useReverseGeocoding);
            reverseGeoButtonDiv.addEventListener('mouseenter', reverseGeocodingHover);
            reverseGeoButtonDiv.classList.add('bkgwebmap-reversegeoactive');
        }

        // Deactivate reverse geocoding
        function deactivateReverseGeocoding() {
            reverseGeoButtonDiv.removeEventListener('click', useReverseGeocoding);
            reverseGeoButtonDiv.removeEventListener('mouseenter', reverseGeocodingHover);
            reverseGeoButtonDiv.classList.remove('bkgwebmap-reversegeoactive');
        }

        // Initialize reverse geocoding
        function configureReverseGeocoding() {
            if (reverseGeocoding.minResolution || reverseGeocoding.maxResolution || reverseGeocoding.minZoom || reverseGeocoding.maxZoom) {
                var initZoom = map.getView().getZoom();
                var initResolution = map.getView().getResolution();
                adjustReverseGeocoding(initZoom, initResolution);
                map.getView().on('change:resolution', function () {
                    var zoom = map.getView().getZoom();
                    var resolution = map.getView().getResolution();
                    adjustReverseGeocoding(zoom, resolution);
                });
            }
        }

        function adjustReverseGeocoding(zoom, resolution) {
            if ((reverseGeocoding.minZoom && zoom < reverseGeocoding.minZoom) || (reverseGeocoding.maxZoom && zoom > reverseGeocoding.maxZoom)) {
                deactivateReverseGeocoding();
            } else if (reverseGeocoding.minZoom || reverseGeocoding.maxZoom) {
                activateReverseGeocoding();
            }
            if ((reverseGeocoding.minResolution && resolution < reverseGeocoding.minResolution) || (reverseGeocoding.maxResolution && resolution > reverseGeocoding.maxResolution)) {
                deactivateReverseGeocoding();
            } else if (reverseGeocoding.minResolution || reverseGeocoding.maxResolution) {
                activateReverseGeocoding();
            }
        }

        // Show tooltip for reverse geocoding button
        function reverseGeocodingHover() {
            searchTooltip.style.visibility = '';
            deleteResultsTooltip.style.visibility = '';
            reverseGeoSearchTooltip.style.visibility = 'visible';
            setTimeout(function () {
                reverseGeoSearchTooltip.style.visibility = '';
            }, 1200);
        }

        // Reverse geocoding function
        function useReverseGeocoding() {
            var bbox = map.getView().calculateExtent(map.getSize());
            var epsg = map.getView().getProjection().getCode();

            if (useSelectionFilterBbox) {
                var filterBbox = ol.proj.transformExtent(selectionFilter.bbox.coordinates, selectionFilter.bbox.projection, epsg);
                var intersected = ol.extent.intersects(bbox, filterBbox);
                if (intersected) {
                    var intersectedBbox = ol.extent.getIntersection(bbox, filterBbox);
                    if (intersectedBbox.indexOf(Infinity) === -1 && intersectedBbox.indexOf(Infinity) === -1) {
                        bbox = intersectedBbox;
                    }
                } else {
                    bbox = false;
                }
            }

            if (!bbox) {
                return;
            }
            var queryFilter = '&filter=' + BKGWebMap.CONTROLS.tools.geoSearch.reverseGeocoding.defaultFilter;
            if (filter) {
                queryFilter = '&filter=' + filter;
            }
            var reverseGeocodingUrl = url + '/geosearch?count=' + resultsCount + '&bbox=' + bbox + '&srsName=' + epsg + queryFilter;
            xhr.open('GET', reverseGeocodingUrl);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var geojson = JSON.parse(xhr.responseText);
                    popupContent.innerHTML = '';
                    popup.setPosition(undefined);
                    geoSearchForm.value = '';
                    addGeojson(geojson);
                }
            };

            xhr.onerror = function () {
                window.console.log(BKGWebMap.ERROR.xhrError);
            };

            xhr.send();
        }

        // Custom WFS for geocoding
        function getWfs(searchString) {
            var epsg = map.getView().getProjection().getCode();
            var search = searchString + '*';
            var format = formatsList[wfsProtocolFormat].olClass;
            var outputFormat = formatsList[wfsProtocolFormat].outputFormat;
            var filterToUse = ol.format.filter.like(wfsSearchAttribute, search);
            var maxFeatures = resultsCount;

            var featureRequest = new ol.format.WFS().writeGetFeature({
                srsName: epsg,
                featurePrefix: wfsFeaturePrefix,
                featureTypes: [wfsFeatureType],
                outputFormat: outputFormat,
                filter: filterToUse,
                maxFeatures: maxFeatures
            });
            var bodyRequest = new XMLSerializer().serializeToString(featureRequest);

            xhr.open('POST', url);

            xhr.onload = function () {
                if (xhr.status === 200) {
                    var vectorSource = vectorLayer.getSource();
                    vectorSource.clear();
                    var features = format.readFeatures(xhr.responseText, {
                        dataProjection: epsg,
                        featureProjection: epsg
                    });

                    features.forEach(function (feature) {
                        var extent = feature.getGeometry().getExtent();
                        var center = getCenterOfExtent(extent);
                        var properties = feature.getProperties();

                        var point = new ol.geom.Point(center);
                        var pointFeature = new ol.Feature({
                            geometry: point
                        });
                        pointFeature.setProperties(properties);
                        pointFeature.setProperties({
                            featureId: BKGWebMap.Util.uniqueId()
                        });
                        vectorSource.addFeature(pointFeature);
                    });

                    if (features.length) {
                        map.getView().fit(vectorSource.getExtent(), { size: map.getSize() });
                    }

                    createResultTable(vectorLayer);
                }
            };

            xhr.onerror = function () {
                window.console.log(BKGWebMap.ERROR.xhrError);
            };

            xhr.send(bodyRequest);
        }

        // Show tooltip for reverse wfs geocoding button
        function searchButtonHover() {
            if (reverseGeoSearchTooltip) {
                reverseGeoSearchTooltip.style.visibility = '';
            }
            if (deleteResultsTooltip) {
                deleteResultsTooltip.style.visibility = '';
            }
            searchTooltip.style.visibility = 'visible';
            setTimeout(function () {
                searchTooltip.style.visibility = '';
            }, 1200);
        }

        function deleteButtonHover() {
            if (reverseGeoSearchTooltip) {
                reverseGeoSearchTooltip.style.visibility = '';
            }
            if (searchTooltip) {
                searchTooltip.style.visibility = '';
            }
            deleteResultsTooltip.style.visibility = 'visible';
            setTimeout(function () {
                deleteResultsTooltip.style.visibility = '';
            }, 1200);
        }

        function useSearch() {
            var searchString = geoSearchForm.value;
            if (protocol === 'wfs') {
                getWfs(searchString);
            } else {
                geosearch(searchString);
            }
        }

        // Deactivate click event for attributes
        function removeAttributeListener() {
            map.getControls().forEach(function (control) {
                if (BKGWebMap.Control.ShowAttributes && control instanceof BKGWebMap.Control.ShowAttributes) {
                    map.un('click', control.clickAttributesActivate);
                }
                if (BKGWebMap.Control.CopyCoordinates && control instanceof BKGWebMap.Control.CopyCoordinates) {
                    map.un('click', control.clickCopyCoordinatesActivate);
                }
            });
        }

        // Activate click event for attributes
        function addAttributeListener() {
            map.getControls().forEach(function (control) {
                if (BKGWebMap.Control.ShowAttributes && control instanceof BKGWebMap.Control.ShowAttributes) {
                    map.on('click', control.clickAttributesActivate);
                }
                if (BKGWebMap.Control.CopyCoordinates && control instanceof BKGWebMap.Control.CopyCoordinates) {
                    map.on('click', control.clickCopyCoordinatesActivate);
                }
            });
        }

        // Event listener to start searching
        if (wfsAutocomplete) {
            geoSearchForm.addEventListener('input', function () {
                var searchString = geoSearchForm.value;
                if (searchString === '') {
                    suggestionDiv.innerHTML = '';
                    suggestionDiv.style.display = 'none';
                    if (resultDiv.innerHTML !== '') {
                        resultDiv.style.display = 'block';
                    }
                } else if (protocol === 'ortssuche') {
                    setTimeout(function () {
                        if (geoSearchForm.value === '') {
                            suggestionDiv.innerHTML = '';
                            suggestionDiv.style.display = 'none';
                            if (resultDiv.innerHTML !== '') {
                                resultDiv.style.display = 'block';
                            }
                        } else {
                            getGdzOrtssuche(searchString, function (table) {
                                showSuggestionTable(table);
                            });
                        }
                    }, 500);
                } else {
                    window.console.log(BKGWebMap.ERROR.geoSearchWrongProtocol);
                }
            }, false);

            geoSearchForm.addEventListener('keydown', function (event) {
                if (protocol === 'ortssuche') {
                    if (event.key && event.key === 'Enter') {
                        var suggestionName = event.target.value;
                        var geojsonUrl;
                        var projection = map.getView().getProjection().getCode();
                        if (useSelectionFilterBbox) {
                            geojsonUrl = url + '/geosearch.json?query=' + suggestionName + '&count=' + resultsCount + '&srsName=' + projection + '&bbox=' + selectionFilter.bbox.coordinates;
                        } else {
                            geojsonUrl = url + '/geosearch.json?query=' + suggestionName + '&count=' + resultsCount + '&srsName=' + projection;
                        }
                        getGeoJson(suggestionName, geojsonUrl);
                    } else if (suggestionDiv.style.display === 'none' && event.key && event.keyCode === 40) {
                        event.preventDefault();
                        suggestionDiv.style.display = 'block';
                    } else if (event.key && event.keyCode === 40) {
                        event.preventDefault();
                        var suggestionTable = document.getElementById(mapId).getElementsByClassName('bkgwebmap-geosearchsuggestiontable');
                        if (suggestionTable && suggestionTable.length) {
                            var row = suggestionTable[0].childNodes;
                            if (row && row.length) {
                                row[0].childNodes[0].childNodes[0].focus();
                                row[0].classList.add('bkgwebmap-geosearchhighlight');
                            }
                        }
                    } else if (event.key && event.key === 'Escape' || event.keyCode === 27) {
                        suggestionDiv.style.display = 'none';
                        if (resultDiv.innerHTML !== '') {
                            resultDiv.style.display = 'block';
                        }
                    }
                }
            }, false);
        }

        function getContentWithTemplate(template, properties, coordinates) {
            var content = template;
            for (var prop in properties) {
                if (content.indexOf('${' + prop + '}') > -1 && prop !== 'geometry') {
                    content = content.replace('${' + prop + '}', properties[prop]);
                } else if (prop === 'geometry') {
                    if (content.indexOf('${geometry.x}') > -1) {
                        content = content.replace('${geometry.x}', coordinates[0].toFixed(5));
                    }
                    if (content.indexOf('${geometry.y}') > -1) {
                        content = content.replace('${geometry.y}', coordinates[1].toFixed(5));
                    }
                }
            }
            content = content.replace(/(\$\{\w+\})/mg, '');
            return content;
        }

        // Read content for feature popup
        function getPopupContent(feature) {
            var properties = feature.getProperties();
            var coordinates = feature.getGeometry().getCoordinates();
            var content = '';
            var propertiesToShow;
            if (templatePopup) {
                content = getContentWithTemplate(templatePopup, properties, coordinates);
            } else {
                if (protocol === 'wfs') {
                    propertiesToShow = wfsShowAttributes;
                } else if (protocol === 'ortssuche') {
                    propertiesToShow = gdzOrtssuchePropsToShow;
                }
                for (var i = 0; i < propertiesToShow.length; i++) {
                    if (Object.prototype.hasOwnProperty.call(properties, propertiesToShow[i])) {
                        content += propertiesToShow[i];
                        content += ': <i>';
                        content += properties[propertiesToShow[i]].replace(/ /g, '&nbsp;');
                        content += '</i><br>';
                    }
                }
                content += '(';
                content += coordinates[0].toFixed(5);
                content += ',&nbsp;';
                content += coordinates[1].toFixed(5);
                content += ')';
            }
            return content;
        }

        // Find feature when clicked on map
        function findFeature(pixel) {
            var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
                return feature;
            }, {
                layerFilter: function (layer) {
                    return layer === vectorLayer;
                },
                hitTolerance: 5
            });

            if (feature) {
                var content = getPopupContent(feature);
                if (content) {
                    var coordinates = feature.getGeometry().getCoordinates();
                    popupContent.innerHTML = content;
                    popup.setPosition(coordinates);
                    removeAttributeListener();
                } else {
                    popupContent.innerHTML = '';
                    popup.setPosition(undefined);
                    addAttributeListener();
                }
            } else {
                popupContent.innerHTML = '';
                popup.setPosition(undefined);
                addAttributeListener();
            }
        }

        /**
         * Activate click event to show popup
         * @param event
         */
        this.geoSearchClickActivate = function (event) {
            var pixel = event.pixel;
            findFeature(pixel);
        };

        map.on('click', this.geoSearchClickActivate);

        // Event listener for enter on search form
        geoSearchForm.addEventListener('keydown', function (event) {
            if (event.key && event.key === 'Enter') {
                useSearch();
            }
        });

        // Event listener for delete button (mouseenter an click)
        deleteResultsButtonDiv.addEventListener('mouseenter', deleteButtonHover, false);
        deleteResultsButtonDiv.addEventListener('click', function () {
            deleteResults();
        }, false);

        // Event listener for reverse geocoding button (mouseenter and click)
        if (reverseGeoButtonDiv) {
            reverseGeoButtonDiv.addEventListener('mouseenter', reverseGeocodingHover);
            reverseGeoButtonDiv.addEventListener('click', useReverseGeocoding);
        }

        // Event listener for search button (mouseenter and click)
        searchButtonDiv.addEventListener('mouseenter', searchButtonHover);
        searchButtonDiv.addEventListener('click', useSearch);

        // Event listener for popup close
        popupCloser.addEventListener('click', function () {
            popup.setPosition(undefined);
        }, false);

        // Finalize control
        ol.control.Control.call(this, {
            element: geoSearchElement,
            target: target
        });
    };
};
