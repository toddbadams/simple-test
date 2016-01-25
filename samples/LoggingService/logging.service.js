(function () {
    'use strict';

    angular.module('s.logging', ['ng', 'toaster', 'ngAnimate'])
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
    loggingService.$inject = ['$log', 'toaster', 'loggingDebugEnabled'];
    function loggingService($log, toaster, debugEnabled) {

        function log(method, message, data, source) {
            // log to angular
            $log[method]({
                message: message,
                data: data,
                source: source
            });
            // send message to toaster
            if(debugEnabled){
                toaster.pop({
                    type: method,
                    title: source,
                    body: message,
                    showCloseButton: true
                });
            }
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