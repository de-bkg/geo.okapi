/**
 * @namespace BKGWebMap.Util
 * @type {object}
 */
BKGWebMap.Util = BKGWebMap.Util || {};

/**
 * Iterates over arrays
 * @param {array} elements - Array that this method is being applied to
 * @param {function} method - Function to be executed for each element
 */
BKGWebMap.Util.each = function (elements, method) {
    if (!elements || !elements.length) {
        return;
    }

    for (var i = 0; i < elements.length; i++) {
        method(i, elements[i]);
    }
};

/**
 * Iterates reverse over arrays
 * @param {array} elements - Array that this method is being applied to
 * @param {function} method - Function to be executed for each element
 */
BKGWebMap.Util.reverseEach = function (elements, method) {
    if (!elements || !elements.length) {
        return;
    }

    for (var i = elements.length - 1; i >= 0; i--) {
        method(i, elements[i]);
    }
};

/**
 * Maps elements of array. It creates a new array with the results of calling a method for every array element. You can pass further static arguments to the method.
 * @param {function} method - Function to be run for each element in the array
 * @param {array} elements - Array that this method is being applied to
 * @return {array}
 */
BKGWebMap.Util.map = function (method, elements) {
    if (!elements || !elements.length) {
        return [];
    }

    // pass further optional arguments
    var staticArgs = (arguments.length === 2) ? [] : Array.prototype.slice.call(arguments, 2, arguments.length);

    var result = [];
    for (var i = 0; i < elements.length; i++) {
        var args = [elements[i]];
        args = args.concat(staticArgs);
        result.push(method.apply(this, args));
    }
    return result;
};

/**
 * Creates a deep copy of an object
 * @param {object} obj - Object to copy
 * @returns {object}
 */
BKGWebMap.Util.deepCopy = function (obj) {
    var newObj = obj;
    if (obj && typeof obj === 'object') {
        newObj = Object.prototype.toString.call(obj) === '[object Array]' ? [] : {};
        for (var i in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, i)) {
                newObj[i] = BKGWebMap.Util.deepCopy(obj[i]);
            }
        }
    }
    return newObj;
};

/**
 * Extends an object using properties of a second object. Common properties will be overwritten.
 * @param {object} obj1 - Object to extend.
 * @param {object} obj2 - Object to get new properties.
 * @returns {object}
 */
BKGWebMap.Util.extend = function (obj1, obj2) {
    for (var p in obj2) {
        if (Object.prototype.hasOwnProperty.call(obj2, p)) {
            try {
                // Property in destination object set: update its value.
                if (obj2[p].constructor === Object && (Object.keys(obj2[p]).length > 0)) {
                    obj1[p] = BKGWebMap.Util.extend(obj1[p], obj2[p]);
                } else {
                    obj1[p] = obj2[p];
                }
            } catch (e) {
                // Property in destination object not set: create it and set its value.
                obj1[p] = obj2[p];
            }
        }
    }
    return obj1;
};

/**
 * Checks if an object has a nested property
 * @param {object} obj - The object to test
 * @param {string} propertyPath - Path of property. Syntax: 'prop1.prop2.prop3...'
 * @returns {boolean}
 */
BKGWebMap.Util.hasNestedProperty = function (obj, propertyPath) {
    if (!propertyPath) { return false; }

    var properties = propertyPath.split('.');

    for (var i = 0; i < properties.length; i++) {
        var prop = properties[i];

        if (!obj || !Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
        obj = obj[prop];
    }

    return true;
};

/**
 * Get a value from an object using a string path in dot notation
 * @param {object} obj - Object to search.
 * @param {string} propertyPath - String path in dot notation.
 * @returns {object}
 */
BKGWebMap.Util.getObjValueFromStringPath = function (obj, propertyPath) {
    function index(_obj, i) {
        return _obj[i];
    }
    return propertyPath.split('.').reduce(index, obj);
};

/**
 * Generate object with css properties from a string
 * @param {string} cssString - String to parse
 * @returns {object}
 */
BKGWebMap.Util.cssParser = function (cssString) {
    var obj = {};
    var propArray = cssString.split(';').filter(function (prop) {
        return (!!prop);
    });
    for (var prop in propArray) {
        propArray[prop] = propArray[prop].split(':');
        obj[propArray[prop][0]] = propArray[prop][1];
    }
    return obj;
};

/**
 * Generate a unique BKG WebMap ID that can be used in DOM elements
 * @returns {string}
 */
BKGWebMap.Util.uniqueId = function () {
    return 'bkgwebmap-' + Math.random().toString(36).substr(2, 16);
};

/**
 * Converts XML to JSON format
 * @param {object} xml - XML as JavaScript object
 * @returns {object}
 */
BKGWebMap.Util.xmlToJson = function (xml) {
    var obj = {};

    if (xml.nodeType === 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj['@attributes'] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType === 3) { // text
        obj = xml.nodeValue;
    }

    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) === 'undefined') {
                obj[nodeName] = BKGWebMap.Util.xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) === 'undefined') {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(BKGWebMap.Util.xmlToJson(item));
            }
        }
    }
    return obj;
};

/**
 * Generate a Session-Token for secure BKG services
 * @param {string} appID
 * @param {string} appDomain
 * @param {function} callback - Callback function
 * @returns {function}
 */
BKGWebMap.Util.getSessionToken = function (appID, appDomain, callback) {
    var baseURL = BKGWebMap.BASE_URL.replace('http://', 'https://');
    var url = baseURL + 'gdz_getSession?bkg_appid=' + appID + '&domain=' + appDomain;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);

    xhr.onload = function () {
        if (xhr.status === 200) {
            return callback(xhr.responseText);
        }
    };

    xhr.onerror = function () {
        return callback('');
    };

    xhr.send();
};

/**
 * Determine if we need to create a panel
 * @param {object} controls - Object with controls configuration
 * @returns {boolean}
 */
BKGWebMap.Util.shouldCreatePanel = function (controls) {
    var createPanel = false;
    BKGWebMap.Util.onlyPermaLink = false;
    if (!controls) {
        return createPanel;
    }
    if (typeof controls.tools !== 'object' || controls.tools.constructor !== Object) {
        return createPanel;
    }
    for (var i = 0; i < BKGWebMap.CONTROLS_IN_PANEL.length; i++) {
        if (controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]]) {
            if (BKGWebMap.CONTROLS_IN_PANEL[i] === 'share') {
                if (controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].active && !controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].div && ((controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].jsonExport && controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].jsonExport.active) || (controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].print && controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].print.active))) {
                    createPanel = true;
                } else if (controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].active && !controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].div && controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].jsonExport && controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].jsonExport.active === false && controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].print && controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].print.active === false && controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].permaLink && controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].permaLink.active === true) {
                    BKGWebMap.Util.onlyPermaLink = true;
                }
            } else if (controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].active && !controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].div) {
                createPanel = true;
            }
        }
    }
    return createPanel;
};

/**
 * Find geometry type of features
 * @param {array} features - Array with OpenLayers features
 * @returns {object}
 */
BKGWebMap.Util.findGeometryType = function (features) {
    var stringsToSearch = [
        {
            string: 'POLYGON',
            name: 'Polygon'
        },
        {
            string: 'POINT',
            name: 'Point'
        },
        {
            string: 'LINE',
            name: 'LineString'
        }
    ];
    var types = [];
    var format = new ol.format.WKT();
    var geometry;
    var wkt;
    var tempType;
    for (var i = 0; i < features.length; i++) {
        geometry = features[i].getGeometry();

        wkt = format.writeGeometry(geometry);
        for (var k = 0; k < stringsToSearch.length; k++) {
            if (wkt.indexOf(stringsToSearch[k].string) !== -1) {
                tempType = stringsToSearch[k].name;
                if (types.indexOf(tempType) === -1) {
                    types.push(tempType);
                }
            }
        }
    }
    return types;
};

/**
 * Counter for layer IDs
 * @type {number}
 */
BKGWebMap.Util.layerId = 0;

/**
 * Generate ID for layers to use in permalink
 * @returns {string}
 */
BKGWebMap.Util.generateLayerId = function () {
    BKGWebMap.Util.layerId++;
    return 'layer_' + BKGWebMap.Util.layerId;
};

// Add remove() if method not exists
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

/**
 * @namespace BKGWebMap.Util
 * @type {object}
 */
BKGWebMap.Util = BKGWebMap.Util || {};

/**
 * Iterates over arrays
 * @param {array} elements - Array that this method is being applied to
 * @param {function} method - Function to be executed for each element
 */
BKGWebMap.Util.each = function (elements, method) {
    if (!elements || !elements.length) {
        return;
    }

    for (var i = 0; i < elements.length; i++) {
        method(i, elements[i]);
    }
};

/**
 * Iterates reverse over arrays
 * @param {array} elements - Array that this method is being applied to
 * @param {function} method - Function to be executed for each element
 */
BKGWebMap.Util.reverseEach = function (elements, method) {
    if (!elements || !elements.length) {
        return;
    }

    for (var i = elements.length - 1; i >= 0; i--) {
        method(i, elements[i]);
    }
};

/**
 * Maps elements of array. It creates a new array with the results of calling a method for every array element. You can pass further static arguments to the method.
 * @param {function} method - Function to be run for each element in the array
 * @param {array} elements - Array that this method is being applied to
 * @return {array}
 */
BKGWebMap.Util.map = function (method, elements) {
    if (!elements || !elements.length) {
        return [];
    }

    // pass further optional arguments
    var staticArgs = (arguments.length === 2) ? [] : Array.prototype.slice.call(arguments, 2, arguments.length);

    var result = [];
    for (var i = 0; i < elements.length; i++) {
        var args = [elements[i]];
        args = args.concat(staticArgs);
        result.push(method.apply(this, args));
    }
    return result;
};

/**
 * Creates a deep copy of an object
 * @param {object} obj - Object to copy
 * @returns {object}
 */
BKGWebMap.Util.deepCopy = function (obj) {
    var newObj = obj;
    if (obj && typeof obj === 'object') {
        newObj = Object.prototype.toString.call(obj) === '[object Array]' ? [] : {};
        for (var i in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, i)) {
                newObj[i] = BKGWebMap.Util.deepCopy(obj[i]);
            }
        }
    }
    return newObj;
};

/**
 * Extends an object using properties of a second object. Common properties will be overwritten.
 * @param {object} obj1 - Object to extend.
 * @param {object} obj2 - Object to get new properties.
 * @returns {object}
 */
BKGWebMap.Util.extend = function (obj1, obj2) {
    for (var p in obj2) {
        if (Object.prototype.hasOwnProperty.call(obj2, p)) {
            try {
                // Property in destination object set: update its value.
                if (obj2[p].constructor === Object && (Object.keys(obj2[p]).length > 0)) {
                    obj1[p] = BKGWebMap.Util.extend(obj1[p], obj2[p]);
                } else {
                    obj1[p] = obj2[p];
                }
            } catch (e) {
                // Property in destination object not set: create it and set its value.
                obj1[p] = obj2[p];
            }
        }
    }
    return obj1;
};

/**
 * Checks if an object has a nested property
 * @param {object} obj - The object to test
 * @param {string} propertyPath - Path of property. Syntax: 'prop1.prop2.prop3...'
 * @returns {boolean}
 */
BKGWebMap.Util.hasNestedProperty = function (obj, propertyPath) {
    if (!propertyPath) { return false; }

    var properties = propertyPath.split('.');

    for (var i = 0; i < properties.length; i++) {
        var prop = properties[i];

        if (!obj || !Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
        obj = obj[prop];
    }

    return true;
};

/**
 * Get a value from an object using a string path in dot notation
 * @param {object} obj - Object to search.
 * @param {string} propertyPath - String path in dot notation.
 * @returns {object}
 */
BKGWebMap.Util.getObjValueFromStringPath = function (obj, propertyPath) {
    function index(_obj, i) {
        return _obj[i];
    }
    return propertyPath.split('.').reduce(index, obj);
};

/**
 * Generate object with css properties from a string
 * @param {string} cssString - String to parse
 * @returns {object}
 */
BKGWebMap.Util.cssParser = function (cssString) {
    var obj = {};
    var propArray = cssString.split(';').filter(function (prop) {
        return (!!prop);
    });
    for (var prop in propArray) {
        propArray[prop] = propArray[prop].split(':');
        obj[propArray[prop][0]] = propArray[prop][1];
    }
    return obj;
};

/**
 * Generate a unique BKG WebMap ID that can be used in DOM elements
 * @returns {string}
 */
BKGWebMap.Util.uniqueId = function () {
    return 'bkgwebmap-' + Math.random().toString(36).substr(2, 16);
};

/**
 * Converts XML to JSON format
 * @param {object} xml - XML as JavaScript object
 * @returns {object}
 */
BKGWebMap.Util.xmlToJson = function (xml) {
    var obj = {};

    if (xml.nodeType === 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj['@attributes'] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType === 3) { // text
        obj = xml.nodeValue;
    }

    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) === 'undefined') {
                obj[nodeName] = BKGWebMap.Util.xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) === 'undefined') {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(BKGWebMap.Util.xmlToJson(item));
            }
        }
    }
    return obj;
};

/**
 * Generate a Session-Token for secure BKG services
 * @param {string} appID
 * @param {string} appDomain
 * @param {function} callback - Callback function
 * @returns {function}
 */
BKGWebMap.Util.getSessionToken = function (appID, appDomain, callback) {
    var baseURL = BKGWebMap.BASE_URL.replace('http://', 'https://');
    var url = baseURL + 'gdz_getSession?bkg_appid=' + appID + '&domain=' + appDomain;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);

    xhr.onload = function () {
        if (xhr.status === 200) {
            return callback(xhr.responseText);
        }
    };

    xhr.onerror = function () {
        return callback('');
    };

    xhr.send();
};

/**
 * Determine if we need to create a panel
 * @param {object} controls - Object with controls configuration
 * @returns {boolean}
 */
BKGWebMap.Util.shouldCreatePanel = function (controls) {
    var createPanel = false;
    BKGWebMap.Util.onlyPermaLink = false;
    if (!controls) {
        return createPanel;
    }
    if (typeof controls.tools !== 'object' || controls.tools.constructor !== Object) {
        return createPanel;
    }
    for (var i = 0; i < BKGWebMap.CONTROLS_IN_PANEL.length; i++) {
        if (controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]]) {
            if (BKGWebMap.CONTROLS_IN_PANEL[i] === 'share') {
                if (controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].active && !controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].div && ((controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].jsonExport && controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].jsonExport.active) || (controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].print && controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].print.active))) {
                    createPanel = true;
                } else if (controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].active && !controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].div && controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].jsonExport && controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].jsonExport.active === false && controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].print && controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].print.active === false && controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].permaLink && controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].permaLink.active === true) {
                    BKGWebMap.Util.onlyPermaLink = true;
                }
            } else if (controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].active && !controls.tools[BKGWebMap.CONTROLS_IN_PANEL[i]].div) {
                createPanel = true;
            }
        }
    }
    return createPanel;
};

/**
 * Find geometry type of features
 * @param {array} features - Array with OpenLayers features
 * @returns {object}
 */
BKGWebMap.Util.findGeometryType = function (features) {
    var stringsToSearch = [
        {
            string: 'POLYGON',
            name: 'Polygon'
        },
        {
            string: 'POINT',
            name: 'Point'
        },
        {
            string: 'LINE',
            name: 'LineString'
        }
    ];
    var types = [];
    var format = new ol.format.WKT();
    var geometry;
    var wkt;
    var tempType;
    for (var i = 0; i < features.length; i++) {
        geometry = features[i].getGeometry();

        wkt = format.writeGeometry(geometry);
        for (var k = 0; k < stringsToSearch.length; k++) {
            if (wkt.indexOf(stringsToSearch[k].string) !== -1) {
                tempType = stringsToSearch[k].name;
                if (types.indexOf(tempType) === -1) {
                    types.push(tempType);
                }
            }
        }
    }
    return types;
};

/**
 * Counter for layer IDs
 * @type {number}
 */
BKGWebMap.Util.layerId = 0;

/**
 * Generate ID for layers to use in permalink
 * @returns {string}
 */
BKGWebMap.Util.generateLayerId = function () {
    BKGWebMap.Util.layerId++;
    return 'layer_' + BKGWebMap.Util.layerId;
};

// Add remove() if method not exists
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

// Polyfill CustomEvent() in IE
(function () {
    if (typeof window.CustomEvent === 'function') return false;

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
}());


/**
 * Returns the extent of the given layer. Depending on the layer type the
 * access to the extent may vary.
 *
 * @param {ol.layer.Layer} layer - the layer from which to retrieve the extent
 * @param {ol.proj.Projection} projection - optional target projection for layer
 * @returns {ol.Extent}
 */
BKGWebMap.Util.getLayerExtent = function (layer, projection) {
    var extent;
    if (layer instanceof ol.layer.Group) {
        extent = ol.extent.createEmpty();
        layer.getLayers().forEach(function (subLayer) {
            var subLayerExtent = BKGWebMap.Util.getLayerExtent(subLayer, projection);
            ol.extent.extend(extent, subLayerExtent);
        });
        return extent;
    }

    // layer has no source. e.g. EMPTY
    if(layer.getSource() == null)
       return ol.extent.createEmpty();

    if (layer instanceof ol.layer.Vector) {
        extent = layer.getSource().getExtent();
    } else if (layer.extent && layer.extent instanceof Array) {
        extent = layer.extent;
    }

    var srcProjection = layer.getSource().getProjection();
    if (projection && srcProjection != null) {
        extent = ol.proj.transformExtent(extent, srcProjection, projection);
    }

    return extent;
};
