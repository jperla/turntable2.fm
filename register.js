var redis = require('redis');
var db = redis.createClient();
var url = require('url');

redis.debug_mode = true;

function register(request, response) {
    // TODO use get params instead of parse
    var query = url.parse(request.url, true).query;
    var user = query.user;
    var password = query.password;

    db.set(user, password);
    response.write('User ' + user + ' created.');
}

exports.register = register;