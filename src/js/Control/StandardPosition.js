/**
 * Create StandardPosition Control
 * @type function
 * @returns {function} See parameters of return function in {@link CONTROL_FACTORIES_standardPosition}
 */
BKGWebMap.Control.createStandardPosition = function () {
    return function (map, position) {
        // Create DOM
        var positionElement = document.createElement('div');
        var positionClass = 'bkgwebmap-position-' + position;
        positionElement.className = 'bkgwebmap-standardposition ' + positionClass + ' ol-unselectable ol-control';

        switch (position) {
        case 'top-left':
            positionElement.style.top = '1.375em';
            positionElement.style.left = '1.375em';
            break;
        case 'top-right':
            positionElement.style.top = '1.375em';
            positionElement.style.right = '1.375em';
            break;
        case 'bottom-left':
            positionElement.style.bottom = '1.375em';
            positionElement.style.left = '1.375em';
            break;
        case 'bottom-right':
            positionElement.style.bottom = '1.375em';
            positionElement.style.right = '1.375em';
            break;
        default:
            return undefined;
        }

        this.getClass = function () {
            return positionClass;
        };

        this.changePosition = function (newPositions) {
            for (var newPosition in newPositions) {
                positionElement.style[newPosition] = newPositions[newPosition];
            }
        };

        // Finalize control
        ol.control.Control.call(this, {
            element: positionElement
        });
    };
};
