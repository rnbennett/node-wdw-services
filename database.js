var sqlite3 = require('sqlite3');
var fs = require('fs');

var db = new sqlite3.Database('./app.db');

module.exports = exports = db;