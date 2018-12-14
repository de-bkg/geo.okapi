/**
 * Create Scalebar Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_scalebar}
 */
BKGWebMap.Control.createScalebar = function () {
    return function (map, controlName, options, panel, standardPositionControls) {
        var _this = this;

        var mapDivId = map.getTarget();
        var scaleLineDiv;

        // Check if control should be created
        if (options.active === false) {
            return undefined;
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

        var onlyFullScreenClass = '';
        if (this.onlyFullScreen) {
            onlyFullScreenClass = ' bkgwebmap-onlyfullscreen ';
        }

        var scalebar = document.createElement('div');
        scalebar.className = 'bkgwebmap-scalebar bkgwebmap-scalebarinit ol-unselectable ol-control' + onlyFullScreenClass;

        if (position !== undefined) {
            if (!cssPosition && standardPositionControls[position]) {
                var targetClass = standardPositionControls[position].getClass();
                target = document.getElementById(mapDivId).getElementsByClassName(targetClass)[0];
                var rightLeft = position.split('-')[1];
                scalebar.classList.add('bkgwebmap-standardpositioncontrol', 'bkgwebmap-standardpositioncontrol' + rightLeft);
            } else if (cssPosition) {
                for (var prop in position) {
                    scalebar.style[prop] = position[prop];
                }
            } else {
                return undefined;
            }
        }

        var scalebarType = BKGWebMap.CONTROLS.tools.scalebar.scalebarType;
        var scalebarTypes = [
            'mapscale',
            'resolution',
            'distance',
            'mapscaleDistance',
            'resolutionDistance'
        ];

        if (scalebarTypes.indexOf(options.scalebarType) !== -1) {
            scalebarType = options.scalebarType;
        }

        var customClass = '';
        if (options.style && options.style !== '') {
            customClass = options.style;
            scalebar.classList.add(customClass);
        }

        if (scalebarType !== 'mapscale' && scalebarType !== 'resolution') {
            scaleLineDiv = document.createElement('div');
            scaleLineDiv.className = 'bkgwebmap-scalelinediv';
        }

        var scaleValueDiv = document.createElement('div');
        scaleValueDiv.className = 'bkgwebmap-scalevalue';

        scalebar.appendChild(scaleValueDiv);
        if (scaleLineDiv) {
            scalebar.appendChild(scaleLineDiv);
        }


        var units = map.getView().getProjection().getUnits();

        var DOTS_PER_INCH = 25.4 / 0.28;

        function getScale(resolution) {
            var metersPerUnit = map.getView().getProjection().getMetersPerUnit();
            var scale = 39.37 * DOTS_PER_INCH * resolution * metersPerUnit;
            scale = '1 : ' + Math.round(scale);
            return scale;
        }

        function getResolution(resolution) {
            var resolutionString;
            if (units === 'degrees') {
                resolutionString = (resolution * 3600).toFixed(2) + ' "/Pixel';
            } else {
                resolutionString = resolution.toFixed(2) + ' Meter/Pixel';
            }
            return resolutionString;
        }

        function getScaleResolution() {
            var resolution = map.getView().getResolution();
            switch (scalebarType) {
            case 'mapscaleDistance':
                scalebar.classList.remove('bkgwebmap-scalebarinit');
                scaleValueDiv.innerHTML = getScale(resolution);
                break;
            case 'resolutionDistance':
                scalebar.classList.remove('bkgwebmap-scalebarinit');
                scaleValueDiv.innerHTML = getResolution(resolution);
                break;
            case 'mapscale':
                scaleValueDiv.innerHTML = getScale(resolution);
                break;
            case 'resolution':
                scaleValueDiv.innerHTML = getResolution(resolution);
                break;
            default:
                scalebar.classList.remove('bkgwebmap-scalebarinit');
            }

            // Adjust scalebar width
            if (scaleLineDiv) {
                setTimeout(function () {
                    var scalebarWidth = _this.scaleLine.element.childNodes[0].clientWidth;
                    scaleLineDiv.style.width = scalebarWidth + 'px';
                }, 100);
            }
        }

        map.on('moveend', getScaleResolution);

        var mapUnits = units;
        if (units === 'm') {
            mapUnits = 'metric';
        }

        if (scaleLineDiv) {
            this.scaleLine = new ol.control.ScaleLine({
                target: scaleLineDiv,
                className: 'bkgwebmap-scaleline',
                units: mapUnits
            });

            BKGWebMap.Control.Scalebar.prototype.setMap = function (map) {
                this.scaleLine.setMap(map);
                ol.control.Control.prototype.setMap.call(this, map);
            };
        }

        // Finalize control
        ol.control.Control.call(this, {
            element: scalebar,
            target: target
        });
    };
};
