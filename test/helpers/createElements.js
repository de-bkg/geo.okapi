function createDomMap() {
    document.getElementsByTagName('body')[0].innerHTML = '<div id="map"></div>';
}

function createDomDivInBody(id) {
    var div = document.createElement('div');
    div.id = id;
    document.getElementsByTagName('body')[0].appendChild(div);
}

function getMapNoControls() {
    return new BKGWebMap.MapBuilder()
        .setTarget('map')
        .setControls({
            tools: {}
        })
        .create()
        .getMap();
}

function getMapNoControlsView4326() {
    return new BKGWebMap.MapBuilder()
        .setTarget('map')
        .setControls({
            tools: {}
        })
        .setView({
            projection: 'EPSG:4326'
        })
        .create()
        .getMap();
}

function createMap(controlName, options, layers, callback) {
    var tool = {};
    if (controlName && options) {
        tool[controlName] = options;
    }
    new BKGWebMap.MapBuilder()
        .setLayers(layers || { baseLayers: [{ type: 'NONE' }], overlays: [] })
        .setControls({ tools: tool })
        .create(function (map) {
            callback(map);
        });
}

function createMapWithSecurityParams(controlName, options, layers, callback) {
    var tool = {};
    if (controlName && options) {
        tool[controlName] = options;
    }
    new BKGWebMap.MapBuilder()
        .setLayers(layers || { baseLayers: [{ type: 'NONE' }], overlays: [] })
        .setControls({ tools: tool })
        .setSecurity({
            cookieCheck: true,
            UUID: 'c9ebe5b6-9dd6-3a43-5310-76aa2cfa13d6',
            appID: '4cc455dc-a595-bbcf-0d00-c1d81caab5c3',
            appDomain: 'sg.geodatenzentrum.de'
        })
        .create(function (map) {
            callback(map);
        });
}

function createMapView(controlName, options, layers, callback) {
    var tool = {};
    if (controlName && options) {
        tool[controlName] = options;
    }
    new BKGWebMap.MapBuilder()
        .setLayers(layers || { baseLayers: [{ type: 'NONE' }], overlays: [] })
        .setView({
            center: {
                lon: 0,
                lat: 0
            },
            projection: 'EPSG:4326',
            zoom: 4
        })
        .setControls({ tools: tool })
        .create(function (map) {
            callback(map);
        });
}
