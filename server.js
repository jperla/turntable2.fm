var http = require('http');
var url = require('url');

function start(route) {
    function onRequest(request, response) {
	route(request, response);
    }

    http.createServer(onRequest).listen(8888);
}

exports.start = start;