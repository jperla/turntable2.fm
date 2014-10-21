var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({id: String,
				  email: String,
				  password: String});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
	fn(null, users[idx]);
    } else {
	fn(new Error('User ' + id + ' does not exist'));
    }
}

function findByUsername(username, fn) {
    console.log('username in find by: ' + username)
    for (var i = 0, len = users.length; i < len; i++) {
	var user = users[i];
	if (user.username === username) {
	    return fn(null, user);
	}
    }
    return fn(null, null);
}


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);