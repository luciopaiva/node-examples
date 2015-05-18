
var
    express = require('express'),
    app = express(),
    server,
    io = require('socket.io');

var
    ROLE_WATCHER = 1,
    ROLE_PLAYER = 2;

var
    watchers = {},
    players = {},
    nextId = 1;

app.use(express.static('public'));

io = io.listen(app.listen(8888));

function updateWatchers(watcher, player) {
    if (watcher) {
        if (player) {
            watcher.emit('player', player);
        } else {
            watcher.emit('player-list', players);
        }
    } else {
        Object.keys(watchers).forEach(function (watcherId) {
            var
                watcher = watchers[watcherId];

            if (player) {
                watcher.socket.emit('player', player);
            } else {
                watcher.socket.emit('player-list', players);
            }
        })
    }
}

io.on('connect', function (clientSocket) {

    clientSocket.gameId = nextId++;
    console.info('Client #' + clientSocket.gameId + ' has connected.');

    clientSocket
        .on('disconnect', function () {
            var
                playerName;

            if (this.gameRole) {
                switch (this.gameRole) {
                    case ROLE_WATCHER:
                        delete watchers[this.gameId];
                        console.info('A watcher has disconnected.');
                        break;
                    case ROLE_PLAYER:
                        playerName = players[this.gameId].name;
                        delete players[this.gameId];
                        console.info('Player "' + playerName + '" has disconnected.');
                        updateWatchers();
                        break;
                    default:
                        console.error('Unknown client disconnecting!');
                }
            }
        })
        .on('watch', function () {
            var
                watcher = {
                    socket: this
                };
            this.gameRole = ROLE_WATCHER;
            watchers[this.gameId] = watcher;
            console.info('A watcher is online');
            updateWatchers(this);
        })
        .on('play', function (player) {
            var
                newPlayer = {
                    id: this.gameId,
                    name: player.name,
                    x: 100,
                    y: 100
                };
            this.gameRole = ROLE_PLAYER;
            players[this.gameId] = newPlayer;
            console.info('Player "' + player.name + '" is online.');
            updateWatchers(null);
        })
        .on('up', function () {
            var
                player = players[this.gameId];

            console.info('UP');

            player.y -= 10;

            updateWatchers(null, player);
        })
        .on('down', function () {
            var
                player = players[this.gameId];

            console.info('DOWN');

            player.y += 10;

            updateWatchers(null, player);
        });
});
