
var correctCounter = 0;
var wrongCounter = 0;

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

    $('.answer').remove();
    header.empty();

    var question = test.questions[number];

    header.append(parseHeader(question.questionNumber, question.header));

    question.answers.forEach(function (value) {
        $('.answers')
            .append($('<div>')
                .append($('<div class=\"answer\">')
                    .attr('onclick', parseAnswerOnclick(value.correct))
                .append(parseContent(value.text))));

    });


}

function answerCorrect() {

    currentQuestion++;

    if(currentQuestion === test.size) {
        alert('Koniec');
    }

    loadQuestion(test, currentQuestion);

}

function answerWrong() {

    wrongCounter++;
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
    var b = parseContent(header);

    return a + b;
}

function parseContent(e) {
    if(e.includes('http')){
        return '<img src=\"' + e + '\">';
    }else{
        return e;
    }
}