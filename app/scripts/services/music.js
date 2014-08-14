angular.module('duodesicalApp')
  .factory('d12allPitches', ['d12Utils', 'minPitch', 'maxPitch', function (u, minPitch, maxPitch) {
    return u.range(minPitch, maxPitch + 1);
  }]);