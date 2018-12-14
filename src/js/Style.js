/**
 * @namespace BKGWebMap.Style
 * @type {object}
 */
BKGWebMap.Style = BKGWebMap.Style || {};

/**
 * Create OpenLayer style to be used in vector layers
 * @param stylesArray - Array with configuration of styles
 * @return {object} - An object with OpenLayers style classes
 */
BKGWebMap.Style.createStyles = function (stylesArray) {
    var styles = {};
    var singleStyle;
    for (var i = 0; i < stylesArray.length; i++) {
        singleStyle = stylesArray[i];
        if (typeof singleStyle.name !== 'string' || singleStyle.name === '') {
            window.console.log(BKGWebMap.ERROR.missingStyleName + JSON.stringify(singleStyle));
            continue;
        }

        switch (singleStyle.type) {
        case 'symbol':
            if (typeof singleStyle.symbol !== 'string' || singleStyle.symbol === '') {
                window.console.log(BKGWebMap.ERROR.missingStyleSymbol + JSON.stringify(singleStyle));
                continue;
            } else if (!Object.prototype.hasOwnProperty.call(BKGWebMap.MAP_ICONS, singleStyle.symbol)) {
                window.console.log(BKGWebMap.ERROR.wrongStyleSymbol + JSON.stringify(singleStyle));
                continue;
            }
            styles[singleStyle.name] = BKGWebMap.Style.createSymbolStyle(singleStyle);
            break;
        case 'custom':
            styles[singleStyle.name] = BKGWebMap.Style.createCustomStyle(singleStyle);
            break;
        default:
            window.console.log(BKGWebMap.ERROR.wrongStyleType + JSON.stringify(singleStyle));
            continue;
        }
    }
    return styles;
};

/**
 * Create OpenLayers style class for symbol styles
 * @param {object} singleStyle - Configuration of style
 * @returns {object}
 */
BKGWebMap.Style.createSymbolStyle = function (singleStyle) {
    singleStyle.fillColor = BKGWebMap.Style.sanitizeColor(singleStyle.fillColor);
    singleStyle.strokeColor = BKGWebMap.Style.sanitizeColor(singleStyle.strokeColor);
    var svgFillColor = BKGWebMap.Style.svgColor(singleStyle.fillColor);
    var svgStrokeColor = BKGWebMap.Style.svgColor(singleStyle.strokeColor);
    var symbol = BKGWebMap.MAP_ICONS_ENCODED[singleStyle.symbol].a + svgFillColor + BKGWebMap.MAP_ICONS_ENCODED[singleStyle.symbol].b + svgStrokeColor + BKGWebMap.MAP_ICONS_ENCODED[singleStyle.symbol].c;
    var anchor = [0.5, 0.5];
    if (singleStyle.symbol === 'marker') {
        anchor = [0.5, 1];
    }

    var style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: singleStyle.fillColor
        }),
        stroke: new ol.style.Stroke({
            color: singleStyle.strokeColor,
            width: 1
        }),
        image: new ol.style.Icon(({
            anchor: anchor,
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            imgSize: BKGWebMap.MAP_ICONS_ENCODED[singleStyle.symbol].size,
            src: 'data:image/svg+xml;charset=utf8,' + symbol
        }))
    });
    style.getImage().anchor = anchor;
    return style;
};

/**
 * Use OpenLayers style class for custom styles
 * @param singleStyle - Configuration of style
 * @returns {string}
 */
BKGWebMap.Style.createCustomStyle = function (singleStyle) {
    var fill = BKGWebMap.Style.fill(singleStyle.fill);
    var stroke = BKGWebMap.Style.stroke(singleStyle.stroke);

    // Image
    // If user has defined multiple Image classes, then this reading order will be used:
    // regularShape -> icon -> circle
    var image;
    if (typeof singleStyle.image === 'object' && singleStyle.image.constructor === Object) {
        // Regular shape
        if (singleStyle.image.regularShape && singleStyle.image.regularShape) {
            if (singleStyle.image.regularShape instanceof ol.style.RegularShape) {
                image = singleStyle.image.regularShape;
            } else if (typeof singleStyle.image.regularShape === 'object' && singleStyle.image.regularShape.constructor === Object) {
                singleStyle.image.regularShape.fill = BKGWebMap.Style.fill(singleStyle.image.regularShape.fill);
                singleStyle.image.regularShape.stroke = BKGWebMap.Style.stroke(singleStyle.image.regularShape.stroke);
                image = new ol.style.RegularShape(singleStyle.image.regularShape);
            }
        }

        // Icon
        if (singleStyle.image.icon && singleStyle.image.icon) {
            if (singleStyle.image.icon instanceof ol.style.Icon) {
                image = singleStyle.image.icon;
            } else if (typeof singleStyle.image.icon === 'object' && singleStyle.image.icon.constructor === Object) {
                image = new ol.style.Icon(singleStyle.image.icon);
            }
        }

        // Circle
        if (singleStyle.image.circle && singleStyle.image.circle) {
            if (singleStyle.image.circle instanceof ol.style.Circle) {
                image = singleStyle.image.circle;
            } else if (typeof singleStyle.image.circle === 'object' && singleStyle.image.circle.constructor === Object) {
                singleStyle.image.circle.fill = BKGWebMap.Style.fill(singleStyle.image.circle.fill);
                singleStyle.image.circle.stroke = BKGWebMap.Style.stroke(singleStyle.image.circle.stroke);
                image = new ol.style.Circle(singleStyle.image.circle);
            }
        }
    }


    var style = new ol.style.Style({
        fill: fill,
        stroke: stroke,
        image: image
    });
    return style;
};

/**
 * Be sure to have # in HEX string
 * @param {string} color - Color HEX
 * @returns {string}
 */
BKGWebMap.Style.sanitizeColor = function (color) {
    if (color && color.slice(0, 1) !== '#') {
        color = '#' + color;
    }
    return color;
};

/**
 * Replace # with %23 for svg color. # in URI body is deprecated
 * @param {string} color - Color HEX
 * @returns {string}
 */
BKGWebMap.Style.svgColor = function (color) {
    color = color.replace('#', '%23');
    return color;
};

/**
 * Use ol.style.Fill class
 * @param {object|undefined} singleStyleFill - ol.style.Fill
 * @returns {object|undefined}
 */
BKGWebMap.Style.fill = function (singleStyleFill) {
    var fill;
    if (singleStyleFill instanceof ol.style.Fill) {
        fill = singleStyleFill;
    } else if (typeof singleStyleFill === 'object' && singleStyleFill.constructor === Object) {
        fill = new ol.style.Fill(singleStyleFill);
    }
    return fill;
};

/**
 * Use ol.style.Stroke class
 * @param {object|undefined} singleStyleStroke - ol.style.Stroke
 * @returns {object|undefined}
 */
BKGWebMap.Style.stroke = function (singleStyleStroke) {
    var stroke;
    if (singleStyleStroke instanceof ol.style.Stroke) {
        stroke = singleStyleStroke;
    } else if (typeof singleStyleStroke === 'object' && singleStyleStroke.constructor === Object) {
        stroke = new ol.style.Stroke(singleStyleStroke);
    }
    return stroke;
};
