var register = require('./register');
var room = require('./room');
var url = require('url');

function route(request, response) {
    var url_parts = url.parse(request.url);
    var pathname = url_parts.pathname;
    var query = url_parts.query;
    console.log('About to route a request for ' + pathname + ' with query ' + query);
    switch(url_parts.pathname) {
    case '/register':
	register.register(request, response);
	break;
    case '/create_room':
	room.create(request, response);
	break;
    case '/join_room':
	room.join(request, response);
	break;
    case '/start_dj':
	room.start_dj(request, response);
	break;
    case '/stop_dj':
	room.stop_dj(request, response);
	break;
    case '/upload':
	music.upload(request, response);
	break;
    case '/upload':
	music.upload(request, response);
	break;
    case '/upload':
	music.bulk_upload(request, response);
	break;
    case '/insert_in_queue':
	music.insert_in_queue(request, response);
	break;
    case '/create_queue':
	music.create_queue(request, response);
	break;
    default:
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write('That page does not exist.');
	response.end()
    }
}

exports.route = route;