/**
 * Create showCoordinates Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_showCoordinates}
 */
BKGWebMap.Control.createShowCoordinates = function () {
    return function (map, controlName, options, panel, standardPositionControls) {
        var i;
        var mapDivId = map.getTarget();
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

        if (target === undefined) {
            if (typeof options.position === 'string' && BKGWebMap.STANDARD_POSITION.indexOf(options.position) !== -1) {
                position = options.position;
            } else if (typeof options.position === 'string' && options.position.match(/top|left|bottom|right/)) {
                cssPosition = true;
                position = BKGWebMap.Util.cssParser(options.position);
            } else {
                position = BKGWebMap.CONTROLS.tools.showCoordinates.position;
            }
        }

        var showCoordinates = document.createElement('div');
        showCoordinates.className = 'bkgwebmap-showcoordinates ol-unselectable ol-control';

        var tooltipExtraClass = ' bkgwebmap-tooltipinmaptext';
        var mapDivMiddle = document.getElementById(mapDivId).offsetWidth / 2;

        if (position !== undefined) {
            if (!cssPosition && standardPositionControls[position]) {
                var targetClass = standardPositionControls[position].getClass();
                target = document.getElementById(mapDivId).getElementsByClassName(targetClass)[0];
                var rightLeft = position.split('-')[1];
                showCoordinates.classList.add('bkgwebmap-standardpositioncontrol', 'bkgwebmap-standardpositioncontrol' + rightLeft);
                if (rightLeft === 'right') {
                    tooltipExtraClass = ' bkgwebmap-tooltipshowcoordright';
                }
            } else if (cssPosition) {
                for (var prop in position) {
                    if (prop === 'left' && parseInt(position.left, 10) > mapDivMiddle) {
                        showCoordinates.style.right = document.getElementById(mapDivId).offsetWidth - parseInt(position.left, 10) + 'px';
                    } else {
                        showCoordinates.style[prop] = position[prop];
                    }
                }
            } else {
                return undefined;
            }
        }
        // Custom class
        var customClass = '';
        if (options.style && options.style !== '') {
            customClass = options.style;
            showCoordinates.classList.add(customClass);
        }

        // Create DOM
        var showCoordinatesButton = document.createElement('button');
        showCoordinatesButton.className = 'bkgwebmap-mapbutton bkgwebmap-showcoordinatesbutton bkgwebmap-paneltooltip';
        if (position === 'bottom-right' || position === 'top-right' || (cssPosition && parseInt(position.left, 10) > mapDivMiddle) || (cssPosition && parseInt(position.right, 10) < mapDivMiddle)) {
            showCoordinatesButton.style.float = 'right';
        } else {
            showCoordinatesButton.style.float = 'left';
        }
        if (position === 'bottom-left' || position === 'bottom-right') {
            showCoordinatesButton.style.marginTop = '20px';
        }

        var parser = new DOMParser();
        var newIcon = parser.parseFromString(BKGWebMap.PANEL_ICONS.SHOW_COORDINATES, 'text/xml');
        showCoordinatesButton.appendChild(newIcon.documentElement);

        var showCoordinatesTooltip = document.createElement('span');
        showCoordinatesTooltip.className = 'bkgwebmap-paneltooltiptext bkgwebmap-tooltipshowcoord' + tooltipExtraClass;
        showCoordinatesTooltip.innerHTML = 'Koordinatenanzeige';
        showCoordinatesButton.appendChild(showCoordinatesTooltip);

        var showCoordinatesSelect = document.createElement('select');
        showCoordinatesSelect.className = 'bkgwebmap-showcoordinatesselect';
        var showCoordinatesSelectDiv = document.createElement('div');
        showCoordinatesSelectDiv.className = 'bkgwebmap-showcoordinatesselectdiv';

        var resizedSelect = document.createElement('select');
        var resizingOption = document.createElement('option');
        resizedSelect.appendChild(resizingOption);
        resizedSelect.style.display = 'none';

        var selectArrowUp = document.createElement('div');
        selectArrowUp.className = 'bkgwebmap-selectarrowdown';

        showCoordinatesSelectDiv.appendChild(selectArrowUp);
        showCoordinatesSelectDiv.appendChild(showCoordinatesSelect);
        showCoordinatesSelectDiv.appendChild(resizedSelect);

        var showCoordinatesDiv = document.createElement('div');
        showCoordinatesDiv.className = 'bkgwebmap-showcoordinatesdiv';
        showCoordinatesDiv.style.display = 'none';

        var showCoordinatesTextDiv = document.createElement('div');
        showCoordinatesTextDiv.className = 'bkgwebmap-showcoordinatestextdiv';


        showCoordinatesDiv.appendChild(showCoordinatesSelectDiv);
        showCoordinatesDiv.appendChild(showCoordinatesTextDiv);

        if (position === 'bottom-right' || position === 'top-right' || (cssPosition && parseInt(position.left, 10) > mapDivMiddle) || (cssPosition && parseInt(position.right, 10) < mapDivMiddle)) {
            showCoordinatesSelectDiv.style.float = 'right';
        } else {
            showCoordinatesSelectDiv.style.float = 'left';
        }

        showCoordinates.appendChild(showCoordinatesButton);
        showCoordinates.appendChild(showCoordinatesDiv);

        var csArray;

        if (options.coordinateSystems instanceof Array && options.coordinateSystems.length) {
            csArray = options.coordinateSystems;
        } else {
            csArray = [
                {
                    epsg: map.getView().getProjection().getCode(),
                    name: map.getView().getProjection().getCode()
                }
            ];
        }
        for (i = 0; i < csArray.length; i++) {
            var selectItem = document.createElement('option');
            selectItem.className = 'bkgwebmap-showcoordinatesselectitem';
            selectItem.value = csArray[i].epsg;
            if (csArray[i].name) {
                selectItem.innerHTML = csArray[i].name;
            } else {
                selectItem.innerHTML = csArray[i].epsg;
            }
            showCoordinatesSelect.appendChild(selectItem);
        }

        showCoordinatesButton.addEventListener('click', function () {
            if (showCoordinatesDiv.style.display === 'none') {
                showCoordinatesDiv.style.display = 'inline-block';
                resizingSelect();
            } else {
                showCoordinatesDiv.style.display = 'none';
            }
        }, { passive: true });

        // Default value of showCoordinates
        var centerDefault = [map.getView().getCenter()[0].toFixed(4), map.getView().getCenter()[1].toFixed(4)];
        var centerDefaultLength = centerDefault[0].length + centerDefault[1].length;
        var noCoordsArray = [];
        for (i = 0; i < centerDefaultLength; i++) {
            noCoordsArray.push('_');
        }
        var noCoords = noCoordsArray.join('');

        var defaultProjection = showCoordinatesSelect.options[showCoordinatesSelect.selectedIndex].value;

        var showCoordinatesValue = new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(4),
            projection: defaultProjection,
            target: showCoordinatesTextDiv,
            className: 'bkgwebmap-showcoordinatesvalue',
            undefinedHTML: '<span style="color:rgba(255,255,255, 0)">' + noCoords + '</span>'
        });

        showCoordinatesSelect.addEventListener('change', function (event) {
            resizingSelect();
            showCoordinatesValue.setProjection(event.target.value);
        });

        function resizingSelect() {
            resizingOption.innerHTML = showCoordinatesSelect.options[showCoordinatesSelect.selectedIndex].textContent;
            resizedSelect.style.display = '';
            showCoordinatesSelect.style.width = resizedSelect.clientWidth + 'px';
            resizedSelect.style.display = 'none';
        }

        this.showCoordinatesValue = showCoordinatesValue;

        BKGWebMap.Control.ShowCoordinates.prototype.setMap = function (map) {
            this.showCoordinatesValue.setMap(map);
            ol.control.Control.prototype.setMap.call(this, map);
        };

        showCoordinatesButton.addEventListener('mouseenter', function () {
            var allTooltips = document.getElementsByClassName('bkgwebmap-paneltooltiptext');
            for (var i = 0; i < allTooltips.length; i++) {
                allTooltips[i].style.visibility = '';
            }
            showCoordinatesTooltip.style.visibility = 'visible';
            setTimeout(function () {
                showCoordinatesTooltip.style.visibility = '';
            }, 1200);
        }, false);

        // Finalize control
        ol.control.Control.call(this, {
            element: showCoordinates,
            target: target
        });
    };
};
