/**
 * Create Print Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_print}
 */
BKGWebMap.Control.createPrint = function () {
    return function (map, options, panel) {
        options = options || {};

        var mapId = map.getTarget();

        // Add user defined stylesheet if set in options
        if ((typeof options.stylesheet === 'string' || options.stylesheet instanceof String) && options.stylesheet !== '') {
            var pathToStylesheet = options.stylesheet;
            var printStylesheet = document.createElement('link');
            printStylesheet.rel = 'stylesheet';
            printStylesheet.href = pathToStylesheet;
            document.head.appendChild(printStylesheet);
        }

        var target;
        if (panel.element) {
            target = panel.element.getElementsByClassName('bkgwebmap-sharepanelcontent')[0];
        } else {
            target = panel.getElementsByClassName('bkgwebmap-sharepanelcontent')[0];
        }

        var print = document.createElement('div');
        print.className = 'bkgwebmap-print';

        // add intro text
        var printMapInfo = document.createElement('div');
        printMapInfo.className = 'bkgwebmap-printmapinfo';
        print.appendChild(printMapInfo);

        // add button to print map
        var printButton = document.createElement('button');
        printButton.className = 'bkgwebmap-printmapbutton';
        printButton.innerHTML = 'Karte drucken';
        print.appendChild(printButton);

        // function to print map
        function printThisMap(mapId) {
            // add media query for map in style-tag
            var printStyle = document.createElement('style');
            printStyle.id = 'bkgwebmap-printstyle';
            printStyle.innerHTML = '@media print {body *{visibility:hidden; font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;}img{max-width:100%}.bkgwebmap-maptoprint,.bkgwebmap-maptoprint *{display:inherit;visibility:visible}.bkgwebmap-maptoprint .ol-control,.bkgwebmap-maptoprint .ol-control *{visibility:hidden!important}.print-element{display:block!important;margin-top:15px} sup {display: inline !important} .bkgwebmap-measureoverlay-tooltip {visibility: hidden;} .bkgwebmap-scalevalue {visibility: hidden}}';
            document.head.appendChild(printStyle);

            // set some variables
            var mapContainer = document.getElementById(mapId);
            var olAttribution = mapContainer.getElementsByClassName('bkgwebmap-copyrightlist')[0];
            var copyrightDiv = document.createElement('div');

            var olScale = mapContainer.getElementsByClassName('bkgwebmap-scalebar')[0];
            var scaleDiv = document.createElement('div');

            var olLegend = mapContainer.getElementsByClassName('bkgwebmap-legendcontent')[0];
            var legendDiv = document.createElement('div');

            // insert copyright information if available
            if (olAttribution) {
                // create new container for copyright information
                copyrightDiv.classList.add('print-element');
                copyrightDiv.style.display = 'none';

                // insert copyright information
                copyrightDiv.innerHTML = '<b>Copyright</b>' + olAttribution.innerHTML;
            }

            // insert scale if available
            if (olScale) {
                // create new container for scale
                scaleDiv.classList.add('print-element');
                scaleDiv.classList.add('scale-div-print');
                scaleDiv.style.display = 'none';


                // insert scale
                scaleDiv.innerHTML = olScale.innerHTML;
            }

            // insert legend if available
            if (olLegend) {
                // create new container for legend
                legendDiv.classList.add('print-element');
                legendDiv.style.display = 'none';

                // insert legend
                legendDiv.innerHTML = olLegend.innerHTML;
            }

            // insert measure result if available
            var measureDiv = document.createElement('div');
            measureDiv.classList.add('print-element');
            measureDiv.style.display = 'none';

            var measureTooltip = document.getElementsByClassName('bkgwebmap-measureoverlay-tooltip-static')[0];

            if (measureTooltip !== undefined) {
                var measureResult = measureTooltip.innerHTML;
                var measureMessage;
                if (measureResult.indexOf('<sup>') !== -1) {
                    measureMessage = 'Gemessene Fläche: ' + measureResult;
                } else {
                    measureMessage = 'Gemessene Strecke: ' + measureResult;
                }

                measureDiv.innerHTML = measureMessage;
            }

            // add scaleDiv, measureDiv, copyrightDiv, le  to page
            mapContainer.appendChild(scaleDiv);
            mapContainer.appendChild(measureDiv);
            mapContainer.appendChild(copyrightDiv);
            mapContainer.appendChild(legendDiv);

            // add class to set all but this map invisible, print and then remove class again
            mapContainer.classList.add('bkgwebmap-maptoprint');

            // print map
            window.print();

            // remove created elements again
            document.head.removeChild(document.getElementById('bkgwebmap-printstyle'));
            mapContainer.removeChild(scaleDiv);
            mapContainer.removeChild(measureDiv);
            mapContainer.removeChild(copyrightDiv);
            mapContainer.removeChild(legendDiv);
            mapContainer.classList.remove('bkgwebmap-maptoprint');
        }

        // add EventListener
        printButton.addEventListener('click', function () {
            printThisMap(mapId);
        }, { passive: true });

        // Finalize control
        ol.control.Control.call(this, {
            element: print,
            target: target
        });
    };
};
