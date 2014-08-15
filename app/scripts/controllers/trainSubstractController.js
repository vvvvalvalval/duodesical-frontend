angular.module('d12App')
  .controller('trainSubstractController',['base12','$scope','$log', function (base12, $scope, $log) {

    function randomNumber(max){
      return Math.floor(Math.random() * max);
    }

    var maxX = base12.readInt("100");

    var question = {
      submittedAnswer : ""
    };
    $scope.isPlaying = function () {
      return angular.isDefined(question.answer);
    };
    function askQuestion (){
      var x = randomNumber(maxX);
      var d = randomNumber(12);
      var sum = x + d;

      question.x = base12.inB12(x);
      question.sum = base12.inB12(sum);

      question.answer = d;
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