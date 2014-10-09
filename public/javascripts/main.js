$(function(){
	var source = $("#room-view").html();
	var dataTemplate = Handlebars.compile(source);

	$('#roomcreate').on('keyup', function(e){
		if(e.keyCode === 13) {
		    var parameters = { room: $(this).val(),
		                       user: 11 };
		    $.get( '/create_room', parameters, function(data) {
			    console.log(data);
			    $('#rooms').html(dataTemplate(data));
			});
		};
	    });
    });

function loadXMLDoc() {
    console.log("loading xml doc...done");
}

function randomChange() {
    console.log("random change...done");
}