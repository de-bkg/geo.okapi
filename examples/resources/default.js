var examplesPath = '';

var linksList = [
    {
        filename: 'bkg-layer.html',
        title: 'BKG-Dienst',
        indexDescription: 'Beispiel einer Karte mit einem gebundenen BKG-Dienst',
        pageDescription: 'Beispiel einer Karte mit einem gebundenen BKG-Dienst'
    },
    {
        filename: 'wms-layer.html',
        title: 'WMS',
        indexDescription: 'Beispiel einer Karte mit einem gebundenen WMS-Dienst',
        pageDescription: 'Beispiel einer Karte mit einem gebundenen WMS-Dienst'
    },
    {
        filename: 'wmts-layer.html',
        title: 'WMTS',
        indexDescription: 'Beispiel einer Karte mit einem gebundenen WMTS-Dienst',
        pageDescription: 'Beispiel einer Karte mit einem gebundenen WMTS-Dienst'
    },
    {
        filename: 'wfs-layer.html',
        title: 'WFS',
        indexDescription: 'Beispiel einer Karte mit einem gebundenen WFS-Dienst',
        pageDescription: 'Beispiel einer Karte mit einem gebundenen WFS-Dienst'
    },
    {
        filename: 'marker-layer.html',
        title: 'Marker',
        indexDescription: 'Beispiel einer Karte mit einem MARKER-Layer',
        pageDescription: 'Beispiel einer Karte mit einem MARKER-Layer'
    },
    {
        filename: 'csv-layer.html',
        title: 'CSV',
        indexDescription: 'Beispiel einer Karte mit einem CSV-Layer',
        pageDescription: 'Beispiel einer Karte mit einem CSV-Layer'
    },
    {
        filename: 'xls-layer.html',
        title: 'XLS (Excel)',
        indexDescription: 'Beispiel einer Karte mit einem XLS-Layer',
        pageDescription: 'Beispiel einer Karte mit einem XLS-Layer'
    },
    {
        filename: 'gps-layer.html',
        title: 'GPS (GPX)',
        indexDescription: 'Beispiel einer Karte mit einem GPS-Layer',
        pageDescription: 'Beispiel einer Karte mit einem GPS-Layer'
    },
    {
        filename: 'group-layer.html',
        title: 'Group-Layer',
        indexDescription: 'Beispiel einer Karte mit einem Group-Layer',
        pageDescription: 'Beispiel einer Karte mit einem Group-Layer'
    },
    {
        filename: 'default-map.html',
        title: 'Default-Karte',
        indexDescription: 'Beispiel einer Karte mit der Default-Konfiguration',
        pageDescription: 'Beispiel einer Karte mit der Default-Konfiguration'
    },
    {
        filename: 'epsg-4326-map.html',
        title: 'EPSG:4326',
        indexDescription: 'Beispiel einer Karte im Koordinatensystem EPSG:4326',
        pageDescription: 'Beispiel einer Karte im Koordinatensystem EPSG:4326'
    },
    {
        filename: 'config.html',
        title: 'Konfigurative Schnittstelle',
        indexDescription: 'Karte mit der konfigurativen Schnittstelle erstellen',
        pageDescription: 'Karte mit der konfigurativen Schnittstelle erstellen'
    },
    {
        filename: 'panel.html',
        title: 'Panel',
        indexDescription: 'Beispiel einer Karte mit einem Panel',
        pageDescription: 'Beispiel einer Karte mit einem Panel'
    },
    {
        filename: 'layerswitcher.html',
        title: 'Layer-Switcher',
        indexDescription: 'Layer-Switcher-Control',
        pageDescription: 'Layer-Switcher-Control'
    },
    {
        filename: 'legend.html',
        title: 'Legende',
        indexDescription: 'Legende-Control',
        pageDescription: 'Legende-Control'
    },
    {
        filename: 'full-screen.html',
        title: 'Full-Screen',
        indexDescription: 'Full-Screen-Control',
        pageDescription: 'Full-Screen-Control'
    },
    {
        filename: 'copyright.html',
        title: 'Copyright',
        indexDescription: 'Copyright-Vermerk',
        pageDescription: 'Copyright-Vermerk'
    },
    {
        filename: 'attributes.html',
        title: 'Attributinformation',
        indexDescription: 'Anzeige von Attributinformation',
        pageDescription: 'Anzeige von Attributinformation'
    },
    {
        filename: 'measure.html',
        title: 'Messwerkzeuge',
        indexDescription: 'Messwerkzeuge-Control',
        pageDescription: 'Messwerkzeuge-Control'
    },
    // {
    //     filename: 'permalink.html',
    //     title: 'Permalink',
    //     indexDescription: 'Einfache Persistierung mit einem Permalink',
    //     pageDescription: 'Einfache Persistierung mit einem Permalink'
    // },
    {
        filename: 'persistence.html',
        title: 'Persistierung',
        indexDescription: 'Persistierung für die Karteninhalte',
        pageDescription: 'Persistierung für die Karteninhalte'
    },
    {
        filename: 'print.html',
        title: 'Druckfunktion',
        indexDescription: 'Karte mit Druckfunktion',
        pageDescription: 'Karte mit Druckfunktion'
    },
    {
        filename: 'scalebar.html',
        title: 'Maßstabsanzeige',
        indexDescription: 'Maßstabsanzeige-Control',
        pageDescription: 'Maßstabsanzeige-Control'
    },
    {
        filename: 'zoom.html',
        title: 'Zoom',
        indexDescription: 'Zoom-Control mit Navigationshistorie und Gesamtausdehnung',
        pageDescription: 'Zoom-Control mit Navigationshistorie und Gesamtausdehnung'
    },
    {
        filename: 'search-coordinates.html',
        title: 'Koordinaten suchen',
        indexDescription: 'Koordinaten suchen und Kartenansicht auf diese Position zentrieren',
        pageDescription: 'Koordinaten suchen und Kartenansicht auf diese Position zentrieren'
    },
    {
        filename: 'show-coordinates.html',
        title: 'Koordinatenanzeige',
        indexDescription: 'Koordinatenanzeige-Control',
        pageDescription: 'Koordinatenanzeige-Control'
    },
    {
        filename: 'copy-coordinates.html',
        title: 'Koordinaten kopieren',
        indexDescription: 'Koordinaten in die Zwischenablage kopieren',
        pageDescription: 'Koordinaten in die Zwischenablage kopieren'
    },
    {
        filename: 'static-links.html',
        title: 'Links',
        indexDescription: 'Statische Links hinzufügen',
        pageDescription: 'Statische Links hinzufügen'
    },
    {
        filename: 'static-windows.html',
        title: 'Fenster',
        indexDescription: 'Fenster hinzufügen',
        pageDescription: 'Fenster hinzufügen'
    },
    {
        filename: 'vector-style.html',
        title: 'Vector Style',
        indexDescription: 'Symbolisierung für Vector-Layer definieren',
        pageDescription: 'Symbolisierung für Vector-Layer definieren'
    },
    {
        filename: 'custom-div.html',
        title: 'Custom DIV',
        indexDescription: 'Externes DIV für Controls verwenden',
        pageDescription: 'Externes DIV für Controls verwenden'
    },
    {
        filename: 'custom-layers.html',
        title: 'Layer hinzuladen',
        indexDescription: 'Geodatendienste und Geodaten hinzuladen',
        pageDescription: 'Geodatendienste und Geodaten hinzuladen'
    },
    {
        filename: 'edit.html',
        title: 'Layer editieren',
        indexDescription: 'Editierfunktion für Vektordaten',
        pageDescription: 'Editierfunktion für Vektordaten'
    },
    {
        filename: 'geosearch-gdz-ortssuche.html',
        title: 'Ortssuche (gdz-ortssuche)',
        indexDescription: 'Ortssuche. Für dieses Beispiel wird das Protokoll "gdz-ortssuche" verwendet.',
        pageDescription: 'Ortssuche. Für dieses Beispiel wird das Protokoll "gdz-ortssuche" verwendet.'
    },
    {
        filename: 'geosearch-wfs.html',
        title: 'Ortssuche (WFS)',
        indexDescription: 'Ortssuche. Für dieses Beispiel wird ein WFS-Dienst verwendet.',
        pageDescription: 'Ortssuche. Für dieses Beispiel wird ein WFS-Dienst verwendet.'
    },
    {
        filename: 'overviewmap.html',
        title: 'Übersichtskarte',
        indexDescription: 'Beispiel mit einer Übersichtskarte.',
        pageDescription: 'Beispiel mit einer Übersichtskarte.'
    },
    {
        filename: 'timeslider.html',
        title: 'Timeslider',
        indexDescription: 'Beispiel mit einem Timeslider für WMS mit Zeitkomponente (WMS-T).',
        pageDescription: 'Beispiel mit einem Timeslider für WMS mit Zeitkomponente (WMS-T).'
    }
];

var examplesDiv = document.getElementById('bkgwebmap-examples-main');

if (window.location.hash !== '') {
    var pageName = window.location.hash;
    examplesDiv.appendChild(findExamplePage(pageName));
} else {
    examplesDiv.appendChild(createLinks());
}

// Create menu with example links
function createLinks() {
    var link;
    var span1;
    var br;
    var span2;
    var url;

    var listDiv = document.createElement('div');
    listDiv.id = 'bkgwebmap-examples-list';

    // sort links alphabetically by title
    linksList = linksList.sort(function(a,b) {return a.title.localeCompare(b.title);});

    for (var i = 0; i < linksList.length; i++) {
        url = window.location + '#' + linksList[i].filename;

        link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('target', '_blank');

        span1 = document.createElement('span');
        span1.className = 'bkgwebmap-examples-title';
        span1.innerText = linksList[i].title;

        br = document.createElement('br');

        span2 = document.createElement('span');
        span2.className = 'bkgwebmap-examples-content';
        span2.innerText = linksList[i].indexDescription;

        link.appendChild(span1);
        link.appendChild(br);
        link.appendChild(span2);

        listDiv.appendChild(link);
    }
    return listDiv;
}

// Create template for examples
function createExamplePage(page) {
    var url = examplesPath + page.filename;

    var container = document.createElement('div');

    var title = document.createElement('div');
    title.id = 'bkgwebmap-examples-title';
    var titleText = document.createElement('h3');
    titleText.innerText = 'geo.okapi - ' + page.title;
    title.appendChild(titleText);

    var iframe = document.createElement('iframe');
    iframe.id = 'bkgwebmap-examples-iframe';
    iframe.setAttribute('src', url);
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('height', '400');

    var description = document.createElement('div');
    description.id = 'bkgwebmap-examples-description';
    description.innerText = page.pageDescription;

    var code = document.createElement('div');
    code.id = 'bkgwebmap-examples-code';
    var pre = document.createElement('pre');
    pre.setAttribute('data-src', url);
    pre.className = 'line-numbers';
    // pre.style.whiteSpace = 'pre-wrap';
    pre.style['white-space'] = 'pre-wrap';
    code.appendChild(pre);

    container.appendChild(title);
    container.appendChild(iframe);
    container.appendChild(description);
    container.appendChild(code);
    return container;
}

// Find if we need to load index or an example
function findExamplePage(pageName) {
    var pageFound = false;
    var page;
    for (var i = 0; i < linksList.length; i++) {
        if (pageName === '#' + linksList[i].filename) {
            pageFound = true;
            page = linksList[i];
        }
    }

    if (pageFound) {
        return createExamplePage(page);
    } else {
        return createLinks();
    }
}
