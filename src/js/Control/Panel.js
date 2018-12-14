/**
 * Create Panel Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_panel}
 */
BKGWebMap.Control.createPanel = function () {
    return function (map, panelPosition, initialize, standardPositionControls) {
        var _this = this;

        var mapDivId = map.getTarget();

        // Panel size
        var panelSize = 300;

        // Panel position
        var position = BKGWebMap.CONTROLS.panelPosition;
        if (panelPosition === 'left' || panelPosition === 'right') {
            position = panelPosition;
        }
        var arrowSvg = BKGWebMap.PANEL_ICONS.ARROW_LEFT;
        var panelContentWrapperLeft = '-' + panelSize + 'px';
        if (position === 'right') {
            arrowSvg = BKGWebMap.PANEL_ICONS.ARROW_RIGHT;
            panelContentWrapperLeft = '';
        }

        // Initialize open panel with specific control in it
        var initialControl = BKGWebMap.CONTROLS.initialize;
        if ((typeof initialize === 'string' || initialize instanceof String) && initialize !== '') {
            initialControl = initialize;
        }

        if (BKGWebMap.CONTROLS_IN_PANEL.indexOf(initialControl) === -1) {
            initialControl = null;
        }

        // Create DOM
        var panelBar = document.createElement('div');
        panelBar.className = 'bkgwebmap-panelbar';

        var title = document.createElement('span');
        title.className = 'bkgwebmap-paneltitletext';
        title.innerHTML = 'Title';

        var panelTitle = document.createElement('div');
        panelTitle.className = 'bkgwebmap-paneltitle';
        panelTitle.appendChild(title);

        var parser = new DOMParser();
        var arrow = parser.parseFromString(arrowSvg, 'text/xml');
        arrow.documentElement.setAttribute('class', 'bkgwebmap-panelicons');

        var panelTitleButton = document.createElement('div');
        panelTitleButton.className = 'bkgwebmap-paneltitlebutton';
        panelTitleButton.appendChild(arrow.documentElement);

        var panelTitleWrapper = document.createElement('div');
        panelTitleWrapper.className = 'bkgwebmap-paneltitlewrapper';

        if (position === 'right') {
            panelTitleWrapper.appendChild(panelTitleButton);
            panelTitleWrapper.appendChild(panelTitle);
        } else {
            panelTitleWrapper.appendChild(panelTitle);
            panelTitleWrapper.appendChild(panelTitleButton);
        }

        var panelContent = document.createElement('div');
        panelContent.className = 'bkgwebmap-panelcontent';
        if (position === 'left') {
            panelContent.style.marginLeft = '40px';
        } else {
            panelContent.style.marginRight = '40px';
        }
        panelContent.setAttribute('data-bkg-webmap-activecontent', '');

        var panelContentWrapper = document.createElement('div');
        panelContentWrapper.className = 'bkgwebmap-panelcontentwrapper';
        panelContentWrapper.style.width = panelSize + 'px';
        panelContentWrapper.style.left = panelContentWrapperLeft;
        panelContentWrapper.appendChild(panelTitleWrapper);
        panelContentWrapper.appendChild(panelContent);

        var panel = document.createElement('div');
        panel.className = 'bkgwebmap-panel ol-unselectable ol-control';

        var moveControls;
        var controlMarginSize = document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-position-top-left')[0].offsetTop;
        var moveControlsWidth = controlMarginSize + 40; // +40 for size of panelBar

        // disable transition at beginning
        if (document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-position-top-left').length) {
            document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-position-top-left')[0].style.transition = 'none';
        }
        if (document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-position-top-right').length) {
            document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-position-top-right')[0].style.transition = 'none';
        }
        if (document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-position-bottom-left').length) {
            document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-position-bottom-left')[0].style.transition = 'none';
        }
        if (document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-position-bottom-right').length) {
            document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-position-bottom-right')[0].style.transition = 'none';
        }

        if (position === 'left') {
            panel.style.left = '0';
            moveControls = {
                left: moveControlsWidth + 'px'
            };
            standardPositionControls['top-left'].changePosition(moveControls);
            standardPositionControls['bottom-left'].changePosition(moveControls);
        } else {
            panelBar.style.right = '0';
            panel.style.right = '0';
            panelContentWrapper.style.right = '-' + panelSize + 'px';
            moveControls = {
                right: moveControlsWidth + 'px'
            };
            standardPositionControls['top-right'].changePosition(moveControls);
            standardPositionControls['bottom-right'].changePosition(moveControls);
        }
        panel.appendChild(panelBar);
        panel.appendChild(panelContentWrapper);

        /**
         * Get panel position (left/right)
         * @returns {string}
         */
        this.getPanelPosition = function () {
            return position;
        };

        /**
         * Add new content to panel
         * @param {Element} newContent - Content that should be added to panel
         */
        this.addPanelContent = function (newContent) {
            panelContent.appendChild(newContent);
        };

        /**
         * Show different content in panel
         * @param {string} title - Content title
         * @param {string} contentClass - Content class
         * @param {boolean} geoSearch - Whether content is geoSearch control
         */
        this.changePanelContent = function (title, contentClass, geoSearch) {
            for (var i = 0; i < panelContent.childNodes.length; i++) {
                panelContent.childNodes[i].style.display = 'none';
            }

            // geoSearch has an input tag instead of a title
            if (geoSearch) {
                if (document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-paneltitle').length) {
                    document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-paneltitle')[0].style.display = 'none';
                }
                if (document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-geosearchformdiv').length) {
                    document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-geosearchformdiv')[0].style.display = 'table-cell';
                }
            } else {
                if (document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-geosearchformdiv').length) {
                    document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-geosearchformdiv')[0].style.display = 'none';
                }
                if (document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-paneltitle').length) {
                    document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-paneltitle')[0].style.display = 'table-cell';
                }
            }

            document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-paneltitletext')[0].innerHTML = title;
            document.getElementById(mapDivId).getElementsByClassName(contentClass)[0].style.display = 'block';
            panelContent.setAttribute('data-bkg-webmap-activecontent', contentClass);

            map.getControls().forEach(function (control) {
                if (BKGWebMap.Control.Edit && control instanceof BKGWebMap.Control.Edit) {
                    control.removeEditInteractions();
                    control.addAttributeListener();
                    if (contentClass === 'bkgwebmap-editpanelcontent') {
                        control.adaptLayerMenu();
                    }
                }
            });
            deactivateIcons();
        };

        /**
         * Get content that is currently shown
         * @returns {string}
         */
        this.getActiveContent = function () {
            var activeContent = panelContent.getAttribute('data-bkg-webmap-activecontent');
            return activeContent;
        };

        /**
         * Close panel
         */
        this.closePanel = function () {
            var panelContentWrapper = document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-panelcontentwrapper')[0];
            var panelBarWidth = document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-panelbar')[0].getBoundingClientRect().width;
            var controlsMargin = document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-position-top-left')[0].offsetTop;

            var moveControls;
            var moveControlsWidth;
            if (position === 'left') {
                panelContentWrapper.style.left = '-' + panelSize + 'px';
                if (panelContentWrapper.style.width === '100%') {
                    panelContentWrapper.style.width = panelSize + 'px';
                    // timeout for optical reasons with css transition
                    setTimeout(function () {
                        panel.style.backgroundColor = '';
                        panel.style.width = '';
                    }, 500);
                } else {
                    moveControlsWidth = panelBarWidth + controlsMargin;
                    moveControls = {
                        left: moveControlsWidth + 'px'
                    };
                    standardPositionControls['top-left'].changePosition(moveControls);
                    standardPositionControls['bottom-left'].changePosition(moveControls);
                }
            } else {
                panelContentWrapper.style.left = '';
                panelContentWrapper.style.right = '-' + panelSize + 'px';
                if (panelContentWrapper.style.width === '100%') {
                    panelContentWrapper.style.width = panelSize + 'px';
                    // timeout for optical reasons with css transition
                    setTimeout(function () {
                        panel.style.backgroundColor = '';
                        panel.style.width = '';
                    }, 500);
                } else {
                    moveControlsWidth = panelBarWidth + controlsMargin;
                    moveControls = {
                        right: moveControlsWidth + 'px'
                    };
                    standardPositionControls['top-right'].changePosition(moveControls);
                    standardPositionControls['bottom-right'].changePosition(moveControls);
                }
            }
            panelContent.setAttribute('data-bkg-webmap-activecontent', '');
            deactivateIcons();
        };

        /**
         * Open panel
         */
        this.openPanel = function (print) {
            var controlsTopLeft = document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-position-top-left')[0];
            var controlsTopRight = document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-position-top-right')[0];
            var controlsBottomLeft = document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-position-bottom-left')[0];
            var controlsBottomRight = document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-position-bottom-right')[0];

            controlsTopLeft.style.transition = '';
            controlsTopRight.style.transition = '';
            controlsBottomLeft.style.transition = '';
            controlsBottomRight.style.transition = '';

            var widthOfTopControls = controlsTopLeft.getBoundingClientRect().width + controlsTopRight.getBoundingClientRect().width;
            var widthOfBottomControls = controlsBottomLeft.getBoundingClientRect().width + controlsBottomRight.getBoundingClientRect().width;

            var panelBarWidth = document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-panelbar')[0].getBoundingClientRect().width;
            var panelWidth = document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-panelcontentwrapper')[0].getBoundingClientRect().width;
            var controlsMargin = document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-position-top-left')[0].offsetTop;

            var controlsWidth;
            if (widthOfTopControls >= widthOfBottomControls) {
                controlsWidth = widthOfTopControls;
            } else if (widthOfTopControls < widthOfBottomControls) {
                controlsWidth = widthOfBottomControls;
            }
            var sumOfWidths = panelWidth + controlsWidth;
            var mapWidth = document.getElementById(mapDivId).getBoundingClientRect().width;

            var panelContentWrapper = document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-panelcontentwrapper')[0];

            var moveControls;
            var moveControlsWidth = panelWidth + controlsMargin;

            if (position === 'left') {
                panelContentWrapper.style.left = '0';
                panelContentWrapper.style.paddingLeft = panelBarWidth + 'px';

                if ((sumOfWidths + (2 * controlsMargin)) >= mapWidth) {
                    panel.style.backgroundColor = 'transparent';
                    panel.style.width = '100%';
                    panelContentWrapper.style.width = '100%';
                } else {
                    moveControls = {
                        left: moveControlsWidth + 'px'
                    };

                    standardPositionControls['top-left'].changePosition(moveControls);
                    standardPositionControls['bottom-left'].changePosition(moveControls);
                }
            } else {
                panelContentWrapper.style.left = '';
                panelContentWrapper.style.right = '0';
                panelContentWrapper.style.paddingRight = panelBarWidth + 'px';

                if ((sumOfWidths + (2 * controlsMargin)) >= mapWidth) {
                    panel.style.backgroundColor = 'transparent';
                    panel.style.width = '100%';
                    panelContentWrapper.style.width = '100%';
                } else {
                    moveControls = {
                        right: moveControlsWidth + 'px'
                    };

                    standardPositionControls['top-right'].changePosition(moveControls);
                    standardPositionControls['bottom-right'].changePosition(moveControls);
                }
            }
            map.getControls().forEach(function (control) {
                if (BKGWebMap.Control.Measure && control instanceof BKGWebMap.Control.Measure) {
                    if (print) {
                        control.closeSidePanel(print);
                    } else {
                        control.closeSidePanel();
                    }
                }
            });
        };

        /**
         * Initialize panel (open control that is defined in property 'initialize')
         */
        this.initialize = function () {
            if (initialControl) {
                if (initialControl === 'geoSearch' || initialControl === 'searchCoordinates') {
                    map.getControls().forEach(function (control) {
                        if (BKGWebMap.Control.SearchPanel && control instanceof BKGWebMap.Control.SearchPanel) {
                            _this.changePanelContent('Suche', 'bkgwebmap-searchpanelcontent', true);
                            _this.openPanel();
                            control.activeIcon();
                        }
                    });
                } else if (initialControl === 'layerSwitcher') {
                    map.getControls().forEach(function (control) {
                        if (BKGWebMap.Control.LayerSwitcher && control instanceof BKGWebMap.Control.LayerSwitcher) {
                            _this.openPanel();
                            _this.changePanelContent('Layer', 'bkgwebmap-layerswitchercontent', false);
                            control.activeIcon();
                        }
                    });
                } else if (initialControl === 'legend') {
                    map.getControls().forEach(function (control) {
                        if (BKGWebMap.Control.Legend && control instanceof BKGWebMap.Control.Legend) {
                            _this.changePanelContent('Legende', 'bkgwebmap-legendcontent', false);
                            _this.openPanel();
                            control.activeIcon();
                        }
                    });
                } else if (initialControl === 'showAttributes' || initialControl === 'copyCoordinates') {
                    map.getControls().forEach(function (control) {
                        if (BKGWebMap.Control.InfoPanel && control instanceof BKGWebMap.Control.InfoPanel) {
                            _this.changePanelContent('Info', 'bkgwebmap-infopanelcontent', false);
                            _this.openPanel();
                            control.activeIcon();
                        }
                    });
                } else if (initialControl === 'share') {
                    map.getControls().forEach(function (control) {
                        if (BKGWebMap.Control.Share && control instanceof BKGWebMap.Control.Share) {
                            _this.changePanelContent('Teilen', 'bkgwebmap-sharepanelcontent', false);
                            _this.openPanel();
                            control.activeIcon();
                        }
                    });
                } else if (initialControl === 'measure') {
                    map.getControls().forEach(function (control) {
                        if (BKGWebMap.Control.Measure && control instanceof BKGWebMap.Control.Measure) {
                            control.toggleSidePanels();
                        }
                    });
                } else if (initialControl === 'edit') {
                    map.getControls().forEach(function (control) {
                        if (BKGWebMap.Control.Edit && control instanceof BKGWebMap.Control.Edit) {
                            _this.changePanelContent('Editieren', 'bkgwebmap-editpanelcontent', false);
                            _this.openPanel();
                            control.activeIcon();
                            var editableLayerAvailable = control.editableLayerAvailable();
                            if (editableLayerAvailable === false) {
                                control.addEmptyLayer();
                            }
                        }
                    });
                }
            }
        };

        function deactivateIcons() {
            var panelIcons = document.getElementsByClassName('bkgwebmap-paneltooltip');
            for (var i = 0; i < panelIcons.length; i++) {
                var element = panelIcons[i];
                if (element.classList.contains('bkgwebmap-panelactive')) {
                    element.classList.remove('bkgwebmap-panelactive');
                }
            }
        }

        // Event listeners
        panelTitleButton.addEventListener('click', this.closePanel, { passive: true });

        // Finalize control
        ol.control.Control.call(this, {
            element: panel
        });
    };
};
