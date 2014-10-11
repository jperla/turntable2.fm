var redis = require('redis');
var db = redis.createClient();
var url = require('url');
var jade = require('jade');

// redis.debug_mode = process.argv[2];

function enterLobby(userID, res) {
    db.hkeys('room:all_rooms', function(err, allRooms) {
	    var options = {rooms: allRooms,
	                   user: userID};
	    res.send(options);
	});
}


function hashFn(s) {
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
    db.hget('user:all_users', user, function (err, existingUserID) {
	    if (existingUserID != null) {
		// TODO is there a less redundant way to do this stuff?
		response.writeHead(409, {'Content-Type': 'text/plain'});
		response.write('The username ' + user + ' is already taken.');
		response.end();
	    } else {
		// TODO nesting these callbacks looks awkward to me...is there a better convention?
		db.incr('user:num_users', function(err, userID) {
			console.log('user id: ' + userID);
			var hash_password = hash_fn(password);
			db.hset('user:all_users', user, userID);
			db.hmset('user:' + userID, 'username', user, 'password', hash_password);

			enterLobby(request, response)
		    });
	    }
	});
}

exports.enterLobby = enterLobby
exports.register = register