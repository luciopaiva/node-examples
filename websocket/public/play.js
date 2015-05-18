"use strict";

var
    app;

app = (function () {
    var
        socket;

    function start() {

        console.info('App is starting...');

        $('#buttonLogin').click(function () {
            var
                name;

            name = $('#playerName').val().replace(/^\s+|\s+$/g, '');

            if (name.length) {

                $('#login-view').addClass('hidden').hide();
                $('#wait-view').removeClass('hidden').show();

                socket = io.connect();

                socket.on('connect', function () {
                    $('#wait-view').addClass('hidden').hide();
                    $('#control-view').removeClass('hidden').show();

                    console.info('Socket connected.');
                    socket.emit('play', {
                        name: name
                    });
                });
            }
        });

        $('#buttonUp').click(function () {
            console.info('UP');
            socket.emit('up');
        });

        $('#buttonDown').click(function () {
            console.info('DOWN');
            socket.emit('down');
        });
    }

    return {
        start: start
    };
})();

$(function () {

    app.start();
});
