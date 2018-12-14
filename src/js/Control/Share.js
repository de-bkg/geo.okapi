/**
 * Create Share Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_share}
 */
BKGWebMap.Control.createShare = function () {
    return function (map, controlName, options, panel) {
        var mapId = map.getTarget();
        var addPrint;
        var addPermaLink;
        var addJsonExport;
        var print;
        var _this = this;


        if (typeof options.print === 'object' && options.print.constructor === Object && typeof options.print.active === 'boolean') {
            addPrint = options.print.active;
        } else {
            addPrint = BKGWebMap.CONTROLS.tools.share.print.active;
        }
        if (typeof options.jsonExport === 'object' && options.jsonExport.constructor === Object && typeof options.jsonExport.active === 'boolean') {
            addJsonExport = options.jsonExport.active;
        } else {
            addJsonExport = BKGWebMap.CONTROLS.tools.share.jsonExport.active;
        }
        if (typeof options.permaLink === 'object' && options.permaLink.constructor === Object && typeof options.permaLink.active === 'boolean') {
            addPermaLink = options.permaLink.active;
        } else {
            addPermaLink = BKGWebMap.CONTROLS.tools.share.permaLink.active;
        }

        // Check if control should be created
        if (options.active === false || (!addPrint && !addJsonExport && !addPermaLink)) {
            return undefined;
        }

        // If no panel exists and no other div ID is defined, do not create this control
        if (!panel && (!options.div || options.div === '') && (addPrint || addJsonExport)) {
            window.console.log(BKGWebMap.ERROR.noPanelNoDivForControl + controlName);
            return undefined;
        }

        // Add permaLink control
        if (addPermaLink) {
            var PermaLinkClass = BKGWebMap.Control.FACTORIES.permaLink();
            this.permaLink = new PermaLinkClass(map);
        }

        if (!addPrint && !addJsonExport && addPermaLink) {
            BKGWebMap.Util.onlyPermaLink = true;
        }

        if (!BKGWebMap.Util.onlyPermaLink) {
            var target;
            var inPanel = true;
            if (options.div && options.div !== '') {
                target = options.div;
                inPanel = false;
            } else {
                target = panel.element.getElementsByClassName('bkgwebmap-panelbar')[0];
            }

            // Control title for panel
            var title = 'Teilen';

            // Tooltip position
            var tooltipClass = 'bkgwebmap-paneltooltip bkgwebmap-paneltooltipleft';
            var tooltipTextClass = 'bkgwebmap-paneltooltiptext bkgwebmap-paneltooltiptextleft';
            if (inPanel && panel.getPanelPosition() === 'right') {
                tooltipClass = 'bkgwebmap-paneltooltip bkgwebmap-paneltooltipright';
                tooltipTextClass = 'bkgwebmap-paneltooltiptext bkgwebmap-paneltooltiptextright';
            }

            // Create DOM
            var sharePanel = document.createElement('div');
            sharePanel.className = 'bkgwebmap-sharepanel ' + tooltipClass;

            var parser = new DOMParser();
            var sharePanelIcon = parser.parseFromString(BKGWebMap.PANEL_ICONS.SHARE, 'text/xml');
            sharePanelIcon.documentElement.setAttribute('class', 'bkgwebmap-panelicons bkgwebmap-paneliconsopen');
            sharePanel.appendChild(sharePanelIcon.documentElement);

            var sharePanelTooltip = document.createElement('span');
            sharePanelTooltip.className = tooltipTextClass;
            sharePanelTooltip.innerHTML = title;
            sharePanel.appendChild(sharePanelTooltip);

            var sharePanelContent = document.createElement('div');
            var sharePanelContentClass = 'bkgwebmap-sharepanelcontent';
            sharePanelContent.className = sharePanelContentClass + ' bkgwebmap-panelsinglecontent';

            if (inPanel) {
                panel.addPanelContent(sharePanelContent);
            } else {
                sharePanel.appendChild(sharePanelContent);
                sharePanelContent.style.display = 'none';
            }

            // Add print control
            if (addPrint) {
                var PrintClass = BKGWebMap.Control.FACTORIES.print();
                if (inPanel) {
                    print = new PrintClass(map, options.print, panel);
                } else {
                    print = new PrintClass(map, options.print, sharePanel);
                }
                map.addControl(print);
            }

            // Add jsonExport control
            if (addJsonExport) {
                var JsonExportClass = BKGWebMap.Control.FACTORIES.jsonExport();
                var jsonExport;
                if (inPanel) {
                    jsonExport = new JsonExportClass(map, options.jsonExport, panel);
                } else {
                    jsonExport = new JsonExportClass(map, options.jsonExport, sharePanel);
                }
                map.addControl(jsonExport);
            }

            function clickControl() {
                if (inPanel) {
                    var activeContent = panel.getActiveContent();
                    if (activeContent === '') {
                        panel.openPanel(print);
                        panel.changePanelContent(title, sharePanelContentClass);
                        _this.activeIcon();
                    } else if (activeContent === sharePanelContentClass) {
                        panel.closePanel();
                    } else {
                        panel.changePanelContent(title, sharePanelContentClass);
                        _this.activeIcon();
                    }
                } else if (sharePanelContent.style.display === 'none') {
                    sharePanelContent.style.display = 'block';
                } else {
                    sharePanelContent.style.display = 'none';
                }
            }

            this.activeIcon = function () {
                sharePanel.classList.add('bkgwebmap-panelactive');
            };

            // Event listeners
            sharePanel.addEventListener('click', clickControl, { passive: true });
            sharePanel.addEventListener('mouseenter', function () {
                var allTooltips = document.getElementById(mapId).getElementsByClassName('bkgwebmap-paneltooltiptext');
                for (var i = 0; i < allTooltips.length; i++) {
                    allTooltips[i].style.visibility = '';
                }
                sharePanelTooltip.style.visibility = 'visible';
                setTimeout(function () {
                    sharePanelTooltip.style.visibility = '';
                }, 1200);
            }, false);

            // Finalize control
            ol.control.Control.call(this, {
                element: sharePanel,
                target: target
            });
        } else {
            // Finalize control
            ol.control.Control.call(this, {
                element: document.createElement('span')
            });
        }
    };
};
