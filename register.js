var redis = require("redis"),
    db = redis.createClient(),
    url = require("url");

redis.debug_mode = true;

function register(request, response) {
    var query = url.parse(request.url, true).query;
    var user = query.user;
    var password = query.password;

    db.set(user, password);
    response.write("User " + user + " created.");
}

exports.register = register;