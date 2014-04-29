require.config({
    urlArgs: "_=" + (new Date()).getTime(),
    baseUrl: "js",
    paths: {
	    jquery: "/js/lib/jquery",
        underscore: "/js/lib/underscore",
        backbone: "/js/lib/backbone",
        Connector: "/js/lib/Connector",
        FnQuery: "/js/lib/FnQuery",
        "socket.io": "/socket.io/socket.io"
    },
    shim: {
	    'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        "socket.io": {
            exports: "io"
        }
    }
});

define([
    'Connector'
], function(
    Connector
){
    var start, init, reconnect, connected;

    // Создаем связь с сервером
    var server = new Connector({
            server: ['bind'],
            remote: '/player'
        }
    );

    // Инициализация
    init = function() {
        // Если id нет
        if (!localStorage.getItem('playerguid')) {
            $(".authorization").show();
            $(".controller").hide();
            connected = false;
            // Ждем ввода токена
            $('#connect').on('click', function() {
                // И отправляем его на сервер
                server.bind({ token: $('#token').val() }, function(data) {
                    if (data.status == 'success') { //  В случае успеха
                        // Стартуем джостик
                        start(data.guid);
                    } else if (data.status == 'undefined guid') {
                        alert('Wrong token');
                    }
                });
            });

        } else { // иначе
            // переподключаемся к уже созданной связке
            reconnect();
        }
    };

    // Переподключение
    // Используем сохранненный id связки
    reconnect = function(){
        server.bind({ guid: localStorage.getItem('playerguid') }, function(data) {
            // Если все ок
            if (data.status == 'success') {
                // Стартуем
                start(data.guid);
            // Если связки уже нет
            } else if (data.status == 'undefined guid') {
                // Начинаем все заново
                localStorage.removeItem('playerguid');
                init();
            }
        });
    };

    // Старт игры
    start = function(guid){
        console.log('start player');
        // Сохраняем id связки
        localStorage.setItem('playerguid', guid);
        $(".authorization").hide();
        $(".controller").show();
        connected = true;
    };

    server.on('reconnect', reconnect);

    // Обмен сообщениями
    server.on('message', function(data, answer){
        console.log('message', data);
        answer('answer');
    });

    init();

    var lastTiltUpdate;
    var firstFinderIdentifier = null;

    window.addEventListener('touchstart', function(e) {
        if (!connected) {
            return;
        }

        e.preventDefault();
        var touches = e.changedTouches;

        for (var i=0; i < touches.length; i++) {
            if (!firstFinderIdentifier) {
                firstFinderIdentifier = touches[i].identifier;
                server.send(JSON.stringify({ action: 'fire' }));
                break;
            }
        }
    });
    window.addEventListener('touchend', function(e) {
        if (!connected) {
            return;
        }

        e.preventDefault();
        var touches = e.changedTouches;

        for (var i=0; i < touches.length; i++) {
            if (firstFinderIdentifier == touches[i].identifier) {
                firstFinderIdentifier = null;
                server.send(JSON.stringify({ action: 'stop_fire' }));
                break;
            }
        }
    });
    window.addEventListener('deviceorientation', function(e) {
        var fps = 60;

        if (lastTiltUpdate && (new Date().getTime() - lastTiltUpdate) < 1000 / fps) {
            return;
        }

        var angle;
        var max_angle = 35;

        if (window.orientation == -90) angle = (-1) * e.beta;
        else if (window.orientation == 90) angle = e.beta;
        else if (window.orientation == 0) angle = e.gamma;
        else if (window.orientation == 180) angle = (-1) * e.gamma;

        if (Math.abs(angle) > Math.abs(max_angle)) {
            angle *= max_angle / Math.abs(angle);
        }

        server.send(JSON.stringify({ action: 'tilt', value: angle / max_angle }));
        lastTiltUpdate = new Date().getTime();
    });
});