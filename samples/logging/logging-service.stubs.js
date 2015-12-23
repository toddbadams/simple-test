    var LOGGING_MODULE_NAME = 'v.common.logging';

	/**
     *      test data
     *
     */
     var message = '854b61fb-5ed1-4bfc-99e5-02e82ed982be',
         data = 'e19b6257-70a9-4ffb-9128-2b948135eb17',
         source = '40f51c9d-a654-4c1a-9a32-2b920068c3b7';

     _T.addExpected(LOGGING_MODULE_NAME, {
        data: data,
        message: message,
        source: source
    });
