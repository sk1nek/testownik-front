
//test variables
var correctCounter = 0;
var wrongCounter = 0;
var questionsCounter = 0;
var currentQuestion = 0;
var test;
var shouldReload = true;
var selectionCorrect = 0;
var currentCorrectCount = 0;
var correctArray = [];

//timer variables
var t;
var seconds=0, minutes=0, hours =0;

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    $('#timer').text('Obecna sesja: ' + (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds));


    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}


function loadTestownikis(){


    var table = $('#table');
    var startButton = $("#start-button");
    var getSuccess = false;
    startButton.hide();

    table.find('tbody').empty();

    $.get('http://localhost:8080/api/tests/', function (response) {

        response.forEach(function (value) {

            getSuccess = true;

            var onclick = 'loadTest(\'' + value.id + '\')';

            table.find('tbody')
                .append($('<tr>')
                    .attr('onclick', onclick)
                    .append($('<td>')
                        .text(value.title))
                    .append($('<td>')
                        .text(value.description)));

        });

        if(getSuccess === false){
            table.find('tbody')
                .append($('<tr>')
                    .attr('class', 'hoverable-error')
                    .attr('onclick', 'loadTestownikis()')
                    .append($('<td>')
                        .text("Coś poszło nie tak"))
                    .append($('<td>')
                        .text("Kliknij aby spróbować ponownie")));
        }

    });


    table.show();

}


function loadTest(v) {


    timer();

    $('#jumbo-start').hide();
    $('#jumbo-test').show();

    $.get('http://localhost:8080/api/tests/' + v, function (r) {
        test = r;
        loadQuestion(test, 0);
    });


}

function loadQuestion(test , number){

    selectionCorrect = 0;
    currentCorrectCount = 0;
    correctArray=[];

    var header = $('#question-header');

    $('.answers').empty();
    header.empty();

    var question = test.questions[number];

    header.append(parseHeader(question.questionNumber, question.header));

    question.answers.forEach(function (answer) {
        $('.answers')
            .append($('<div>')
                .append($('<div class=\"answer\">')
                    .attr('onclick', parseAnswerOnclick(answer.correct))
                .append(parseContent(answer.text, false))));

        correctArray.push(answer.correct);

        if(answer.correct === true){
            currentCorrectCount++;
        }
    });

    var progressPercentage = (questionsCounter / test.questions.length) * 100;

    $('#test-progress').attr('style', 'width:'+ progressPercentage +'%');

    var correctPercentage = ((questionsCounter - wrongCounter) / questionsCounter) * 100;

    $('#correct-progress').attr('style', 'width:' + correctPercentage + '%');

    $('#test-name').text('Test: '+ test.title);
    $('#correct-answers').text('Poprawnych: ' + correctCounter);
    $('#wrong-answers').text('Złych: ' + wrongCounter);



}

function proceed(){

    if(currentCorrectCount === selectionCorrect){
        correctCounter++;
    }else{
        wrongCounter++;
    }

    questionsCounter++;

    currentQuestion++;

    if(currentQuestion === test.questions.length) {
        handleEnd();
    }

    loadQuestion(test, currentQuestion);

}

function answerCorrect(src) {

    selectionCorrect++;

    src.classList.add("selection");

}

function answerWrong(src) {

    src.classList.add("selection");

}

function markCorrect() {

    $('.answer').each(function (i, obj) {

        if(correctArray[i] === true){
            obj.style.boxShadow = 'inset 0px 0px 0px 7px green';
        }
    })

}

function deselectAll(){

    selectionCorrect = 0;
    $('.answer').each(function (i, obj) {
        obj.className = 'answer';
    });
}

function handleEnd(){

    var modal = $('#endModal');

    $('#test-progress').attr('style', 'width:'+ 100 +'%');


    modal.modal();
    summaryText();

    modal.on('hidden.bs.modal', function(e){
        if(shouldReload === true){
            window.location.reload();
        }
    })
}

function summaryText(){

    var summary = 'Brawo, udało Ci się skończyć test z wynikiem <b>' + Math.round(correctCounter / questionsCounter * 100) + '%</b>. Powodzenia na kolokium.';

    var summaryDiv = $('#summary-text');
    summaryDiv.empty();
    summaryDiv
        .append(summary);
}

function parseAnswerOnclick(correct){

    if(correct === true){
        return 'answerCorrect(this)';
    }else{
        return 'answerWrong(this)';
    }

}

function parseHeader(number, header) {

    var a = '<b>' + number + '. </b>';
    var b = parseContent(header, true);

    if(number == undefined)
        return b;

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

function reloadTest() {

    correctCounter = 0;
    wrongCounter = 0;
    currentQuestion = 0;
    questionsCounter = 0;

    shouldReload = false;
    loadTest(test.id);
}