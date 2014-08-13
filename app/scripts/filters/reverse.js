angular.module('duodesicalApp')
  .filter('reverse', function () {
    return function (items) {
      return items.slice().reverse();
    };
  });