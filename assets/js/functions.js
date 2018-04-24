function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

$( document ).ready(function() {

    var total_players = 6;
    var total_lucky_beasts = 2;
    var total_stations = 3;

    var audio = new Audio('assets/sfx/myamya.wav');
    var stations = []
    stations.push($('#station1').find('.content'));
    stations.push($('#station2').find('.content'));
    stations.push($('#station3').find('.content'));

    var audios = [];
    audios.push(new Audio('assets/sfx/Tsuchinoko.mp3'));
    audios.push(new Audio('assets/sfx/Arai.mp3'));
    audios.push(new Audio('assets/sfx/Beaver.mp3'));
    audios.push(new Audio('assets/sfx/Toki.mp3'));
    audios.push(new Audio('assets/sfx/Oater.mp3'));

    var questions = [
        'Donde tienen que recargar Kaban y Serval el Japari bus despues de haberlo arreglado por primera vez?', // En lo alto de la montanya
        'Quien le da a Serval y Kaban un banco para colocar dentro del japari bus?', // Beaver y praire
        'En que episodio aparecen Gray fox y Red fox por primera vez?', // 9
        'Con que friend esta enfrentada lion-chan?', // Moose, arce
        'En que capitulo ocurre el Live de PPP?', // 8
        'Con que friend miran Serval y Kaban el Live de PPP?', // Margay, gato tigre
        'Quienes persiguen a Kaban y Serval para recuperar su gorro?' // Fennec y Arai
    ];

    var sugoi = new Audio('assets/sfx/Sugoi.mp3');

    var example_avatar = $('#example-avatar');

    var players = [];
    var beasts = [];
    for (var i = 1; i <= total_players; ++i) {
        players.push(i);
    }
    for (i = 1; i <= total_lucky_beasts; ++i) {
        beasts.push(i + 10);
    }


    var get_avatar = function(number) {
        var avatar = example_avatar.clone();

        avatar.attr('id', '')
            .removeClass('invisible')
            .find('img').attr('src', 'assets/img/' + number + '.jpg');

        return avatar;
    };

    var start_date = new Date().getTime() + 10 * 1000;
    var next_swap = new Date().getTime() + 10 * 1000;
    var next_audio = new Date().getTime() + 60 * 1000;
    var next_question = new Date().getTime() + 300 * 1000;
    var next_question_clear = next_question + 60 * 1000;

    var current_question = 0;

    var swap = function(){
        if (new Date().getTime() < next_swap) return;
        next_swap = new Date().getTime() + getRandomInt(200, 360) * 1000;

        audio.play();

        players = shuffle(players);
        beasts = shuffle(beasts);

        for (var i = 0; i < total_stations; ++i) {
            stations[i].html('');
        }

        var tetris_count = 0;

        for (i = 0; i < players.length; ++i) {
            var station = i;
            if (station >= stations.length) station = stations.length - (i - stations.length + 1);
            if (i >= players.length - 2) {
                if (tetris_count < 2) {
                    station = getRandomInt(0, 1);
                } else {
                    station = 0;
                }
            }
            stations[station].append(get_avatar(players[i]));

            if (station === 1) ++tetris_count;
        }

        for (i = 0; i < beasts.length; ++i) {
            //station = i % 4;
            //if (i === beasts.length - 1) station = Math.floor(Math.random() * 2);
            station = 0;
            if (tetris_count < 2 && i > 0) station = 1;
            console.log((i + 10) + ' ' + station);
            stations[station].append(get_avatar(beasts[i]));
        }
    };

    var random_kiss = function() {
        if (new Date().getTime() < next_audio) return;
        next_audio = new Date().getTime() + getRandomInt(1, 60) * 1000;

        audios[getRandomInt(0, audios.length - 1)].play();

        setTimeout(random_kiss, 3 * getRandomInt(3, 80) * 1000);
    };

    var elapsed_quiz = function() {
        var elapsed = new Date() - start_date;

        var seconds = Math.floor(elapsed / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);

        if (elapsed < 0) {
            $('#elapsed').text(seconds);
        } else {
            $('#elapsed').text(pad(hours, 2) + ':' + pad(minutes % 60, 2) + ':' + pad(seconds % 60, 2));
        }

        if (new Date().getTime() >= next_question && current_question < questions.length) {
            $('#question').text(questions[current_question]);
            serval.play();

            current_question += 1;

            next_question += 300 * 1000;
            next_question_clear += next_question + 60 * 1000;
        }

        if (new Date().getTime() >= next_question_clear) {
            $('#question').text('');
        }

    };

    setInterval(swap, 1000);
    setInterval(random_kiss, 1000);
    setInterval(elapsed_quiz, 1000);
});

