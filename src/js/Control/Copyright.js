/**
 * Create Copyright Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_copyright}
 */
BKGWebMap.Control.createCopyright = function () {
    return function (map, controlName, options, panel, standardPositionControls) {
        var _this = this;
        var mapDivId = map.getTarget();
        var copyrightIsOpen = false;

        // Check if control should be created
        if (options.active === false) {
            return undefined;
        }

        // Find div ID for control
        var target;
        if (options.div && options.div !== '') {
            target = options.div;
        }
        var position;
        var cssPosition = false;

        if (typeof options.onlyFullScreen === 'boolean' && options.onlyFullScreen === true) {
            this.onlyFullScreen = true;
        }

        if (target === undefined) {
            if (typeof options.position === 'string' && BKGWebMap.STANDARD_POSITION.indexOf(options.position) !== -1) {
                position = options.position;
            } else if (typeof options.position === 'string' && options.position.match(/top|left|bottom|right/)) {
                cssPosition = true;
                position = BKGWebMap.Util.cssParser(options.position);
            } else {
                position = BKGWebMap.CONTROLS.tools.copyright.position;
            }
        }

        var onlyFullScreenClass = '';
        if (this.onlyFullScreen) {
            onlyFullScreenClass = ' bkgwebmap-onlyfullscreen ';
        }

        var copyright = document.createElement('div');
        copyright.className = 'bkgwebmap-copyright ol-unselectable ol-control' + onlyFullScreenClass;

        var tooltipExtraClass = ' bkgwebmap-tooltipinmaptext';
        if (position !== undefined) {
            if (!cssPosition && standardPositionControls[position]) {
                var targetClass = standardPositionControls[position].getClass();
                target = document.getElementById(mapDivId).getElementsByClassName(targetClass)[0];
                var rightLeft = position.split('-')[1];
                copyright.classList.add('bkgwebmap-standardpositioncontrol', 'bkgwebmap-standardpositioncontrol' + rightLeft);
                if (rightLeft === 'right') {
                    tooltipExtraClass = ' bkgwebmap-tooltipcopyrightright';
                }
            } else if (cssPosition) {
                for (var prop in position) {
                    copyright.style[prop] = position[prop];
                }
            } else {
                return undefined;
            }
        }

        // Custom class
        var customClass = '';
        if (options.style && options.style !== '') {
            customClass = options.style;
            copyright.classList.add(customClass);
        }

        var maxWidth = BKGWebMap.CONTROLS.tools.copyright.maxWidth;
        if (options.maxWidth && options.maxWidth !== '') {
            maxWidth = options.maxWidth;
            if (maxWidth.indexOf('px') === -1) {
                maxWidth += 'px';
            }
        }

        var maxHeight = BKGWebMap.CONTROLS.tools.copyright.maxHeight;
        if (options.maxHeight && options.maxHeight !== '') {
            maxHeight = options.maxHeight;
            if (maxHeight.indexOf('px') === -1) {
                maxHeight += 'px';
            }
        }

        var copyrightButton = document.createElement('button');
        copyrightButton.className = 'bkgwebmap-mapbutton bkgwebmap-copyrightbutton bkgwebmap-paneltooltip';

        // Parse icons
        var parser = new DOMParser();
        var iconCopyright = parser.parseFromString(BKGWebMap.PANEL_ICONS.COPYRIGHT, 'text/xml');
        copyrightButton.appendChild(iconCopyright.documentElement);

        var copyrightTooltip = document.createElement('span');
        copyrightTooltip.className = 'bkgwebmap-paneltooltiptext bkgwebmap-tooltipcopyright' + tooltipExtraClass;
        copyrightTooltip.innerHTML = 'Copyright';
        copyrightButton.appendChild(copyrightTooltip);

        var copyrightList = document.createElement('ul');
        copyrightList.className = 'bkgwebmap-copyrightlist bkgwebmap-selectable';
        copyrightList.style.display = 'none';
        copyrightList.style.position = 'absolute';

        // Compute optimal size for copyright
        function adjustCopyrightSize() {
            var controlsTopLeft = document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-position-top-left')[0];
            var controlsTopRight = document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-position-top-right')[0];
            var controlsBottomLeft = document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-position-bottom-left')[0];
            var controlsBottomRight = document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-position-bottom-right')[0];

            var heightOfTopControls;
            if (controlsTopLeft.getBoundingClientRect().height > controlsTopRight.getBoundingClientRect().height) {
                heightOfTopControls = controlsTopLeft.getBoundingClientRect().height;
            } else {
                heightOfTopControls = controlsTopRight.getBoundingClientRect().height;
            }
            var heightOfBottomControls;
            if (controlsBottomLeft.getBoundingClientRect().height > controlsBottomRight.getBoundingClientRect().height) {
                heightOfBottomControls = controlsBottomLeft.getBoundingClientRect().height;
            } else {
                heightOfBottomControls = controlsBottomRight.getBoundingClientRect().height;
            }
            var offset = controlsTopLeft.offsetTop;

            var mapHeight = document.getElementById(mapDivId).offsetHeight;
            var newCopyrightHeight = mapHeight - (heightOfTopControls + heightOfBottomControls + (offset * 2) + 10);
            var mapDivWidth = document.getElementById(mapDivId).offsetWidth;
            var copyrightListWidth;
            if (mapDivWidth < 350) {
                copyrightListWidth = mapDivWidth - 80;
            } else {
                copyrightListWidth = mapDivWidth / 2;
            }
            copyrightList.style.width = copyrightListWidth + 'px';
            copyrightList.style.maxHeight = newCopyrightHeight + 'px';
            copyrightList.style.maxWidth = maxWidth;
            if (position === 'bottom-right' || position === 'bottom-left') {
                copyrightList.style.bottom = '100%';
            }
            if (position === 'bottom-right' || position === 'top-right') {
                copyrightList.style.right = '0';
            }
            if (cssPosition) {
                adjustCopyrightList(position, mapDivWidth, mapHeight);
            }
        }

        function adjustCopyrightList(position, mapWidth, mapHeight) {
            if (Object.prototype.hasOwnProperty.call(position, 'top')) {
                copyrightList.style.bottom = parseInt(position.top, 10) > mapHeight / 2 ? '100%' : 'auto';
            } else if (Object.prototype.hasOwnProperty.call(position, 'bottom')) {
                copyrightList.style.bottom = parseInt(position.bottom, 10) > mapHeight / 2 ? 'auto' : '100%';
            }
            if (Object.prototype.hasOwnProperty.call(position, 'left')) {
                copyrightList.style.right = parseInt(position.left, 10) > mapWidth / 2 ? '0' : 'auto';
            } else if (Object.prototype.hasOwnProperty.call(position, 'right')) {
                copyrightList.style.right = parseInt(position.right, 10) > mapWidth / 2 ? 'auto' : '0';
            }
        }

        setTimeout(adjustCopyrightSize, 1000);
        map.on('change:size', adjustCopyrightSize);

        copyright.appendChild(copyrightButton);
        copyright.appendChild(copyrightList);

        copyrightButton.addEventListener('click', function () {
            if (!copyrightList.children.length) {
                copyrightButton.style.position = '';
                copyrightList.style.display = 'none';
            } else if (copyrightList.style.display === 'none') {
                copyrightList.style.display = 'inline-block';
                copyrightIsOpen = true;
            } else {
                copyrightButton.style.position = '';
                copyrightList.style.display = 'none';
                copyrightIsOpen = false;
            }
        }, { passive: true });

        this.addLayerInCopyright = function (layer) {
            if (layer instanceof ol.layer.Group) {
                layer.getLayers().forEach(function (sublayer) {
                    _this.addLayerInCopyright(sublayer);
                });
                layer.on('change:visible', function () {
                    addCopyright(map);
                });
            } else {
                var copyrightInfo = layer.get('copyright');
                if (copyrightInfo) {
                    addCopyright(map);
                    layer.on('change:visible', function () {
                        addCopyright(map);
                    });
                }
            }
        };

        this.removeLayerFromCopyright = function () {
            addCopyright(map);
        };

        function addCopyright(map) {
            var arrayCopyright = [];
            copyrightList.innerHTML = '';
            map.getLayers().forEach(function (layer) {
                if (layer instanceof ol.layer.Group) {
                    if (layer.getVisible()) {
                        layer.getLayers().forEach(function (groupLayer) {
                            var visible = groupLayer.getVisible();
                            var copyrightInfo = groupLayer.get('copyright');
                            if (visible && copyrightInfo && arrayCopyright.indexOf(copyrightInfo) === -1) {
                                arrayCopyright.push(copyrightInfo);
                            }
                        });
                    }
                } else {
                    var visible = layer.getVisible();
                    var copyrightInfo = layer.get('copyright');
                    if (visible && copyrightInfo && arrayCopyright.indexOf(copyrightInfo) === -1) {
                        arrayCopyright.push(copyrightInfo);
                    }
                }
            });
            for (var i = 0; i < arrayCopyright.length; i++) {
                var li = document.createElement('li');
                li.className = 'bkgwebmap-copyrightlistitem';
                li.innerHTML = arrayCopyright[i];
                copyrightList.appendChild(li);
            }
            var copyrightLength = copyrightList.innerText.length;
            if (!copyrightLength) {
                copyrightButton.style.position = '';
                copyrightList.style.display = 'none';
            } else if (copyrightIsOpen) {
                copyrightList.style.display = 'inline-block';
                copyrightIsOpen = true;
            } else {
                copyrightButton.style.position = '';
                copyrightList.style.display = 'none';
                copyrightIsOpen = false;
            }
        }

        copyrightButton.addEventListener('mouseenter', function () {
            var allTooltips = document.getElementsByClassName('bkgwebmap-paneltooltiptext');
            for (var i = 0; i < allTooltips.length; i++) {
                allTooltips[i].style.visibility = '';
            }
            copyrightTooltip.style.visibility = 'visible';
            setTimeout(function () {
                copyrightTooltip.style.visibility = '';
            }, 1200);
        }, false);

        // Finalize control
        ol.control.Control.call(this, {
            element: copyright,
            target: target
        });
    };
};
