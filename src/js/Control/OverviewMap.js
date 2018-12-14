/**
 * Create OverviewMap Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_overviewMap}
 */
BKGWebMap.Control.createOverviewMap = function () {
    return function (map, controlName, options, panel, standardPositionControls) {
        var mapDivId = map.getTarget();
        var _this = this;

        // Check if control should be created
        if (options.active === false) {
            return undefined;
        }

        var layers = BKGWebMap.CONTROLS.tools.overviewMap.layers;
        if (options.layers instanceof Array) {
            layers = options.layers;
        }

        var collapsible = BKGWebMap.CONTROLS.tools.overviewMap.collapsible;
        if (typeof options.collapsible === 'boolean') {
            collapsible = options.collapsible;
        }

        var collapsed = BKGWebMap.CONTROLS.tools.overviewMap.collapsed;
        if (typeof options.collapsed === 'boolean') {
            collapsed = options.collapsed;
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

        var onlyFullScreenClass = '';
        if (this.onlyFullScreen) {
            onlyFullScreenClass = ' bkgwebmap-onlyfullscreen ';
        }

        if (target === undefined) {
            if (typeof options.position === 'string' && BKGWebMap.STANDARD_POSITION.indexOf(options.position) !== -1) {
                position = options.position;
            } else if (typeof options.position === 'string' && options.position.match(/top|left|bottom|right/)) {
                cssPosition = true;
                position = BKGWebMap.Util.cssParser(options.position);
            } else {
                position = BKGWebMap.CONTROLS.tools.scalebar.position;
            }
        }

        var overviewMap = document.createElement('div');

        var label = '\u00BB';
        var collapseLabel = '\u00AB';

        var standardPositionClass = '';
        if (position !== undefined) {
            if (standardPositionControls[position]) {
                var targetClass = standardPositionControls[position].getClass();
                target = document.getElementById(mapDivId).getElementsByClassName(targetClass)[0];
                var rightLeft = position.split('-')[1];
                standardPositionClass = ' bkgwebmap-standardpositioncontrol bkgwebmap-standardpositioncontrol' + rightLeft;
                if (rightLeft === 'right') {
                    label = '\u00AB';
                    collapseLabel = '\u00BB';
                }
            } else if (cssPosition) {
                for (var prop in position) {
                    overviewMap.style.position = 'absolute';
                    overviewMap.style[prop] = position[prop];
                }
            } else {
                return undefined;
            }
        }

        // Custom class
        var customClass = ' ';
        if (options.style && options.style !== '') {
            customClass = ' ' + options.style;
        }

        // Activate ol.control.OverviewMap with layers defined by user
        this.activateOverviewMap = function () {
            var layersToUse = [];

            map.getLayers().forEach(function (layer) {
                if (layer.getProperties().id && layers.indexOf(layer.getProperties().id) !== -1) {
                    layersToUse.push(layer);
                }
                if (layer instanceof ol.layer.Group) {
                    layer.getLayers().forEach(function (layerInGroup) {
                        if (layerInGroup.getProperties().id && layers.indexOf(layerInGroup.getProperties().id) !== -1) {
                            layersToUse.push(layerInGroup);
                        }
                    });
                }
            });

            if (!layersToUse.length) {
                map.getLayers().forEach(function (layer) {
                    if ((layer instanceof BKGWebMap.Layer.ImageWMS || layer instanceof BKGWebMap.Layer.TileWMS) && (layer.getTimeInfo() !== undefined && Object.keys(layer.getTimeInfo()).length)) {
                        return;
                    } else if (layer instanceof ol.layer.Group) {
                        layer.getLayers().forEach(function (layerInGroup) {
                            if ((layerInGroup instanceof BKGWebMap.Layer.ImageWMS || layer instanceof BKGWebMap.Layer.TileWMS) && (layerInGroup.getTimeInfo() !== undefined && Object.keys(layerInGroup.getTimeInfo()).length)) {
                                return;
                            } else {
                                layersToUse.push(layerInGroup);
                            }
                        });
                    } else {
                        layersToUse.push(layer);
                    }
                });
            }

            _this.om = new ol.control.OverviewMap({
                className: 'ol-overviewmap bkgwebmap-overviewmap' + onlyFullScreenClass + customClass + standardPositionClass + ' ',
                target: overviewMap,
                collapsed: collapsed,
                collapsible: collapsible,
                collapseLabel: collapseLabel,
                label: label,
                layers: layersToUse,
                view: new ol.View({
                    projection: map.getView().getProjection().getCode()
                }),
                tipLabel: 'Übersichtskarte'
            });
            _this.om.setMap(map);
        };

        // Finalize control
        ol.control.Control.call(this, {
            element: overviewMap,
            target: target
        });
    };
};
