var redis = require('redis');
var db = redis.createClient();
var url = require('url');

// TODO make command line option
// redis.debug_mode = true;

exports.register = register;