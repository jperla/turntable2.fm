var lobbySource = $("#lobby-view").html();
console.log("lobby source", lobbySource);
var lobbyTemplate = Handlebars.compile(lobbySource);

var roomSource = $("#room-view").html();
var roomTemplate = Handlebars.compile(roomSource);

function bindRoomHandlers() {
    $('#toggledj').on('click', function(e) {
	    // TODO get actual room name
	    var parameters = { room: "foo",
			       user: 11 };
	    $('#toggledj').val(function(i, toggle) {
		    if (toggle == 'Start DJing') {
			$.get('/start_dj', parameters, function(data) {
				console.log("Started DJing");
			    });
			console.log("returning stop djing");
			return "Stop DJing";
		    } else {
			$.get('/stop_dj', parameters, function(data) {
				console.log("Stopped DJing");
			    });
			console.log("returning START djing");
			return "Start DJing";
		    };
		});
	});
}

function bindLobbyHandlers(rooms) {
	$('#roomcreate').on('keyup', function(e) {
		if(e.keyCode === 13) {
		    var parameters = { room: $(this).val(),
		                       user: 11 };
		    $.get('/create_room', parameters, function(data) {
			    $('#room').html(roomTemplate(data));
			    bindRoomHandlers();
			    $('#lobby').empty();
			});
		};
	    });

	for (var room in rooms) {
	    var roomTag = '#room_' + rooms[room];
	    $(document).on('click', roomTag, function(e) {
		    var parameters = { room: $(this).val(),
				       user: 11 };
		    $.get('/join_room', parameters, function(data) {
			    $('#room').html(roomTemplate(data));
			    bindRoomHandlers();
			    $('#lobby').empty();
			});
		});
	}
    }

function goToLobby(e) {
    var parameters = { user: 11 };
    $.get('/enter_lobby', function(data) {
	    console.log("response from enter lobby: " + data);
	    $('#lobby').html(lobbyTemplate(data));
	    // TODO more consistent handler binding
	    bindLobbyHandlers(data['rooms']);
	    $('#register').empty();
	});
}

$(function() {
	console.log("entering the main function");

	/* $('#loginform').submit(function(e) {
		console.log('loginform submitted');
		goToLobby(e, lobbyTemplate);
		}); */

	$('#home').on('click', function(e) {
		goToLobby(e, lobbyTemplate);
	    });

	$('#lobby').load(function(e) {
		goToLobby(e, lobbyTemplate);
	    });
    });