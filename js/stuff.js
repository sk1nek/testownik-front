
var correctCounter = 0;
var wrongCounter = 0;
var questionsCounter = 0;

var currentQuestion = 0;
var test;

function loadTestownikis(){

    var startButton = $("#start-button");

    startButton.hide();

    $.get('http://localhost:8080/api/tests/', function (response) {



        response.forEach(function (value) {

            var onclick = 'loadTest(\'' + value.id + '\')';

            $('#table').find('tbody')
                .append($('<tr>')
                    .attr('onclick', onclick)
                    .append($('<td>')
                        .text(value.title))
                    .append($('<td>')
                        .text(value.description)))
            ;
        });

        $('#table').show();

    });

}

function loadTest(v) {


    $('#jumbo-start').hide();
    $('#jumbo-test').show();

    $.get('http://localhost:8080/api/tests/' + v, function (r) {
        test = r;
        loadQuestion(test, 0);
    });


}

function loadQuestion(test , number){

    var header = $('#question-header');

    $('.answers').empty();
    header.empty();

    var question = test.questions[number];

    header.append(parseHeader(question.questionNumber, question.header));

    question.answers.forEach(function (value) {
        $('.answers')
            .append($('<div>')
                .append($('<div class=\"answer\">')
                    .attr('onclick', parseAnswerOnclick(value.correct))
                .append(parseContent(value.text, false))));

    });

    var progressPercentage = (questionsCounter / test.questions.length) * 100;

    $('#test-progress').attr('style', 'width:'+ progressPercentage +'%');

    var correctPercentage = ((questionsCounter - wrongCounter) / questionsCounter) * 100;

    $('#correct-progress').attr('style', 'width:' + correctPercentage + '%');

    $('#test-name').text('Test: '+ test.title);
    $('#correct-answers').text('Poprawnych: ' + correctCounter);
    $('#wrong-answers').text('Złych: ' + wrongCounter);



}

function answerCorrect() {

    currentQuestion++;
    questionsCounter++;
    correctCounter++;

    if(currentQuestion === test.questions.length) {
        handleEnd();
    }

    loadQuestion(test, currentQuestion);

}

function answerWrong() {

    currentQuestion++;
    questionsCounter++;
    wrongCounter++;

    if(currentQuestion === test.questions.length){
        handleEnd();
    }

    loadQuestion(test, currentQuestion);
}

function handleEnd(){
    alert("Koniec");
}

function parseAnswerOnclick(correct){

    if(correct === true){
        return 'answerCorrect()';
    }else{
        return 'answerWrong()';
    }

}

function parseHeader(number, header) {

    var a = '<b>' + number + '. </b>';
    var b = parseContent(header, true);

    return a + b;
}

function parseContent(e, addModal) {
    if(e.includes('http') && addModal === true){
        return "<a onclick=\"showmodal('"+ e +"')\" href=\"#\"><img src=\"" + e + "\"></a>";
    }else if(e.includes('http') && addModal === false){
        return "<img src=\"" + e + "\">";
    }else{
        return e;
    }
}

function showmodal(e) {

    var modal = $('#image-modal');

    modal.append($('<div>')
        .attr('class', 'modal-img-holder')
            .append($('<img>')
                .attr('src', e)
            )
        );

    modal.show();

}

function disposeModal(){

    var modal = $('#image-modal');

    modal.empty();
    modal.hide();

}