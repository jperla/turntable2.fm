var http = require('http');
var url = require('url');

function start(route) {
    function onRequest(request, response) {
	response.writeHead(200, {'Content-Type': 'text/plain'});
	route(request, response);
	response.end();
    }

    http.createServer(onRequest).listen(8888);
}

exports.start = start;