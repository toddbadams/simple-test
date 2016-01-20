(function () {
    'use strict';

    angular.module('s.logging', ['ng'])
        .config(config)
        .constant('loggingDebugEnabled', true)
		.factory('loggingService', loggingService);

    /**
     * Module configuration
     */
    config.$inject = ['$logProvider', 'loggingDebugEnabled'];
    function config($logProvider, loggingDebugEnabled) {
        $logProvider.debugEnabled(loggingDebugEnabled);
    }

    /**
     * The logging service
     */
    loggingService.$inject = ['$log','toaster'];
    function loggingService($log, toaster) {

        function log(method, message, data, source) {
            // log to angular
            $log[method]({
                message: message,
                data: data,
                source: source
            });
            // send message to toaster
            toaster[method](message);
        }

        function logger(source) {
            return {
                debug: function (message, data) {
                    return log('debug', message, data, source);
                },
                error: function (message, data) {
                    return log('error', message, data, source);
                }
            };
        }

        return {
            logger: logger
        }
    }
})();