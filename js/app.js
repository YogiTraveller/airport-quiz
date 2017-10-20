let allQuestions = [
  {question: "IAD - this (IATA) airport code indicates an important airport near which city?", choices: ["Ilulissat, Greenland", "Washington DC, USA", "Innsbruck, Austria", "Ada, United States"], correctAnswer:1, img: "img/plane.jpg"},
  {question: "HND - this (IATA) airport code indicates an important airport near which city?", choices: ["Tokyo, Japan ", "Hamburg, Germany", "Hancheng, China", "Ho Chi Minh City, Vietnam"], correctAnswer:0, img: "img/plane2.jpg"},
  {question: "TLL - this (IATA) airport code indicates an important airport near which city?", choices: ["Tel Aviv, Israel", "Tallin, Estonia", "Toulouse/Blagnac, France", "Thessaloniki, Greece"], correctAnswer:1, img: "img/plane3.jpg"},
  {question: "SIN - this (IATA) airport code indicates an important airport near which city?", choices: ["Sinop, Turkey", "Sinop, Brazil", "Singapore, Singapore", "Saint Martin, Sint Maarten"], correctAnswer:2, img: "img/plane3.jpg"},
  {question: "CPT - this (IATA) airport code indicates an important airport near which city?", choices: ["Copenhagen, Denmark", "Cape Town, South Africa", "Campeche, Mexico", "Campinas, Brazil"], correctAnswer:1, img: "img/plane3.jpg"},
  {question: "BGO- this (IATA) airport code indicates an important airport near which city?", choices: ["Bergamo, Italy", "Bergen, Norway", "Bangassou, Central African Republic", "Baghdad, Iraq"], correctAnswer:1, img: "img/plane3.jpg"}
];

let allQuestionsChoiceShuffle = []

class Question {
  constructor(questionNr, question, choices, correctChoice, userChoice) {
    this._questionNr = questionNr;
    this._question = question;
    this._choices = choices;
    this._correctChoice = correctChoice;
    this._userChoice = userChoice;
  }
}

Question.prototype.generateHtml = function() {
  for (var i = 0; i < this._choices.length; i ++ ) {
    $(quiz.settings.choicesTag).append('<li class="radio">' + this._choices[i] + '</li>');
    $(quiz.settings.questionTag).html(this._question);
  }
}

let quiz = {
  settings: {
    questionsWrapTag: $('.questions-wrap'),
    choicesTag: $('.choices'),
    questionTag: $('.question'),
    questionNumberTag: $('.queNr-wrap'),
    progress: $('.progress'),
    allQuestionsNr: $('.allQuestionsNr'),
    photoWrap: $('.photo-wrap'),
    questionIndex: 0, // index in array, starts with 0
    errorTag: $('.error'),
    errorMsg: "You must select one answer",
    nextButtonTag: $('.submit'),
    prevButtonTag: $('.prev'),
    resultsTag: $('.results')
  },

  init: function() {
    for (var i = 0; i < allQuestions.length; i++){
      allQuestionsChoiceShuffle[i] = new Question(i, allQuestions[i].question, allQuestions[i].choices, allQuestions[i].correctAnswer);
    };
    this.shuffleChoices();
    allQuestionsChoiceShuffle[this.settings.questionIndex].generateHtml();
    this.choiceListener();
    this.buttonNextListener();
    this.buttonPrevListener();
    this.allQuestionsNr();
    this.genereateQueNrHtml();
    this.genereatePhotoHtml();
    this.settings.prevButtonTag.addClass('hidden');

  },

  shuffleChoices: function() {
      for (var i = 0; i < allQuestionsChoiceShuffle.length; i++) {
        this.shuffle(allQuestionsChoiceShuffle[i]._choices)
      }
  },

  // Shuffle function from http://stackoverflow.com/a/2450976
  shuffle: function(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      while (currentIndex !== 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
      }

      return array;
  },

  userChoice: function() {
    let $this = $(this);
    $this.addClass('selected').siblings().removeClass('selected');
    quiz.settings.errorTag.removeClass('visible')
  },

  choiceListener: function() {
    this.settings.choicesTag.on('click', 'li.radio', this.userChoice);
  },

  buttonNextListener: function(){
    this.settings.nextButtonTag.on('click', this.nextQuestion);
  },

  buttonPrevListener: function(){
    this.settings.prevButtonTag.on('click', this.prevQuestion);
  },

  nextQuestion: function(userChoice) {
    if(quiz.settings.choicesTag.children().hasClass('selected') === true ) {
      quiz.settings.prevButtonTag.removeClass('hidden');
      var userChoice = quiz.settings.choicesTag.find('.selected').html();
      allQuestionsChoiceShuffle[quiz.settings.questionIndex]._userChoice = userChoice;
      quiz.checkChoice();

      quiz.changeQuestionNr();
      quiz.changePhoto();
      quiz.settings.questionIndex++;
      if(quiz.settings.questionIndex === allQuestions.length - 1){
        quiz.settings.nextButtonTag.html('Finish quiz');
      }
      if (quiz.settings.questionIndex < allQuestions.length) {
        $(quiz.settings.choicesTag).empty();
         allQuestionsChoiceShuffle[quiz.settings.questionIndex].generateHtml();
      } else {
        quiz.showResult();
      }
    } else {
      quiz.settings.errorTag.html(quiz.settings.errorMsg).addClass('visible')
    }
  },

  prevQuestion: function() {
      quiz.settings.questionIndex--;
      $(quiz.settings.choicesTag).empty();
      allQuestionsChoiceShuffle[quiz.settings.questionIndex].generateHtml();
      var selected = allQuestionsChoiceShuffle[quiz.settings.questionIndex]._userChoice;
      $("li:contains('" + selected + "')").addClass('selected');

      quiz.settings.questionNumberTag.find('.current').removeClass('current').addClass('after').prev().addClass('current');
      quiz.settings.photoWrap.find('.current').removeClass('current').addClass('after').prev().addClass('current');

      if(quiz.settings.questionIndex == 0){
        quiz.settings.prevButtonTag.addClass('hidden');
      };
      if(quiz.settings.questionIndex < allQuestions.length - 1){
        quiz.settings.nextButtonTag.html('Next question');
      }
  },

  checkChoice: function() {
    let selection = $('.selected').html();
    console.log(selection);
    let correctAnswer = allQuestions[this.settings.questionIndex].choices[allQuestions[this.settings.questionIndex].correctAnswer];
    console.log(this.settings.questionIndex);
    console.log(correctAnswer);

    if(selection === correctAnswer) {
      this.results.points++;
    }
  },

  showResult : function() {
        this.settings.questionsWrapTag.hide();
        this.settings.resultsTag.html(`Udało Ci się poprawnie odpowiedzieć na ${this.results.points} pytań z ${allQuestions.length}`)
  },

  genereateQueNrHtml: function() {
    for (var i = 0; i < allQuestions.length; i++){
      this.settings.questionNumberTag.append('<span class="queNr">' + (i + 1) + '</span>');
    };
    this.settings.questionNumberTag.find('span:first-child').addClass('current').siblings('span').addClass('after');
  },

  changeQuestionNr: function() {
    this.settings.questionNumberTag.find('.current').removeClass('current').addClass('before').next().addClass('current');
  },

  allQuestionsNr: function() {
    this.settings.allQuestionsNr.html(allQuestions.length)
  },

  genereatePhotoHtml: function() {
    for (var i = 0; i < allQuestions.length; i++){
      this.settings.photoWrap.append(`<div class="photo" style="background-image: url(${allQuestions[i].img})" ></div>`);
    };
    this.settings.photoWrap.find('div:first-of-type').addClass('current').siblings('span').addClass('after');
  },

  changePhoto: function() {
    this.settings.photoWrap.find('.current').removeClass('current').addClass('before').next().addClass('current');
  },

  results: {
    points: 0
  },

}



quiz.init();
