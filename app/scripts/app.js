'use strict';

angular
  .module('duodesicalApp', [
    'ngRoute',
    'duodesicalMIDI',
    'd12calToolbox',
    'ui.router',
    'ui.bootstrap',
    'ngAnimate'
  ])

  .constant('d12appResolvers',{
    loadedMidi: ['instruPlayer', function (midi) {
      return midi.loadedMidi;
    }]
  })

  .config(['$stateProvider', '$urlRouterProvider','d12appResolvers',
    function ($stateProvider, $urlRouterProvider, d12appResolvers) {
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
            loadedMidi: d12appResolvers.loadedMidi
          }
        })
        .state('sandbox.notes',{
          url: '/notes',
          templateUrl: 'views/notes-sandbox.html'
        })
        .state('sandbox.cyclicKeyboard',{
          url:'/cyclic-keyboard',
          templateUrl: 'views/cyclic-keyboard.html',
          resolve: {
            loadedMidi: d12appResolvers.loadedMidi
          },
          controller: 'CyclicKeyboardCtrl'
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

        .state('explore',{
          url: '/explore',
          templateUrl: 'views/explore.html'
        })
        .state('explore.intervals',{
          url: '/intervals',
          templateUrl: 'views/explore-intervals.html',
          controller: 'ExploreIntervalsCtrl',
          resolve: {
            loadedMidi: d12appResolvers.loadedMidi
          }
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
