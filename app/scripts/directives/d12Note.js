angular.module('d12App')
  .directive('d12Note', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/d12-note.html',
      scope: {
        pitch: '=pitch'
      },
      controller: ['$scope','base12',function($scope,base12){
        $scope.inB12= base12.inB12;
      }]
    };
  });