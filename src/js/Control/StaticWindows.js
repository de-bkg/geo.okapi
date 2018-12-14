/**
 * Create StaticWindows Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_staticWindows}
 */
BKGWebMap.Control.createStaticWindows = function () {
    return function (map, controlName, options) {
        if (!options.size[0] || !options.size[1]) {
            return undefined;
        }

        var target;
        if (options.div && options.div !== '') {
            target = options.div;
        }

        if (typeof options.onlyFullScreen === 'boolean' && options.onlyFullScreen === true) {
            this.onlyFullScreen = true;
        }

        this.controlName = 'StaticWindows';

        // Check if control should be open or closed
        var active = BKGWebMap.CONTROLS.tools.staticWindows[0].active;
        if (typeof options.active === 'boolean') {
            active = options.active;
        }
        var staticWindowIcon;
        var staticWindowDisplay;
        if (active) {
            staticWindowIcon = '-';
            staticWindowDisplay = 'inline-block';
        } else {
            staticWindowIcon = '+';
            staticWindowDisplay = 'none';
        }

        var position;
        if (typeof options.position === 'string') {
            position = options.position;
        } else {
            position = BKGWebMap.CONTROLS.tools.staticWindows[0].position;
        }
        var cssPosition = BKGWebMap.Util.cssParser(position);

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
        var staticWindows = document.createElement('div');
        staticWindows.className = 'bkgwebmap-staticwindows ol-unselectable ol-control' + onlyFullScreenClass + customClass;
        staticWindows.style.width = options.size[0] + 'px';
        staticWindows.style.margin = '1px';

        for (var prop in cssPosition) {
            staticWindows.style[prop] = [cssPosition[prop]];
        }

        var staticWindowTitle = document.createElement('div');
        staticWindowTitle.className = 'bkgwebmap-staticwindowtitle';
        staticWindowTitle.innerHTML = options.title;

        var staticWindowButton = document.createElement('div');
        staticWindowButton.className = 'bkgwebmap-staticwindowbutton';
        staticWindowButton.innerHTML = staticWindowIcon;

        var staticWindowWrapper = document.createElement('div');
        staticWindowWrapper.className = 'bkgwebmap-staticwindowwrapper';
        staticWindowWrapper.appendChild(staticWindowTitle);
        staticWindowWrapper.appendChild(staticWindowButton);

        var staticWindowContent = document.createElement('div');
        staticWindowContent.className = 'bkgwebmap-staticwindowcontent bkgwebmap-selectable';
        staticWindowContent.innerHTML = options.content;
        staticWindowContent.style.display = staticWindowDisplay;
        staticWindowContent.style.height = options.size[1] + 'px';

        var staticWindow = document.createElement('div');
        staticWindow.className = 'bkgwebmap-staticwindow';
        staticWindow.appendChild(staticWindowWrapper);
        staticWindow.appendChild(staticWindowContent);

        staticWindows.appendChild(staticWindow);

        dragWindow(staticWindows, staticWindowWrapper);

        staticWindowButton.addEventListener('click', function () {
            if (staticWindowContent.style.display === 'none') {
                staticWindowContent.style.display = 'inline-block';
                staticWindowButton.innerHTML = '-';
            } else {
                staticWindowContent.style.display = 'none';
                staticWindowButton.innerHTML = '+';
            }
        }, { passive: true });

        // Move window
        function dragWindow(div, header) {
            var mousePosition;
            var offset = [0, 0];
            var isDown = false;

            function mouseDown(e) {
                isDown = true;
                if (e.clientX && e.clientY) {
                    offset = [
                        div.offsetLeft - e.clientX,
                        div.offsetTop - e.clientY
                    ];
                } else if (e.touches && e.touches.length) {
                    offset = [
                        div.offsetLeft - e.touches[0].clientX,
                        div.offsetTop - e.touches[0].clientY
                    ];
                }

                document.addEventListener('mousemove', mouseMove);
                document.addEventListener('touchmove', mouseMove);
            }

            function mouseUp() {
                isDown = false;
                document.removeEventListener('mousemove', mouseMove);
                document.removeEventListener('touchmove', mouseMove);
            }

            function mouseMove(event) {
                event.preventDefault();
                if (isDown) {
                    if (event.clientX && event.clientY) {
                        mousePosition = {
                            x: event.clientX,
                            y: event.clientY
                        };
                    } else if (event.touches && event.touches.length) {
                        mousePosition = {
                            x: event.touches[0].clientX,
                            y: event.touches[0].clientY
                        };
                    }
                    div.style.left = (mousePosition.x + offset[0]) + 'px';
                    div.style.top = (mousePosition.y + offset[1]) + 'px';
                }
            }
            header.addEventListener('mousedown', mouseDown);
            header.addEventListener('touchstart', mouseDown);

            document.addEventListener('mouseup', mouseUp);
            document.addEventListener('touchend', mouseUp);
        }

        this.getControlTarget = function () {
            return staticWindows;
        };

        // Finalize control
        ol.control.Control.call(this, {
            element: staticWindows,
            target: target
        });
    };
};
