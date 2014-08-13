angular.module('duodesicalApp')
  .controller('MidiTestController',['instruPlayer', '$scope', '$log', function (instruPlayer, $scope, $log) {

    var instruments = instruPlayer.getCurrentInstruments();
    $scope.instruments = instruments;

    $scope.settings = {
      instrument: instruments[0],
      volume: 127,
      pitch: 50,
      velocity: 127,
      delay: 0,
      duration: 0.25
    };

    $scope.playNote = function () {
      var s = $scope.settings;
      $log.debug("Playing the note : ",s);

      var p = instruPlayer.playNote({
        instrument: s.instrument,
        pitch: +s.pitch,
        duration: +s.duration,
        delay: +s.delay,
        velocity: +s.velocity
      },true);
      //p.on.then(function (data) {
      //  $log.debug("triggered at : ",p.triggeredAt,", elapsed : ", data.elapsed);
      //});
    }
  }]);