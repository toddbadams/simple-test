(function () {

    angular.module('s.logging', ['ng'])
        .config(config)
        .constant('loggingDebugEnabled', true)
		.factory('loggingService', loggingService);

    config.$inject = ['$logProvider', 'loggingDebugEnabled'];
    function config($logProvider, loggingDebugEnabled) {
        $logProvider.debugEnabled(loggingDebugEnabled);
    }

    /**
     * The logging service
     */
    loggingService.$inject = ['$log'];
    function loggingService($log) {

        function log(method, message, data, source) {
            $log[method]({
                message: message,
                data: data,
                source: source
            });
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