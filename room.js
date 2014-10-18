var redis = require('redis');
var db = redis.createClient();
var url = require('url');
var jade = require('jade');

function create(request, response) {
    // TODO use get params instead of parse
    var query = url.parse(request.url, true).query;
    var room = query.room;
    var userID = query.user;
    console.log('User ' + userID + ' attempting to create room ' + room);

    function add_room(err, roomID) {
	console.log('room id: ' + roomID);
	db.hset('room:all_rooms', room, roomID);
	var description = userID + '\'s room with id ' + roomID + '!';
	db.hmset('room:' + roomID, 'user', userID, 'name', room, 'description', description);

	joinRoomByID(userID, room, response)(null, roomID);
    }

    function conditionallyAddRoom(err, roomID) {
	if (roomID !== null) {
	    // TODO error throwing, catching
	    response.writeHead(409, {'Content-Type': 'text/plain'});
	    response.write('The room ' + room + ' already exists.');
	    response.end();
	} else {
	    db.incr('room:num_rooms', add_room);
	}
    }

    // TODO move these keys to constants?
    db.hget('room:all_rooms', room, conditionallyAddRoom);
}

function joinRoomByID(userID, room, response) {
    return function(err, roomID) {
	console.log("user " + userID + " room " + room);
	var room_aud_key = 'room:' + roomID + ':audience';
	db.sadd(room_aud_key, userID);

	var room_key = 'room:' + roomID;
	var room_dj_key = 'room:' + roomID + ':djs';
	var room_max_dj_key = 'room:' + roomID + ':max_dj';
	var room_song_key = 'room:' + roomID + ':song';
	var room_data = {};
	db.multi()
	    .zrange(room_dj_key, 0, -1)
	    .smembers(room_aud_key)
	    .hmget(room_key, 'name')
	    .hmget(room_key, 'description')
	    .exec(function (err, replies) {
		    var options = {djs: replies[0],
				   audience: replies[1],
				   name: replies[2],
				   description: replies[3]};
		    console.log("replies: " + replies + " options: " + options);
		    response.send(options);
		});
    };
}

function join(request, response) {
    var query = url.parse(request.url, true).query;
    var userID = query.user;
    var room = query.room;
    console.log('User ' + userID + ' joining room ' + room);

    joinRoomByName(room, userID, response);
}

function joinRoomByName(room, userID, response) {
    db.hget('room:all_rooms', room, joinRoomByID(userID, room, response));
}

function startDJ(request, response) {
    console.log('entering startDJ');
    var query = url.parse(request.url, true).query;
    var userID = query.user;
    var roomID = query.room;

    // TODO validation for ability to dj
    var roomDJKey = 'room:' + roomID + ':djs';
    var roomMaxDJKey = 'room:' + roomID + ':max_dj';
    // TODO debug: TypeError: Object 0 has no method 'get'
    db.incr(roomMaxDJKey, function(err, djScore) {
	    db.zadd(roomDJKey, djScore, userID);
	});
}

function stopDJ(request, response) {
    var query = url.parse(request.url, true).query;
    var userID = query.user;
    var roomID = query.room;

    var roomDJKey = 'room:' + roomID + ':djs';
    var roomMaxDJKey = 'room:' + roomID + ':max_dj';
    db.zrem(roomDJKey, userID);
    // TODO deal with an ever growing max_dj
    db.multi()
	.zcard(roomDJKey)
	.exec(function(err, replies) {
		var num_djs = replies.get(0);
		if (numDJs === 0) {
		    // TODO debug: TypeError: Object 0 has no method 'get'
		    db.set(roomMaxDJKey, 0);
		}
	    });
}

exports.create = create;
exports.join = join;
exports.startDJ = startDJ;
exports.stopDJ = stopDJ;
