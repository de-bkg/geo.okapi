# Online Karten API (geo.okapi)

<span style="color:#ff0000;">**repository currently under construction**</span>

**O**nline **K**arten **API** (geo.**okapi**) is a JavaScript library that encapsulates features for creating interactive maps. It is 
based on OpenLayers and adds some useful features to this library.

## Getting Started

To use geo.okapi you need the appropriate .js and .css files. Those files are created with the build process as 
described [here](doc/develop/01_Getting_Started.md) 

If you don't want to rebuild the project, you can follow the instructions given at the projects 
[release page](http://sgx.geodatenzentrum.de/geo.okapi/latest/download.html)  

A minimal map setup would be:
```html

<script src="geo.okapi.min.js"></script>
<link rel="stylesheet" href="geo.okapi.min.css">
<div id="map" style="width:500px;height:500px"></div>
<script>
new okapi.MapBuilder()
  .setTarget('map')
  .setView({ projection: 'EPSG:25832' }) 
  .setLayers({
      baseLayers: [{
        type: 'BKG',
        ref: 'topplus_open'
      }]
    })
  .setControls({
    tools: {
      copyright: {active: true},
      zoom: {active: true}
    }
  })
  .create();             
</script>
```

## Libraries overview

- Builds including external libraries (e.g. OpenLayers)
  - Uncompressed:<br>
*okapi.js*<br>
*okapi.css*
  - Compressed:<br>
*okapi.min.js*<br>
*okapi.min.css*

- Builds without any external libraries
  - Uncompressed:<br>
*okapi.no.libs.js*<br>
*okapi.no.libs.css*
  - Compressed:<br>
*okapi.no.libs.min.js*<br>
*okapi.no.libs.min.css*

### External Libraries
If you use the geo.okapi builds without external libraries, you need to include the following in your web site before 
including the geo.okapi JavaScript and CSS files:

- OpenLayers 4.6.5<br>
Links:<br>
https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v4.6.5/css/ol.css<br>
https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v4.6.5/build/ol.js<br>
Download:<br>
https://github.com/openlayers/openlayers/releases/tag/v4.6.5

- Proj4js 2.5.0<br>
Link:<br>
https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.5.0/proj4.js<br>
Download:<br>
https://github.com/proj4js/proj4js/releases/tag/2.5.0

- FileSaver 1.3.8<br>
Link:<br>
https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.12.13/xlsx.full.min.js<br>
Download:<br>
https://github.com/SheetJS/js-xlsx/releases/tag/v0.12.13

- SheetJS js-xlsx 0.12.13<br>
Link:<br>
https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js<br>
Download:<br>
https://github.com/eligrey/FileSaver.js/releases/tag/1.3.8

## Documentation

Further information, tutorials and the API documentation can be found at the 
[project website](http://sgx.geodatenzentrum.de/geo.okapi/latest/doc/)

Informations concerning development within this repository are located under [doc/develop](doc/develop)

### Quick links

* Current config schema: http://sgx.geodatenzentrum.de/geo.okapi/tools/schema/view/index.html?id=api_schema
* Current API documentation: http://sgx.geodatenzentrum.de/geo.okapi/latest/doc/js/
* Referenced OpenLayers version: https://openlayers.org/en/v4.6.5/doc/
