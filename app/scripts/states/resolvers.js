angular.module('d12App')
  .constant('d12AppResolvers', {

    // waits for midi soundfonts to be loaded and opens a modal
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

  });