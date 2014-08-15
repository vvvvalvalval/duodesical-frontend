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

  .run(['instruPlayer', function (midi) {
    // starts loading midi files.
  }]);
