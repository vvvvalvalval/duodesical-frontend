angular.module('duodesicalApp')
  .directive('d12Invl', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/d12-interval.html',
      scope: {
        pitch: '=v'
      },
      controller: ['$scope','base12',function($scope,base12){
        $scope.inB12= base12.inB12;
      }]
    };
  });