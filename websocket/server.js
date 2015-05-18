
var
    express = require('express'),
    io = require('socket.io');

var
    ROLE_WATCHER = 1,
    ROLE_PLAYER = 2;

var
    watchers = {},
    players = {},
    nextId = 1;

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

function clientDisconnect() {
    var
        playerName;

    if (this.gameRole) {
        switch (this.gameRole) {
            case ROLE_WATCHER:
                delete watchers[this.gameClientId];
                console.info('A watcher has disconnected.');
                break;
            case ROLE_PLAYER:
                playerName = players[this.gameClientId].name;
                delete players[this.gameClientId];
                console.info('Player "' + playerName + '" has disconnected.');
                updateWatchers();
                break;
            default:
                console.error('Unknown client disconnecting!');
        }
    }
}

function watcherOnline() {
    var
        watcher = {
            socket: this
        };
    this.gameRole = ROLE_WATCHER;
    watchers[this.gameClientId] = watcher;
    console.info('A watcher is online');
    updateWatchers(this);
}

function playerOnline(player) {
    var
        newPlayer = {
            id: this.gameClientId,
            name: player.name,
            x: 100,
            y: 100
        };
    this.gameRole = ROLE_PLAYER;
    players[this.gameClientId] = newPlayer;
    console.info('Player "' + player.name + '" is online.');
    updateWatchers(null);
}

function playerMove(delta) {
    var
        player = players[this.gameClientId];

    player.x += delta.dx;
    player.y += delta.dy;

    updateWatchers(null, player);
}

function main() {
    var
        app = express();

    app.use(express.static('public'));

    io = io.listen(app.listen(8888));

    io.on('connect', function (clientSocket) {

        clientSocket.gameClientId = nextId++;
        console.info('Client #' + clientSocket.gameClientId + ' has connected.');

        clientSocket
            .on('disconnect', clientDisconnect.bind(clientSocket))
            .on('watch', watcherOnline.bind(clientSocket))
            .on('play', playerOnline.bind(clientSocket))
            .on('move', playerMove.bind(clientSocket));
    });
}

main();
