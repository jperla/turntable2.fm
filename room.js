var redis = require('redis');
var db = redis.createClient();
var url = require('url');

function create(request, response) {
        // TODO use get params instead of parse
    var query = url.parse(request.url, true).query;
    var room = query.room;
    var userID = query.user;
    console.log('User ' + userID + ' aAttempting to create room ' + room);

    function add_room(err, roomID) {
	console.log('room id: ' + roomID);
	db.sadd('room:all_rooms', room);
	var description = userID + '\'s room with id ' + roomID + '!';
	db.hmset('room:' + roomID, 'user', userID, 'name', room, 'description', description);
	
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.write('Room ' + room + ' created.');
	response.end();
    }

    function conditionally_add_room(err, room_exists) {
	if (room_exists) {
	    // TODO is there a less redundant way to do this stuff?
	    response.writeHead(409, {'Content-Type': 'text/plain'});
	    response.write('The room ' + room + ' already exists.');
	    response.end();
	} else {
	    db.incr('room:num_rooms', add_room);
	}
    }

    // TODO move these keys to constants?
    db.sismember('room:all_rooms', room, conditionally_add_room);
}

function join(request, response) {
    var query = url.parse(request.url, true).query;
    var userID = query.user;
    var roomID = query.room;

    var room_aud_key = 'room:' + roomID + ':audience';
    db.sadd(room_aud_key, userID);

    // TODO set response json
    var room_key = 'room:' + roomID;
    var room_dj_key = 'room:' + roomID + ':djs';
    var room_max_dj_key = 'room:' + roomID + ':max_dj';
    var room_song_key = 'room:' + roomID + ':song';
    var room_data = {};
    db.zcard(room_max_dj_key, function(err, num_djs) {
	    db.multi()
		.zrange(room_dj_key, 0, num_djs)
		.smembers(room_aud_key)
		.hmget(room_key, 'name')
		.hmget(room_key, 'description')
		.exec(function (err, replies) {
			var djs = replies[0];
			var audience = replies[1];
			var name = replies[2];
			var description = replies[3];
			response.writeHead(200, {'Content-Type': 'application/json'});
			response.write(JSON.stringify({
				"name": name,
				"id": roomID,
				"description": description,
				"djs": djs,
				"audience": audience
				    }));
			response.end();
		    });
	});
}

function start_dj(request, response) {
    var query = url.parse(request.url, true).query;
    var userID = query.user;
    var roomID = query.room;

    // TODO validation for ability to dj?
    var room_dj_key = 'room:' + roomID + ':djs';
    var room_max_dj_key = 'room:' + roomID + ':max_dj';
    db.incr(room_max_dj_key, function(err, dj_score) {
	    db.zadd(room_dj_key, dj_score, userID);
	});
}

function stop_dj(request, response) {
    var query = url.parse(request.url, true).query;
    var userID = query.user;
    var roomID = query.room;

    var room_dj_key = 'room:' + roomID + ':djs';
    var room_max_dj_key = 'room:' + roomID + ':max_dj';
    db.zrem(room_dj_key, userID);
    // TODO is this the right way to deal with an ever growing max_dj?
    db.multi()
	.zcard(room_dj_key)
	.exec(function(err, replies) {
		var num_djs = replies.get(0);
		if (num_djs == 0) {
		    db.set(room_max_dj_key = 0);
		}
	    });
}

exports.create = create;
exports.join = join;
exports.start_dj = start_dj;
exports.stop_dj = stop_dj;