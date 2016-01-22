(function () {
    "use strict";

    // set a simulated delay in the response
    var simulatedDelay = 650,
        // set to true to log the http call
        consoleLog = true,
        // set to 200 for success
        responseCode = 200;

    // Place response models here
    var
        id = 1,
        first = '854b61fb-5ed1-4bfc-99e5-02e82ed982be',
        last = 'e19b6257-70a9-4ffb-9128-2b948135eb17',
        dob = '1990-08-24';

    // a list of POST calls to stub
    var stubPostMethods = [
        {
            api: "person/1", data: {
                id: id,
                first: first,
                last: last,
                dob: dob
            }
        }
    ];

    // A list of POST calls to pass through
    var passThroughPostMethods = [

    ];

    /**
     * An angular module to simulate backend responses
     * 
     * REQUIRES angular mocks
     */
    angular
        .module('sample.backend', ["ngMockE2E"])
        .config(config)
        .run(runtime);

    config.$inject = ["$provide"];
    function config($provide) {
        $provide.decorator("$httpBackend", function ($delegate) {
            var proxy = function (method, url, data, callback, headers) {
                var interceptor = function () {
                    var _this = this,
                        _arguments = arguments;
                    setTimeout(function () {
                        callback.apply(_this, _arguments);
                    }, simulatedDelay);
                };
                return $delegate.call(this, method, url, data, interceptor, headers);
            };
            for (var key in $delegate) {
                proxy[key] = $delegate[key];
            }
            return proxy;
        });
    };

    runtime.$inject = ["$httpBackend", "ipgConfig"];
    function runtime($httpBackend, ipgConfig) {
        // activation
        (function () {
            // pass through in app files
            $httpBackend.whenGET(/.*/).passThrough();
            // pass through from array 
            passThroughPostMethods.forEach(function (element) {
                $httpBackend.whenPOST(ipgConfig.apiBasePath + "/" + element).passThrough();
            });
            $httpBackend.whenPOST(/.*(MediaStorageDelete).*/).passThrough();
            $httpBackend.whenPOST(/.*(MediaStorageUpload).*/).passThrough();

            stubPostMethods.forEach(function (element) {
                $httpBackend.whenPOST(ipgConfig.apiBasePath + "/" + element.api)
                    .respond(function (method, url, data, headers) {
                        if (consoleLog) console.log(method + " " + url, "\n\rdata: \n\r", data, "\n\rheaders: ", headers);
                        return [responseCode, element.data, {}];
                    });
            });
        })();
    }
})();