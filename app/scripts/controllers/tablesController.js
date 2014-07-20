angular.module('duodesicalApp')
  .controller('tablesController',['base12','$scope','$log', function (base12, $scope, $log) {

    var untilX = 12, untilY = 12;
    var xs = [], ys = [];

    for(var i = 0; i <= untilX; i += 1) {
      xs.push(i);
    }
    for(var j = 0; j <= untilY; j += 1) {
      ys.push(j);
    }

    $scope.base12 = base12;
    $scope.data = {
      xs: xs, ys: ys
    };

  }]);