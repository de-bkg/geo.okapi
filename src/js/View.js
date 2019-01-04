/**
 * @namespace BKGWebMap.View
 * @type {object}
 */
BKGWebMap.View = BKGWebMap.View || {};

/**
 * Creates a View instance using a configuration object.
 * @param {object} config - An object with valid options for ol.View.
 * @returns {object}
 */
BKGWebMap.View.create = function (config) {
    return new ol.View(config);
};

/**
 * Find best resolution for map
 * @param {object} config - An object with valid options for ol.View.
 * @param {ol.Map} map - Map to calculate best resolution.
 * @returns {number}
 */
BKGWebMap.View.findBestResolution = function (config, map) {
    var projExtent = BKGWebMap.PROJECTIONS_EXTENTS[config.projection];
    var startResolution = ol.extent.getWidth(projExtent) / 256;
    var resolutions = new Array(22);
    for (var i = 0, ii = resolutions.length; i < ii; ++i) {
        resolutions[i] = startResolution / Math.pow(2, i);
    }

    var getResolutionForExtent = function (extent, size) {
        var xResolution = ol.extent.getWidth(extent) / size[0];
        var yResolution = ol.extent.getHeight(extent) / size[1];
        return Math.max(xResolution, yResolution);
    };

    var bestResolution;
    var resolution = getResolutionForExtent(BKGWebMap.PROJECTIONS_EXTENTS[config.projection], map.getSize());
    var k = 0;
    do {
        bestResolution = resolutions[k];
        k++;
    } while (resolutions[k] > resolution);

    return bestResolution;
};
