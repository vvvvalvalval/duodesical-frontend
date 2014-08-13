angular.module('duodesicalApp')
  .factory('base12',[function () {

    var digit10 = 'A';
    var digit11 = 'B';

    var digits = ["0","1","2","3","4","5","6","7","8","9",digit10,digit11];
    var digitsValues = {};
    digits.forEach(function(d,n){
      digitsValues[d.toLowerCase()] = n;
    });

    function inB12(n){
      return n.toString(12)
        .replace(/a/g,digit10)
        .replace(/b/g,digit11);
    }

    function readInt(s){
      var res = 0, i= 0, c = s.charAt(i);
      var signum = 1;

      if(c === "-"){
        signum = -1;
        i += 1; c = s.charAt(i);
      } else if(c === "+"){
        signum = 1;
        i += 1; c = s.charAt(i);
      }

      while (c !== ""){
        res = 12*res + digitsValues[c.toLowerCase()];
        i += 1; c = s.charAt(i);
      }

      return signum*res;
    }

    return {
      inB12: inB12,
      readInt: readInt
    };

  }]);
