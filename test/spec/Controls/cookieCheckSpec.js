describe('A suite for cookieCheck control', function () {
    var cookieCheck;
    beforeEach(function () {
        createDomMap();
        var cookieCheckClass = BKGWebMap.Control.createCookieCheck();
        cookieCheck = new cookieCheckClass(null, null, {});

        spyOn(window, 'setTimeout');
    });
    it('test if timeout fired', function () {
        cookieCheck.activateCookieTest();
        expect(setTimeout).toHaveBeenCalled();
    });
});
