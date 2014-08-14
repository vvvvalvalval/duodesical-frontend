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

  .constant('d12appResolvers', {
    loadedMidi: ['instruPlayer', '$modal', '$q', '$state', '$log', '$timeout', function (midi, $modal, $q, $state, $log, $timeout) {
      var pFonts = midi.loadedMidi;
      var defLoaded = $q.defer();

      //$log.debug("Resolving sound fonts, starting to wait...");
      var stillWaiting = true;
      var dWaitShortly = $q.defer(), pWaitShortly = dWaitShortly.promise;
      $timeout(function () {
        if (stillWaiting) {
          //$log.debug("Still waiting.");
          dWaitShortly.reject(stillWaiting);
        } else {
          //$log.debug("No longer waiting.");
          dWaitShortly.resolve(stillWaiting);
        }
      }, 30);
      pFonts.then(function () {
        //$log.debug("Received fonts, no more waiting.");
        stillWaiting = false;
      });


      $q.all([pWaitShortly, pFonts])
        .then(
        function (results) { // pFonts was already resolved, or resolved very fast : we dont open modal
          //$log.debug("Shortly resolved, all is well");
          defLoaded.resolve(results[1]);
        },
        function () { // didn't resolve in the given time : open a modal
          //$log.debug("opening modal...");
          var modal = $modal.open({
            templateUrl: 'views/fonts-loading-modal.html',
            controller: 'ModalCtrl',
            size: 'lg'
          });
          modal.result.then(function (result) {
            //$log.debug("Closed modal on :", result);
            if (result === 'loaded') {
              defLoaded.resolve(result);
            } else {
              defLoaded.reject(result);
            }
          });
        });

      return defLoaded.promise
        .catch(function (err) {
          //$log.debug("Error in resolving, redirecting...");
          $state.go('about');
        });
    }]
  })

  .config(['$stateProvider', '$urlRouterProvider', 'd12appResolvers',
    function ($stateProvider, $urlRouterProvider, d12appResolvers) {
      $stateProvider

        .state('sandbox', {
          url: '/sandbox',
          template: '<div ui-view></div>'
        })
        .state('sandbox.miditest', {
          url: '/miditest',
          templateUrl: 'views/midi-test.html',
          controller: 'MidiTestController',
          resolve: {
            loadedMidi: d12appResolvers.loadedMidi
          }
        })
        .state('sandbox.notes', {
          url: '/notes',
          templateUrl: 'views/notes-sandbox.html'
        })
        .state('sandbox.cyclicKeyboard', {
          url: '/cyclic-keyboard',
          templateUrl: 'views/cyclic-keyboard.html',
          resolve: {
            loadedMidi: d12appResolvers.loadedMidi
          },
          controller: 'CyclicKeyboardCtrl'
        })

        .state('tables', {
          url: '/tables',
          templateUrl: 'views/tables.html',
          controller: 'tablesController'
        })

        .state('train', {
          url: '/train',
          template: '<div ui-view></div>'
        })
        .state('train.add', {
          url: '/add',
          templateUrl: 'views/train-add.html',
          controller: 'trainAddController'
        })
        .state('train.substract', {
          url: '/substract',
          templateUrl: 'views/train-substract.html',
          controller: 'trainSubstractController'
        })

        .state('explore', {
          url: '/explore',
          templateUrl: 'views/explore.html'
        })
        .state('explore.intervals', {
          url: '/intervals',
          templateUrl: 'views/explore-intervals.html',
          controller: 'ExploreIntervalsCtrl',
          resolve: {
            loadedMidi: d12appResolvers.loadedMidi
          }
        })

        .state('about', {
          url: '/about',
          templateUrl: 'views/about.html'
        });

      $urlRouterProvider.otherwise('/about');

    }])
  .run(['instruPlayer', function (midi) {
    // starts loading midi files.
  }]);
