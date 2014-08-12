'use strict';

angular
  .module('duodesicalApp', [
    'ngRoute',
    'duodesicalMIDI',
    'd12calToolbox',
    'ui.router'
  ])
  .config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      $stateProvider

        .state('sandbox',{
          url: '/sandbox',
          template: '<div ui-view></div>'
        })
        .state('sandbox.miditest',{
          url: '/miditest',
          templateUrl: 'views/midi-test.html',
          controller: 'MidiTestController',
          resolve: {
            'loadedMidi': ['instruPlayer', function (midi) {
              return midi.loadedMidi;
            }]
          }
        })
        .state('sandbox.notes',{
          url: '/notes',
          templateUrl: 'views/notes-sandbox.html'
        })

        .state('tables',{
          url: '/tables',
          templateUrl: 'views/tables.html',
          controller: 'tablesController'
        })

        .state('train',{
          url: '/train',
          template: '<div ui-view></div>'
        })
        .state('train.add',{
          url: '/add',
          templateUrl: 'views/train-add.html',
          controller: 'trainAddController'
        })
        .state('train.substract',{
          url: '/substract',
          templateUrl: 'views/train-substract.html',
          controller: 'trainSubstractController'
        })

        .state('about',{
          url:'/about',
          templateUrl: 'views/about.html'
        });

      $urlRouterProvider.otherwise('/about');

    }])
  .run(['instruPlayer', function (midi) {
    // starts loading midi files.
  }]);
