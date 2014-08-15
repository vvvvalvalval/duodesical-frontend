'use strict';

angular
  .module('d12App', [
    'ngRoute',
    'duodesicalMIDI',
    'd12calToolbox',
    'ui.router',
    'ui.bootstrap',
    'ngAnimate'
  ])

  .config(['availableInstrumentsProvider', function (availableInstrumentsProvider) {
    availableInstrumentsProvider.setLoadedInstruments([
      'acoustic_grand_piano',
      'acoustic_guitar_steel',
      'cello',
      'church_organ',
      //'distortion_guitar',
      //'flute',
      'soprano_sax'
      //,'acoustic_guitar_nylon',
      //'banjo',
      //'clarinet',
      //'contrabass',
      //'electric_bass_finger',
      //'electric_guitar_clean',
      //'overdriven_guitar',
      //'string_ensemble_1',
      //'synth_drum',
      //'trumpet',
      //'violin'
    ]);
  }])

  .run(['instruPlayer', function (midi) {
    // starts loading midi files.
  }]);
