/**
 * Create CookieCheck Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_cookieCheck}
 */
BKGWebMap.Control.createCookieCheck = function () {
    return function (map, controlName, options) {
        options = options || {};

        var _this = this;

        // Check if control should be created
        this.activate = BKGWebMap.CONTROLS.tools.cookieCheck.active;

        // Use property 'active' to check later if control is activated.
        this.active = false;

        if (typeof options.active === 'boolean') {
            this.activate = options.active;
        }

        // Get URL
        var url = BKGWebMap.CONTROLS.tools.cookieCheck.url;
        if (typeof options.url === 'string' && options.url !== '') {
            url = options.url;
        }
        url = url.replace('https://', '');
        url = url.replace('http://', '');
        url = window.location.protocol + '//' + url;
        // Generate token
        var token = Math.random().toString(36).substring(2, 10);

        // Name of callback to evaluate cookie test result
        var callbackName = 'BKGWebMap.Controls.cookieCheck.callback';

        // Message to show if cookies are disabled
        var message = 'Für eine korrekte Darstellung <b>aktivieren Sie Cookies für sg.geodatenzentrum.de</b> und laden Sie die Webseite noch einmal vollständig neu (Strg + F5). Weitere Informationen dazu finden sie <a href="http://sg.geodatenzentrum.de/web_bkg_webmap/cookietest/enable.html" target="_blank">hier</a>';

        // Add DOM
        var cookieCheck = document.createElement('div');
        cookieCheck.className = 'bkgwebmap-cookiecheck ol-unselectable ol-control';
        var messageDiv = document.createElement('div');
        messageDiv.className = 'bkgwebmap-cookiemessage';
        messageDiv.innerHTML = message;
        cookieCheck.appendChild(messageDiv);

        var closeDiv = document.createElement('div');
        closeDiv.className = 'bkgwebmap-cookieclosemessage';
        closeDiv.innerHTML = 'X';
        cookieCheck.appendChild(closeDiv);

        // How many milliseconds to wait before message is shown
        var delay = 10000;

        // Activate cookie test
        this.activateCookieTest = function () {
            _this.active = true;
            _this.showTimer = setTimeout(function () {
                cookieCheck.style.display = 'table';
            }, delay);

            var urlWithParams = url + '?callback=' + callbackName + '&token=' + token;
            var script = document.createElement('script');
            script.src = urlWithParams;
            document.head.appendChild(script);
        };

        // Callback to evaluate cookie test result
        this.callback = function (tokenReceived) {
            if (tokenReceived === token) {
                clearTimeout(_this.showTimer);
            } else {
                cookieCheck.style.display = 'table';
            }
        };

        // Close message
        closeDiv.addEventListener('click', function () {
            cookieCheck.style.display = 'none';
        }, true);

        // Finalize control
        ol.control.Control.call(this, {
            element: cookieCheck
        });
    };
};
