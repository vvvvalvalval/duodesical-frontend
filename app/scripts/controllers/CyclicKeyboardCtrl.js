angular.module('d12App')
  .controller('CyclicKeyboardCtrl', ['instruPlayer', '$scope', '$log', 'd12allPitches','base12','availableInstrumentsData',
    function (instruPlayer, $scope, $log, d12allPitches, base12, availableInstrumentsData) {

      $scope.pitches = d12allPitches;

      // display
      $scope.ckDisplaySettings = {
        width: 450,
        distorsion: 0.00005,
        octaveHeight: 38,
        rMin: 70,
        minPitch: "30"
      };

      var ck = $scope.ckDisplaySettings;
      function minPitch(){
        return base12.readInt(ck.minPitch);
      }
      $scope.incMinPitch = function () {
        ck.minPitch = base12.inB12(minPitch()+1);
      };
      $scope.decMinPitch = function () {
        ck.minPitch = base12.inB12(minPitch()-1);
      };

      function cartesianCoordinates(r, theta) {
        //var centerX = 0.5, centerY = 0.5;
        return {
          x: (r * Math.cos(theta)),
          y: (r * Math.sin(theta))
        };
      }

      var twelveth = 2 * Math.PI / 12;

      function display(pitch) {
        return (pitch >= minPitch());
      }

      $scope.display = display;
      function getPosition(pitch) {
        var relPitch = (pitch - minPitch());

        var r = +ck.rMin + (relPitch * ck.octaveHeight / 12);

        var theta = (1 - (ck.distorsion * relPitch)) * twelveth * pitch;

        return cartesianCoordinates(r, theta);
      }

      $scope.getPosition = getPosition;


      $log.debug("availableInstrumentsData = ", availableInstrumentsData);
      $scope.instruments = availableInstrumentsData;

      $scope.playerSettings = {
        currentInstrument : availableInstrumentsData[0].midiName,
        sustainMode: false,
        duration: 600,
        velocity: 127
      };
      var pS = $scope.playerSettings;

      var pitchesPlaying = [];
      var notesOnOff = [];

      function isPlaying(pitch) {
        return !!pitchesPlaying[pitch];
      }
      $scope.isPlaying = isPlaying;

      $scope.clickNote = function (pitch) {
        if (pS.sustainMode){
          if(!notesOnOff[pitch]){
            var opts = {
              instrument: pS.currentInstrument,
              pitch: pitch,
              velocity: pS.velocity
            };
            notesOnOff[pitch] = opts;
            instruPlayer.noteOn2(opts);
            if(!pitchesPlaying[pitch]){
              pitchesPlaying[pitch] = 0;
            }
            pitchesPlaying[pitch] += 1;
          } else {
            var opts = notesOnOff[pitch];
            instruPlayer.noteOff2(opts);
            delete notesOnOff[pitch];
            pitchesPlaying[pitch] -= 1;
          }
        } else {
          var p = instruPlayer.playNote({
            instrument: pS.currentInstrument,
            pitch: pitch,
            duration: pS.duration / 1000,
            velocity: pS.velocity
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
        }
        //p.on.then(function (data) {
        //  $log.debug("triggered at : ",p.triggeredAt,", elapsed : ", data.elapsed);
        //});
      };

    }]);