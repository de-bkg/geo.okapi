/**
 * Create FullScreen Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_fullScreen}
 */
BKGWebMap.Control.createFullScreen = function () {
    return function (map, controlName, options, panel, standardPositionControls) {
        var mapDivId = map.getTarget();
        // Check if control should be created
        if (options.active === false) {
            this.inactive = true;
            return this;
        }

        // Find div ID for control
        var target;
        if (options.div && options.div !== '') {
            target = options.div;
        }
        var position;
        var cssPosition = false;

        if (target === undefined) {
            if (typeof options.position === 'string' && BKGWebMap.STANDARD_POSITION.indexOf(options.position) !== -1) {
                position = options.position;
            } else if (typeof options.position === 'string' && options.position.match(/top|left|bottom|right/)) {
                cssPosition = true;
                position = BKGWebMap.Util.cssParser(options.position);
            } else {
                position = BKGWebMap.CONTROLS.tools.fullScreen.position;
            }
        }


        var standardPositionClass = '';
        if (position !== undefined) {
            if (standardPositionControls[position]) {
                var targetClass = standardPositionControls[position].getClass();
                target = document.getElementById(mapDivId).getElementsByClassName(targetClass)[0];
                var rightLeft = position.split('-')[1];
                standardPositionClass = ' bkgwebmap-standardpositioncontrol bkgwebmap-standardpositioncontrol' + rightLeft;
            } else if (cssPosition) {
                target = document.createElement('div');
                target.className = 'customFullscreen';
                target.style.position = 'absolute';
                document.getElementsByClassName('ol-overlaycontainer-stopevent')[0].appendChild(target);
                for (var prop in position) {
                    target.style[prop] = position[prop];
                }
            } else {
                this.inactive = true;
                return this;
            }
        }

        // Custom class
        var customClass = ' ';
        if (options.style && options.style !== '') {
            customClass = ' ' + options.style;
        }

        // Add class to map div
        map.getTargetElement().classList.add('bkgwebmap-fullscreen');

        // Parse icons
        var parser = new DOMParser();
        var iconMaximize = parser.parseFromString(BKGWebMap.PANEL_ICONS.MAXIMIZE, 'text/xml');
        iconMaximize = iconMaximize.documentElement;
        var iconMinimize = parser.parseFromString(BKGWebMap.PANEL_ICONS.MINIMIZE, 'text/xml');
        iconMinimize = iconMinimize.documentElement;

        // Tools avaibale only in full screen mode
        function fullScreenFunctions(isFullScreen) {
            var onlyFullScreenControls = [
                {
                    name: 'Zoom',
                    class: 'bkgwebmap-zoom'
                },
                {
                    name: 'Scalebar',
                    class: 'bkgwebmap-scalebar'
                },
                {
                    name: 'Copyright',
                    class: 'bkgwebmap-copyright'
                },
                {
                    name: 'OverviewMap',
                    class: 'bkgwebmap-overviewmap'
                },
                {
                    name: 'StaticLinks',
                    class: 'bkgwebmap-staticlinks'
                },
                {
                    name: 'StaticWindows',
                    class: 'bkgwebmap-staticwindows'
                }
            ];
            map.getControls().forEach(function (control) {
                for (var i = 0; i < onlyFullScreenControls.length; i++) {
                    if ((onlyFullScreenControls[i].name === 'StaticLinks' && control.controlName === 'StaticLinks') || (onlyFullScreenControls[i].name === 'StaticWindows' && control.controlName === 'StaticWindows')) {
                        if (control.onlyFullScreen) {
                            if (isFullScreen) {
                                if (control.getControlTarget()) {
                                    control.getControlTarget().classList.remove('bkgwebmap-onlyfullscreen');
                                }
                            } else if (control.getControlTarget()) {
                                control.getControlTarget().classList.add('bkgwebmap-onlyfullscreen');
                            }
                        }
                    } else if (BKGWebMap.Control[onlyFullScreenControls[i].name] && control instanceof BKGWebMap.Control[onlyFullScreenControls[i].name] && control.onlyFullScreen) {
                        if (isFullScreen) {
                            // Refresh overview map
                            var overviewMapCollapse = false;
                            var overviewMapCollapsible = false;
                            if (BKGWebMap.Control.OverviewMap && control instanceof BKGWebMap.Control.OverviewMap && control.om) {
                                if (!control.om.getCollapsible()) {
                                    control.om.setCollapsible(true);
                                    overviewMapCollapsible = true;
                                }
                                if (!control.om.getCollapsed()) {
                                    control.om.setCollapsed(true);
                                    overviewMapCollapse = true;
                                }
                            }

                            if (document.getElementById(mapDivId).getElementsByClassName(onlyFullScreenControls[i].class).length) {
                                document.getElementById(mapDivId).getElementsByClassName(onlyFullScreenControls[i].class)[0].classList.remove('bkgwebmap-onlyfullscreen');
                            }

                            // Refresh overview map
                            if (BKGWebMap.Control.OverviewMap && control instanceof BKGWebMap.Control.OverviewMap && control.om && overviewMapCollapse) {
                                setTimeout(function () {
                                    control.om.setCollapsed(false);
                                    if (overviewMapCollapsible) {
                                        control.om.setCollapsible(false);
                                    }
                                }, 100);
                            }
                        } else if (document.getElementById(mapDivId).getElementsByClassName(onlyFullScreenControls[i].class).length) {
                            document.getElementById(mapDivId).getElementsByClassName(onlyFullScreenControls[i].class)[0].classList.add('bkgwebmap-onlyfullscreen');
                        }
                    }
                }
            });
        }

        this.fullScreenListener = function () {
            document.addEventListener('webkitfullscreenchange', function () {
                if (document.webkitIsFullScreen) {
                    fullScreenFunctions(true);
                } else {
                    fullScreenFunctions(false);
                }
            });
            document.addEventListener('mozfullscreenchange', function () {
                if (document.mozFullScreen) {
                    fullScreenFunctions(true);
                } else {
                    fullScreenFunctions(false);
                }
            });
            document.addEventListener('fullscreenchange', function () {
                if (document.fullscreen) {
                    fullScreenFunctions(true);
                } else {
                    fullScreenFunctions(false);
                }
            });
            document.addEventListener('MSFullscreenChange', function () {
                if (document.msFullscreenElement) {
                    fullScreenFunctions(true);
                } else {
                    fullScreenFunctions(false);
                }
            });
        };

        // Finalize control
        ol.control.FullScreen.call(this, {
            className: 'bkgwebmap-mapbutton' + customClass + standardPositionClass + ' ',
            target: target,
            label: iconMaximize,
            labelActive: iconMinimize,
            tipLabel: 'Vollbildmodus umschalten'
        });
    };
};
