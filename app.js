var finalhandler = require('finalhandler');
var http = require('http');
var serveStatic = require('serve-static');

// Serve up public/ftp folder
var serve = serveStatic('./static', {'index': ['index.html']});

// Create server
var server = http.createServer(function onRequest (req, res) {
    serve(req, res, finalhandler(req, res));
})

// Listen
var port = process.env.PORT || 3000;
server.listen(port);
console.log('Listening on port', port);
