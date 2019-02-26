var cookieCheck;

// TODO: fix this workaround by correcting CookieCheck's callback behaviour
BKGWebMap.Controls = BKGWebMap.Controls || {};
BKGWebMap.Controls.cookieCheck = BKGWebMap.Controls.cookieCheck || {};

describe('A suite for cookieCheck control', function () {

    beforeEach(function () {
        createDomMap();

        var cookieCheckClass = BKGWebMap.Control.createCookieCheck();
        cookieCheck = new cookieCheckClass(null, null, {});
        BKGWebMap.Controls.cookieCheck.callback = cookieCheck.callback;

        spyOn(window, 'setTimeout');
    });

    afterEach(function() {
        if(cookieCheck.showTimer)
            clearTimeout(cookieCheck.showTimer);
    });

    it('test if timeout fired', function (done) {
        cookieCheck.activateCookieTest();

        // TODO: use internal properties rather than spy
        expect(setTimeout).toHaveBeenCalled();
        /*
        setTimeout(function() {
            expect(cookieCheck.positive).toBe(true);
            done();
        }, 3000);
*/
        done();
    });

    // TODO: stub testing cookies disabled
    // TODO: stub testing cookies enabled
    // TODO: stub testing cookies misconfiguration
});
