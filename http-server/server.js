
var
    http = require('http');

var
    PORT = 8888,
    count = 0;

function onRequest(request, response) {

    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    response.end('Response #' + ++count);
}

http.createServer(onRequest).listen(PORT, 'localhost');

console.info('Server running at localhost:%d', PORT);
