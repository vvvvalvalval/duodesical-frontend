angular.module('d12calToolbox')

  .factory('d12random', ['d12Utils',
    function (u) {

      function randomInt(start,end){
        return start + (Math.floor(Math.random() * (end - start)));
      }

      /**
       * Creates a function that picks randomly in the given array.
       * @param values an array.
       * @returns {pick}
       */
      function uniformPicker(values){
        return function pick () {
          var n = values.length;
          return values[randomInt(0,n)];
        };
      }

      function intPicker(start, end){
        return function(){
          return randomInt(start, end);
        };
      }

      return {
        randomInt: randomInt,
        intPicker: intPicker,
        uniformPicker: uniformPicker
      };
    }]);