/**
 * Create StaticLinks Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_staticLinks}
 */
BKGWebMap.Control.createStaticLinks = function () {
    return function (map, controlName, options, panel, standardPositionControls) {
        var mapDivId = map.getTarget();

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
                position = BKGWebMap.CONTROLS.tools.staticLinks[0].position;
            }
        }
        if (!options.url) {
            return undefined;
        }

        var title = '';
        if (options.title && options.title !== '') {
            title = options.title;
        }

        var staticLinks = document.createElement('div');

        var standardPositionClass = '';
        if (position !== undefined) {
            if (standardPositionControls[position]) {
                var targetClass = standardPositionControls[position].getClass();
                target = document.getElementById(mapDivId).getElementsByClassName(targetClass)[0];
                var rightLeft = position.split('-')[1];
                standardPositionClass = ' bkgwebmap-standardpositioncontrol bkgwebmap-standardpositioncontrol' + rightLeft;
            } else if (cssPosition) {
                for (var prop in position) {
                    staticLinks.style[prop] = position[prop];
                }
            } else {
                return undefined;
            }
        }

        // Custom class
        var customClass = '';
        if (options.style && options.style !== '') {
            customClass = ' ' + options.style;
        }

        var onlyFullScreenClass = '';
        if (this.onlyFullScreen) {
            onlyFullScreenClass = ' bkgwebmap-onlyfullscreen ';
        }

        // Create DOM
        staticLinks.className = 'bkgwebmap-staticlinks ol-unselectable ol-control' + onlyFullScreenClass + customClass + standardPositionClass;

        var staticLink = document.createElement('a');
        staticLink.href = options.url;
        staticLink.setAttribute('target', '_blank');
        staticLink.setAttribute('title', title);
        staticLink.innerHTML = options.content;
        staticLink.className = 'bkgwebmap-staticlink';

        staticLinks.appendChild(staticLink);

        this.controlName = 'StaticLinks';

        this.getControlTarget = function () {
            return staticLinks;
        };

        // Finalize control
        ol.control.Control.call(this, {
            element: staticLinks,
            target: target
        });
    };
};
