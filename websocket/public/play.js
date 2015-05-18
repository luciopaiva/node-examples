"use strict";

var
    app;

app = (function () {
    var
        socket;

    function startTouchPad() {
        var
            touchPad,
            innerCircle,
            screenWidth = $(window).width(),
            screenHeight = $(window).height(),
            screenCenterX = screenWidth / 2,
            screenCenterY = screenHeight / 2,
            padDiameter = Math.round(screenWidth * .85),
            stepTimer = null,
            isTouching = false;

        touchPad = $('#touchpad');
        touchPad
            .width(padDiameter)
            .height(padDiameter)
            .css('top', screenHeight / 2 - touchPad.height() / 2)
            .css('left', screenWidth / 2 - touchPad.width() / 2);

        $('#pad-outer-circle')
            .attr('cx', padDiameter / 2)
            .attr('cy', padDiameter / 2)
            .attr('r', padDiameter / 2)
            .attr('fill', 'black');

        innerCircle = $('#pad-inner-circle');
        innerCircle
            .attr('cx', padDiameter / 2)
            .attr('cy', padDiameter / 2)
            .attr('r', padDiameter / 20)
            .attr('fill', '#333');

        touchPad
            .on('touchstart', function (evt) {
                var
                    dx, dy, delta;

                evt.preventDefault();
                //startPosX = evt.originalEvent.changedTouches[0].clientX;
                //startPosY = evt.originalEvent.changedTouches[0].clientY;
                isTouching = true;

                dx = evt.originalEvent.changedTouches[0].clientX - screenCenterX;
                dy = evt.originalEvent.changedTouches[0].clientY - screenCenterY;

                dx = (dx > 100 ? 100 : dx < -100 ? -100 : dx);
                dy = (dy > 100 ? 100 : dy < -100 ? -100 : dy);

                dx /= 15;
                dy /= 15;

                delta = { dx: dx, dy: dy };

                console.dir(delta);

                socket.emit('move', delta);
                clearInterval(stepTimer);
                stepTimer = window.setInterval(function () {
                    socket.emit('move', delta);
                    console.info('Time ticks');
                }, 10);
            })
            .on('touchmove', function (evt) {
                var
                    dx, dy, delta;

                evt.preventDefault();

                dx = evt.originalEvent.changedTouches[0].clientX - screenCenterX;
                dy = evt.originalEvent.changedTouches[0].clientY - screenCenterY;

                dx = (dx > 100 ? 100 : dx < -100 ? -100 : dx);
                dy = (dy > 100 ? 100 : dy < -100 ? -100 : dy);

                dx /= 15;
                dy /= 15;

                delta = { dx: dx, dy: dy };

                console.dir(delta);

                socket.emit('move', delta);
                clearInterval(stepTimer);
                stepTimer = window.setInterval(function () {
                    socket.emit('move', delta);
                    console.info('Time ticks');
                }, 10);
            })
            .on('touchend', function (evt) {
                evt.preventDefault();

                isTouching = false;
                socket.emit('move', { dx: 0, dy: 0 });
                clearInterval(stepTimer);
                stepTimer = null;
            })
            .on('touchcancel', function (evt) {
                evt.preventDefault();

                isTouching = false;
                socket.emit('move', { dx: 0, dy: 0 });
                clearInterval(stepTimer);
                stepTimer = null;
            })
            .on('touchleave', function (evt) {
                evt.preventDefault();

                isTouching = false;
                socket.emit('move', { dx: 0, dy: 0 });
                clearInterval(stepTimer);
                stepTimer = null;
            });
    }

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

                    startTouchPad();
                    $('#control-view').show();

                    console.info('Socket connected.');
                    socket.emit('play', {
                        name: name
                    });
                });
            }
        });
    }

    return {
        start: start
    };
})();

$(function () {

    app.start();
});
