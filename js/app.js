let allQuestions = [
  {question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eleifend dictum felis, quis pretium tortor fringilla ut. Morbi dictum massa sed tincidunt dignissim.", choices: ["David Cameron", "Gordon Brown", "Winston Churchill", "Tony Blair"], correctAnswer:0},
  {question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eleifend dictum felis, quis pretium tortor fringilla ut. Morbi dictum massa sed tincidunt dignissim.", choices: ["David ", "Gordon ", "Winston ", "Tony "], correctAnswer:0},
  {question: "Pytanie 3", choices: ["David Cameron", "Gordon Brown", "Winston Churchill", "Tony Blair"], correctAnswer:0}
];


let quiz = {

    settings: {
      questionsWrapTag: $('.questions-wrap'),
      choicesTag: $('.choices'),
      questionTag: $('.question'),
      questionNumberTag: $('.queNr'),
      questionIndex: 0, // index in array, starts with 0
      nextButtonTag: $('.submit'),
      resultsTag: $('.results'),
    },

    init: function() {
      this.generateHtml();
      this.choiceListener();
      this.buttonNextListener();
    },

    generateHtml: function() {
      var $this = $(this);
      let currentQue = allQuestions[this.settings.questionIndex].question;
      let currentChoices = allQuestions[this.settings.questionIndex].choices;
      let queNr = this.settings.questionIndex + 1;
      // genereate question
      this.settings.questionNumberTag.html(queNr);
      this.settings.questionTag.html(currentQue);

      //genereate choices
      for(var i = 0; i < allQuestions[this.settings.questionIndex].choices.length; i++) {
        $(this.settings.choicesTag).append('<li class="radio">' + allQuestions[this.settings.questionIndex].choices[i] + '</li>');
      }
    },

    userChoice: function() {
      let $this = $(this);
      let userChoice = $this.val();
      $this.addClass('selected').siblings().removeClass('selected');

    },

    choiceListener: function() {
      this.settings.choicesTag.on('click', 'li.radio', this.userChoice);
    },

    buttonNextListener: function() {
      this.settings.nextButtonTag.on('click', this.nextQuestion);
    },

    nextQuestion: function() {
      var selected = quiz.settings.choicesTag.children('li').hasClass('selected');
      if (selected === false) {
        alert('Odpowiedz na pytanie')
      } else {
        quiz.storeAnswer();
        quiz.checkChoice();

        if (userAnswers.length < allQuestions.length) {
          quiz.settings.choicesTag.empty();
          quiz.settings.questionIndex++;
          quiz.generateHtml();
        } else {
          quiz.showResult();
        }
      }
    },

    storeAnswer: function() {
      let selected = $('.selected').html();
      userAnswers.push(selected);
    },


    checkChoice: function() {
      let correctAnswerIndex = allQuestions[this.settings.questionIndex].correctAnswer;
      let correctAnswer = allQuestions[this.settings.questionIndex].choices[correctAnswerIndex]
      if (correctAnswer === userAnswers[this.settings.questionIndex]) {
        this.results.points++
        console.log(this.results.points);
        return true;
      } else {
        console.log(false)
        return false
      }
    },

    results: {
      points: 0
    },

    showResult : function() {
      this.settings.questionsWrapTag.hide();
      this.settings.resultsTag.html(`Udało Ci się poprawnie odpowiedzieć na ${this.results.points} pytań z ${allQuestions.length}`)

    },



}

let userAnswers = [];


quiz.init();
