angular.module('duodesicalApp')
  .controller('MidiTestController',['midi', '$scope', '$log', 'loadedMidi', function (midi, $scope, $log, instrument) {
    var m = midi.midi;
    $scope.helpers = {
      channels: (function () {
        var res = [];
        var n = 16;
        for(var i = 0; i < n; i += 1){
          res.push(i);
        }
        return res;
      }())
    };

    $scope.settings = {
      channel: 1,
      volume: 127,
      note: 50,
      velocity: 127,
      delay: 0,
      duration: 0.25
    };

    $scope.playNote = function () {
      var s = $scope.settings;
      $log.debug("Playing the note : ",s);

      m.setVolume(+s.channel, +s.volume);
      m.noteOn(+s.channel, +s.note, +s.velocity, +s.delay);
      m.noteOff(+s.channel, +s.note, +s.delay + +s.duration);
    }
  }]);