[Back to TOC](README.md)

# Developing Geo.OKAPI

## Required Software

You need **node.js** and **npm**: https://nodejs.org

For compilation of OpenLayer custom build additionally a JDK is required. Make sure the appropriate path is within PATH
environment variable.

## Create custom OpenLayers build

Geo.OKAPI uses a custom OpenLayers build with classes defined in file **config/ol/ol-custom.js**.<br/>
If you need to use an OpenLayers class not included in current custom build, then you should add this class in file 
ol-custom.js

```javascript
"exports": [
    "ol.Map",
    "ol.Map#*",
    "ol.layer.Image",
    "ol.layer.Image#getSource"
    ...
    ...
]
```

Add a class (e.g. "ol.layer.Image") and then explicit the methods you need (e.g. "ol.layer.Image#getSource").
With #* you add all methods of a specific class (e.g. "ol.layer.Image#*").

Create custom OpenLayers build:
```bash
npm run compile-ol
```

The above command creates file **ol-custom.js** in folder *build/libs/*

### Troubleshooting

If the compile command does not work check if
- correct JRE/JDK is installed
- within the PATH environment variable no collision with other JDKs/JREs exist. E.g. under Windows 
  `.*\Oracle\Java\javapath`


## Create Geo.OKAPI build

All source files should be in folder */src*. JavaScript in *src/js* and CSS in *src/css*.<br/>
Any new files created must be also defined in file **build.js**. Only then, they can be included in build.

```javascript
// JavaScript files of Geo.OKAPI
var jsFiles = [
    'src/js/BKGWebMap.js'
    ...
    ...
];

// CSS files of Geo.OKAPI
var cssFiles = [
    'src/css/app.css'
    ...
    ...
];
```

Create Geo.OKAPI build:

```bash
npm run build
```

The above command creates compressed/uncompressed versions of Geo.OKAPI including/not including libraries. All these 
files are located in folder *build/libs*.


## Documenting and Linting source code

During the build process, the JavaScript source code will be corrected and a documentation will be automatically 
generated *(build/docs/jsdoc)*. 

For the documentation a custom jsdoc template will be used *(config/jsdoc/template)*.

If you would like to change the first page of jsdoc (index.html) you should edit *config/jsdoc/README.md*

## Using examples

Application and code examples can be found within the directory examples. To use the examples the Geo.OKAPI libraries
has to be build. The [index](../../examples/index.html) can be used to list all examples. If you want to add a new 
example you have to edit examples/resources/default.js:  
```javascript
var linksList = [
    {
        filename: 'bkg-layer.html',
        title: 'BKG-Dienst',
        indexDescription: 'Beispiel einer Karte mit einem gebundenen BKG-Dienst',
        pageDescription: 'Beispiel einer Karte mit einem gebundenen BKG-Dienst'
    },
    // add more examples
];

```
[Back to TOC](README.md)