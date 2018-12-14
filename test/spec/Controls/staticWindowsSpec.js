describe('A suite for staticWindows control', function () {
    var options;
    var controlName = 'staticWindows';
    var cssClass = 'bkgwebmap-staticwindows';
    var standardPosition = 'top:200px;left:350px';
    var staticWindows;


    beforeEach(function () {
        // Create DOM and map
        createDomMap();
    });

    it('adds a staticWindows control to map', function (done) {
        // Create new control in map
        options = [
            {
                active: true,
                style: '',
                size: [200, 200],
                title: 'Test window',
                content: '<p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p>'
            }
        ];

        createMap(controlName, options, null, function (map) {
            staticWindows = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
            staticWindows.runTest(options.length);
            done();
        });
    });

    it('adds a staticWindows control in custom div', function (done) {
        // Create new control outside map
        options = [
            {
                active: true,
                div: 'customdiv',
                style: '',
                size: [200, 200],
                title: 'Test window',
                content: '<p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p>'
            }
        ];
        createDomDivInBody(options[0].div);
        createMap(controlName, options, null, function (map) {
            staticWindows = new ControlInCustomDiv(map, controlName, cssClass, options, standardPosition);
            staticWindows.runTest(options.length);
            done();
        });
    });
    it('test properties of window', function (done) {
        options = [
            {
                active: true,
                style: '',
                size: [200, 200],
                title: 'Test window',
                content: '<p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p><p>Hello World</p>'
            }
        ];
        createMap(controlName, options, null, function () {
            // Run test
            var windowContent = document.getElementsByClassName('bkgwebmap-staticwindowcontent')[0].innerHTML;
            expect(windowContent).toBe(options[0].content);
            var windowTitle = document.getElementsByClassName('bkgwebmap-staticwindowtitle')[0].innerHTML;
            expect(windowTitle).toBe(options[0].title);
            done();
        });
    });
});
