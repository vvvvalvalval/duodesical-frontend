angular.module('d12App')
  .controller('ExploreIntervalsCtrl', ['instruPlayer', '$scope', '$log', 'd12random','base12',
    function (instruPlayer, $scope, $log, random, base12) {

      $scope.instruments = ['cello','acoustic_grand_piano','acoustic_guitar_steel', 'flute'];
      $scope.base12 = base12;

      var pickInstrument = random.uniformPicker($scope.instruments);

      // nice pitch range.
      var pickPitch = random.intPicker(base12.readInt('30'),base12.readInt('60'));

      var pickInterval = random.intPicker(0,13);

      var timings = ['ascending','simultaneous','descending'];
      var pickTiming = random.uniformPicker(timings);

      function pickIntervalOpts () {
        var basePitch = pickPitch();
        var interval = pickInterval();
        var timing = pickTiming();
        var instrument = pickInstrument();
        return {
          basePitch: basePitch,
          interval: interval,
          timing: timing,
          instrument: instrument
        };
      }

      var timeSpacing = 0.5, duration = 3.0;
      function playInterval(io){
        var delayLow, delayHigh,
          durationLow, durationHigh;
        var timing = io.timing;
        if(timing === 'ascending'){
          delayLow = 0; delayHigh = timeSpacing;
          durationLow = duration; durationHigh = duration - timeSpacing;
        } else if(timing === 'simultaneous') {
          delayLow = 0; delayHigh = 0;
          durationLow = duration; durationHigh = duration;
        } else if(timing === 'descending'){
          delayLow = timeSpacing; delayHigh = 0;
          durationLow = duration - timeSpacing; durationHigh = duration;
        }

        instruPlayer.playNote({
          instrument: io.instrument,
          pitch: io.basePitch,
          duration: durationLow,
          delay: delayLow
        });
        instruPlayer.playNote({
            instrument: io.instrument,
            pitch: io.basePitch + io.interval,
            duration: durationHigh,
            delay: delayHigh
        });
      }
      $scope.playInterval = playInterval;

      $scope.intervalOpts = {
        randomInstrument: true,
        instrument: $scope.instruments[0],

        randomBasePitch: false,
        basePitch: '40',

        randomTiming: false,
        timing: 'ascending'
      };

      var o = $scope.intervalOpts;

      function currentInstrument () {
        return (o.randomInstrument ? pickInstrument() : o.instrument);
      }
      function currentBasePitch () {
        return (o.randomBasePitch ? pickPitch() : base12.readInt(o.basePitch));
      }
      function currentTiming () {
        return (o.randomTiming? pickTiming() : o.timing);
      }

      // intervals that were previously played
      $scope.justPlayed = [];

      $scope.playThatInterval = function (interval) {
        var opts = {
          basePitch: currentBasePitch(),
          interval: interval,
          instrument: currentInstrument(),
          timing: currentTiming()
        };
        $log.debug('Play some interval : ', opts);
        playInterval(opts);
        $scope.justPlayed.push(opts);
      };

      $scope.playThePitch = function (pitch12) {
        instruPlayer.playNote({
          instrument: currentInstrument(),
          pitch: base12.readInt(pitch12),
          duration:duration
        });
      };

      $scope.playBasePitch = function (opts) {
        instruPlayer.playNote({
          instrument: opts.instrument,
          pitch: opts.basePitch,
          duration:duration
        });
      };
      $scope.playOtherPitch = function (opts) {
        instruPlayer.playNote({
          instrument: opts.instrument,
          pitch: opts.basePitch + opts.interval,
          duration:duration
        });
      };

    }]);