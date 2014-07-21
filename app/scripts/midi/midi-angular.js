angular.module('duodesicalMIDI',[])
  .factory('midi',['$q','$log', function ($q, $log) {


    function loadInstrument (instrumentName) {
      $log.debug("Loading instrument : ",instrumentName,"...");

      var deferredMidi = $q.defer();
      MIDI.loadPlugin({
        soundfontUrl: 'scripts/midi/soundfonts/',
        instrument: instrumentName,
        callback: function () {
          $log.debug("Done loading instrument : ",instrumentName,"...");
          $log.debug(MIDI);
          deferredMidi.resolve(MIDI);
        }
      });

      return deferredMidi.promise;
    }


    return {
      loadInstrument: loadInstrument,
      midi: MIDI
    };

  }]);