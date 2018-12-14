/**
 * Create SearchPanel Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_searchPanel}
 */
BKGWebMap.Control.createSearchPanel = function () {
    return function (map, controlName, geoSearch, panel) {
        var mapId = map.getTarget();
        var _this = this;
        var target = panel.element.getElementsByClassName('bkgwebmap-panelbar')[0];

        // If no panel exists, do not create this control
        if (!panel) {
            window.console.log(BKGWebMap.ERROR.noPanelNoDivForControl + controlName);
            return undefined;
        }

        // Control title for panel
        var title = 'Suche';

        // Tooltip position
        var tooltipClass = 'bkgwebmap-paneltooltip bkgwebmap-paneltooltipleft';
        var tooltipTextClass = 'bkgwebmap-paneltooltiptext bkgwebmap-paneltooltiptextleft';
        if (panel.getPanelPosition() === 'right') {
            tooltipClass = 'bkgwebmap-paneltooltip bkgwebmap-paneltooltipright';
            tooltipTextClass = 'bkgwebmap-paneltooltiptext bkgwebmap-paneltooltiptextright';
        }

        // Create DOM
        var searchPanel = document.createElement('div');
        searchPanel.className = 'bkgwebmap-searchpanel ' + tooltipClass;

        var parser = new DOMParser();
        var searchPanelIcon = parser.parseFromString(BKGWebMap.PANEL_ICONS.SEARCH, 'text/xml');
        searchPanelIcon.documentElement.setAttribute('class', 'bkgwebmap-panelicons bkgwebmap-paneliconsopen');
        searchPanel.appendChild(searchPanelIcon.documentElement);

        var searchPanelTooltip = document.createElement('span');
        searchPanelTooltip.className = tooltipTextClass;
        searchPanelTooltip.innerHTML = title;
        searchPanel.appendChild(searchPanelTooltip);

        var searchPanelContent = document.createElement('div');
        var searchPanelContentClass = 'bkgwebmap-searchpanelcontent';
        searchPanelContent.className = searchPanelContentClass + ' bkgwebmap-panelsinglecontent';
        panel.addPanelContent(searchPanelContent);

        function clickControl() {
            var activeContent = panel.getActiveContent();
            if (activeContent === '') {
                panel.openPanel();
                panel.changePanelContent(title, searchPanelContentClass, geoSearch);
                _this.activeIcon();
            } else if (activeContent === searchPanelContentClass) {
                panel.closePanel();
            } else {
                panel.changePanelContent(title, searchPanelContentClass, geoSearch);
                _this.activeIcon();
            }
        }

        this.activeIcon = function () {
            searchPanel.classList.add('bkgwebmap-panelactive');
        };

        // Event listeners
        searchPanel.addEventListener('click', clickControl, { passive: true });
        searchPanel.addEventListener('mouseenter', function () {
            var allTooltips = document.getElementById(mapId).getElementsByClassName('bkgwebmap-paneltooltiptext');
            for (var i = 0; i < allTooltips.length; i++) {
                allTooltips[i].style.visibility = '';
            }
            searchPanelTooltip.style.visibility = 'visible';
            setTimeout(function () {
                searchPanelTooltip.style.visibility = '';
            }, 1200);
        }, false);

        // Finalize control
        ol.control.Control.call(this, {
            element: searchPanel,
            target: target
        });
    };
};
