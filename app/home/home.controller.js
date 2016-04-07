(function() {
    angular.module('app').controller('HomeCtrl', ['$scope', '$state', 'localStorageService',
        function($scope, $state, localStorageService) {
          console.log('Initializing Home: ', $scope);
        }
    ]);
})();
