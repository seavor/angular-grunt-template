(function() {
    angular.module('app').controller('HeaderCtrl', ['$scope', 'localStorageService',
        function($scope, localStorageService) {
          console.log('Initializing Header: ', $scope);
        }
    ]);
})();
