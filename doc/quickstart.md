# Quickstart

This guide shows you the minimal steps needed to put an interactive map with geo.okapi on a web page.

## Preparation

Start by including the necessary JS an CSS libraries into your web page:
```html
<script src="https:/sgx.geodatenzentrum.de/geo.okapi/latest/dist/geo.okapi.min.js"></script>
<link rel="stylesheet" href="https:/sgx.geodatenzentrum.de/geo.okapi/latest/dist/geo.okapi.min.css">
```

You'll need a html element in your web page where the map is placed. This is a `div` element wiht an unique id: 

```html
<div id="map" style="width:500px;height:500px"></div>
```

Of course you can use a central CSS definition as an alternative for inline styling (`style="..."`).

## Configure the map

Map configurations are performed with help of the class okapi.MapBuilder. If nothing is specified, a map with a standard
configuration is created. Additional adjustments may be performed for the layers (`setLayers(...)`), control elements
(`setControls(...)`), map view (`setView(...)`), vector symbols (`setStyles(...)`) and configuration for authentication
for secured services (`setSecurity(...)`). All available options can be viewed within the corresponding API 
documentation of the [MapBuilder class](http://sgx.geodatenzentrum.de/geo.okapi/latest/doc/js/BKGWebMap.MapBuilder.html).

As an alternative the MapBuilder can use a JSON config file to create a map. This can be done with help of the 
`loadConfig(...)` method. This reduces the amount of required JavaScript code lines. Further the configuration can be 
outsourced. A complete overview of the configuration schema can be found 
[here](http://sgx.geodatenzentrum.de/geo.okapi/tools/schema/view/index.html?id=api_schema).

Following example uses the configuration via JavaScript and creates a map with a TopPlusOpen basemap and marker layer
as overlay:
```javascript
  new okapi.MapBuilder()
    .setTarget('map')             
    .setView({
        projection: 'EPSG:25832'  
    })
    .setLayers({
        baseLayers: [
            {
                type: 'BKG',
                name: 'TopPlusOpen',
                ref: 'topplus_open',
                visibility: true
            }
        ],
        overlays: [
            {
                type: 'MARKER',
                name: 'BKG Dienststellen',
                visibility: true,
                srsName: 'EPSG:25832',
                markers: [
                    {
                        coordinates: { lon: 464216.0, lat: 5554721.0 },
                        content: 'Zentrale Dienststelle in Frankfurt am Main'
                    },
                    {
                        coordinates: { lon: 721979.0, lat: 5693986.0 },
                        content: 'Außenstelle Leipzig'
                    },
                    {
                        coordinates: { lon: 782883.35506, lat: 5450718.67392 },
                        content: 'Geodätisches Observatorium Wettzell'
                    }
                ]
            }
        ]
    })
    .setControls({
        tools: {
            copyright: {active: true},
            copyCoordinates: { active: true },
            showAttributes: {active: true},
            showCoordinates: {active: true},
            zoom: {active: true}
        }
    })
    .create();
```

## Further information

Additional examples can be found on the hosted [example pages](http://sgx.geodatenzentrum.de/geo.okapi/latest/examples/).
Further notes for the usage can be found at the hosted [documentation page](http://sgx.geodatenzentrum.de/geo.okapi/latest/doc/).