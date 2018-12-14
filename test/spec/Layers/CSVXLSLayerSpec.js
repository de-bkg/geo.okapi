describe('A suite for CSV/EXCEL layers', function () {
    var layerConfig;
    beforeEach(function () {
        // Create DOM and map
        createDomMap();
    });
    it('test CSV layer config', function (done) {
        layerConfig = {
            type: 'CSV',
            name: 'CSV test',
            url: 'points.csv',
            visibility: true,
            srsName: 'EPSG:4326',
            csvOptions: {
                header: true,
                columnsToParse: ['name', 'place', 'infos'],
                LatColumn: 'lat',
                LonColumn: 'lon',
                delimiter: ';',
                encoding: 'UTF-8'
            },
            minResolution: 0.0001,
            maxResolution: 156545,
            edit: false
        };

        layerTest(layerConfig, 'CSV', done);
    });
    it('test Excel layer config', function (done) {
        layerConfig = {
            type: 'XLS',
            name: 'Excel test',
            url: 'points.xlsx',
            visibility: true,
            srsName: 'EPSG:4326',
            excelOptions: {
                header: false,
                columnNames: ['a', 'b', ''],
                columnsToParse: [3, 4, 5],
                LatColumn: 1,
                LonColumn: 2
            },
            minResolution: 0.0001,
            maxResolution: 156545,
            edit: false,
            style: 'blueSymbols'
        };

        layerTest(layerConfig, 'XLS', done);
    });
});
