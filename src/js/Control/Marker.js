/**
 * Create Marker Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_marker}
 */
BKGWebMap.Control.createMarker = function () {
    return function (map) {
        var marker = document.createElement('div');
        marker.className = 'bkgwebmap-markercontrol ol-unselectable ol-control';
        var overlayMarkerId = BKGWebMap.Util.uniqueId();
        var parserMarkerIcon = new DOMParser();
        var markerColor = '#407e40';
        var markerIcon = BKGWebMap.MAP_ICONS.marker.a + markerColor + BKGWebMap.MAP_ICONS.marker.b + markerColor + BKGWebMap.MAP_ICONS.marker.c;
        var layerDownIcon = parserMarkerIcon.parseFromString(markerIcon, 'text/xml');
        var overlayMarker = new ol.Overlay({
            element: layerDownIcon.documentElement,
            offset: [0, 5],
            positioning: 'bottom-center',
            uniqueId: overlayMarkerId
        });
        var overlayPosition;

        this.setMarker = function (control, coord) {
            overlayPosition = overlayMarker.getPosition();
            if (!overlayPosition) {
                map.addOverlay(overlayMarker);
            }
            overlayMarker.setPosition(coord);
        };

        this.deleteMarker = function () {
            overlayPosition = overlayMarker.getPosition();
            if (overlayPosition) {
                map.removeOverlay(overlayMarker);
                overlayMarker.setPosition(null);
            }
        };

        // Finalize control
        ol.control.Control.call(this, {
            element: marker
        });
    };
};
