(function() {
    'use strict';

    angular.module('app', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ui.router',
        'ngStorage',
        'toastr'
    ])

    .constant('config', {
        site: 'Angular Template'
    });

})();
