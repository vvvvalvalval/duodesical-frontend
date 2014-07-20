angular.module('duodesicalApp')
  .controller('trainAddController',['base12','$scope','$log', function (base12, $scope, $log) {

    function randomNumber(max){
      return Math.floor(Math.random() * max);
    }

    var range = base12.readInt("10");

    var question = {
      submittedAnswer : ""
    };
    function askQuestion (){
      var x = randomNumber(range);
      var y = randomNumber(range);
      var answer = x + y;

      question.x = base12.inB12(x);
      question.y = base12.inB12(y);

      question.answer = answer;
    }

    $scope.question = question; $scope.askQuestion = askQuestion;

    askQuestion();

    $scope.submitAnswer = function () {
      $log.debug("Submitting : ", question.submittedAnswer);
      var ans = question.submittedAnswer;
      if(ans){
        $log.debug(ans + " --12-> " + base12.readInt(ans));
        if(base12.readInt(ans) === question.answer){
          $scope.message = "Correct!";
          askQuestion();
        } else {
          $scope.message = "Wrong!";
        }
        question.submittedAnswer = "";
      }
    }

  }]);