(function() {
    angular.module('app').controller('ApplicationCtrl', ['$scope', '$state', 'localStorageService',
        function($scope, $state, localStorageService) {
          console.log('Initializing Application: ', $scope);
        }
    ]);
})();
