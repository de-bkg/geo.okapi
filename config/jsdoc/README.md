# Geo.OKAPI

Geo.OKAPI is a JavaScript library that encapsulates features for creating interactive maps. It is based on OpenLayers 
and adds some useful features to this library. Geo.OKAPI is open source and it is published under the MIT License.

## Create a simple map
```javascript
var map = new okapi.MapBuilder()
  .setTarget('mapDiv') // ID of map div
        .setLayers({
            baseLayers: [
                {
                    type: 'BKG',
                    name: 'WebAtlasDE',
                    ref: 'webatlasde_light'
                }
            ]
        }) // Use layer VG2500
  .create(); // Create map
```

**NOTE:** The Geo.OKAPI version with all libraries bundled uses a custom version of OpenLayers with only the necessary 
classes included. If you would like to use more OpenLayers classes in your code, you should do the following:

1. Find OpenLayer Version used in Geo.OKAPI:
	- Add Geo.OKAPI with all libraries included in a HTML file.
	- Open file with browser and start the console.
	- Type: *okapi.OPENLAYERS_VERSION*
2. Download the same version of OpenLayers: https://github.com/openlayers/openlayers/releases/
3. At your website use a Geo.OKAPI version without any libraries and add OpenLayers before Geo.OKAPI.
4. Add also the following libraries before Geo.OKAPI:
	- Proj4js 2.5.0 (https://github.com/proj4js/proj4js/releases/tag/2.5.0)
	- FileSaver 1.3.8 (https://github.com/eligrey/FileSaver.js/releases/tag/1.3.8)
	- SheetJS js-xlsx 0.12.13 (https://github.com/SheetJS/js-xlsx/releases/tag/v0.12.13)