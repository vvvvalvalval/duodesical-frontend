angular.module('d12calToolbox')

  .factory('timeUtils', ['$timeout', '$interval','d12Utils',
    function ($timeout, $interval, d12Utils) {

      function nowMillis () {
        return (new Date()).getTime();
      }

      function millisUntil(dateMillis) {
        return dateMillis - nowMillis();
      }

      return {
        nowMillis: nowMillis,
        millisUntil: millisUntil
      };

    }]);