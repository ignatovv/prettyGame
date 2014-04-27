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
    var message = document.getElementById('message');
    var input = document.getElementById('token');
    var start, init, reconnect;

    // Создаем связь с сервером
    var server = new Connector({
            server: ['bind'],
            remote: '/player'
        }
    );

    // Инициализация
    init = function(){
        message.innerHTML = 'ready';
        // Если id нет
        if (!localStorage.getItem('playerguid')){
            // Ждем ввода токена
            input.parentNode.addEventListener('submit', function(e){
                e.preventDefault();

                // И отправляем его на сервер
                server.bind({token: input.value}, function(data){
                    if (data.status == 'success'){ //  В случае успеха
                        // Стартуем джостик
                        start(data.guid);
                    }
                });
            }, false);

        } else { // иначе
            // переподключаемся к уже созданной связке
            reconnect();
        }
    };

    // Переподключение
    // Используем сохранненный id связки
    reconnect = function(){
        server.bind({guid: localStorage.getItem('playerguid')}, function(data){
            // Если все ок
            if (data.status == 'success'){
                // Стартуем
                start(data.guid);
            // Если связки уже нет
            } else if (data.status == 'undefined guid'){
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
        message.innerHTML = 'game';
    };

    server.on('reconnect', reconnect);

    init();

    // Обмен сообщениями
    server.on('message', function(data, answer){
        console.log('message', data);
        answer('answer');
    });

    window.server = server;
    var move = "STOP";
    var shoot = "STOP_FIRE";

    window.addEventListener('click', function (event) {
        if (shoot != 'FIRE') {
            server.send('FIRE', null);
            shoot = 'FIRE';
        }
        server.send('FIRE', null);
    });
    window.addEventListener('touchstart', function (event) {
        if (shoot != 'FIRE') {
            server.send('FIRE', null);
            shoot = 'FIRE';
        }
    });
    window.addEventListener('touchend', function (event) {
        if (shoot != 'STOP_FIRE') {
            server.send('STOP_FIRE', null);
            shoot = 'STOP_FIRE';
        }
    });
    window.addEventListener('deviceorientation', function(event) {

        if (Math.abs(event.alpha) < 2) {
            msg = "STOP";
        }
        else if (event.alpha < 45)
            msg = "MOVE_LEFT";
        else 
            msg = "MOVE_RIGHT";
        console.log("alpha", event.alpha);
        if (move != msg) {
            server.send(msg, null);
            move = msg;
        }
    });


});