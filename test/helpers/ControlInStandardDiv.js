// Constructor
function ControlInStandardDiv(map, controlName, cssClass, options, standardPosition) {
    var _this = this;
    if (options instanceof Array) {
        options.forEach(function (optionsSingle) {
            _this.singleControl = new ControlInStandardDiv(map, controlName, cssClass, optionsSingle, standardPosition);
        });
    } else {
        _this.map = map;
        _this.controlName = controlName;
        _this.cssClass = cssClass;
        _this.standardPosition = standardPosition;
    }
}

// Method to run tests
ControlInStandardDiv.prototype.runTest = function (customNumControls) {
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

        // Container is in standard position
        var standardPosition = this.standardPosition;
        var standardPositionsBKGWebmap = [
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right'];
        var elements;
        if (standardPositionsBKGWebmap.indexOf(this.standardPosition) > -1) {
            elements = document.getElementsByClassName('bkgwebmap-position-' + this.standardPosition)[0].getElementsByClassName(this.cssClass);
            expect(elements.length).toBe(numControls);
        } else if (standardPosition.substr(standardPosition.length - 5) === 'panel') {
            if (standardPosition === 'panel') {
                elements = document.getElementsByClassName('bkgwebmap-panelbar')[0].getElementsByClassName(this.cssClass);
                expect(elements.length).toBe(numControls);
            } else if (standardPosition === 'layerswircherpanel') {
                elements = document.getElementsByClassName('bkgwebmap-layerswitchercontent')[0].getElementsByClassName(this.cssClass);
                expect(elements.length).toBe(numControls);
            } else {
                elements = document.getElementsByClassName('bkgwebmap-' + standardPosition + 'content')[0].getElementsByClassName(this.cssClass);
                expect(elements.length).toBe(numControls);
            }
        } else {
            elements = document.getElementsByClassName(this.cssClass);
            expect(elements.length).toBe(numControls);
            if (elements.length === 1) {
                var propArray = standardPosition.split(';').filter(function (prop) {
                    return (!!prop);
                });
                for (var prop in propArray) {
                    propArray[prop] = propArray[prop].split(':');
                    expect(elements[0].style[propArray[prop][0]]).toBe(propArray[prop][1]);
                }
            }
        }
    }
};
