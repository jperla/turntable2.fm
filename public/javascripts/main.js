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
	var roomSource = $("#room-view").html();
	var roomTemplate = Handlebars.compile(roomSource);
	// TODO handlebar template passing (or use jade?)

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

function goToLobby(e, lobbyTemplate) {
    var parameters = { user: 11 };
    $.get('/enter_lobby', parameters, function(data) {
	    console.log("response from enter lobby: " + data);
	    $('#lobby').html(lobbyTemplate(data));
	    // TODO more consistent handler binding
	    bindLobbyHandlers(data['rooms']);
	    $('#register').empty();
	});
}

$(function() {
	var lobbySource = $("#lobby-view").html();
	var lobbyTemplate = Handlebars.compile(lobbySource);

	$('#user').on('keyup', function(e) {
		if (e.keyCode === 13) {
		    goToLobby(e, lobbyTemplate);
		};
	    });

	$('#home').on('click', function(e) {
		goToLobby(e, lobbyTemplate);
	    });
    });