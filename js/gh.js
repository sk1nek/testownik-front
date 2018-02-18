var repo = 'https://api.github.com/repos/sk1nek/testownik-baza';

var testList;

loadTests();

function loadTests() {

    $.get(repo + '/contents', function (response) {
        response.forEach(function (value) {

            if(value.type==='dir'){

                var test = {};
                test.id = value.name;
                getTestMetadata(value.path);

            }

        })
    })

}

function getTestMetadata(path){

    $.get(repo + '/contents/' + path + '/test.md', function (response) {

        $.get(response.git_url, function(r){
            var content = r.content;
            content = content.replace('\n', '');
            console.log(atob(content));
        })

    })
}

