describe('A suite for cookieCheck control', function () {

    var url;
    var request;
    var response;

    it('test url response', function (done) {
        url = 'https://sg.geodatenzentrum.de/web_bkg_webmap/cookietest/setcookie.php?callback=BKGWebMap.Controls.cookieCheck.callback&token=12345';
        response = 'BKGWebMap.Controls.cookieCheck.callback("12345");';

        request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send(null);
        expect(request.responseText).toContain(response);

        done();
    });

    it('test bad request', function (done) {
        url = 'https://sg.geodatenzentrum.de/web_bkg_webmap/cookietest/setcookie.php';

        request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send(null);
        expect(request.responseText).toBe('console.log(\'No Cookie set!\');');

        done();
    });
});
