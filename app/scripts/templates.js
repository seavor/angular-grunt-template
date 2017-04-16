angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/views/init.html',
    "<ui-view>"
  );


  $templateCache.put('templates/views/main.html',
    "<h1>Main View</h1>"
  );

}]);
