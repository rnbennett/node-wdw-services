var config = require('./config.js');
var sqlite3 = require('sqlite3');

var db = new sqlite3.Database(config.sqlite.dbPath);

module.exports = exports = db;