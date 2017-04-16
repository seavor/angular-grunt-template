(function() {
    'use strict';

    angular.module('app').config(['$locationProvider', '$urlRouterProvider', '$stateProvider', 'toastrConfig',
    function ApplicationConfiguration($locationProvider, $urlRouterProvider, $stateProvider, toastrConfig) {
        // Setup HTML5 mode, so that the # is not present in the URL.
        $locationProvider.html5Mode(true);

        // Custom Toastr Service Settings
        angular.extend(toastrConfig, {
          positionClass: 'toast-top-center'
        });

        // If we did not find a valid url, redirect to home page
        $urlRouterProvider.otherwise(function($injector, $location) {
            return '/';
        });

        $stateProvider.state("init", {
            url: "",
            abstract: true,
            controller: 'InitCtrl',
            templateUrl: "templates/views/init.html",
        });

        $stateProvider.state("init.main", {
            url: "/",
            controller: 'MainCtrl',
            templateUrl: "templates/views/main.html",
        });
    }]);
})();
