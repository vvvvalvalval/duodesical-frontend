angular.module('duodesicalApp')
  .controller('CyclicKeyboardCtrl', ['instruPlayer', '$scope', '$log', 'd12allPitches',
    function (instruPlayer, $scope, $log, d12allPitches) {

      $scope.pitches = d12allPitches;

      // display
      $scope.ckDisplaySettings = {
        width: 450,
        a: 0.00005,
        octaveHeight: 0.08,
        rMin: 0.18,
        minPitch: 36
      };
      var ck = $scope.ckDisplaySettings;

      function cartesianCoordinates(r, theta) {
        var centerX = 0.5, centerY = 0.5;
        return {
          x: (centerX + r * Math.cos(theta)) * 100,
          y: (centerY + r * Math.sin(theta)) * 100
        };
      }

      var twelveth = 2 * Math.PI / 12;

      function display(pitch) {
        return (pitch >= +ck.minPitch);
      }

      $scope.display = display;
      function getPosition(pitch) {
        pitch = (pitch - ck.minPitch);
        var r = +ck.rMin + (pitch * ck.octaveHeight / 12);
        var theta = (1 - (ck.a * pitch)) * twelveth * pitch;

        return cartesianCoordinates(r, theta);
      }

      $scope.getPosition = getPosition;


      var pitchesPlaying = [];

      function isPlaying(pitch) {
        return !!pitchesPlaying[pitch];
      }
      $scope.isPlaying = isPlaying;

      $scope.playNote = function (pitch) {
        var p = instruPlayer.playNote({
          pitch: pitch,
          duration: 0.6
        }, true);
        p.on.then(function (data) {
          if(!pitchesPlaying[pitch]){
            pitchesPlaying[pitch] = 0;
          }
          pitchesPlaying[pitch] += 1;
        });
        p.off.then(function (data) {
          pitchesPlaying[pitch] -= 1;
        });
        //p.on.then(function (data) {
        //  $log.debug("triggered at : ",p.triggeredAt,", elapsed : ", data.elapsed);
        //});
      }
    }]);