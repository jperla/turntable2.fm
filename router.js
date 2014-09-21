var register = require("./register"),
    url = require("url");

function route(request, response) {
    var url_parts = url.parse(request.url);
    var pathname = url_parts.pathname;
    var query = url_parts.query;
    console.log("About to route a request for " + pathname + " with query " + query);
    switch(url_parts.pathname) {
    case '/register':
	register.register(request, response);
	break;
    default:
	response.write("Default behavior.");
    }
}

exports.route = route;