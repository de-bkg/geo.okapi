describe('A suite for staticLinks control', function () {
    var options;
    var controlName = 'staticLinks';
    var cssClass = 'bkgwebmap-staticlinks';
    var standardPosition = 'bottom-left';
    var staticLinks;


    beforeEach(function () {
        // Create DOM
        createDomMap();
    });

    it('adds a staticLinks control to map', function (done) {
        // Create new control in map
        options = [
            {
                active: true,
                position: 'bottom-left',
                div: '',
                style: '',
                url: 'http://geosys24.com',
                title: 'a',
                content: 'geosys-link'
            }
        ];
        createMap(controlName, options, null, function (map) {
            staticLinks = new ControlInStandardDiv(map, controlName, cssClass, options, standardPosition);
            // Run test
            staticLinks.runTest(options.length);
            done();
        });
    });

    it('adds a staticLinks control in custom div', function (done) {
        // Create new control outside map
        options = [
            {
                active: true,
                div: 'staticLinksDiv',
                style: '',
                url: 'http://geosys24.com',
                title: 'a',
                content: 'geosys-link'
            }
        ];

        createDomDivInBody(options[0].div);
        createMap(controlName, options, null, function (map) {
            staticLinks = new ControlInCustomDiv(map, controlName, cssClass, options, standardPosition);
            // Run test
            staticLinks.runTest(options.length);
            done();
        });
    });
    it('test properties of link', function (done) {
        options = [
            {
                active: true,
                position: 'bottom-left',
                div: '',
                style: '',
                url: 'http://geosys24.com',
                title: 'a',
                content: 'geosys-link'
            }
        ];
        // Create new control in map
        createMap(controlName, options, null, function () {
            var linkText = document.getElementsByClassName('bkgwebmap-staticlink')[0].innerHTML;
            expect(linkText).toBe(options[0].content);
            var linkTitle = document.getElementsByClassName('bkgwebmap-staticlink')[0].title;
            expect(linkTitle).toBe(options[0].title);
            var linkUrl = document.getElementsByClassName('bkgwebmap-staticlink')[0].getAttribute('href');
            expect(linkUrl).toBe(options[0].url);
            done();
        });
    });
});
