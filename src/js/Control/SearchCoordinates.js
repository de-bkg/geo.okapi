/**
 * Create SearchCoordinates Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_searchCoordinates}
 */
BKGWebMap.Control.createSearchCoordinates = function () {
    return function (map, controlName, options, panel) {
        var _this = this;
        var mapId = map.getTarget();
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
        var searchPanelControl = searchPanelExists();
        if (inPanel) {
            if (!searchPanelControl) {
                createSearchpanel();
            }
            target = panel.element.getElementsByClassName('bkgwebmap-searchpanelcontent')[0];
        }

        function createSearchpanel() {
            var SearchPanelClass = BKGWebMap.Control.FACTORIES.searchPanel();
            var searchPanel = new SearchPanelClass(map, 'searchpanel', false, panel);
            map.addControl(searchPanel);
            return searchPanel;
        }

        function searchPanelExists() {
            var exists = false;
            map.getControls().forEach(function (control) {
                if (BKGWebMap.Control.SearchPanel && control instanceof BKGWebMap.Control.SearchPanel) {
                    exists = true;
                }
            });
            return exists;
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

        var searchCoordinates = document.createElement('div');
        var searchCoordinatesClass = 'bkgwebmap-searchcoordinates ' + customClass;
        searchCoordinates.className = searchCoordinatesClass;

        var searchCoordinatesTitle = document.createElement('div');
        searchCoordinatesTitle.className = 'bkgwebmap-searchcoordinatestitle';
        searchCoordinatesTitle.innerHTML = 'Zu Koordinaten springen';
        var searchCoordinatesText = document.createElement('div');
        searchCoordinatesText.className = 'bkgwebmap-searchcoordinatestext';
        searchCoordinatesText.innerHTML = 'Koordinatenbezugssystem wählen und Koordinaten eingeben (Dezimalformat).';
        searchCoordinates.appendChild(searchCoordinatesTitle);
        searchCoordinates.appendChild(searchCoordinatesText);

        var searchCoordinatesSelect = document.createElement('select');
        searchCoordinatesSelect.className = 'bkgwebmap-searchcoordinatesselect';
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
            selectItem.className = 'bkgwebmap-searchcoordinatesselectitem';
            selectItem.value = csArray[i].epsg;
            if (csArray[i].name) {
                selectItem.innerHTML = csArray[i].name;
            } else {
                selectItem.innerHTML = csArray[i].epsg;
            }
            searchCoordinatesSelect.appendChild(selectItem);
        }
        searchCoordinates.appendChild(searchCoordinatesSelect);

        var searchCoordinatesLonInput = document.createElement('input');
        searchCoordinatesLonInput.className = 'bkgwebmap-searchcoordinatesinput bkgwebmap-searchcoordinateslon';
        searchCoordinatesLonInput.placeholder = 'Länge/Rechts';

        var searchCoordinatesLatInput = document.createElement('input');
        searchCoordinatesLatInput.className = 'bkgwebmap-searchcoordinatesinput bkgwebmap-searchcoordinateslat';
        searchCoordinatesLatInput.placeholder = 'Breite/Hoch';

        var searchCoordinatesInputs = document.createElement('div');
        searchCoordinatesInputs.className = 'bkgwebmap-searchcoordinatesinputs';
        searchCoordinatesInputs.appendChild(searchCoordinatesLatInput);
        searchCoordinatesInputs.appendChild(searchCoordinatesLonInput);
        searchCoordinates.appendChild(searchCoordinatesInputs);

        var searchCoordinatesButton = document.createElement('button');
        searchCoordinatesButton.className = 'bkgwebmap-searchcoordinatesbutton';
        searchCoordinatesButton.innerHTML = 'zu Koordinate springen';
        searchCoordinates.appendChild(searchCoordinatesButton);

        searchCoordinatesButton.addEventListener('click', zoomToCoordinates, { passive: true });

        var markerButton = document.createElement('button');
        markerButton.className = 'bkgwebmap-deletemarker';
        markerButton.innerHTML = 'Marker löschen';

        function zoomToCoordinates() {
            var lat = parseFloat(searchCoordinatesLatInput.value.replace(',', '.'));
            var lon = parseFloat(searchCoordinatesLonInput.value.replace(',', '.'));
            var proj = searchCoordinatesSelect.value;
            var mapProj = map.getView().getProjection();
            if (!isNaN(lat) && !isNaN(lon)) {
                var coordinates = [lon, lat];
                map.getView().setCenter(ol.proj.transform(coordinates, proj, mapProj));
                markerControl.setMarker(_this, ol.proj.transform(coordinates, proj, mapProj));
                if (document.getElementById(mapId).getElementsByClassName('bkgwebmap-deletemarker').length) {
                    document.getElementById(mapId).getElementsByClassName('bkgwebmap-deletemarker')[0].remove();
                }
                var markerButtonClone = markerButton.cloneNode(true);
                searchCoordinates.appendChild(markerButtonClone);
                markerButtonClone.onclick = function () {
                    markerControl.deleteMarker();
                    markerButtonClone.remove();
                };
            }
        }

        // Finalize control
        ol.control.Control.call(this, {
            element: searchCoordinates,
            target: target
        });
    };
};
