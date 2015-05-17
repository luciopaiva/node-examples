
var
    express = require('express');

var
    PORT = 8888,
    app = express(),
    count = 0;

app.use(express.static('public'));
app.listen(PORT);

console.info('Server running at localhost:%d', PORT);

/*
// Or event shorter:
var
    express = require('express');

express.use(express.static('public')).listen(8888);
*/
