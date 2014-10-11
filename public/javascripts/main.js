$(function(){
	var source = $("#room-view").html();
	var dataTemplate = Handlebars.compile(source);

	$('#roomcreate').on('keyup', function(e){
		if(e.keyCode === 13) {
		    var parameters = { room: $(this).val(),
		                       user: 11 };
		    $.get( '/create_room', parameters, function(data) {
			    console.log(data);
			    $('#room').html(dataTemplate(data));
			    $('#lobby').empty();
			});
		};
	    });
    });

$(function(){
	var source = $("#lobby-view").html();
	var dataTemplate = Handlebars.compile(source);

	$('#user').on('keyup', function(e) {
		if(e.keyCode === 13) {
		    var parameters = { user: 11 };
		    $.get('/enter_lobby', parameters, function(data) {
			    console.log("response from enter lobby: " + data);
			    $('#lobby').html(dataTemplate(data));
			    $('#register').empty();
			});
		};
	    });
    });