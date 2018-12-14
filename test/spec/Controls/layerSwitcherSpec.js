describe('A suite for layerSwitcher control', function () {
    var options;
    var layers;
    var controlName = 'layerSwitcher';
    var cssClass = 'bkgwebmap-layerswitcher';
    var standardPosition = 'panel';
    var countLayersMap = 0;
    var countLayersPanel = 0;
    var invisibleLayersBefore = 0;
    var invisibleGroupLayersBefore = 0;
    var invisibleLayersAfter = 0;
    var invisibleGroupLayersAfter = 0;
    var idCustom = '2';
    var opacity;
    var layerSwitcher;
    var srcBefore = '';
    var srcAfter = '';
    var nameFound = false;
    var layerName;
    var selectedOption;
    var layerStyle;
    var layerVisibility;
    var layerId;
    var styleColorBefore;
    var styleColorAfter;
    var stylesBefore;
    var stylesAfter;
    var urlBefore;
    var urlAfter;


    beforeEach(function () {
        // Create DOM
        createDomMap();
    });

    it('adds a layerSwitcher control inside panel', function (done) {
        options = {
            active: true,
            editStyle: false,
            changeVisibility: false,
            showWMSLayers: false,
            changeOrder: false,
            openLevel: 1
        };

        createMap(controlName, options, null, function (map) {
            layerSwitcher = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
            layerSwitcher.runTest();
            done();
        });
    });

    it('adds a layerSwitcher control outside panel', function (done) {
        // Create new control outside panel
        options = {
            active: true,
            div: 'layerSwitcherDiv',
            editStyle: false,
            changeVisibility: false,
            showWMSLayers: false,
            changeOrder: false,
            openLevel: 1
        };

        createDomDivInBody(options.div);
        createMap(controlName, options, null, function (map) {
            layerSwitcher = new ControlInCustomDiv(map, controlName, cssClass, options, standardPosition);
            layerSwitcher.runTest();
            done();
        });
    });

    it('list of all layers', function (done) {
        options = {
            active: true,
            editStyle: false,
            changeVisibility: false,
            showWMSLayers: false,
            changeOrder: false,
            openLevel: 1
        };

        layers = {
            baseLayers: [
                {
                    type: 'NONE'
                }
            ],
            overlays: [
                {
                    type: 'MARKER',
                    name: 'Marker Leipzig',
                    visibility: true,
                    srsName: 'EPSG:4326',
                    markers: [
                        {
                            coordinates: {
                                lat: 50.091176,
                                lon: 8.663281
                            },
                            content: '<h3>Zentrale Dienststelle in Frankfurt am Main</h3><p>Bundesamt für Kartographie und Geodäsie<br>Richard-Strauss-Allee 11<br>60598 Frankfurt am Main<br>Deutschland</p>'

                        },
                        {
                            coordinates: {
                                lat: 51.354210,
                                lon: 12.374295
                            },
                            content: '<h3>Außenstelle Leipzig</h3><p>Bundesamt für Kartographie und Geodäsie<br> - Außenstelle Leipzig -<br>Karl-Rothe-Straße 10-14<br>04105 Leipzig<br>Deutschland</p>'
                        }
                    ],
                    minResolution: 0.0001,
                    maxResolution: 156545,
                    edit: false
                }
            ]
        };

        createMap(controlName, options, layers, function (map) {
            // Count layers
            map.getLayers().forEach(function (layer) {
                if (layer instanceof ol.layer.Group) {
                    layer.getLayers().forEach(function () {
                        countLayersMap++;
                    });
                } else {
                    countLayersMap++;
                }
            });
            countLayersPanel = 2;
            expect(countLayersMap).toBe(countLayersPanel);
            done();
        });
    });

    it('test switch off layer visibility', function (done) {
        options = {
            active: true,
            editStyle: false,
            changeVisibility: true,
            showWMSLayers: false,
            changeOrder: false,
            openLevel: 1
        };

        layers = {
            baseLayers: [
                {
                    type: 'MARKER',
                    name: 'Marker Leipzig',
                    visibility: true,
                    srsName: 'EPSG:4326',
                    markers: [
                        {
                            coordinates: {
                                lat: 50.091176,
                                lon: 8.663281
                            },
                            content: '<h3>Zentrale Dienststelle in Frankfurt am Main</h3><p>Bundesamt für Kartographie und Geodäsie<br>Richard-Strauss-Allee 11<br>60598 Frankfurt am Main<br>Deutschland</p>'

                        },
                        {
                            coordinates: {
                                lat: 51.354210,
                                lon: 12.374295
                            },
                            content: '<h3>Außenstelle Leipzig</h3><p>Bundesamt für Kartographie und Geodäsie<br> - Außenstelle Leipzig -<br>Karl-Rothe-Straße 10-14<br>04105 Leipzig<br>Deutschland</p>'
                        }
                    ],
                    minResolution: 0.0001,
                    maxResolution: 156545,
                    edit: false
                }
            ],
            overlays: [
                {
                    type: 'MARKER',
                    name: 'Marker Leipzig',
                    visibility: true,
                    srsName: 'EPSG:4326',
                    markers: [
                        {
                            coordinates: {
                                lat: 50.091176,
                                lon: 8.663281
                            },
                            content: '<h3>Zentrale Dienststelle in Frankfurt am Main</h3><p>Bundesamt für Kartographie und Geodäsie<br>Richard-Strauss-Allee 11<br>60598 Frankfurt am Main<br>Deutschland</p>'

                        },
                        {
                            coordinates: {
                                lat: 51.354210,
                                lon: 12.374295
                            },
                            content: '<h3>Außenstelle Leipzig</h3><p>Bundesamt für Kartographie und Geodäsie<br> - Außenstelle Leipzig -<br>Karl-Rothe-Straße 10-14<br>04105 Leipzig<br>Deutschland</p>'
                        }
                    ],
                    minResolution: 0.0001,
                    maxResolution: 156545,
                    edit: false
                }
            ]
        };

        createMap(controlName, options, layers, function (map) {
            var invisibleLayersBefore = 0;
            map.getLayers().forEach(function (layer) {
                if (layer.getVisible() === false) {
                    invisibleLayersBefore++;
                }
            });
            expect(invisibleLayersBefore).toBe(0);
            var inputsChangeVisibility = document.getElementsByClassName('bkgwebmap-layerheaderinput');
            expect(inputsChangeVisibility.length).toBe(1);
            inputsChangeVisibility[0].click();
            invisibleLayersAfter = 0;
            map.getLayers().forEach(function (layer) {
                if (layer.getVisible() === false) {
                    invisibleLayersAfter++;
                }
            });
            expect(invisibleLayersAfter).toBe(1);
            done();
        });
    });
    it('test switch off grouplayer visibility', function (done) {
        options = {
            active: true,
            editStyle: false,
            changeVisibility: true,
            showWMSLayers: false,
            changeOrder: false,
            openLevel: 1
        };
        layers = {
            baseLayers: [
                {
                    type: 'MARKER',
                    name: 'Marker Leipzig',
                    visibility: true,
                    srsName: 'EPSG:4326',
                    markers: [
                        {
                            coordinates: {
                                lat: 50.091176,
                                lon: 8.663281
                            },
                            content: '<h3>Zentrale Dienststelle in Frankfurt am Main</h3><p>Bundesamt für Kartographie und Geodäsie<br>Richard-Strauss-Allee 11<br>60598 Frankfurt am Main<br>Deutschland</p>'

                        },
                        {
                            coordinates: {
                                lat: 51.354210,
                                lon: 12.374295
                            },
                            content: '<h3>Außenstelle Leipzig</h3><p>Bundesamt für Kartographie und Geodäsie<br> - Außenstelle Leipzig -<br>Karl-Rothe-Straße 10-14<br>04105 Leipzig<br>Deutschland</p>'
                        }
                    ],
                    minResolution: 0.0001,
                    maxResolution: 156545,
                    edit: false
                }
            ],
            overlays: [
                {
                    type: 'GROUP',
                    name: 'GROUP Layer',
                    layers: [
                        {
                            type: 'MARKER',
                            name: 'Marker Leipzig',
                            visibility: true,
                            srsName: 'EPSG:4326',
                            markers: [
                                {
                                    coordinates: {
                                        lat: 50.091176,
                                        lon: 8.663281
                                    },
                                    content: '<h3>Zentrale Dienststelle in Frankfurt am Main</h3><p>Bundesamt für Kartographie und Geodäsie<br>Richard-Strauss-Allee 11<br>60598 Frankfurt am Main<br>Deutschland</p>'

                                },
                                {
                                    coordinates: {
                                        lat: 51.354210,
                                        lon: 12.374295
                                    },
                                    content: '<h3>Außenstelle Leipzig</h3><p>Bundesamt für Kartographie und Geodäsie<br> - Außenstelle Leipzig -<br>Karl-Rothe-Straße 10-14<br>04105 Leipzig<br>Deutschland</p>'
                                }
                            ],
                            minResolution: 0.0001,
                            maxResolution: 156545,
                            edit: false
                        },
                        {
                            type: 'MARKER',
                            name: 'Marker Leipzig',
                            visibility: true,
                            srsName: 'EPSG:4326',
                            markers: [
                                {
                                    coordinates: {
                                        lat: 50.091176,
                                        lon: 8.663281
                                    },
                                    content: '<h3>Zentrale Dienststelle in Frankfurt am Main</h3><p>Bundesamt für Kartographie und Geodäsie<br>Richard-Strauss-Allee 11<br>60598 Frankfurt am Main<br>Deutschland</p>'

                                },
                                {
                                    coordinates: {
                                        lat: 51.354210,
                                        lon: 12.374295
                                    },
                                    content: '<h3>Außenstelle Leipzig</h3><p>Bundesamt für Kartographie und Geodäsie<br> - Außenstelle Leipzig -<br>Karl-Rothe-Straße 10-14<br>04105 Leipzig<br>Deutschland</p>'
                                }
                            ],
                            minResolution: 0.0001,
                            maxResolution: 156545,
                            edit: false
                        }
                    ]
                }
            ]
        };
        createMap(controlName, options, layers, function (map) {
            map.getLayers().forEach(function (layer) {
                if (layer instanceof ol.layer.Group) {
                    if (layer.getVisible() === false) {
                        invisibleGroupLayersBefore++;
                    }
                } else if (layer.getVisible() === false) {
                    invisibleLayersBefore++;
                }
            });
            expect(invisibleLayersBefore).toBe(0);
            expect(invisibleGroupLayersBefore).toBe(0);
            var inputsChangeGroupVisibility = document.getElementsByClassName('bkgwebmap-layerswitchergroupheader')[0].getElementsByClassName('bkgwebmap-layerheaderinput');
            expect(inputsChangeGroupVisibility.length).toBe(1);
            inputsChangeGroupVisibility[0].click();
            invisibleLayersAfter = 0;
            map.getLayers().forEach(function (layer) {
                if (layer instanceof ol.layer.Group) {
                    if (layer.getVisible() === false) {
                        invisibleGroupLayersAfter++;
                    }
                } else if (layer.getVisible() === false) {
                    invisibleLayersAfter++;
                }
            });
            expect(invisibleGroupLayersAfter).toBe(1);
            expect(invisibleLayersAfter).toBe(0);
            done();
        });
    });
    it('test min/max resolution', function (done) {
        options = {
            active: true,
            editStyle: false,
            changeVisibility: true,
            showWMSLayers: false,
            changeOrder: false,
            openLevel: 1
        };

        layers = {
            baseLayers: [
                {
                    type: 'MARKER',
                    name: 'Marker Leipzig',
                    visibility: true,
                    srsName: 'EPSG:4326',
                    markers: [
                        {
                            coordinates: {
                                lat: 50.091176,
                                lon: 8.663281
                            },
                            content: '<h3>Zentrale Dienststelle in Frankfurt am Main</h3><p>Bundesamt für Kartographie und Geodäsie<br>Richard-Strauss-Allee 11<br>60598 Frankfurt am Main<br>Deutschland</p>'

                        },
                        {
                            coordinates: {
                                lat: 51.354210,
                                lon: 12.374295
                            },
                            content: '<h3>Außenstelle Leipzig</h3><p>Bundesamt für Kartographie und Geodäsie<br> - Außenstelle Leipzig -<br>Karl-Rothe-Straße 10-14<br>04105 Leipzig<br>Deutschland</p>'
                        }
                    ],
                    minResolution: 10000,
                    maxResolution: 156545
                }
            ],
            overlays: []
        };
        createMap(controlName, options, layers, function (map) {
            var fontOpacityBefore = document.getElementsByClassName('bkgwebmap-baselayerdiv')[0].style.opacity;
            expect(fontOpacityBefore).toBe('0.5');
            map.getView().setResolution(10000);
            var fontOpacityAfter = document.getElementsByClassName('bkgwebmap-baselayerdiv')[0].style.opacity;
            expect(fontOpacityAfter).toBe('1');
            done();
        });
    });
    it('test unable edit styles', function (done) {
        options = {
            active: true,
            editStyle: false,
            changeVisibility: true,
            showWMSLayers: false,
            changeOrder: false,
            openLevel: 1
        };

        layers = {
            baseLayers: [
                {
                    type: 'NONE'
                }
            ],
            overlays: [
                {
                    type: 'MARKER',
                    name: 'Marker Leipzig',
                    visibility: true,
                    srsName: 'EPSG:4326',
                    markers: [
                        {
                            coordinates: {
                                lat: 50.091176,
                                lon: 8.663281
                            },
                            content: '<h3>Zentrale Dienststelle in Frankfurt am Main</h3><p>Bundesamt für Kartographie und Geodäsie<br>Richard-Strauss-Allee 11<br>60598 Frankfurt am Main<br>Deutschland</p>'

                        },
                        {
                            coordinates: {
                                lat: 51.354210,
                                lon: 12.374295
                            },
                            content: '<h3>Außenstelle Leipzig</h3><p>Bundesamt für Kartographie und Geodäsie<br> - Außenstelle Leipzig -<br>Karl-Rothe-Straße 10-14<br>04105 Leipzig<br>Deutschland</p>'
                        }
                    ],
                    minResolution: 0.0001,
                    maxResolution: 156545,
                    edit: false
                }
            ]
        };

        createMap(controlName, options, layers, function () {
            var layerId = document.getElementsByClassName('bkgwebmap-overlayscontent')[0].firstChild.id;
            document.getElementById(layerId).getElementsByClassName('bkgwebmap-layerheaderadjust')[0].click();
            var styleDiv = !!document.getElementById(layerId).getElementsByClassName('bkgwebmap-layercontentactive')[0].getElementsByClassName('bkgwebmap-changestylediv').length;
            expect(styleDiv).toBe(false);
            done();
        });
    });
    it('test enable edit styles', function (done) {
        options = {
            active: true,
            editStyle: true,
            changeVisibility: true,
            showWMSLayers: false,
            changeOrder: false,
            openLevel: 1
        };

        layers = {
            baseLayers: [
                {
                    type: 'NONE'
                }
            ],
            overlays: [
                {
                    type: 'MARKER',
                    name: 'Marker Leipzig',
                    visibility: true,
                    srsName: 'EPSG:4326',
                    markers: [
                        {
                            coordinates: {
                                lat: 50.091176,
                                lon: 8.663281
                            },
                            content: '<h3>Zentrale Dienststelle in Frankfurt am Main</h3><p>Bundesamt für Kartographie und Geodäsie<br>Richard-Strauss-Allee 11<br>60598 Frankfurt am Main<br>Deutschland</p>'

                        },
                        {
                            coordinates: {
                                lat: 51.354210,
                                lon: 12.374295
                            },
                            content: '<h3>Außenstelle Leipzig</h3><p>Bundesamt für Kartographie und Geodäsie<br> - Außenstelle Leipzig -<br>Karl-Rothe-Straße 10-14<br>04105 Leipzig<br>Deutschland</p>'
                        }
                    ],
                    minResolution: 0.0001,
                    maxResolution: 156545,
                    edit: false
                }
            ]
        };

        createMap(controlName, options, layers, function (map) {
            var layerId = document.getElementsByClassName('bkgwebmap-overlayscontent')[0].firstChild.id;
            document.getElementById(layerId).getElementsByClassName('bkgwebmap-layerheaderadjust')[0].click();
            var styleDiv = !!document.getElementById(layerId).getElementsByClassName('bkgwebmap-layercontentactive')[0].getElementsByClassName('bkgwebmap-changestylediv').length;
            expect(styleDiv).toBe(true);
            // change symbol
            var styleBefore;
            map.getLayers().forEach(function (layer) {
                if (layer instanceof ol.layer.Vector) {
                    styleBefore = layer.getStyle();
                }
            });
            document.getElementsByClassName('bkgwebmap-changestylesymbol')[0].querySelector('svg').dispatchEvent(new Event('click'));
            var styleAfterChangeSymbol;
            map.getLayers().forEach(function (layer) {
                if (layer instanceof ol.layer.Vector) {
                    styleAfterChangeSymbol = layer.getStyle();
                }
            });
            expect(styleBefore).not.toBe(styleAfterChangeSymbol);
            done();
        });
    });
    it('test edit styles', function (done) {
        options = {
            active: true,
            editStyle: true,
            changeVisibility: true,
            showWMSLayers: false,
            changeOrder: false,
            openLevel: 1
        };

        layers = {
            baseLayers: [
                {
                    type: 'NONE'
                }
            ],
            overlays: [
                {
                    type: 'MARKER',
                    name: 'Marker Leipzig',
                    visibility: true,
                    srsName: 'EPSG:4326',
                    markers: [
                        {
                            coordinates: {
                                lat: 50.091176,
                                lon: 8.663281
                            },
                            content: '<h3>Zentrale Dienststelle in Frankfurt am Main</h3><p>Bundesamt für Kartographie und Geodäsie<br>Richard-Strauss-Allee 11<br>60598 Frankfurt am Main<br>Deutschland</p>'

                        },
                        {
                            coordinates: {
                                lat: 51.354210,
                                lon: 12.374295
                            },
                            content: '<h3>Außenstelle Leipzig</h3><p>Bundesamt für Kartographie und Geodäsie<br> - Außenstelle Leipzig -<br>Karl-Rothe-Straße 10-14<br>04105 Leipzig<br>Deutschland</p>'
                        }
                    ],
                    minResolution: 0.0001,
                    maxResolution: 156545,
                    edit: false
                }
            ]
        };

        createMap(controlName, options, layers, function (map) {
            // change color
            document.getElementsByClassName('bkgwebmap-changestylecolorcheckbox')[0].querySelector('svg').dispatchEvent(new Event('click'));
            map.getLayers().forEach(function (layer) {
                if (layer instanceof ol.layer.Vector) {
                    styleColorBefore = layer.getStyle();
                }
            });
            document.getElementsByClassName('bkgwebmap-changestylecolorcheckbox')[1].querySelector('svg').dispatchEvent(new Event('click'));
            map.getLayers().forEach(function (layer) {
                if (layer instanceof ol.layer.Vector) {
                    styleColorAfter = layer.getStyle();
                }
            });
            expect(styleColorBefore).not.toBe(styleColorAfter);
            done();
        });
    });
    it('test opacity slider', function (done) {
        options = {
            active: true,
            editStyle: false,
            changeVisibility: true,
            showWMSLayers: false,
            changeOrder: false,
            openLevel: 1
        };

        layers = {
            baseLayers: [
                {
                    type: 'NONE'
                }
            ],
            overlays: [
                {
                    type: 'MARKER',
                    name: 'Marker Leipzig',
                    visibility: true,
                    srsName: 'EPSG:4326',
                    markers: [
                        {
                            coordinates: {
                                lat: 50.091176,
                                lon: 8.663281
                            },
                            content: '<h3>Zentrale Dienststelle in Frankfurt am Main</h3><p>Bundesamt für Kartographie und Geodäsie<br>Richard-Strauss-Allee 11<br>60598 Frankfurt am Main<br>Deutschland</p>'

                        },
                        {
                            coordinates: {
                                lat: 51.354210,
                                lon: 12.374295
                            },
                            content: '<h3>Außenstelle Leipzig</h3><p>Bundesamt für Kartographie und Geodäsie<br> - Außenstelle Leipzig -<br>Karl-Rothe-Straße 10-14<br>04105 Leipzig<br>Deutschland</p>'
                        }
                    ],
                    minResolution: 0.0001,
                    maxResolution: 156545,
                    edit: false
                }
            ]
        };

        createMap(controlName, options, layers, function (map) {
            map.getLayers().forEach(function (layer) {
                opacity = layer.getOpacity();
            });
            expect(opacity).toBe(1);
            var slider = document.getElementsByClassName('bkgwebmap-opacityslider')[0];
            slider.value = 0.5;
            var changeEvent = new Event('change');
            slider.dispatchEvent(changeEvent);
            map.getLayers().forEach(function (layer) {
                opacity = layer.getOpacity();
            });
            expect(opacity).toBe('0.5');
            done();
        });
    });
    it('test open level 1', function (done) {
        options = {
            active: true,
            editStyle: false,
            changeVisibility: true,
            showWMSLayers: false,
            changeOrder: false,
            openLevel: 1
        };

        layers = {
            baseLayers: [
                {
                    type: 'NONE'
                }
            ],
            overlays: [
                {
                    type: 'GROUP',
                    name: 'GROUP Layer',
                    layers: [
                        {
                            type: 'MARKER',
                            name: 'Marker Leipzig',
                            visibility: true,
                            srsName: 'EPSG:4326',
                            markers: [
                                {
                                    coordinates: {
                                        lat: 50.091176,
                                        lon: 8.663281
                                    },
                                    content: '<h3>Zentrale Dienststelle in Frankfurt am Main</h3><p>Bundesamt für Kartographie und Geodäsie<br>Richard-Strauss-Allee 11<br>60598 Frankfurt am Main<br>Deutschland</p>'

                                },
                                {
                                    coordinates: {
                                        lat: 51.354210,
                                        lon: 12.374295
                                    },
                                    content: '<h3>Außenstelle Leipzig</h3><p>Bundesamt für Kartographie und Geodäsie<br> - Außenstelle Leipzig -<br>Karl-Rothe-Straße 10-14<br>04105 Leipzig<br>Deutschland</p>'
                                }
                            ],
                            minResolution: 0.0001,
                            maxResolution: 156545,
                            edit: false
                        },
                        {
                            type: 'MARKER',
                            name: 'Marker Leipzig',
                            visibility: true,
                            srsName: 'EPSG:4326',
                            markers: [
                                {
                                    coordinates: {
                                        lat: 50.091176,
                                        lon: 8.663281
                                    },
                                    content: '<h3>Zentrale Dienststelle in Frankfurt am Main</h3><p>Bundesamt für Kartographie und Geodäsie<br>Richard-Strauss-Allee 11<br>60598 Frankfurt am Main<br>Deutschland</p>'

                                },
                                {
                                    coordinates: {
                                        lat: 51.354210,
                                        lon: 12.374295
                                    },
                                    content: '<h3>Außenstelle Leipzig</h3><p>Bundesamt für Kartographie und Geodäsie<br> - Außenstelle Leipzig -<br>Karl-Rothe-Straße 10-14<br>04105 Leipzig<br>Deutschland</p>'
                                }
                            ],
                            minResolution: 0.0001,
                            maxResolution: 156545,
                            edit: false
                        }
                    ]
                }
            ]
        };

        createMap(controlName, options, layers, function () {
            var idGroupLayer = document.getElementsByClassName('bkgwebmap-layerswitchergroupheader')[0].parentNode.id;
            var classActive = ' bkgwebmap-layercontentactive ';
            var groupLayerContent = document.getElementById(idGroupLayer).getElementsByClassName('bkgwebmap-layercontent')[0];
            var checkActive = (' ' + groupLayerContent.className + ' ').replace(/[\n\t]/g, ' ').indexOf(classActive) > -1;
            expect(checkActive).toBe(false);
            done();
        });
    });
    it('test open level 2', function (done) {
        options = {
            active: true,
            editStyle: false,
            changeVisibility: true,
            showWMSLayers: false,
            changeOrder: false,
            openLevel: 2
        };

        layers = {
            baseLayers: [
                {
                    type: 'NONE'
                }
            ],
            overlays: [
                {
                    type: 'GROUP',
                    name: 'GROUP Layer',
                    layers: [
                        {
                            type: 'MARKER',
                            name: 'Marker Leipzig',
                            visibility: true,
                            srsName: 'EPSG:4326',
                            markers: [
                                {
                                    coordinates: {
                                        lat: 50.091176,
                                        lon: 8.663281
                                    },
                                    content: '<h3>Zentrale Dienststelle in Frankfurt am Main</h3><p>Bundesamt für Kartographie und Geodäsie<br>Richard-Strauss-Allee 11<br>60598 Frankfurt am Main<br>Deutschland</p>'

                                },
                                {
                                    coordinates: {
                                        lat: 51.354210,
                                        lon: 12.374295
                                    },
                                    content: '<h3>Außenstelle Leipzig</h3><p>Bundesamt für Kartographie und Geodäsie<br> - Außenstelle Leipzig -<br>Karl-Rothe-Straße 10-14<br>04105 Leipzig<br>Deutschland</p>'
                                }
                            ],
                            minResolution: 0.0001,
                            maxResolution: 156545,
                            edit: false
                        },
                        {
                            type: 'MARKER',
                            name: 'Marker Leipzig',
                            visibility: true,
                            srsName: 'EPSG:4326',
                            markers: [
                                {
                                    coordinates: {
                                        lat: 50.091176,
                                        lon: 8.663281
                                    },
                                    content: '<h3>Zentrale Dienststelle in Frankfurt am Main</h3><p>Bundesamt für Kartographie und Geodäsie<br>Richard-Strauss-Allee 11<br>60598 Frankfurt am Main<br>Deutschland</p>'

                                },
                                {
                                    coordinates: {
                                        lat: 51.354210,
                                        lon: 12.374295
                                    },
                                    content: '<h3>Außenstelle Leipzig</h3><p>Bundesamt für Kartographie und Geodäsie<br> - Außenstelle Leipzig -<br>Karl-Rothe-Straße 10-14<br>04105 Leipzig<br>Deutschland</p>'
                                }
                            ],
                            minResolution: 0.0001,
                            maxResolution: 156545,
                            edit: false
                        }
                    ]
                }
            ]
        };

        createMap(controlName, options, layers, function () {
            var idGroupLayer = document.getElementsByClassName('bkgwebmap-layerswitchergroupheader')[0].parentNode.id;
            var classActive = ' bkgwebmap-layercontentactive ';
            var groupLayerContent = document.getElementById(idGroupLayer).getElementsByClassName('bkgwebmap-layercontent')[0];
            var checkActive = (' ' + groupLayerContent.className + ' ').replace(/[\n\t]/g, ' ').indexOf(classActive) > -1;
            expect(checkActive).toBe(true);
            done();
        });
    });
    it('test switch off wms-sublayer', function (done) {
        options = {
            active: true,
            editStyle: false,
            changeVisibility: false,
            showWMSLayers: true,
            changeOrder: false,
            openLevel: 1
        };

        layers = {
            baseLayers: [
                {
                    type: 'NONE'
                }
            ],
            overlays: [
                {
                    type: 'WMS',
                    name: 'Berlin',
                    // id: 'wmsBerlin',
                    tiles: true,
                    url: 'http://gismonster.com/geoserver/kurs/wms',
                    visibility: true,
                    srsName: 'EPSG:3857',
                    layers: [
                        {
                            id: '0',
                            name: 'Bundesländer',
                            layer: 'Bundeslaender',
                            selectStyle: true
                        },
                        {
                            id: '1',
                            name: 'Berliner Bezirke',
                            layer: 'berliner_bezirke',
                            style: 'grass',
                            visibility: true,
                            selectStyle: true,
                            legendUrl: ''
                        }
                    ]
                }
            ]
        };

        createMap(controlName, options, layers, function (map) {
            map.getLayers().forEach(function (layer) {
                if (layer instanceof BKGWebMap.Layer.ImageWMS || layer instanceof BKGWebMap.Layer.TileWMS) {
                    srcBefore = layer.getSource().getParams().LAYERS;
                    stylesBefore = layer.getSource().getParams().STYLES;
                    urlBefore = layer.getSource().getUrls()[0];
                }
            });
            document.getElementsByClassName('bkgwebmap-layerheaderwmsinputdiv')[0].firstChild.click();
            map.getLayers().forEach(function (layer) {
                if (layer instanceof BKGWebMap.Layer.ImageWMS || layer instanceof BKGWebMap.Layer.TileWMS) {
                    srcAfter = layer.getSource().getParams().LAYERS;
                    stylesAfter = layer.getSource().getParams().STYLES;
                    urlAfter = layer.getSource().getUrls()[0];
                }
            });
            expect(srcAfter).not.toBe(srcBefore);
            expect(stylesBefore).not.toBe(stylesAfter);
            expect(urlBefore).toBe(urlAfter);
            done();
        });
    });
    it('properties of wms-sublayer', function (done) {
        options = {
            active: true,
            editStyle: false,
            changeVisibility: false,
            showWMSLayers: true,
            changeOrder: false,
            openLevel: 1
        };

        layers = {
            baseLayers: [
                {
                    type: 'NONE'
                }
            ],
            overlays: [
                {
                    type: 'WMS',
                    name: 'Berlin',
                    // id: 'wmsBerlin',
                    tiles: true,
                    url: 'http://gismonster.com/geoserver/kurs/wms',
                    visibility: true,
                    srsName: 'EPSG:3857',
                    layers: [
                        {
                            id: '0',
                            name: 'Bundesländer',
                            layer: 'Bundeslaender',
                            selectStyle: true
                        },
                        {
                            id: idCustom,
                            name: 'Berliner Bezirke',
                            layer: 'berliner_bezirke',
                            style: 'grass',
                            visibility: true,
                            selectStyle: true,
                            legendUrl: ''
                        }
                    ]
                }
            ]
        };

        createMap(controlName, options, layers, function (map) {
            map.getLayers().forEach(function (layer) {
                if (layer instanceof BKGWebMap.Layer.ImageWMS || layer instanceof BKGWebMap.Layer.TileWMS) {
                    var subLayers = layer.getLayers().forEach(function (wmssublayer) {
                        if (wmssublayer.style && wmssublayer.name) {
                            layerName = wmssublayer.name;
                            layerStyle = wmssublayer.style;
                            layerVisibility = wmssublayer.visibility;
                            layerId = wmssublayer.id;
                        }
                    });
                }
            });
            var select = document.getElementsByTagName('select')[0];
            selectedOption = select.options[select.selectedIndex].value;
            var layersPanel = document.getElementsByClassName('bkgwebmap-layerheaderwmstitle');
            for (var i = 0; i < layersPanel.length; i++) {
                nameFound = layersPanel[i].textContent === layerName;
            }
            expect(nameFound).toBe(true);
            expect(selectedOption).toBe(layerStyle);
            expect(layerVisibility).toBe(true);
            expect(layerId).toBe(idCustom);
            done();
        });
    });
});
