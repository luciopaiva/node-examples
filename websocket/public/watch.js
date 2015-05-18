"use strict";

var
    app;

app = (function () {
    var
        players = {},
        socket;

    function updatePlayer(player) {
        var
            x = player.x, y = player.y;

        console.info('Player new position: ' + x + ', ' + y);

        player.shape.attr('transform', 'translate(' + x + ',' + y + ')');
    }

    function start() {

        console.info('App is starting...');

        socket = io.connect();

        socket.on('connect', function () {
            console.info('Socket connected.');

            socket.emit('watch');
        });

        socket.on('player', function (player) {
            var
                shape = players[player.id].shape;

            console.info('Player position updated');
            console.dir(player);

            players[player.id] = player;
            players[player.id].shape = shape;

            updatePlayer(player);
        });

        socket.on('player-list', function (updatedPlayers) {
            var
                playerCount = Object.keys(updatedPlayers).length,
                text;

            console.info('Received players list');

            Object.keys(updatedPlayers).forEach(function (playerId) {
                var
                    shape,
                    isNewPlayer = !players[playerId];

                if (isNewPlayer) {
                    shape = $('#player-template').clone();
                    shape.attr('id', 'player' + playerId);
                    shape.appendTo('#map');
                    shape.find('.player-name').text(updatedPlayers[playerId].name);
                } else {
                    shape = players[playerId].shape;
                }

                players[playerId] = updatedPlayers[playerId];
                players[playerId].shape = shape;

                updatePlayer(players[playerId]);
            });

            Object.keys(players).forEach(function (playerId) {

                if (!updatedPlayers[playerId]) {
                    players[playerId].shape.remove();
                    delete players[playerId];
                }
            });

            if (playerCount) {
                text = playerCount + ' player' + (playerCount > 1 ? 's' : '') + ' online';
            } else {
                text = 'No players online';
            }

            $('#playerCount').text(text);
        });
    }

    return {
        start: start
    };
})();

$(function () {

    app.start();
});
