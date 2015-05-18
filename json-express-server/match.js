
var
    format = require('util').format,
    r = Math.random;

function alternate(current) {
    return current == 0 ? 1 : 0;
}

function printScore(player1, score1, player2, score2) {
    return format('%s %d x %d %s', player1.name, score1, score2, player2.name);
}

function simulate(player1, player2) {
    var
        players = [player1, player2],
        scores = [0, 0],
        log = [],
        whoScores,
        threshold,
        winner,
        serveCount = 0,
        serving,
        result = {};

    threshold = (player1.level) / (player1.level + player2.level);

    scores[0] = 0;
    scores[1] = 0;

    serving = r() < .5 ? 0 : 1;

    log.push(format('%s starts serving.', players[serving].name));

    while (true) {

        whoScores = r() < threshold ? 0 : 1;

        scores[whoScores]++;
        log.push(format('%s scores.', players[whoScores].name));

        if ((scores[whoScores] >= 21) &&
            (scores[whoScores] - scores[alternate(whoScores)]) > 1) {

            winner = whoScores;
            log.push(format('%s is the winner. The final score is %s',
                players[whoScores].name,
                printScore(player1, scores[0], player2, scores[1])));
            break;
        }

        log.push(format('The score is %s.', printScore(player1, scores[0], player2, scores[1])));

        serveCount++;

        if (serveCount == 2) {
            serveCount = 0;
            serving = alternate(serving);
            log.push(format('%s is now serving.', players[serving].name));
        }
    }

    result.winner = players[winner].name;
    result[player1.name] = scores[0];
    result[player2.name] = scores[1];
    result.log = log;

    return result;
}

module.exports = simulate;
