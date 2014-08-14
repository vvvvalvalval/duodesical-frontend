angular.module('duodesicalApp')
  .controller('CyclicKeyboardCtrl',['instruPlayer', '$scope', '$log', 'd12allPitches',
    function (instruPlayer, $scope, $log, d12allPitches) {

    $scope.pitches = d12allPitches;

    // display
    $scope.ckDisplaySettings = {
      width: 450,
      a: 0.00005,
      octaveHeight: 35,
      rMin: 30,
      minPitch: 30,
      numberDisplayed: 4*12
    };
    var ck = $scope.ckDisplaySettings;

    function cartesianCoordinates (r, theta) {
      var centerX = ck.width/ 2, centerY = ck.width/2;
      return {
        x: (centerX + r * Math.cos(theta)),
        y: (centerY + r * Math.sin(theta))
      };
    }

    var twelveth = 2 * Math.PI / 12;

    function display(pitch){
      return (pitch >= +ck.minPitch && (pitch - +ck.minPitch) < +ck.numberDisplayed);
    }
    $scope.display = display;
    function getPosition(pitch){
      pitch = (pitch - ck.minPitch);
      var r = +ck.rMin + (pitch * ck.octaveHeight / 12);
      var theta = (1 - (ck.a * pitch)) * twelveth * pitch;

      return cartesianCoordinates(r,theta);
    }
    $scope.getPosition = getPosition;

    $scope.playNote = function (pitch) {
      var p = instruPlayer.playNote({
        pitch: pitch,
        duration: 0.6
      },true);
      //p.on.then(function (data) {
      //  $log.debug("triggered at : ",p.triggeredAt,", elapsed : ", data.elapsed);
      //});
    }
  }]);