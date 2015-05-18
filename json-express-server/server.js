
var
    format = require('util').format,
    express = require('express'),
    match = require('./match');

var
    PORT = 8888,
    players = require('./players');

express()
    .use('/match/:player1(\\w+)/:player2(\\w+)', function (req, res, next) {
        var
            player1, player2,
            errors = [];

        player1 = players.get(req.params.player1);
        player2 = players.get(req.params.player2);

        if (!player1) {
            errors.push(format('Unknown player \'%s\'', req.params.player1));
        }
        if (!player2) {
            errors.push(format('Unknown player \'%s\'', req.params.player2));
        }

        if (errors.length == 0) {
            res.json(match(player1, player2));
        } else {
            res.json({
                errors: errors
            });
        }
    })
    .listen(PORT);

console.info('Server running at localhost:%d', PORT);
