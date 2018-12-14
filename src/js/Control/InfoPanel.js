/**
 * Create InfoPanel Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_infoPanel}
 */
BKGWebMap.Control.createInfoPanel = function () {
    return function (map, controlName, options, panel) {
        var mapId = map.getTarget();
        var _this = this;
        var target = panel.element.getElementsByClassName('bkgwebmap-panelbar')[0];

        // Control title for panel
        var title = 'Info';

        // Tooltip position
        var tooltipClass = 'bkgwebmap-paneltooltip bkgwebmap-paneltooltipleft';
        var tooltipTextClass = 'bkgwebmap-paneltooltiptext bkgwebmap-paneltooltiptextleft';
        if (panel.getPanelPosition() === 'right') {
            tooltipClass = 'bkgwebmap-paneltooltip bkgwebmap-paneltooltipright';
            tooltipTextClass = 'bkgwebmap-paneltooltiptext bkgwebmap-paneltooltiptextright';
        }

        // Create DOM
        var infoPanel = document.createElement('div');
        infoPanel.className = 'bkgwebmap-infopanel ' + tooltipClass;

        var parser = new DOMParser();
        var infoPanelIcon = parser.parseFromString(BKGWebMap.PANEL_ICONS.INFO, 'text/xml');
        infoPanelIcon.documentElement.setAttribute('class', 'bkgwebmap-panelicons bkgwebmap-paneliconsopen');
        infoPanel.appendChild(infoPanelIcon.documentElement);

        var infoPanelTooltip = document.createElement('span');
        infoPanelTooltip.className = tooltipTextClass;
        infoPanelTooltip.innerHTML = title;
        infoPanel.appendChild(infoPanelTooltip);

        var infoPanelContent = document.createElement('div');
        var infoPanelContentClass = 'bkgwebmap-infopanelcontent';
        infoPanelContent.className = infoPanelContentClass + ' bkgwebmap-panelsinglecontent';

        panel.addPanelContent(infoPanelContent);

        function clickControl() {
            var activeContent = panel.getActiveContent();
            if (activeContent === '') {
                panel.openPanel();
                panel.changePanelContent(title, infoPanelContentClass);
                _this.activeIcon();
            } else if (activeContent === infoPanelContentClass) {
                panel.closePanel();
            } else {
                panel.changePanelContent(title, infoPanelContentClass);
                _this.activeIcon();
            }
        }

        this.activeIcon = function () {
            infoPanel.classList.add('bkgwebmap-panelactive');
        };

        // Event listeners
        infoPanel.addEventListener('click', clickControl, { passive: true });
        infoPanel.addEventListener('mouseenter', function () {
            var allTooltips = document.getElementById(mapId).getElementsByClassName('bkgwebmap-paneltooltiptext');
            for (var i = 0; i < allTooltips.length; i++) {
                allTooltips[i].style.visibility = '';
            }
            infoPanelTooltip.style.visibility = 'visible';
            setTimeout(function () {
                infoPanelTooltip.style.visibility = '';
            }, 1200);
        }, false);

        // Finalize control
        ol.control.Control.call(this, {
            element: infoPanel,
            target: target
        });
    };
};
