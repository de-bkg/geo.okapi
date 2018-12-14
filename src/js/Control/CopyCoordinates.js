/**
 * Create CopyCoordinates Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_copyCoordinates}
 */
BKGWebMap.Control.createCopyCoordinates = function () {
    return function (map, controlName, options, panel) {
        var mapId = map.getTarget();
        var _this = this;
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
        }

        // Custom class
        var customClass = '';
        if (options.style && options.style !== '') {
            customClass = options.style;
        }

        // Control in panel
        var infoPanel = getInfoPanel();
        if (inPanel) {
            if (!infoPanel) {
                infoPanel = createInfopanel();
            }
            target = panel.element.getElementsByClassName('bkgwebmap-infopanelcontent')[0];
        }

        function createInfopanel() {
            var InfoPanelClass = BKGWebMap.Control.FACTORIES.infoPanel();
            var infoPanel = new InfoPanelClass(map, 'infoPanel', null, panel);
            map.addControl(infoPanel);
            return infoPanel;
        }

        function getInfoPanel() {
            var theControl = false;
            map.getControls().forEach(function (control) {
                if (BKGWebMap.Control.InfoPanel && control instanceof BKGWebMap.Control.InfoPanel) {
                    theControl = control;
                }
            });
            return theControl;
        }

        var markerControl;
        map.getControls().forEach(function (control) {
            if (BKGWebMap.Control.Marker && control instanceof BKGWebMap.Control.Marker) {
                markerControl = control;
            }
        });

        if (!markerControl) {
            var Marker = BKGWebMap.Control.FACTORIES.marker();
            markerControl = new Marker(map);
            map.addControl(markerControl);
        }

        var copyCoordinates = document.createElement('div');
        copyCoordinates.className = 'bkgwebmap-copycoordinates ' + customClass;

        var copyCoordinatesInfo = document.createElement('div');
        copyCoordinatesInfo.innerHTML = 'Linksklick: Koordinatenabfrage';
        copyCoordinatesInfo.className = 'bkgwebmap-copycoordinatesinfo';
        copyCoordinates.appendChild(copyCoordinatesInfo);

        var copyCoordinatesInput = document.createElement('input');
        copyCoordinatesInput.className = 'bkgwebmap-copycoordinatesinput';
        copyCoordinatesInput.readOnly = true;
        copyCoordinatesInput.value = '';
        copyCoordinates.appendChild(copyCoordinatesInput);

        var copyCoordinatesSelect = document.createElement('select');
        copyCoordinatesSelect.className = 'bkgwebmap-copycoordinatesselect';
        var csArray;
        if (options.coordinateSystems && options.coordinateSystems instanceof Array && options.coordinateSystems.length) {
            csArray = options.coordinateSystems;
        } else {
            csArray = [
                {
                    epsg: map.getView().getProjection().getCode(),
                    name: map.getView().getProjection().getCode()
                }
            ];
        }
        for (var i = 0; i < csArray.length; i++) {
            var selectItem = document.createElement('option');
            selectItem.className = 'bkgwebmap-copycoordinatesselectitem';
            selectItem.value = csArray[i].epsg;
            if (csArray[i].name) {
                selectItem.innerHTML = csArray[i].name;
            } else {
                selectItem.innerHTML = csArray[i].epsg;
            }
            copyCoordinatesSelect.appendChild(selectItem);
        }
        copyCoordinates.appendChild(copyCoordinatesSelect);

        var copyCoordinatesButton = document.createElement('button');
        copyCoordinatesButton.className = 'bkgwebmap-copycoordinatesbutton';
        copyCoordinatesButton.innerHTML = 'Koordinaten kopieren';
        copyCoordinates.appendChild(copyCoordinatesButton);

        copyCoordinatesButton.addEventListener('click', copyCoordinatesFunction, { passive: true });

        function copyCoordinatesFunction() {
            copyCoordinatesInput.select();
            document.execCommand('copy');
            deselectAllText();
            map.getTargetElement().style.cursor = 'default';
        }

        var markerButton = document.createElement('button');
        markerButton.className = 'bkgwebmap-deletemarker';
        markerButton.innerHTML = 'Marker löschen';

        var customProjection = copyCoordinatesSelect.value;
        var mapProjection = map.getView().getProjection();
        var lastProjection = customProjection;

        copyCoordinatesSelect.onchange = function (evt) {
            customProjection = evt.target.value;
            var coordinatesString = copyCoordinatesInput.value;
            if (coordinatesString) {
                var coordinatesArray = coordinatesString.split(' ');
                copyCoordinatesInput.value = ol.coordinate.format(ol.proj.transform([parseFloat(coordinatesArray[0]), parseFloat(coordinatesArray[1])], lastProjection, customProjection), '{x} {y}', 5);
            }
            lastProjection = customProjection;
        };

        var coordinates;
        // Add click event on map
        this.clickCopyCoordinatesActivate = function (evt) {
            // Open info panel
            if (inPanel) {
                panel.openPanel();
                var activeContent = panel.getActiveContent();
                if (activeContent !== 'bkgwebmap-infopanelcontent') {
                    panel.changePanelContent('Info', 'bkgwebmap-infopanelcontent');
                }
                infoPanel.activeIcon();
            }
            coordinates = evt.coordinate;
            copyCoordinatesInput.style.display = 'block';
            copyCoordinatesInput.value = ol.coordinate.format(ol.proj.transform(coordinates, mapProjection, customProjection), '{x} {y}', 5);
            markerControl.setMarker(_this, coordinates);
            if (document.getElementById(mapId).getElementsByClassName('bkgwebmap-deletemarker').length) {
                document.getElementById(mapId).getElementsByClassName('bkgwebmap-deletemarker')[0].remove();
            }
            var markerButtonClone = markerButton.cloneNode(true);
            copyCoordinates.appendChild(markerButtonClone);
            markerButtonClone.onclick = function () {
                markerControl.deleteMarker();
                markerButtonClone.remove();
            };
        };

        map.on('click', this.clickCopyCoordinatesActivate);

        function deselectAllText() {
            var element = document.activeElement;
            if (element && /INPUT|TEXTAREA/i.test(element.tagName)) {
                if ('selectionStart' in element) {
                    element.selectionEnd = element.selectionStart;
                }
                element.blur();
            }
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            } else if (document.selection) {
                document.selection.empty();
            }
        }

        // Finalize control
        ol.control.Control.call(this, {
            element: copyCoordinates,
            target: target
        });
    };
};
