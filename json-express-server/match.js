
var
    format = require('util').format,
    r = Math.random;

function alternate(current) {
    return current == 0 ? 1 : 0;
}

function printScore(player1, player2) {
    return format('%s %d x %d %s', player1.name, player1.score, player2.score, player2.name);
}

function simulate(player1, player2) {
    var
        players = [player1, player2],
        log = [],
        whoScores,
        winner,
        serveCount = 0,
        serving,
        result = {};

    players[0].score = 0;
    players[1].score = 0;

    serving = r() < .5 ? 0: 1;

    log.push(format('%s starts serving.', players[serving].name));

    while (true) {

        serveCount++;

        whoScores = r() < (player1.level) / (player1.level + player2.level) ? 0 : 1;

        players[whoScores].score++;
        log.push(format('%s scores.', players[whoScores].name));

        if ((players[whoScores].score >= 21) &&
            (players[whoScores].score - players[alternate(whoScores)].score) > 1) {

            winner = whoScores;
            log.push(format('%s is the winner. The final score is %s', players[whoScores].name, printScore(player1, player2)));
            break;
        }

        log.push(format('The score is %s.', printScore(player1, player2)));

        if (serveCount == 2) {
            serveCount = 0;
            serving = alternate(serving);
            log.push(format('%s is now serving.', players[serving].name));
        }
    }

    result.winner =players[winner].name;
    result[player1.name] = player1.score;
    result[player2.name] = player2.score;
    result.log = log;

    return result;
}

module.exports = simulate;
