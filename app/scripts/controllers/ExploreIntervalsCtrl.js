angular.module('duodesicalApp')
  .controller('ExploreIntervalsCtrl', ['instruPlayer', '$scope', '$log', 'd12random','base12',
    function (instruPlayer, $scope, $log, random, base12) {

      var instruments = instruPlayer.getCurrentInstruments();

      var pickInstrument = random.uniformPicker(['cello','acoustic_grand_piano','acoustic_guitar_steel', 'flute']);

      // nice pitch range.
      var pickPitch = random.intPicker(base12.readInt('30'),base12.readInt('60'));

      var pickInterval = random.intPicker(0,13);

      var timings = ['increasing','simultaneous','decreasing'];
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
        if(timing === 'increasing'){
          delayLow = 0; delayHigh = timeSpacing;
          durationLow = duration; durationHigh = duration - timeSpacing;
        } else if(timing === 'simultaneous') {
          delayLow = 0; delayHigh = 0;
          durationLow = duration; durationHigh = duration;
        } else if(timing === 'decreasing'){
          delayLow = timeSpacing; delayHigh = 0;
          durationLow = duration - timeSpacing; durationHigh = duration;
        }

        instruPlayer.playNote(io.instrument,io.basePitch, durationLow, delayLow, 127);
        instruPlayer.playNote(io.instrument,io.basePitch + io.interval, durationHigh, delayHigh, 127);
      }

      $scope.intervalOpts = {
        randomBasePitch: true,
        basePitch: 48,

        randomTiming: true,
        timing: 'simultaneous'
      };

      $scope.playThatInterval = function (interval) {
        var opts = {
          basePitch: pickPitch(),
          interval: interval,
          instrument: pickInstrument(),
          timing: pickTiming()
        };
        $log.debug('Play some interval : ', opts);
        playInterval(opts);
      }

    }]);