var redis = require('redis');
var db = redis.createClient();
var url = require('url');

// TODO make command line option
redis.debug_mode = true;

function hash_fn(s) {
    // TODO hash and salt :)
    return s;
}

function register(request, response) {
    // TODO use get params instead of parse
    var query = url.parse(request.url, true).query;
    var user = query.user;
    var password = query.password;
    console.log('Attempting to create user ' + user);

    // TODO move these keys to constants?
    db.sismember('all_users', user, function (err, obj) {
	    if (obj) {
		// TODO is there a less redundant way to do this stuff?
		response.writeHead(409, {'Content-Type': 'text/plain'});
		response.write('The username ' + user + ' is already taken.');
		response.end();
	    } else {
		// TODO nesting these callbacks looks awkward to me...is there a better convention?
		db.incr('constants:num_users', function(err, userID) {
			console.log('user id: ' + userID);
			var hash_password = hash_fn(password);
			db.sadd('all_users', user);
			db.hmset('user:' + userID, 'username', user, 'password', hash_password);

			response.writeHead(200, {'Content-Type': 'text/plain'});
			response.write('User ' + user + ' created.');
			response.end();
		    });
	    }
	});
}

exports.register = register;