var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var app = express();

var room = require('./room');
var lobby = require('./lobby');

var users = [
	     { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
	     , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
	     ];

function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
	fn(null, users[idx]);
    } else {
	fn(new Error('User ' + id + ' does not exist'));
    }
}

function findByUsername(username, fn) {
    console.log('finding by username: ' + username);
    for (var i = 0, len = users.length; i < len; i++) {
	var user = users[i];
	if (user.username === username) {
	    return fn(null, user);
	}
    }
    return fn(null, null);
}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
	done(null, user.id);
    });

passport.deserializeUser(function(id, done) {
	findById(id, function (err, user) {
		done(err, user);
	    });
    });

passport.use(new LocalStrategy(function(username, password, done) {
	    // asynchronous verification, for effect...
	    process.nextTick(function () {
		    // Find the user by username.  If there is no user with the given
		    // username, or the password is not correct, set the user to `false` to
		    // indicate failure and set a flash message.  Otherwise, return the
		    // authenticated `user`.
		    findByUsername(username, function(err, user) {
			    console.log('user after find by ' + user);
			    if (err) { return done(err); }
			    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
			    if (user.password != password) {
				return done(null, false, { message: 'Invalid password' });
			    }
			    return done(null, user);
			});
		});
}));

/* Express configuration */

app.set('views', './views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


app.post('/login', function(req, res, next) {
	console.log('post data: ' + req.body);
	passport.authenticate('local', function(err, user, info) {
		if (err) { return next(err) }
		if (!user) {
		    req.session.messages = [info.message];
		    console.log('redirecting back to home msg: ' + info.message)
		    return res.redirect('/');
		}
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			return res.redirect('/enter_lobby');
		    });
	    })(req, res, next);
    });

app.get('/', function(req, res) {
	res.render('index', { title: 'Hey', message: 'Hello there!'});
    });
app.get('/register', function(req, res) {
	lobby.register(req, res);
    });
app.get('/enter_lobby', ensureAuthenticated, function(req, res) {
	var userID = 11;
	lobby.enterLobby(userID, res);
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

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
	return next();
    }
    res.redirect('/login')
	}
