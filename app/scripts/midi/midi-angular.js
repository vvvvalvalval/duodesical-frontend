angular.module('duodesicalMIDI', ['d12calToolbox'])
  .factory('midi', ['$q', '$log', 'd12Utils', function ($q, $log, u) {

    function programNumberFor(instrumentName) {
      return MIDI.GeneralMIDI.byName[instrumentName].number;
    }

    function programInstruments(config) {
      u.forProperty(config)(function (channel, instrumentName) {
        MIDI.programChange(+channel, programNumberFor(instrumentName));
      });
    }

    var availableInstruments = [
      "acoustic_grand_piano",
      //'acoustic_guitar_nylon',
      'acoustic_guitar_steel',
      //'banjo',
      'cello',
      'church_organ',
      //'clarinet',
      //'contrabass',
      'distortion_guitar',
      //'electric_bass_finger',
      //'electric_guitar_clean',
      'flute',
      //'overdriven_guitar',
      'soprano_sax',
      //'string_ensemble_1',
      //'synth_drum',
      //'trumpet',
      //'violin'
    ];

    var defaultChannelConfig = (function () {
      var res = {};
      for (var i = 0; i < 16; i++) {
        res["" + i] = availableInstruments[i];
      }
      return res;
    }());

    function loadInstruments(instrumentNames) {
      $log.debug("Loading instrument : ", instrumentNames, "...");

      var deferredMidi = $q.defer();
      MIDI.loadPlugin({
        soundfontUrl: 'scripts/midi/soundfonts/',
        instruments: instrumentNames,
        callback: function () {
          $log.debug("Done loading instrument : ", instrumentNames, "...");
          $log.debug(MIDI);
          deferredMidi.resolve(MIDI);

          programInstruments(defaultChannelConfig);
        }
      });

      return deferredMidi.promise;
    }

    function loadInstrument(instrumentName) {
      return loadInstruments([instrumentName]);
    }

    function loadAllInstruments() {
      return loadInstruments(availableInstruments);
    }

    var loadedMidi = loadAllInstruments();

    return {
      availableInstruments: availableInstruments,
      loadedMidi: loadedMidi,
      midi: MIDI,
      programInstruments: programInstruments
    };

  }]);
