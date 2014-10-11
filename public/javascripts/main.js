function bindRoomCreate() {
	var roomSource = $("#room-view").html();
	var roomTemplate = Handlebars.compile(roomSource);

	$('#roomcreate').on('keyup', function(e) {
		console.log("heard a key on room create");
		if(e.keyCode === 13) {
		    var parameters = { room: $(this).val(),
		                       user: 11 };
		    $.get( '/create_room', parameters, function(data) {
			    console.log(data);
			    $('#room').html(roomTemplate(data));
			    $('#lobby').empty();
			});
		};
	    });
    }

$(function(){
	var lobbySource = $("#lobby-view").html();
	var lobbyTemplate = Handlebars.compile(lobbySource);

	$('#user').on('keyup', function(e) {
		if(e.keyCode === 13) {
		    var parameters = { user: 11 };
		    $.get('/enter_lobby', parameters, function(data) {
			    console.log("response from enter lobby: " + data);
			    $('#lobby').html(lobbyTemplate(data));
			    bindRoomCreate();
			    $('#register').empty();
			});
		};
	    });

    });