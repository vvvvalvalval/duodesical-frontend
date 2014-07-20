'use strict';

angular
  .module('duodesicalApp', [
    'ngRoute'
  ])
  .config(['$routeProvider',function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/train/add',{
        templateUrl: 'views/train-add.html',
        controller: 'trainAddController'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
