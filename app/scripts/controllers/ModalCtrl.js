angular.module('d12App')
  .controller('ModalCtrl', ['$scope', 'instruPlayer', '$log', '$timeout', function ($scope, instruPlayer, $log, $timeout) {

    $scope.fontsLoadingState = 'loading';

    instruPlayer.loadedMidi
      .then(function () {
        $scope.fontsLoadingState = 'loaded';

        var fadeAfter = 300;
        $timeout(function () {
          $scope.$close($scope.fontsLoadingState);
        }, fadeAfter);

      }, function (err) {
        $log.error("Failed to load fonts : ", err);
        $scope.fontsLoadingState = 'failed';
      });

  }]);