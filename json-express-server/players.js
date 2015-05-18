
var
    players = {
        'marcelo': {
            name: 'Marcelo',
            level: 5
        },
        'ricardo': {
            name: 'Ricardo',
            level: 4
        },
        'gastao': {
            name: 'Gastão',
            level: 5
        },
        'roberto': {
            name: 'Roberto',
            level: 5
        },
        'eduardo': {
            name: 'Duda',
            level: 2
        },
        'vinicius': {
            name: 'Vinicius',
            level: 5
        },
        'lucio': {
            name: 'Lucio',
            level: 2
        },
        'dania': {
            name: 'Dânia',
            level: 0.5
        },
        'gabriel': {
            name: 'Gabriel',
            level: 4.5
        },
        'adriana': {
            name: 'Adriana',
            level: 0.5
        }
    };

module.exports = {
    get: function (playerName) {

        if (players[playerName]) {
            return players[playerName];
        } else {
            return null;
        }
    }
};
