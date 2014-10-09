var express = require('express');
var app = express();

var room = require('./room');
var lobby = require('./lobby');

app.set('views', './views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.render('index', { title: 'Hey', message: 'Hello there!'});
    });
app.get('/register', function (req, res) {
	lobby.register(req, res);
    });
app.get('/enter_lobby', function (req, res) {
	lobby.enterLobby(req, res);
    });
app.get('/create_room', function (req, res) {
	room.create(req, res);
    });
app.get('/join_room', function (req, res) {
	room.join(req, res);
    });
app.get('/start_dj', function (req, res) {
	room.startDJ(req, res);
    });
app.get('/stop_dj', function (req, res) {
	room.stopDJ(req, res);
    });
app.get('/upload', function (req, res) {
	music.upload(req, res);
    });
app.get('/bulk_upload', function (req, res) {
	music.bulkUpload(req, res);
    });
app.get('/insert_in_queue', function (req, res) {
	music.insertInQueue(req, res);
    });
app.get('/create_queue', function (req, res) {
	music.createQueue(req, res);
    });

var server = app.listen(8888, function() {
	console.log('Listening on port %d', server.address().port);
    });