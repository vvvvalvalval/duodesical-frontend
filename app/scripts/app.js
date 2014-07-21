'use strict';

angular
  .module('duodesicalApp', [
    'ngRoute',
    'duodesicalMIDI'
  ])
  .config(['$routeProvider',function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/tables',{
        templateUrl: 'views/tables.html',
        controller: 'tablesController'
      })
      .when('/train/add',{
        templateUrl: 'views/train-add.html',
        controller: 'trainAddController'
      })
      .when('/train/substract',{
        templateUrl: 'views/train-substract.html',
        controller: 'trainSubstractController'
      })

      .when('/miditest',{
        templateUrl: 'views/midi-test.html',
        controller: 'MidiTestController',
        resolve: {
          'instrument': ['midi', function (midi) {
            return midi.loadInstrument('cello');
          }]
        }
      })

      .otherwise({
        redirectTo: '/'
      });
  }])
  .run(['midi', function (midi) {
    //midi.loadInstrument('acoustic_grand_piano');
  }]);
