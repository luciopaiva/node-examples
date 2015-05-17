
var
    express = require('express'),
    chalk = require('chalk');

var
    PORT = 8888;

function log(req, res, next) {
    console.info(chalk.gray('[%s] %s requested %s'), new Date(), chalk.blue(req.ip), chalk.yellow(req.url));
    next();
}

express()
    .use(log)
    .use(express.static('public'))
    .listen(PORT);

console.info('Server running at localhost:%d', PORT);
