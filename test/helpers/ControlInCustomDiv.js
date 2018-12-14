// Constructor
function ControlInCustomDiv(map, controlName, cssClass, options, standardPosition) {
    var _this = this;
    if (options instanceof Array) {
        options.forEach(function (optionsSingle) {
            _this.singleControl = new ControlInCustomDiv(map, controlName, cssClass, optionsSingle, standardPosition);
        });
    } else {
        _this.map = map;
        _this.controlName = controlName;
        _this.cssClass = cssClass;
        _this.standardPosition = standardPosition;
        _this.options = options;
    }
}

// Method to run tests
ControlInCustomDiv.prototype.runTest = function (customNumControls) {
    if (this.singleControl) {
        this.singleControl.runTest(customNumControls);
    } else {
        var numControls = 1;
        if (customNumControls || customNumControls === 0) {
            numControls = customNumControls;
        }

        var controlName = this.controlName.charAt(0).toUpperCase() + this.controlName.slice(1);

        // Control is present and instanceof BKGWebMap.control
        var bkgwebmapcontrol = false;
        this.map.getControls().forEach(function (control) {
            if (controlName !== 'StaticLinks' && controlName !== 'StaticWindows') {
                if (BKGWebMap.Control[controlName] && control instanceof BKGWebMap.Control[controlName]) {
                    bkgwebmapcontrol = true;
                }
            } else if (BKGWebMap.Control[controlName + '0'] && control instanceof BKGWebMap.Control[controlName + '0']) {
                bkgwebmapcontrol = true;
            }
        });
        expect(bkgwebmapcontrol).toBe(true);

        // Container-Div is added
        var container = document.getElementsByClassName(this.cssClass);
        expect(container.length).toBe(numControls);

        // No Container in standard position
        var standardPosition = this.standardPosition;
        var standardPositionsBKGWebmap = [
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right'];
        var elements;
        if (standardPositionsBKGWebmap.indexOf(this.standardPosition) > -1) {
            elements = document.getElementsByClassName('bkgwebmap-position-' + this.standardPosition)[0].getElementsByClassName(this.cssClass);
            expect(elements.length).toBe(0);
        } else if (standardPosition.substr(standardPosition.length - 5) === 'panel') {
            elements = document.getElementsByClassName('bkgwebmap-panel');
            expect(elements.length).toBe(0);
        }
        // Container is in custom element
        var customDiv = document.getElementById(this.options.div).getElementsByClassName(this.cssClass);
        expect(customDiv.length).toBe(numControls);
    }
};
