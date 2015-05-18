
var
    fs = require('fs'),
    http = require('http');

var
    MESSAGES_FILE = 'facts.txt',
    messages,
    PORT = 8888;

function onRequest(request, response) {
    var
        pos;

    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    pos = Math.floor(Math.random() * messages.length);
    response.end(messages[pos]);
}

function main() {

    messages = fs.readFileSync(MESSAGES_FILE, 'utf-8').split('\n');
    http.createServer(onRequest).listen(PORT);
    console.info('Server running at localhost:%d', PORT);
}

main();
