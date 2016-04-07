(function() {
    angular.module('app', [])
        .constant('config', {
            site: 'Angular Template'
        })
        .config(['$locationProvider', '$urlRouterProvider', '$stateProvider', 'localStorageServiceProvider', 'config',
        function ApplicationConfiguration($locationProvider, $urlRouterProvider, $stateProvider, localStorageServiceProvider, config) {
            // Setup HTML5 mode, so that the # is not present in the URL.
            $locationProvider.html5Mode(true);

            // Configure Local Storage
            localStorageServiceProvider
                .setNotify(false)
                .setPrefix(config.site)
                .setStorageCookieDomain(window.location);

            // If we did not find a valid url, redirect to home page
            $urlRouterProvider.otherwise(function($injector, $location) {
                return '/';
            });

            $stateProvider.state("init", {
                url: "",
                abstract: true,
                controller: 'ApplicationCtrl',
                views: {
                    "header@": {
                        templateUrl: "app/header/header.template.html",
                        controller: "HeaderCtrl"
                    },
                    "footer@": {
                        templateUrl: "app/footer/footer.template.html",
                        controller: "FooterCtrl"
                    }
                }
            });

            $stateProvider.state("home", {
                parent: "init",
                url: "/",
                views: {
                    "content@": {
                        templateUrl: "app/home/home.template.html",
                        controller: "HomeCtrl"
                    }
                }
            });
        }]);
})();
