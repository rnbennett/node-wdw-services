var sqlite3 = require('sqlite3'),
    fs = require('fs');

function Provider () {
    // Create application database if it does not exist.
    this.db = null;

    var that = this;

    fs.exists('./app.db', function (exists) {
        that.db = new sqlite3.Database('./app.db');

        if (!exists) {
            console.info('Creating database. This may take a while...');
            fs.exists('app.sql', 'utf8', function (err, data) {
                if (err) throw err;
                that.db.exec(data, function (err) {
                    if (err) throw err;
                    console.info('Done.');
                });
            });
        }
    });
}

Provider.prototype = {

    save: function() {
    },

    get: function() {
    }
};

exports.Provider = Provider;