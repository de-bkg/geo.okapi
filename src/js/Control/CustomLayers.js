/**
 * Create CustomLayers Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_customLayers}
 */
BKGWebMap.Control.createCustomLayers = function () {
    return function (map, controlName, options, panel) {
        var _this = this;

        var mapId = map.getTarget();

        // Check if control should be created
        if (options.active === false) {
            return undefined;
        }

        // If no panel exists, do not create this control
        if (!panel) {
            window.console.log(BKGWebMap.ERROR.noPanelNoDivForControl + controlName);
            return undefined;
        }

        this.styles = null;

        this.changeVisibility = BKGWebMap.CONTROLS.tools.customLayers.changeVisibility;
        if (typeof options.changeVisibility === 'boolean') {
            this.changeVisibility = options.changeVisibility;
        }

        var style;
        var styleName;
        if (options.defaultStyle && typeof options.defaultStyle === 'string' && options.defaultStyle !== '') {
            style = options.defaultStyle;
            styleName = options.defaultStyle;
        }

        var edit = BKGWebMap.CONTROLS.tools.customLayers.edit;
        if (typeof options.edit === 'boolean') {
            edit = options.edit;
        }

        var dataTypes = BKGWebMap.CONTROLS.tools.customLayers.dataTypes;
        if (options.dataTypes instanceof Array && options.dataTypes.length) {
            dataTypes = options.dataTypes;
        }

        // Create DOM
        var customLayersContainer = document.createElement('div');
        customLayersContainer.className = 'bkgwebmap-customlayerscontainer';

        var customLayers = document.createElement('div');
        customLayers.className = 'bkgwebmap-customlayers';

        var customLayersHeader = document.createElement('div');
        customLayersHeader.className = 'bkgwebmap-customlayersheader bkgwebmap-layerheader bkgwebmap-layerswitchermainheader';
        customLayers.appendChild(customLayersHeader);

        var customLayersIconDiv = document.createElement('div');
        customLayersIconDiv.className = 'bkgwebmap-layerheaderinputdiv';

        var parserCustomLayersIcon = new DOMParser();
        var customLayersIcon = parserCustomLayersIcon.parseFromString(BKGWebMap.PANEL_ICONS.ADD_LAYER, 'text/xml');
        customLayersIconDiv.appendChild(customLayersIcon.documentElement);
        customLayersHeader.appendChild(customLayersIconDiv);

        var customLayersTitle = document.createElement('div');
        customLayersTitle.className = 'bkgwebmap-layerheaderinputdivlayer';
        customLayersTitle.innerHTML = 'Layer hinzufügen';
        customLayersHeader.appendChild(customLayersTitle);

        var plusMinus = document.createElement('div');
        plusMinus.className = 'bkgwebmap-layerheaderplusminus';
        plusMinus.innerHTML = '+';
        customLayersHeader.appendChild(plusMinus);

        customLayersHeader.addEventListener('click', openCloseHeader);
        customLayers.appendChild(createContent());

        var messageDiv = document.createElement('div');
        messageDiv.className = 'bkgwebmap-messagediv';
        messageDiv.innerHTML = 'fehlerhafte URL';


        function fillTypeDropdown(dataType) {
            var selectItem = document.createElement('option');
            selectItem.setAttribute('value', dataType);
            if (dataType === 'BKG') {
                selectItem.innerHTML = 'vorkonfigurierte Dienste';
            } else {
                selectItem.innerHTML = dataType;
            }
            return selectItem;
        }

        // Get info about available BKG services
        function getBkgServiceIds(callback) {
            var registryUrl = BKGWebMap.SERVICE_REGISTRY;
            var params = '';

            var xhr = new XMLHttpRequest();
            xhr.open('GET', registryUrl + params);
            var onError = function () {
                return callback(undefined);
            };
            xhr.onerror = onError;
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var jsonConfig = JSON.parse(xhr.responseText);
                    return callback(jsonConfig);
                }
                onError();
            };
            xhr.send();
        }

        // Get Info about WMS through a GetCapabilities request
        function getWmsInfo(callback) {
            var url = document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayerwmsinput')[0].value;
            if (url === '') {
                callback(undefined);
                return;
            }
            var title = '';
            var wmsInfo = [];
            var xhr = new XMLHttpRequest();
            var requestUrl = url;
            // Add parameters if not available
            if (requestUrl.indexOf('?') === -1) {
                requestUrl += '?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities';
            } else if (requestUrl[requestUrl.length - 1] === '?') {
                requestUrl += 'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities';
            }
            xhr.open('GET', requestUrl);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var parser = new ol.format.WMSCapabilities();
                    var result = parser.read(xhr.responseText);
                    // Parse title
                    if (BKGWebMap.Util.hasNestedProperty(result, 'Service.Title')) {
                        title = result.Service.Title;
                    }
                    // Parse info
                    if (BKGWebMap.Util.hasNestedProperty(result, 'Capability.Layer.Layer')) {
                        if (result.Capability.Layer.Layer && result.Capability.Layer.Layer instanceof Array && result.Capability.Layer.Layer.length) {
                            parseLayersInfoWMS(result.Capability.Layer.Layer, wmsInfo);
                        }
                    }
                    // GetMap URL
                    if (BKGWebMap.Util.hasNestedProperty(result, 'Capability.Request.GetMap.DCPType')) {
                        if (result.Capability.Request.GetMap.DCPType && result.Capability.Request.GetMap.DCPType instanceof Array && result.Capability.Request.GetMap.DCPType.length) {
                            var dcpType = result.Capability.Request.GetMap.DCPType[0];
                            if (dcpType && BKGWebMap.Util.hasNestedProperty(dcpType, 'HTTP.Get.OnlineResource')) {
                                url = dcpType.HTTP.Get.OnlineResource;
                            }
                        }
                    }
                    if (url.indexOf('?') !== -1) {
                        url = url.substring(0, url.indexOf('?'));
                    }
                    callback(title, wmsInfo, url);
                } else {
                    showMessage('bkgwebmap-customlayerdivwms', 'WMS-URL aufrufen');
                    callback(undefined);
                }
            };
            xhr.onerror = function () {
                showMessage('bkgwebmap-customlayerdivwms', 'WMS-URL aufrufen');
                callback(undefined);
            };
            xhr.send();
        }

        function showMessage(div, defaultButton) {
            var messageDivs = document.getElementById(mapId).getElementsByClassName(div)[0].getElementsByClassName('bkgwebmap-messagediv');
            document.getElementById(mapId).getElementsByClassName(div)[0].getElementsByClassName('bkgwebmap-customlayerinputbutton')[0].innerHTML = defaultButton;
            if (!messageDivs.length) {
                var cloneMessage = messageDiv.cloneNode(true);
                document.getElementById(mapId).getElementsByClassName(div)[0].appendChild(cloneMessage);
            }
            setTimeout(function () {
                if (messageDivs.length) {
                    document.getElementById(mapId).getElementsByClassName(div)[0].removeChild(messageDivs[0]);
                }
            }, 10000);
        }

        function parseLayersInfoWMS(arrayLayers, wmsInfo) {
            for (var i = 0; i < arrayLayers.length; i++) {
                if (arrayLayers[i].Layer && arrayLayers[i].Layer instanceof Array && arrayLayers[i].Layer.length) {
                    var layersGroup = {};
                    layersGroup.layers = [];
                    if (arrayLayers[i].Title) {
                        layersGroup.title = arrayLayers[i].Title;
                    }
                    wmsInfo.push(layersGroup);
                    parseLayersInfoWMS(arrayLayers[i].Layer, layersGroup.layers);
                } else if (!arrayLayers[i].Layer && arrayLayers[i].Name) {
                    var singleLayer = {};
                    singleLayer.styles = [];
                    singleLayer.name = arrayLayers[i].Name;
                    // Layer title
                    if (arrayLayers[i].Title) {
                        singleLayer.title = arrayLayers[i].Title;
                    } else {
                        singleLayer.title = singleLayer.name;
                    }
                    // Layer styles
                    if (arrayLayers[i].Style && arrayLayers[i].Style instanceof Array) {
                        for (var j = 0; j < arrayLayers[i].Style.length; j++) {
                            var singleStyle = {};
                            if (arrayLayers[i].Style[j].Name) {
                                singleStyle.name = arrayLayers[i].Style[j].Name;
                                if (arrayLayers[i].Style[j].Title) {
                                    singleStyle.title = arrayLayers[i].Style[j].Title;
                                } else {
                                    singleStyle.title = singleStyle.name;
                                }
                            }
                            singleLayer.styles.push(singleStyle);
                        }
                    }
                    wmsInfo.push(singleLayer);
                }
            }
        }

        function getWmtsInfo(callback) {
            var url = document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayerwmtsinput')[0].value;
            if (url === '' || url.slice(url.length - 4, url.length) !== '.xml') {
                callback(undefined);
                return;
            }
            var title = '';
            var wmtsInfo = {
                layers: [],
                matrixSets: []
            };
            var singleLayer;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var i;
                    var parser = new ol.format.WMTSCapabilities();
                    var result = parser.read(xhr.responseText);
                    // Parse title
                    if (BKGWebMap.Util.hasNestedProperty(result, 'ServiceIdentification.Title')) {
                        title = result.ServiceIdentification.Title;
                    }
                    // Parse info
                    if (BKGWebMap.Util.hasNestedProperty(result, 'Contents.Layer') && result.Contents.Layer instanceof Array && result.Contents.Layer.length) {
                        for (i = 0; i < result.Contents.Layer.length; i++) {
                            singleLayer = {};
                            if (result.Contents.Layer[i].Identifier) {
                                singleLayer.layer = result.Contents.Layer[i].Identifier;

                                if (result.Contents.Layer[i].Title) {
                                    singleLayer.title = result.Contents.Layer[i].Title;
                                } else {
                                    singleLayer.title = singleLayer.layer;
                                }
                            }
                            wmtsInfo.layers.push(singleLayer);
                        }

                        if (BKGWebMap.Util.hasNestedProperty(result, 'Contents.TileMatrixSet') && result.Contents.TileMatrixSet instanceof Array && result.Contents.TileMatrixSet.length) {
                            for (i = 0; i < result.Contents.TileMatrixSet.length; i++) {
                                if (result.Contents.TileMatrixSet[i].Identifier) {
                                    wmtsInfo.matrixSets.push(result.Contents.TileMatrixSet[i].Identifier);
                                }
                            }
                        }
                    }

                    if (wmtsInfo.layers.length && wmtsInfo.matrixSets.length) {
                        callback(title, wmtsInfo, url);
                    } else {
                        showMessage('bkgwebmap-customlayerdivwmts', 'WMTS-URL aufrufen');
                        callback(undefined);
                    }
                } else {
                    showMessage('bkgwebmap-customlayerdivwmts', 'WMTS-URL aufrufen');
                    callback(undefined);
                }
            };
            xhr.onerror = function () {
                showMessage('bkgwebmap-customlayerdivwmts', 'WMTS-URL aufrufen');
                callback(undefined);
            };
            xhr.send();
        }

        function getWfsLayerNames(wfsNamesArray) {
            var layers = [];
            var singleLayer;
            for (var i = 0; i < wfsNamesArray.length; i++) {
                singleLayer = {};
                if (BKGWebMap.Util.hasNestedProperty(wfsNamesArray[i], 'Name.#text') && wfsNamesArray[i].Name['#text'] !== '') {
                    singleLayer.name = wfsNamesArray[i].Name['#text'];
                    if (BKGWebMap.Util.hasNestedProperty(wfsNamesArray[i], 'Title.#text') && wfsNamesArray[i].Title['#text'] !== '') {
                        singleLayer.title = wfsNamesArray[i].Title['#text'];
                    } else {
                        singleLayer.title = singleLayer.name;
                    }
                    layers.push(singleLayer);
                } else if (BKGWebMap.Util.hasNestedProperty(wfsNamesArray[i], 'wfs:Name.#text') && wfsNamesArray[i]['wfs:Name']['#text'] !== '') {
                    singleLayer.name = wfsNamesArray[i]['wfs:Name']['#text'];
                    if (BKGWebMap.Util.hasNestedProperty(wfsNamesArray[i], 'wfs:Title.#text') && wfsNamesArray[i]['wfs:Title']['#text'] !== '') {
                        singleLayer.title = wfsNamesArray[i]['wfs:Title']['#text'];
                    } else {
                        singleLayer.title = singleLayer.name;
                    }
                    layers.push(singleLayer);
                }
            }
            return layers;
        }

        // Create an array with available WFS formats
        function createFormatsArray(formatsTemp) {
            var formats = [];
            for (var i = 0; i < formatsTemp.length; i++) {
                var formatTemp = formatsTemp[i].toLowerCase();
                formatTemp = formatTemp.replace(/\s+/g, '');
                // GEOJSON
                if ((formatTemp.indexOf('json') !== -1 || formatTemp.indexOf('geojson') !== -1) && formats.indexOf('GEOJSON') === -1) {
                    formats.push('GEOJSON');
                }
                // GML3
                if ((formatTemp.indexOf('gml3') !== -1 || formatTemp.indexOf('gml/3') !== -1 || formatTemp.indexOf('gml+xml;version=3') !== -1) && formats.indexOf('GML3') === -1) {
                    formats.push('GML3');
                }
                // GML2
                if ((formatTemp.indexOf('gml2') !== -1 || formatTemp.indexOf('gml/2') !== -1 || formatTemp.indexOf('gml+xml;version=2') !== -1) && formats.indexOf('GML2') === -1) {
                    formats.push('GML2');
                }
            }
            return formats;
        }

        // Search in GetCapabilities object for various types of wfs formats
        function wfsFormatsOperation(operations) {
            var formatsTemp = [];
            for (var i = 0; i < operations.length; i++) {
                if (operations[i]['@attributes'] && operations[i]['@attributes'].name && operations[i]['@attributes'].name === 'GetFeature') {
                    var getFeatureOperation = operations[i];
                    if (getFeatureOperation['ows:Parameter'] instanceof Array) {
                        var parameter = getFeatureOperation['ows:Parameter'];
                        for (var k = 0; k < parameter.length; k++) {
                            if (BKGWebMap.Util.hasNestedProperty(parameter[k], '@attributes.name') && parameter[k]['@attributes'].name === 'outputFormat' && parameter[k]['ows:Value'] instanceof Array) {
                                var arrayFormats = parameter[k]['ows:Value'];
                                for (var j = 0; j < arrayFormats.length; j++) {
                                    if (arrayFormats[j]['#text']) {
                                        formatsTemp.push(arrayFormats[j]['#text']);
                                    }
                                }
                            } else if (BKGWebMap.Util.hasNestedProperty(parameter[k], '@attributes.name') && parameter[k]['@attributes'].name === 'outputFormat' && BKGWebMap.Util.hasNestedProperty(parameter[k], 'ows:Value.#text')) {
                                formatsTemp.push(parameter[k]['ows:Value']['#text']);
                            }
                        }
                    } else if (BKGWebMap.Util.hasNestedProperty(getFeatureOperation, 'ows:Parameter.@attributes.name') && getFeatureOperation['ows:Parameter']['@attributes'].name === 'outputFormat') {
                        if (BKGWebMap.Util.hasNestedProperty(getFeatureOperation, 'ows:Parameter.ows:AllowedValues.ows:Value.#text')) {
                            var singleFormat = getFeatureOperation['ows:Parameter']['ows:AllowedValues']['ows:Value']['#text'];
                            formatsTemp.push(singleFormat);
                        }
                    }
                }
            }
            return formatsTemp;
        }

        // Get available wfs formats  from GetCapabilities
        function getWfsFormats(result) {
            var formatsTemp;
            var operations;
            if (BKGWebMap.Util.hasNestedProperty(result, 'wfs:WFS_Capabilities.ows:OperationsMetadata.ows:Operation') && result['wfs:WFS_Capabilities']['ows:OperationsMetadata']['ows:Operation'] instanceof Array) {
                operations = result['wfs:WFS_Capabilities']['ows:OperationsMetadata']['ows:Operation'];
                formatsTemp = wfsFormatsOperation(operations);
            } else if (BKGWebMap.Util.hasNestedProperty(result, 'WFS_Capabilities.ows:OperationsMetadata.ows:Operation') && result.WFS_Capabilities['ows:OperationsMetadata']['ows:Operation'] instanceof Array) {
                operations = result.WFS_Capabilities['ows:OperationsMetadata']['ows:Operation'];
                formatsTemp = wfsFormatsOperation(operations);
            }
            return createFormatsArray(formatsTemp);
        }

        function getWfsInfo(callback) {
            var url = document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayerwfsinput')[0].value;
            if (url === '') {
                callback(undefined);
                return;
            }
            var title = '';
            var wfsInfo = {
                layers: []
            };
            var xhr = new XMLHttpRequest();
            var requestUrl = url;
            // Add parameters if not available
            if (requestUrl.indexOf('?') === -1) {
                requestUrl += '?REQUEST=GetCapabilities&VERSION=1.3.0&SERVICE=wfs';
            } else if (requestUrl[requestUrl.length - 1] === '?') {
                requestUrl += 'REQUEST=GetCapabilities&VERSION=1.3.0&SERVICE=wfs';
            }
            xhr.open('GET', requestUrl);


            // xhr.open('GET', url + '?REQUEST=GetCapabilities&VERSION=1.3.0&SERVICE=wfs');

            xhr.onload = function () {
                if (xhr.status === 200) {
                    var parser = new DOMParser();
                    var resultXml = parser.parseFromString(xhr.responseText, 'text/xml');
                    var result = BKGWebMap.Util.xmlToJson(resultXml);
                    if (BKGWebMap.Util.hasNestedProperty(result, 'wfs:WFS_Capabilities.ows:ServiceIdentification.ows:Title.#text')) {
                        title = result['wfs:WFS_Capabilities']['ows:ServiceIdentification']['ows:Title']['#text'];
                    } else if (BKGWebMap.Util.hasNestedProperty(result, 'WFS_Capabilities.ows:ServiceIdentification.ows:Title.#text')) {
                        title = result.WFS_Capabilities['ows:ServiceIdentification']['ows:Title']['#text'];
                    }
                    if (BKGWebMap.Util.hasNestedProperty(result, 'wfs:WFS_Capabilities.FeatureTypeList.FeatureType')) {
                        if (result['wfs:WFS_Capabilities'].FeatureTypeList.FeatureType.length) {
                            wfsInfo.layers = getWfsLayerNames(result['wfs:WFS_Capabilities'].FeatureTypeList.FeatureType);
                        } else {
                            wfsInfo.layers = getWfsLayerNames([result['wfs:WFS_Capabilities'].FeatureTypeList.FeatureType]);
                        }
                    } else if (BKGWebMap.Util.hasNestedProperty(result, 'WFS_Capabilities.FeatureTypeList.FeatureType') && result.WFS_Capabilities.FeatureTypeList.FeatureType.length) {
                        wfsInfo.layers = getWfsLayerNames(result.WFS_Capabilities.FeatureTypeList.FeatureType);
                    } else if (BKGWebMap.Util.hasNestedProperty(result, 'wfs:WFS_Capabilities.wfs:FeatureTypeList.wfs:FeatureType')) {
                        if (result['wfs:WFS_Capabilities']['wfs:FeatureTypeList']['wfs:FeatureType'].length) {
                            wfsInfo.layers = getWfsLayerNames(result['wfs:WFS_Capabilities']['wfs:FeatureTypeList']['wfs:FeatureType']);
                        }
                    }

                    wfsInfo.formats = getWfsFormats(result);

                    // GetFeature URL
                    var operationArray;
                    if (BKGWebMap.Util.hasNestedProperty(result, 'wfs:WFS_Capabilities.ows:OperationsMetadata.ows:Operation')) {
                        if (result['wfs:WFS_Capabilities']['ows:OperationsMetadata']['ows:Operation'].length) {
                            operationArray = result['wfs:WFS_Capabilities']['ows:OperationsMetadata']['ows:Operation'];
                        }
                    } else if (BKGWebMap.Util.hasNestedProperty(result, 'WFS_Capabilities.ows:OperationsMetadata.ows:Operation') && result.WFS_Capabilities['ows:OperationsMetadata']['ows:Operation'].length) {
                        operationArray = result.WFS_Capabilities['ows:OperationsMetadata']['ows:Operation'];
                    }
                    if (operationArray) {
                        for (var i = 0; i < operationArray.length; i++) {
                            if (BKGWebMap.Util.hasNestedProperty(operationArray[i], '@attributes.name')) {
                                if (operationArray[i]['@attributes'].name === 'GetFeature' && BKGWebMap.Util.hasNestedProperty(operationArray[i], 'ows:DCP.ows:HTTP.ows:Get.@attributes.xlink:href')) {
                                    url = operationArray[i]['ows:DCP']['ows:HTTP']['ows:Get']['@attributes']['xlink:href'];
                                }
                            }
                        }
                    }

                    if (url.indexOf('?') !== -1) {
                        url = url.substring(0, url.indexOf('?'));
                    }
                    return callback(title, wfsInfo, url);
                }
                showMessage('bkgwebmap-customlayerdivwfs', 'WFS-URL aufrufen');
            };
            xhr.onerror = function () {
                showMessage('bkgwebmap-customlayerdivwfs', 'WFS-URL aufrufen');
                return callback(undefined);
            };
            xhr.send();
        }

        function createWmsStyleDropdown(styleInfo) {
            var option = document.createElement('option');
            option.setAttribute('value', styleInfo.name);
            option.innerHTML = styleInfo.title;
            return option;
        }

        // Create menu with wms layer and style names
        function createWmsInfoMenu(singleLayerInfo) {
            var wmsSingleInfoContainer = document.createElement('div');
            wmsSingleInfoContainer.className = 'bkgwebmap-customlayerwmscontainer';

            var inputDiv = document.createElement('div');
            inputDiv.className = 'bkgwebmap-customlayerwmsinputdiv';

            var inputDivLabel = document.createElement('label');
            var parserIconEmpty = new DOMParser();
            var iconEmpty = parserIconEmpty.parseFromString(BKGWebMap.PANEL_ICONS.LAYER_HIDDEN, 'text/xml');

            var input = document.createElement('input');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('data-bkgwebmap-customwmslayer', singleLayerInfo.name);
            input.checked = false;
            inputDivLabel.appendChild(input);

            inputDivLabel.appendChild(iconEmpty.documentElement);
            inputDiv.appendChild(inputDivLabel);
            wmsSingleInfoContainer.appendChild(inputDiv);

            var titleDiv = document.createElement('div');
            titleDiv.className = 'bkgwebmap-customlayerwmstitlediv';
            titleDiv.innerHTML = singleLayerInfo.title;
            wmsSingleInfoContainer.appendChild(titleDiv);

            if (singleLayerInfo.styles.length > 1) {
                var dropdownDiv = document.createElement('div');
                dropdownDiv.className = 'bkgwebmap-customlayerwmsdropdowndiv';
                var styleTitle = document.createTextNode('Stil: ');
                var dropdown = document.createElement('select');
                dropdownDiv.appendChild(styleTitle);
                dropdownDiv.appendChild(dropdown);
                for (var i = 0; i < singleLayerInfo.styles.length; i++) {
                    dropdown.appendChild(createWmsStyleDropdown(singleLayerInfo.styles[i]));
                }
                wmsSingleInfoContainer.appendChild(dropdownDiv);
            }

            input.onchange = function () {
                var label = this.parentNode;
                label.removeChild(label.childNodes[1]);
                parserIconEmpty = new DOMParser();
                var clickIconEmpty = parserIconEmpty.parseFromString(BKGWebMap.PANEL_ICONS.LAYER_HIDDEN, 'text/xml');
                var parserIconFull = new DOMParser();
                var clickIconFull = parserIconFull.parseFromString(BKGWebMap.PANEL_ICONS.LAYER_SHOWN, 'text/xml');
                if (this.checked) {
                    label.appendChild(clickIconFull.documentElement);
                } else {
                    label.appendChild(clickIconEmpty.documentElement);
                }
            };

            return wmsSingleInfoContainer;
        }

        // Create menu with wmts layer name and matrix
        function createWmtsInfoMenu(wmtsInfo) {
            var i;
            var wmtsInfoContainer = document.createElement('div');
            wmtsInfoContainer.className = 'bkgwebmap-customlayerwmtscontainer';

            if (wmtsInfo.layers.length > 1) {
                var layerDivContainer = document.createElement('div');
                wmtsInfoContainer.appendChild(layerDivContainer);
                var layerTitle = document.createTextNode('Layer: ');
                layerDivContainer.appendChild(layerTitle);
                var dropdownLayers = document.createElement('select');
                dropdownLayers.className = 'bkgwebmap-customlayerwmtsdropdownlayers';
                layerDivContainer.appendChild(dropdownLayers);
                var optionLayers;
                for (i = 0; i < wmtsInfo.layers.length; i++) {
                    optionLayers = document.createElement('option');
                    optionLayers.setAttribute('value', wmtsInfo.layers[i].layer);
                    optionLayers.innerHTML = wmtsInfo.layers[i].title;
                    dropdownLayers.appendChild(optionLayers);
                }
            } else {
                var layerDivTitle = document.createElement('div');
                layerDivTitle.className = 'bkgwebmap-customlayerwmtsdivlayers';
                layerDivTitle.setAttribute('data-bkgwebmap-customlayerwmtsname', wmtsInfo.layers[0].layer);
                layerDivTitle.innerHTML = 'Layer: ' + wmtsInfo.layers[0].title;
                wmtsInfoContainer.appendChild(layerDivTitle);
            }

            if (wmtsInfo.matrixSets.length > 1) {
                var matrixSetDivContainer = document.createElement('div');
                wmtsInfoContainer.appendChild(matrixSetDivContainer);
                var matrixSetTitle = document.createTextNode('Matrix Set: ');
                matrixSetDivContainer.appendChild(matrixSetTitle);
                var dropdownMatrixSet = document.createElement('select');
                dropdownMatrixSet.className = 'bkgwebmap-customlayerwmtsdropdownmatrix';
                matrixSetDivContainer.appendChild(dropdownMatrixSet);
                var optionMatrixSet;
                var currentEPSG = parseFloat(map.getView().getProjection().getCode().replace(/[^\d.]/g, ''));
                for (i = 0; i < wmtsInfo.matrixSets.length; i++) {
                    optionMatrixSet = document.createElement('option');
                    optionMatrixSet.setAttribute('value', wmtsInfo.matrixSets[i]);
                    if (wmtsInfo.matrixSets[i].indexOf(currentEPSG) > -1) {
                        optionMatrixSet.selected = 'selected';
                    }
                    optionMatrixSet.innerHTML = wmtsInfo.matrixSets[i];
                    dropdownMatrixSet.appendChild(optionMatrixSet);
                }
            } else {
                var layerDivMatrixSet = document.createElement('div');
                layerDivMatrixSet.className = 'bkgwebmap-customlayerwmtsdivmatrix';
                layerDivMatrixSet.setAttribute('data-bkgwebmap-customlayerwmtsmatrixset', wmtsInfo.matrixSets[0]);
                layerDivMatrixSet.innerHTML = 'Matrix Set: ' + wmtsInfo.matrixSets[0];
                wmtsInfoContainer.appendChild(layerDivMatrixSet);
            }
            return wmtsInfoContainer;
        }

        // Create menu for wfs layer
        function createWfsInfoMenu(wfsInfo) {
            var i;
            var wfsInfoContainer = document.createElement('div');
            wfsInfoContainer.className = 'bkgwebmap-customlayerwfscontainer';

            if (wfsInfo.layers.length > 1) {
                var layerDivContainer = document.createElement('div');
                layerDivContainer.className = 'bkgwebmap-customlayerwfsdivlayers';
                wfsInfoContainer.appendChild(layerDivContainer);
                var layerTitle = document.createTextNode('Layer: ');
                layerDivContainer.appendChild(layerTitle);
                var dropdownLayers = document.createElement('select');
                dropdownLayers.className = 'bkgwebmap-customlayerwfsdropdownlayers';
                layerDivContainer.appendChild(dropdownLayers);
                var optionLayers;
                for (i = 0; i < wfsInfo.layers.length; i++) {
                    optionLayers = document.createElement('option');
                    optionLayers.setAttribute('value', wfsInfo.layers[i].name);
                    optionLayers.innerHTML = wfsInfo.layers[i].title;
                    dropdownLayers.appendChild(optionLayers);
                }
            } else {
                var layerDivTitle = document.createElement('div');
                layerDivTitle.className = 'bkgwebmap-customlayerwfsdivlayers bkgwebmap-customlayerwfsdivname';
                layerDivTitle.setAttribute('data-bkgwebmap-customlayerwfsname', wfsInfo.layers[0].name);
                layerDivTitle.innerHTML = 'Layer: ' + wfsInfo.layers[0].title;
                wfsInfoContainer.appendChild(layerDivTitle);
            }

            var inputDiv = document.createElement('div');
            inputDiv.className = 'bkgwebmap-customlayerwfsdivlayers';

            var epsgTitle = document.createTextNode('EPSG:');
            inputDiv.appendChild(epsgTitle);

            var input = document.createElement('input');
            input.className = 'bkgwebmap-customlayerwfsepsginput';
            input.value = '25832';
            inputDiv.appendChild(input);
            var epsgExample = document.createElement('span');
            epsgExample.innerHTML = 'Default: 25832';
            epsgExample.className = 'bkgwebmap-customlayerinputexample bkgwebmap-customlayerinputexamplewfs';
            inputDiv.appendChild(epsgExample);

            wfsInfoContainer.appendChild(inputDiv);

            var formatDivContainer = document.createElement('div');
            formatDivContainer.className = 'bkgwebmap-customlayerwfsdivlayers';
            wfsInfoContainer.appendChild(formatDivContainer);
            var formatTitle = document.createTextNode('Format: ');
            formatDivContainer.appendChild(formatTitle);
            var dropdownFormat = document.createElement('select');
            dropdownFormat.className = 'bkgwebmap-customlayerwfsdropdownformat';
            formatDivContainer.appendChild(dropdownFormat);
            var formats = ['GEOJSON', 'GML3', 'GML2'];
            if (wfsInfo.formats instanceof Array && wfsInfo.formats.length) {
                formats = wfsInfo.formats;
            }
            var geojsonIndex = formats.indexOf('GEOJSON');
            if (geojsonIndex !== -1) {
                formats.splice(geojsonIndex, 1);
                formats.splice(0, 0, 'GEOJSON');
            }
            var optionFormat;
            for (i = 0; i < formats.length; i++) {
                optionFormat = document.createElement('option');
                optionFormat.setAttribute('value', formats[i]);
                optionFormat.innerHTML = formats[i];
                dropdownFormat.appendChild(optionFormat);
            }

            var versionDivContainer = document.createElement('div');
            versionDivContainer.className = 'bkgwebmap-customlayerwfsdivlayers';
            wfsInfoContainer.appendChild(versionDivContainer);
            var versionTitle = document.createTextNode('Version: ');
            versionDivContainer.appendChild(versionTitle);
            var dropdownVersion = document.createElement('select');
            dropdownVersion.className = 'bkgwebmap-customlayerwfsdropdownversion';
            versionDivContainer.appendChild(dropdownVersion);
            var versions = ['1.0.0', '1.1.0', '2.0.0'];
            var optionVersion;
            for (i = 0; i < versions.length; i++) {
                optionVersion = document.createElement('option');
                optionVersion.setAttribute('value', versions[i]);
                optionVersion.innerHTML = versions[i];
                dropdownVersion.appendChild(optionVersion);
            }

            return wfsInfoContainer;
        }

        // Load WMS
        function loadWmsLayer(wmsInfoContainer, url) {
            var name = wmsInfoContainer.getElementsByClassName('bkgwebmap-customlayerwmsinfonameinput')[0].value;
            if (name === '') {
                name = 'WMS';
            }
            var layerOptions = {
                type: 'WMS',
                name: name,
                url: url,
                visibility: true,
                tiles: false,
                layers: []
            };

            var tilesInput = document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayerwmstilesinput')[0];
            if (tilesInput.checked) {
                layerOptions.tiles = true;
            }

            var layersMenu = wmsInfoContainer.getElementsByClassName('bkgwebmap-customlayerwmscontainer');
            var input;
            var singleLayer;
            for (var i = 0; i < layersMenu.length; i++) {
                singleLayer = {};
                input = layersMenu[i].getElementsByTagName('input')[0];
                if (input.checked) {
                    singleLayer.layer = input.getAttribute('data-bkgwebmap-customwmslayer');
                    singleLayer.name = input.parentNode.parentNode.nextSibling.innerHTML;

                    var styleContainer = input.parentNode.parentNode.nextSibling.nextSibling;
                    if (styleContainer && styleContainer.getElementsByTagName('select').length) {
                        singleLayer.style = styleContainer.getElementsByTagName('select')[0].value;
                    }
                    layerOptions.layers.push(singleLayer);
                }
            }
            if (layerOptions.layers.length) {
                _this.createLayer(_this, map, layerOptions, 'overlays', null, false, function (layer) {
                    addLayerToMap(layer);
                });
            }
        }

        // Load WMTS
        function loadWmtsLayer(wmtsInfoContainer, url) {
            var name = wmtsInfoContainer.getElementsByClassName('bkgwebmap-customlayerwmtsinfonameinput')[0].value;
            if (name === '') {
                name = 'WMTS';
            }
            var layerOptions = {
                type: 'WMTS',
                name: name,
                url: url,
                visibility: true,
                layer: '',
                matrixSet: ''
            };
            var layersMenu = wmtsInfoContainer.getElementsByClassName('bkgwebmap-customlayerwmtscontainer')[0];

            if (layersMenu.getElementsByClassName('bkgwebmap-customlayerwmtsdropdownlayers').length) {
                layerOptions.layer = layersMenu.getElementsByClassName('bkgwebmap-customlayerwmtsdropdownlayers')[0].value;
            } else if (layersMenu.getElementsByClassName('bkgwebmap-customlayerwmtsdivlayers').length) {
                layerOptions.layer = layersMenu.getElementsByClassName('bkgwebmap-customlayerwmtsdivlayers')[0].getAttribute('data-bkgwebmap-customlayerwmtsname');
            }

            if (layersMenu.getElementsByClassName('bkgwebmap-customlayerwmtsdropdownmatrix').length) {
                layerOptions.matrixSet = layersMenu.getElementsByClassName('bkgwebmap-customlayerwmtsdropdownmatrix')[0].value;
            } else if (layersMenu.getElementsByClassName('bkgwebmap-customlayerwmtsdivmatrix').length) {
                layerOptions.matrixSet = layersMenu.getElementsByClassName('bkgwebmap-customlayerwmtsdivmatrix')[0].getAttribute('data-bkgwebmap-customlayerwmtsmatrixset');
            }

            _this.createLayer(_this, map, layerOptions, 'overlays', null, false, function (layer) {
                addLayerToMap(layer);
            });
        }

        // Load WFS
        function loadWfsLayer(wfsInfoContainer, url) {
            var name = wfsInfoContainer.getElementsByClassName('bkgwebmap-customlayerwfsinfonameinput')[0].value;
            if (name === '') {
                name = 'WFS';
            }

            var layerOptions = {
                type: 'WFS',
                name: name,
                url: url,
                visibility: true,
                version: '',
                typename: '',
                srsName: '',
                format: '',
                edit: edit
            };

            if (style) {
                layerOptions.style = style;
            }

            if (styleName) {
                layerOptions.styleName = style;
            }

            var layersMenu = wfsInfoContainer.getElementsByClassName('bkgwebmap-customlayerwfscontainer')[0];

            if (layersMenu.getElementsByClassName('bkgwebmap-customlayerwfsdropdownlayers').length) {
                layerOptions.typename = layersMenu.getElementsByClassName('bkgwebmap-customlayerwfsdropdownlayers')[0].value;
            } else if (layersMenu.getElementsByClassName('bkgwebmap-customlayerwfsdivname').length) {
                layerOptions.typename = layersMenu.getElementsByClassName('bkgwebmap-customlayerwfsdivname')[0].getAttribute('data-bkgwebmap-customlayerwfsname');
            }

            layerOptions.srsName = 'EPSG:' + layersMenu.getElementsByClassName('bkgwebmap-customlayerwfsepsginput')[0].value;

            layerOptions.format = layersMenu.getElementsByClassName('bkgwebmap-customlayerwfsdropdownformat')[0].value;

            layerOptions.version = layersMenu.getElementsByClassName('bkgwebmap-customlayerwfsdropdownversion')[0].value;

            _this.createLayer(_this, map, layerOptions, 'overlays', _this.styles, false, function (layer) {
                addLayerToMap(layer);
            });
        }

        // Load CSV / XLS
        function loadCsvEcxelData(format, json, csvExcelInfoContainer) {
            var i;
            var layerOptions = {
                name: '',
                type: '',
                url: json,
                visibility: true,
                srsName: '',
                edit: edit
            };

            if (style) {
                layerOptions.style = style;
            }

            if (styleName) {
                layerOptions.styleName = style;
            }

            var options = '';

            if (!json.length) {
                return;
            }

            if (format === 'csv') {
                options = 'csvOptions';
                layerOptions[options] = {};
                layerOptions.type = 'CSV';
                layerOptions.srsName = BKGWebMap.LAYERS.CSV.PROJECTION;
                layerOptions.encoding = BKGWebMap.LAYERS.CSV.ENCODING;
                var encoding = csvExcelInfoContainer.getElementsByClassName('bkgwebmap-customlayercsvencinput')[0].value;
                if (encoding) {
                    layerOptions.encoding = encoding;
                }
            } else if (format === 'excel') {
                options = 'excelOptions';
                layerOptions[options] = {};
                layerOptions.type = 'XLS';
                layerOptions.srsName = BKGWebMap.LAYERS.XLS.PROJECTION;
            }

            layerOptions.name = csvExcelInfoContainer.getElementsByClassName('bkgwebmap-customlayercsvinfonameinput')[0].value;
            if (layerOptions.name === '') {
                layerOptions.name = layerOptions.type;
            }

            layerOptions[options].header = csvExcelInfoContainer.getElementsByClassName('bkgwebmap-customlayercsvheader')[0].checked;

            var latColumn = csvExcelInfoContainer.getElementsByClassName('bkgwebmap-customlayercsvlat')[0].value;
            if (latColumn && !isNaN(latColumn)) {
                layerOptions[options].LatColumn = parseInt(latColumn, 10);
            } else if (latColumn) {
                layerOptions[options].LatColumn = latColumn;
            }

            var lonColumn = csvExcelInfoContainer.getElementsByClassName('bkgwebmap-customlayercsvlon')[0].value;
            if (lonColumn && !isNaN(lonColumn)) {
                layerOptions[options].LonColumn = parseInt(lonColumn, 10);
            } else if (lonColumn) {
                layerOptions[options].LonColumn = lonColumn;
            }

            // Find columns to parse
            var index;
            layerOptions[options].columnsToParse = [];
            for (i = 0; i < json[0].length; i++) {
                index = i + 1;

                if (layerOptions[options].header) {
                    if (layerOptions[options].LatColumn === json[0][i] || layerOptions[options].LonColumn === json[0][i]) {
                        continue;
                    }
                    layerOptions[options].columnsToParse.push(json[0][i]);
                } else {
                    if (layerOptions[options].LatColumn === index || layerOptions[options].LonColumn === index) {
                        continue;
                    }
                    layerOptions[options].columnsToParse.push(index);
                }
            }

            // Fill column names with empty strings (used if no header)
            layerOptions[options].columnNames = [];
            for (i = 0; i < layerOptions[options].columnsToParse.length; i++) {
                layerOptions[options].columnNames.push('');
            }

            var epsg = csvExcelInfoContainer.getElementsByClassName('bkgwebmap-customlayercsvepsginput')[0].value;
            if (epsg) {
                layerOptions.srsName = 'EPSG:' + epsg;
            }
            _this.createLayer(_this, map, layerOptions, 'overlays', _this.styles, false, function (layer) {
                addLayerToMap(layer);
                clearForms('CSV');
            });
        }

        function openCsvExcelFile(container, filename, format, json, csvExcelInfoContainer) {
            var i;
            var optionFormat;
            var header = csvExcelInfoContainer.getElementsByClassName('bkgwebmap-customlayercsvheader')[0].checked;
            var csvInfoName = document.createElement('div');
            csvInfoName.innerHTML = 'Titel eingeben:';
            csvInfoName.className = 'bkgwebmap-customlayerexcelinfoname';
            container.appendChild(csvInfoName);

            var inputDiv = document.createElement('input');
            inputDiv.value = filename;
            inputDiv.className = 'bkgwebmap-customlayerinput bkgwebmap-customlayercsvinfonameinput';
            container.appendChild(inputDiv);

            // Latitude
            var latDiv = document.createElement('div');
            latDiv.className = 'bkgwebmap-customlayercsvexcelmenu';
            container.appendChild(latDiv);
            var latTitle = document.createElement('div');
            latTitle.className = 'bkgwebmap-customlayercsvexcelitem';
            latTitle.innerHTML = 'Lat-Spalte:';
            latDiv.appendChild(latTitle);
            var latInputDiv = document.createElement('div');
            latInputDiv.className = 'bkgwebmap-customlayercsvexcelitem bkgwebmap-customlayercsvcoordinputdiv';
            latDiv.appendChild(latInputDiv);

            var latInput = document.createElement('select');
            latInput.className = 'bkgwebmap-customlayercsvinput bkgwebmap-customlayercsvcoordinput bkgwebmap-customlayercsvlat';
            latInputDiv.appendChild(latInput);
            if (json[0] instanceof Array) {
                optionFormat = document.createElement('option');
                optionFormat.setAttribute('disabled', '');
                optionFormat.setAttribute('selected', '');
                optionFormat.innerHTML = 'Spalte auswählen';
                latInput.appendChild(optionFormat);
                for (i = 0; i < json[0].length; i++) {
                    optionFormat = document.createElement('option');
                    if (header) {
                        optionFormat.setAttribute('value', json[0][i]);
                        optionFormat.innerHTML = json[0][i];
                    } else {
                        optionFormat.setAttribute('value', i + 1);
                        optionFormat.innerHTML = i + 1;
                    }
                    latInput.appendChild(optionFormat);
                }
            }

            // Longitude
            var lonDiv = document.createElement('div');
            lonDiv.className = 'bkgwebmap-customlayercsvexcelmenu';
            container.appendChild(lonDiv);
            var lonTitle = document.createElement('span');
            lonTitle.innerHTML = 'Lon-Spalte:';
            lonDiv.appendChild(lonTitle);
            var lonInputDiv = document.createElement('div');
            lonInputDiv.className = 'bkgwebmap-customlayercsvexcelitem bkgwebmap-customlayercsvcoordinputdiv';
            lonDiv.appendChild(lonInputDiv);

            var lonInput = document.createElement('select');
            lonInput.className = 'bkgwebmap-customlayercsvinput bkgwebmap-customlayercsvcoordinput bkgwebmap-customlayercsvlon';
            lonInputDiv.appendChild(lonInput);

            if (json[0] instanceof Array) {
                optionFormat = document.createElement('option');
                optionFormat.setAttribute('disabled', '');
                optionFormat.setAttribute('selected', '');
                optionFormat.innerHTML = 'Spalte auswählen';
                lonInput.appendChild(optionFormat);
                for (i = 0; i < json[0].length; i++) {
                    optionFormat = document.createElement('option');
                    if (header) {
                        optionFormat.setAttribute('value', json[0][i]);
                        optionFormat.innerHTML = json[0][i];
                    } else {
                        optionFormat.setAttribute('value', i + 1);
                        optionFormat.innerHTML = i + 1;
                    }
                    lonInput.appendChild(optionFormat);
                }
            }

            var inputButton = document.createElement('button');
            inputButton.className = 'bkgwebmap-customlayerinputbutton';
            inputButton.innerHTML = 'Daten laden';
            container.appendChild(inputButton);

            container.style.display = 'block';

            inputButton.addEventListener('click', function () {
                loadCsvEcxelData(format, json, csvExcelInfoContainer);
            }, true);
        }

        function loadGpsLayer(container, gpx, gpsInfoContainer) {
            var layerOptions = {
                type: 'GPS',
                name: '',
                url: [gpx],
                visibility: true,
                edit: edit
            };

            if (style) {
                layerOptions.style = style;
            }

            if (styleName) {
                layerOptions.styleName = style;
            }

            layerOptions.name = gpsInfoContainer.getElementsByClassName('bkgwebmap-customlayergpsinfonameinput')[0].value;
            if (layerOptions.name === '') {
                layerOptions.name = layerOptions.type;
            }
            _this.createLayer(_this, map, layerOptions, 'overlays', _this.styles, false, function (layer) {
                addLayerToMap(layer);
                container.innerHTML = '';
                clearForms('GPS');
            });
        }

        function openGpsFile(container, filename, gpx, gpsInfoContainer) {
            var gpsInfoName = document.createElement('div');
            gpsInfoName.innerHTML = 'Titel eingeben:';
            gpsInfoName.className = 'bkgwebmap-customlayergpsinfoname';
            container.appendChild(gpsInfoName);

            var inputDiv = document.createElement('input');
            inputDiv.value = filename;
            inputDiv.className = 'bkgwebmap-customlayerinput bkgwebmap-customlayergpsinfonameinput';
            container.appendChild(inputDiv);

            var inputButton = document.createElement('button');
            inputButton.className = 'bkgwebmap-customlayerinputbutton';
            inputButton.innerHTML = 'Daten laden';
            container.appendChild(inputButton);

            container.style.display = 'block';

            inputButton.addEventListener('click', function () {
                loadGpsLayer(container, gpx, gpsInfoContainer);
            }, true);
        }

        // Create container for menu with wms layer and style names
        function addWmsInfoToDom(title, wmsInfo, url) {
            var wmsInfoContainer = document.createElement('div');
            wmsInfoContainer.className = 'bkgwebmap-customlayerwmsinfodiv';

            var wmsInfoName = document.createElement('div');
            wmsInfoName.innerHTML = 'Titel eingeben:';
            wmsInfoName.className = 'bkgwebmap-customlayerwmsinfoname';
            wmsInfoContainer.appendChild(wmsInfoName);

            var inputDiv = document.createElement('input');
            inputDiv.value = title;
            inputDiv.className = 'bkgwebmap-customlayerinput bkgwebmap-customlayerwmsinfonameinput';
            wmsInfoContainer.appendChild(inputDiv);

            var inputTilesDiv = document.createElement('div');
            inputTilesDiv.className = 'bkgwebmap-customlayerwmsinputdiv';
            wmsInfoContainer.appendChild(inputTilesDiv);

            var inputTilesLabel = document.createElement('label');

            var inputTiles = document.createElement('input');
            inputTiles.className = 'bkgwebmap-customlayerwmstilesinput';
            inputTiles.setAttribute('type', 'checkbox');
            inputTilesLabel.appendChild(inputTiles);


            var parserIconFull = new DOMParser();
            var clickIconFull = parserIconFull.parseFromString(BKGWebMap.PANEL_ICONS.LAYER_SHOWN, 'text/xml');
            inputTilesLabel.appendChild(clickIconFull.documentElement);
            inputTilesDiv.appendChild(inputTilesLabel);

            inputTiles.checked = true;

            inputTiles.onchange = function () {
                var label = this.parentNode;
                label.removeChild(label.childNodes[1]);
                var parserIconEmpty = new DOMParser();
                var clickIconEmpty = parserIconEmpty.parseFromString(BKGWebMap.PANEL_ICONS.LAYER_HIDDEN, 'text/xml');
                var parserIconFull = new DOMParser();
                var clickIconFull = parserIconFull.parseFromString(BKGWebMap.PANEL_ICONS.LAYER_SHOWN, 'text/xml');
                if (this.checked) {
                    label.appendChild(clickIconFull.documentElement);
                } else {
                    label.appendChild(clickIconEmpty.documentElement);
                }
            };

            var inputTilesTitle = document.createElement('span');
            inputTilesTitle.className = 'bkgwebmap-customlayerwmstitlediv';
            inputTilesTitle.innerHTML = 'Gekachelt einbinden';
            inputTilesDiv.appendChild(inputTilesTitle);


            wmsInfoContainer.appendChild(inputTilesDiv);

            var wmsInfoContainerText = document.createElement('div');
            wmsInfoContainerText.className = 'bkgwebmap-customlayerwmsstyle';
            wmsInfoContainerText.innerHTML = 'Layer und Stil auswählen:';
            wmsInfoContainer.appendChild(wmsInfoContainerText);
            createWmsInfoContainer(wmsInfoContainer, wmsInfo);

            var inputButton = document.createElement('button');
            inputButton.className = 'bkgwebmap-customlayerinputbutton';
            inputButton.innerHTML = 'Dienst laden';
            wmsInfoContainer.appendChild(inputButton);

            inputButton.addEventListener('click', function () {
                loadWmsLayer(wmsInfoContainer, url);
            }, true);

            return wmsInfoContainer;
        }

        function createWmsInfoContainer(wmsInfoContainer, wmsInfo) {
            for (var i = 0; i < wmsInfo.length; i++) {
                if (Object.prototype.hasOwnProperty.call(wmsInfo[i], 'layers')) {
                    var wmsSublayersWrapper = document.createElement('div');
                    var wmsLayersHeader = document.createElement('div');
                    wmsLayersHeader.className = 'bkgwebmap-customlayerwmsheader';

                    var wmsLevelTitle = document.createElement('div');
                    wmsLevelTitle.innerHTML = wmsInfo[i].title;
                    wmsLevelTitle.className = 'bkgwebmap-customlayerwmsheadertext';

                    var wmsMinusDiv = document.createElement('div');
                    wmsMinusDiv.className = 'bkgwebmap-customlayerwmsheaderplusminus';
                    wmsMinusDiv.innerHTML = '+';

                    wmsLayersHeader.appendChild(wmsLevelTitle);
                    wmsLayersHeader.appendChild(wmsMinusDiv);

                    var wmsSubLayersContainer = document.createElement('div');
                    wmsSubLayersContainer.className = 'bkgwebmap-wmssublayersgroupcontainer';

                    wmsSublayersWrapper.appendChild(wmsLayersHeader);
                    wmsSublayersWrapper.appendChild(wmsSubLayersContainer);
                    wmsSubLayersContainer.style.display = 'none';
                    wmsLayersHeader.addEventListener('click', function () {
                        var parent = this.parentNode;
                        var container = parent.getElementsByClassName('bkgwebmap-wmssublayersgroupcontainer')[0];
                        var minusPlus = parent.getElementsByClassName('bkgwebmap-customlayerwmsheaderplusminus')[0];
                        container.style.display = container.style.display === 'none' ? 'block' : 'none';
                        minusPlus.innerHTML = minusPlus.innerHTML === '+' ? '-' : '+';
                    });
                    wmsInfoContainer.appendChild(wmsSublayersWrapper);
                    createWmsInfoContainer(wmsSubLayersContainer, wmsInfo[i].layers);
                } else {
                    wmsInfoContainer.appendChild(createWmsInfoMenu(wmsInfo[i]));
                }
            }
        }

        // Create container for WMTS
        function addWmtsInfoToDom(title, wmtsInfo, url) {
            var wmtsInfoContainer = document.createElement('div');
            wmtsInfoContainer.className = 'bkgwebmap-customlayerwmtsinfodiv';

            var wmtsInfoName = document.createElement('div');
            wmtsInfoName.innerHTML = 'Titel eingeben:';
            wmtsInfoName.className = 'bkgwebmap-customlayerwmtsinfoname';
            wmtsInfoContainer.appendChild(wmtsInfoName);

            var inputDiv = document.createElement('input');
            inputDiv.value = title;
            inputDiv.className = 'bkgwebmap-customlayerinput bkgwebmap-customlayerwmtsinfonameinput';
            wmtsInfoContainer.appendChild(inputDiv);

            wmtsInfoContainer.appendChild(createWmtsInfoMenu(wmtsInfo));

            var inputButton = document.createElement('button');
            inputButton.className = 'bkgwebmap-customlayerinputbutton';
            inputButton.innerHTML = 'Dienst laden';
            wmtsInfoContainer.appendChild(inputButton);

            inputButton.addEventListener('click', function () {
                loadWmtsLayer(wmtsInfoContainer, url);
            }, true);

            return wmtsInfoContainer;
        }

        function addWfsInfoToDom(title, wfsInfo, url) {
            var wfsInfoContainer = document.createElement('div');
            wfsInfoContainer.className = 'bkgwebmap-customlayerwfsinfodiv';

            var wfsInfoName = document.createElement('div');
            wfsInfoName.innerHTML = 'Titel eingeben:';
            wfsInfoName.className = 'bkgwebmap-customlayerfinfoname';
            wfsInfoContainer.appendChild(wfsInfoName);

            var inputDiv = document.createElement('input');
            inputDiv.value = title;
            inputDiv.className = 'bkgwebmap-customlayerinput bkgwebmap-customlayerwfsinfonameinput';
            wfsInfoContainer.appendChild(inputDiv);

            wfsInfoContainer.appendChild(createWfsInfoMenu(wfsInfo));

            var inputButton = document.createElement('button');
            inputButton.className = 'bkgwebmap-customlayerinputbutton';
            inputButton.innerHTML = 'Dienst laden';
            wfsInfoContainer.appendChild(inputButton);

            inputButton.addEventListener('click', function () {
                loadWfsLayer(wfsInfoContainer, url);
            }, true);

            return wfsInfoContainer;
        }

        function addCsvExcelMenu(format) {
            var fileButtonText = 'Excel-Datei auswählen';
            var acceptFiles = '.xlsx,.xls,.ods';

            var csvExcelInfoContainer = document.createElement('div');
            csvExcelInfoContainer.className = 'bkgwebmap-customlayercsvexcelinfodiv';

            // Header
            var headerDiv = document.createElement('div');
            headerDiv.className = 'bkgwebmap-customlayercsvexcelmenu';
            csvExcelInfoContainer.appendChild(headerDiv);
            var headerTitle = document.createElement('div');
            headerTitle.className = 'bkgwebmap-customlayercsvexcelitem';
            headerTitle.innerHTML = 'Erste Zeile als Header:';
            headerDiv.appendChild(headerTitle);
            var headerInputDiv = document.createElement('div');
            headerInputDiv.className = 'bkgwebmap-customlayercsvexcelitem';
            headerDiv.appendChild(headerInputDiv);
            var headerInput = document.createElement('input');
            headerInput.className = 'bkgwebmap-customlayercsvheader';
            headerInput.setAttribute('type', 'checkbox');
            headerInput.setAttribute('name', 'header');
            headerInput.setAttribute('checked', '');
            headerInputDiv.appendChild(headerInput);

            // EPSG
            var epsgDiv = document.createElement('div');
            epsgDiv.className = 'bkgwebmap-customlayercsvexcelmenu';
            csvExcelInfoContainer.appendChild(epsgDiv);
            var epsgTitle = document.createElement('span');
            epsgTitle.innerHTML = 'EPSG:';
            epsgDiv.appendChild(epsgTitle);
            var epsgInputDiv = document.createElement('div');
            epsgInputDiv.className = 'bkgwebmap-customlayercsvexcelitem bkgwebmap-customlayercsvepsginputdiv';
            epsgDiv.appendChild(epsgInputDiv);
            var epsgInput = document.createElement('input');
            epsgInput.value = '4326';
            epsgInput.setAttribute('type', 'text');
            epsgInput.className = 'bkgwebmap-customlayercsvinput bkgwebmap-customlayercsvepsginput';
            epsgInputDiv.appendChild(epsgInput);

            if (format === 'csv') {
                fileButtonText = 'CSV-Datei auswählen';
                acceptFiles = '.csv';

                // Delimiter
                var delimiterDiv = document.createElement('div');
                delimiterDiv.className = 'bkgwebmap-customlayercsvexcelmenu';
                csvExcelInfoContainer.appendChild(delimiterDiv);
                var delimiterTitle = document.createElement('span');
                delimiterTitle.innerHTML = 'Trennzeichen:';
                delimiterDiv.appendChild(delimiterTitle);
                var delimiterInputDiv = document.createElement('div');
                delimiterInputDiv.className = 'bkgwebmap-customlayercsvexcelitem bkgwebmap-customlayercsvdelinputdiv';
                delimiterDiv.appendChild(delimiterInputDiv);
                var delimiterInput = document.createElement('input');
                delimiterInput.value = ';';
                delimiterInput.setAttribute('type', 'text');
                delimiterInput.className = 'bkgwebmap-customlayercsvinput bkgwebmap-customlayercsvdelinput';
                delimiterInputDiv.appendChild(delimiterInput);

                // Encoding
                var encodingDiv = document.createElement('div');
                encodingDiv.className = 'bkgwebmap-customlayercsvexcelmenu';
                csvExcelInfoContainer.appendChild(encodingDiv);
                var encodingTitle = document.createElement('span');
                encodingTitle.innerHTML = 'Kodierung:';
                encodingDiv.appendChild(encodingTitle);
                var encodingInputDiv = document.createElement('div');
                encodingInputDiv.className = 'bkgwebmap-customlayercsvexcelitem bkgwebmap-customlayercsvencinputdiv';
                encodingDiv.appendChild(encodingInputDiv);
                var encodingInput = document.createElement('input');
                encodingInput.setAttribute('type', 'text');
                encodingInput.value = 'UTF-8';
                encodingInput.className = 'bkgwebmap-customlayercsvinput bkgwebmap-customlayercsvencinput';
                encodingDiv.appendChild(encodingInput);
            }

            // Select file
            var selectFileDiv = document.createElement('div');
            selectFileDiv.className = 'bkgwebmap-customlayercsvexcelfilediv';
            csvExcelInfoContainer.appendChild(selectFileDiv);

            var fileButtonLabel = document.createElement('label');
            fileButtonLabel.className = 'bkgwebmap-customlayercsvexcelfilelabel';
            fileButtonLabel.innerHTML = fileButtonText;
            csvExcelInfoContainer.appendChild(fileButtonLabel);


            var fileButton = document.createElement('input');
            fileButton.className = 'bkgwebmap-customlayerinputbutton bkgwebmap-customlayercsvexcelfilebutton';
            fileButton.setAttribute('type', 'file');
            fileButton.setAttribute('accept', acceptFiles);

            fileButtonLabel.appendChild(fileButton);

            var container = document.createElement('div');
            container.className = 'bkgwebmap-customlayeremptycontainer';
            container.style.display = 'none';
            csvExcelInfoContainer.appendChild(container);

            // CSV
            if (format === 'csv') {
                fileButton.onchange = function (evt) {
                    var input = evt.target;

                    var filename = '';
                    if (input.files[0] && input.files[0].name) {
                        filename = input.files[0].name;
                    }
                    filename = filename.replace('.csv', '');
                    filename = filename.replace('.CSV', '');

                    var reader = new FileReader();
                    reader.readAsText(input.files[0]);
                    reader.onload = function (event) {
                        var delimiter = BKGWebMap.LAYERS.CSV.DELIMITER;
                        var customDelimiter = csvExcelInfoContainer.getElementsByClassName('bkgwebmap-customlayercsvdelinput')[0].value;
                        if (customDelimiter) {
                            delimiter = customDelimiter;
                        }
                        var result = 'sep=' + delimiter + '\n' + event.target.result;
                        var workbook = XLSX.read(result, { type: 'binary' });
                        var sheet = workbook.Sheets[workbook.SheetNames[0]];
                        var json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                        clearForms('CSV');
                        openCsvExcelFile(container, filename, format, json, csvExcelInfoContainer);
                    };
                    fileButton.value = '';
                };
            } else if (format === 'excel') {
                // EXCEL
                fileButton.onchange = function (evt) {
                    var file = evt.target.files[0];

                    var filename = '';
                    if (file && file.name) {
                        filename = file.name;
                    }
                    filename = filename.replace('.xlsx', '');
                    filename = filename.replace('.XLSX', '');
                    filename = filename.replace('.xls', '');
                    filename = filename.replace('.XLS', '');

                    var reader = new FileReader();

                    reader.onload = function (event) {
                        var binary = '';
                        var bytes = new Uint8Array(event.target.result);
                        for (var i = 0; i < bytes.byteLength; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        var workbook = XLSX.read(binary, { type: 'binary' });
                        var sheet = workbook.Sheets[workbook.SheetNames[0]];
                        var json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                        clearForms('XLS');
                        openCsvExcelFile(container, filename, format, json, csvExcelInfoContainer);
                    };
                    reader.readAsArrayBuffer(file);
                    fileButton.value = '';
                };
            }

            return csvExcelInfoContainer;
        }

        // Create a custom layer
        this.createLayer = function (_this, map, config, layerGroup, styles, bkg, createLayerCallback) {
            config.isBaseLayer = false;
            BKGWebMap.Layer.FACTORIES[config.type](_this, map, config, styles, bkg, function (layer) {
                return createLayerCallback(layer);
            });
        };

        // Add layer in layer switcher control
        function addLayerToMap(layer) {
            if (layer === undefined) {
                return;
            }
            layer.setProperties({ customLayer: true });
            map.addLayer(layer);
            map.getControls().forEach(function (control) {
                if (BKGWebMap.Control.LayerSwitcher && control instanceof BKGWebMap.Control.LayerSwitcher) {
                    control.addInLayerSwitcher(layer, false, false, false, _this.changeVisibility);
                    control.resolutionLimits(layer);
                    control.ajaxLoader(layer);
                }
                if (BKGWebMap.Control.Legend && control instanceof BKGWebMap.Control.Legend) {
                    control.addLayerToLegend(layer);
                }
                if (BKGWebMap.Control.Copyright && control instanceof BKGWebMap.Control.Copyright) {
                    control.addLayerInCopyright(layer);
                }
            });

            return true;
        }

        // Add BKG Layer
        function createCustomBKG() {
            var layerOptions = {
                type: 'BKG',
                visibility: true
            };

            var typeDiv = document.createElement('div');
            typeDiv.setAttribute('data-bkgwebmap-customlayertype', 'BKG');
            typeDiv.className = 'bkgwebmap-customlayertypediv bkgwebmap-customlayerdivbkg';

            var bkgServiceTypeTitle = document.createElement('div');
            bkgServiceTypeTitle.innerHTML = 'BKG-Dienst auswählen:';
            typeDiv.appendChild(bkgServiceTypeTitle);

            var bkgServiceDropdownDiv = document.createElement('div');
            bkgServiceDropdownDiv.className = 'bkgwebmap-customlayertypedropdownbkg';
            typeDiv.appendChild(bkgServiceDropdownDiv);

            var bkgServiceDropdownInput = document.createElement('input');
            bkgServiceDropdownInput.setAttribute('placeholder', 'Suchen...');
            bkgServiceDropdownInput.className = 'bkgwebmap-customlayertypeinputbkg';
            bkgServiceDropdownDiv.appendChild(bkgServiceDropdownInput);

            var bkgServiceDropdownList = document.createElement('ul');
            bkgServiceDropdownList.className = 'bkgwebmap-customlayertypelistbkg';
            bkgServiceDropdownDiv.appendChild(bkgServiceDropdownList);

            bkgServiceDropdownInput.onkeyup = function (event) {
                var i;
                if (event.key && event.keyCode === 40) {
                    event.preventDefault();
                    var list = document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayertypelistbkg')[0];
                    var allItems = list.childNodes;
                    if (allItems && allItems.length) {
                        for (i = 0; i < allItems.length; i++) {
                            allItems[i].classList.remove('bkgwebmap-customlayertypeliactivebkg');
                        }
                        i = 0;
                        var focus;
                        do {
                            if (allItems[i].style.display !== 'none') {
                                allItems[i].childNodes[0].focus();
                                allItems[i].classList.add('bkgwebmap-customlayertypeliactivebkg');
                                focus = true;
                            }
                            i++;
                        } while (!focus && i < allItems.length);
                    }
                }
                var filter;
                var li;
                var a;
                filter = bkgServiceDropdownInput.value.toUpperCase();
                li = bkgServiceDropdownList.getElementsByTagName('li');
                for (i = 0; i < li.length; i++) {
                    a = li[i].getElementsByTagName('a')[0];
                    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                        li[i].style.display = '';
                    } else {
                        li[i].style.display = 'none';
                    }
                }
            };

            function pressArrows(event) {
                if (event.key && event.keyCode === 40) {
                    event.preventDefault();
                    var nextSibling = event.target.parentNode.nextSibling;
                    hightlightBkgListItem(nextSibling, true);
                } else if (event.key && event.keyCode === 38) {
                    var previousSibling = event.target.parentNode.previousSibling;
                    hightlightBkgListItem(previousSibling, false);
                }
            }

            getBkgServiceIds(function (ids) {
                if (ids.length) {
                    var listItem;
                    var a;
                    for (var i = 0; i < ids.length; i++) {
                        listItem = document.createElement('li');
                        listItem.className = 'bkgwebmap-customlayertypelibkg';
                        a = document.createElement('a');
                        a.setAttribute('href', 'javascript:void(0)');
                        a.innerHTML = ids[i];
                        listItem.appendChild(a);
                        listItem.setAttribute('data-bkgdienstid', ids[i]);
                        bkgServiceDropdownList.appendChild(listItem);
                        listItem.onclick = function () {
                            bkgServiceDropdownInput.innerHTML = this.firstChild.innerHTML;
                            var selectedId = this.getAttribute('data-bkgdienstid');
                            layerOptions.ref = selectedId;

                            _this.createLayer(_this, map, layerOptions, 'overlays', null, false, function (layer) {
                                addLayerToMap(layer);
                            });
                        };
                        a.onfocus = function () {
                            this.parentNode.addEventListener('keydown', pressArrows);
                        };
                        listItem.addEventListener('mouseenter', function () {
                            this.firstChild.focus();
                            var allItems = document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayertypelibkg');
                            for (var i = 0; i < allItems.length; i++) {
                                allItems[i].classList.remove('bkgwebmap-customlayertypeliactivebkg');
                            }
                            this.classList.add('bkgwebmap-customlayertypeliactivebkg');
                        });
                    }
                }
            });
            return typeDiv;
        }

        function hightlightBkgListItem(nextSibling, arrowdown) {
            var newSibling;
            var allItems = document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayertypelibkg');
            if (arrowdown && nextSibling && nextSibling.style.display === 'none') {
                newSibling = nextSibling.nextSibling;
                hightlightBkgListItem(newSibling, true);
            } else if (!arrowdown && nextSibling && nextSibling.style.display === 'none') {
                newSibling = nextSibling.previousSibling;
                hightlightBkgListItem(newSibling, false);
            } else if (nextSibling && nextSibling.style.display !== 'none') {
                for (var i = 0; i < allItems.length; i++) {
                    allItems[i].classList.remove('bkgwebmap-customlayertypeliactivebkg');
                }
                nextSibling.classList.add('bkgwebmap-customlayertypeliactivebkg');
                nextSibling.childNodes[0].focus();
            }
        }

        // WMS
        function createCustomWMS() {
            var typeDiv = document.createElement('div');
            typeDiv.setAttribute('data-bkgwebmap-customlayertype', 'WMS');
            typeDiv.className = 'bkgwebmap-customlayertypediv bkgwebmap-customlayerdivwms';

            var inputDivTitle = document.createElement('div');
            inputDivTitle.innerHTML = 'WMS-URL eingeben:';
            typeDiv.appendChild(inputDivTitle);

            var inputDiv = document.createElement('input');
            inputDiv.className = 'bkgwebmap-customlayerwmsinput';
            typeDiv.appendChild(inputDiv);

            var inputExampleDiv = document.createElement('div');
            inputExampleDiv.className = 'bkgwebmap-customlayerinputexample';
            inputExampleDiv.innerHTML = 'z.B. https://sg.geodatenzentrum.de/wms_webatlasde';
            typeDiv.appendChild(inputExampleDiv);

            var inputButton = document.createElement('button');
            inputButton.className = 'bkgwebmap-customlayerinputbutton';
            inputButton.innerHTML = 'WMS-URL aufrufen';
            typeDiv.appendChild(inputButton);

            inputButton.addEventListener('click', function () {
                var button = this;
                button.innerHTML = '...parsing...';
                if (typeDiv.lastChild.classList.contains('bkgwebmap-customlayerwmsinfodiv')) {
                    typeDiv.removeChild(typeDiv.lastChild);
                }
                getWmsInfo(function (title, wmsInfo, url) {
                    if (wmsInfo) {
                        typeDiv.appendChild(addWmsInfoToDom(title, wmsInfo, url));
                        button.innerHTML = 'WMS-URL aufrufen';
                        if (document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayerdivwms')[0].getElementsByClassName('bkgwebmap-messagediv').length) {
                            document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayerdivwms')[0].getElementsByClassName('bkgwebmap-messagediv')[0].remove();
                        }
                    } else {
                        showMessage('bkgwebmap-customlayerdivwms', 'WMS-URL aufrufen');
                    }
                });
            }, true);

            return typeDiv;
        }

        // WMTS
        function createCustomWMTS() {
            var typeDiv = document.createElement('div');
            typeDiv.setAttribute('data-bkgwebmap-customlayertype', 'WMTS');
            typeDiv.className = 'bkgwebmap-customlayertypediv bkgwebmap-customlayerdivwmts';

            var inputDivTitle = document.createElement('div');
            inputDivTitle.innerHTML = 'WMTS GetCapabilities URL:';
            typeDiv.appendChild(inputDivTitle);

            var inputDiv = document.createElement('input');
            inputDiv.className = 'bkgwebmap-customlayerwmtsinput';
            typeDiv.appendChild(inputDiv);

            var inputExampleDiv = document.createElement('div');
            inputExampleDiv.className = 'bkgwebmap-customlayerinputexample';
            inputExampleDiv.innerHTML = 'z.B. https://sg.geodatenzentrum.de/wmts_webatlasde/1.0.0/WMTSCapabilities.xml';
            typeDiv.appendChild(inputExampleDiv);

            var inputButton = document.createElement('button');
            inputButton.className = 'bkgwebmap-customlayerinputbutton';
            inputButton.innerHTML = 'WMTS-URL aufrufen';
            typeDiv.appendChild(inputButton);

            inputButton.addEventListener('click', function () {
                var button = this;
                button.innerHTML = '...parsing...';
                if (typeDiv.lastChild.classList.contains('bkgwebmap-customlayerwmtsinfodiv')) {
                    typeDiv.removeChild(typeDiv.lastChild);
                }
                getWmtsInfo(function (title, wmtsInfo, url) {
                    if (wmtsInfo) {
                        typeDiv.appendChild(addWmtsInfoToDom(title, wmtsInfo, url));
                        button.innerHTML = 'WMTS-URL aufrufen';
                        if (document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayerdivwmts')[0].getElementsByClassName('bkgwebmap-messagediv').length) {
                            document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayerdivwmts')[0].getElementsByClassName('bkgwebmap-messagediv')[0].remove();
                        }
                    } else {
                        showMessage('bkgwebmap-customlayerdivwmts', 'WMTS-URL aufrufen');
                    }
                });
            }, true);

            return typeDiv;
        }

        function createCustomWFS() {
            var typeDiv = document.createElement('div');
            typeDiv.setAttribute('data-bkgwebmap-customlayertype', 'WFS');
            typeDiv.className = 'bkgwebmap-customlayertypediv bkgwebmap-customlayerdivwfs';

            var inputDivTitle = document.createElement('div');
            inputDivTitle.innerHTML = 'WFS-URL eingeben:';
            typeDiv.appendChild(inputDivTitle);

            var inputDiv = document.createElement('input');
            inputDiv.className = 'bkgwebmap-customlayerwfsinput';
            typeDiv.appendChild(inputDiv);

            var inputExampleDiv = document.createElement('div');
            inputExampleDiv.className = 'bkgwebmap-customlayerinputexample';
            inputExampleDiv.innerHTML = 'z.B. https://sg.geodatenzentrum.de/wfs_vg1000';
            typeDiv.appendChild(inputExampleDiv);

            var inputButton = document.createElement('button');
            inputButton.className = 'bkgwebmap-customlayerinputbutton';
            inputButton.innerHTML = 'WFS-URL aufrufen';
            typeDiv.appendChild(inputButton);

            inputButton.addEventListener('click', function () {
                var button = this;
                button.innerHTML = '...parsing...';
                if (typeDiv.lastChild.classList.contains('bkgwebmap-customlayerwfsinfodiv')) {
                    typeDiv.removeChild(typeDiv.lastChild);
                }
                getWfsInfo(function (title, wfsInfo, url) {
                    if (wfsInfo) {
                        button.innerHTML = 'WFS-URL aufrufen';
                        if (document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayerdivwfs')[0].getElementsByClassName('bkgwebmap-messagediv').length) {
                            document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayerdivwfs')[0].getElementsByClassName('bkgwebmap-messagediv')[0].remove();
                        }
                        typeDiv.appendChild(addWfsInfoToDom(title, wfsInfo, url));
                    } else {
                        showMessage('bkgwebmap-customlayerdivwfs', 'WFS-URL aufrufen');
                    }
                });
            }, true);

            return typeDiv;
        }

        // CSV
        function createCustomCSV() {
            var typeDiv = document.createElement('div');
            typeDiv.setAttribute('data-bkgwebmap-customlayertype', 'CSV');
            typeDiv.className = 'bkgwebmap-customlayertypediv bkgwebmap-customlayerdivcsv';

            typeDiv.appendChild(addCsvExcelMenu('csv'));

            return typeDiv;
        }

        // XLS
        function createCustomXLS() {
            var typeDiv = document.createElement('div');
            typeDiv.setAttribute('data-bkgwebmap-customlayertype', 'XLS');
            typeDiv.className = 'bkgwebmap-customlayertypediv bkgwebmap-customlayerdivxls';

            typeDiv.appendChild(addCsvExcelMenu('excel'));

            return typeDiv;
        }

        // GPS
        function createCustomGPS() {
            var typeDiv = document.createElement('div');
            typeDiv.setAttribute('data-bkgwebmap-customlayertype', 'GPS');
            typeDiv.className = 'bkgwebmap-customlayertypediv bkgwebmap-customlayerdivgps';

            var gpsInfoContainer = document.createElement('div');
            gpsInfoContainer.className = 'bkgwebmap-customlayergpsinfodiv';
            typeDiv.appendChild(gpsInfoContainer);

            // Select file
            var selectFileDiv = document.createElement('div');
            selectFileDiv.className = 'bkgwebmap-customlayergpsfilediv';
            gpsInfoContainer.appendChild(selectFileDiv);

            var fileButtonLabel = document.createElement('label');
            fileButtonLabel.className = 'bkgwebmap-customlayergpsfilelabel';
            fileButtonLabel.innerHTML = 'GPX-Datei auswählen';
            gpsInfoContainer.appendChild(fileButtonLabel);

            var fileButton = document.createElement('input');
            fileButton.className = 'bkgwebmap-customlayerinputbutton bkgwebmap-customlayergpsfilebutton';
            fileButton.setAttribute('type', 'file');
            fileButton.setAttribute('accept', '.gpx');

            fileButtonLabel.appendChild(fileButton);

            var container = document.createElement('div');
            container.className = 'bkgwebmap-customlayeremptycontainer';
            container.style.display = 'none';
            gpsInfoContainer.appendChild(container);

            fileButton.onchange = function (evt) {
                var input = evt.target;
                var filename = '';
                if (input.files[0] && input.files[0].name) {
                    filename = input.files[0].name;
                }
                filename = filename.replace('.gpx', '');
                filename = filename.replace('.GPX', '');
                var reader = new FileReader();
                reader.readAsText(input.files[0]);
                reader.onload = function (event) {
                    var gpx = event.target.result;
                    clearForms('GPS');
                    openGpsFile(container, filename, gpx, gpsInfoContainer);
                };
                fileButton.value = '';
            };

            return typeDiv;
        }

        // Clear forms when changing data type
        function clearForms(type) {
            var i;
            var containerToEmpty = document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayeremptycontainer');
            if (containerToEmpty.length) {
                for (i = 0; i < containerToEmpty.length; i++) {
                    containerToEmpty[i].innerHTML = '';
                }
            }
            switch (type) {
            case 'WMS':
                if (document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayerwmsinput').length) {
                    document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayerwmsinput')[0].value = '';
                }
                if (document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayerwmsinfodiv').length) {
                    var wmsMenu = document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayerwmsinfodiv')[0];
                    wmsMenu.parentNode.removeChild(wmsMenu);
                }
                break;
            case 'WMTS':
                if (document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayerwmtsinput').length) {
                    document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayerwmtsinput')[0].value = '';
                }
                if (document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayerwmtsinfodiv').length) {
                    var wmtsMenu = document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayerwmtsinfodiv')[0];
                    wmtsMenu.parentNode.removeChild(wmtsMenu);
                }
                break;
            case 'CSV':
            case 'XLS':
                var titleInput = document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayercsvinfonameinput');
                for (i = 0; i < titleInput.length; i++) {
                    titleInput[i].value = '';
                }
                break;
            case 'GPS':
                if (document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayergpsinfonameinput').length) {
                    document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayergpsinfonameinput')[0].value = '';
                }
                break;
                // no default
            }
        }

        // Create content for custom layer dropdown menu
        function createContent() {
            var i;
            var customLayersContent = document.createElement('div');
            customLayersContent.className = 'bkgwebmap-customlayerscontent';

            var selectType = document.createElement('select');
            selectType.className = 'bkgwebmap-customlayertypeselect';

            var selectItem = document.createElement('option');
            selectItem.setAttribute('disabled', '');
            selectItem.setAttribute('selected', '');
            selectItem.innerHTML = 'Geodatentyp auswählen';
            selectType.appendChild(selectItem);
            customLayersContent.appendChild(selectType);

            for (i = 0; i < dataTypes.length; i++) {
                selectType.appendChild(fillTypeDropdown(dataTypes[i]));
                var dataTypeContent;
                switch (dataTypes[i]) {
                case 'BKG':
                    dataTypeContent = createCustomBKG();
                    break;
                case 'WMS':
                    dataTypeContent = createCustomWMS();
                    break;
                case 'WMTS':
                    dataTypeContent = createCustomWMTS();
                    break;
                case 'WFS':
                    dataTypeContent = createCustomWFS();
                    break;
                case 'CSV':
                    dataTypeContent = createCustomCSV();
                    break;
                case 'XLS':
                    dataTypeContent = createCustomXLS();
                    break;
                case 'GPS':
                    dataTypeContent = createCustomGPS();
                    break;
                    // no default
                }
                customLayersContent.appendChild(dataTypeContent);
            }

            selectType.onchange = function () {
                var selectedType = this.value;
                var dataTypeDivs = document.getElementById(mapId).getElementsByClassName('bkgwebmap-customlayertypediv');
                var type;
                for (i = 0; i < dataTypeDivs.length; i++) {
                    dataTypeDivs[i].classList.remove('bkgwebmap-customlayertypeactive');
                    type = dataTypeDivs[i].getAttribute('data-bkgwebmap-customlayertype');
                    if (selectedType === type) {
                        clearForms(selectedType);
                        dataTypeDivs[i].classList.add('bkgwebmap-customlayertypeactive');
                    }
                }
                if (document.getElementById(mapId).getElementsByClassName('bkgwebmap-messagediv').length) {
                    document.getElementById(mapId).getElementsByClassName('bkgwebmap-messagediv')[0].remove();
                }
            };
            return customLayersContent;
        }

        function openCloseHeader() {
            if (this.nextSibling.classList.contains('bkgwebmap-customlayercontentactive')) {
                this.nextSibling.classList.remove('bkgwebmap-customlayercontentactive');
                if (this.childNodes[2]) {
                    this.childNodes[2].innerHTML = '+';
                }
            } else {
                this.nextSibling.classList.add('bkgwebmap-customlayercontentactive');
                if (this.childNodes[2]) {
                    this.childNodes[2].innerHTML = '\u2212';
                }
            }
        }

        /**
         * Initialize custom layers control if layers switcher is available
         * @param {object} - layerSwitcher
         */
        this.initializeControl = function (layerSwitcher, styles) {
            if (layerSwitcher === undefined) {
                // If no layerswitcher exists, do not create this control
                window.console.log(BKGWebMap.ERROR.noLayerSwitcherControl);
            } else {
                layerSwitcher.addCustomLayersContainer(customLayersContainer);
            }
            _this.styles = styles;
        };

        // Finalize control
        ol.control.Control.call(this, {
            element: customLayers,
            target: customLayersContainer
        });
    };
};
