
var
    express = require('express');

var
    PORT = 8888,
    app = express(),
    count = 0;

function onRequest(request, response) {

    response.send('Response #' + ++count);
}

app.get('/', onRequest).listen(PORT);

console.info('Server running at localhost:%d', PORT);
