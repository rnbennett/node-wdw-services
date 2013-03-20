var sqlite3 = require('sqlite3'),
    fs = require('fs');

function ParkCommentProvider () {
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

ParkCommentProvider.prototype = {

    save: function(item) {
        this.db.run('INSERT INTO parkAttractionComments (parkPermalink, attractionPermalink, email, score, details) VALUES (?, ?, ?, ?, ?)',
            [item.parkPermalink, item.attractionPermalink, item.email, item.score, item.details]);
    },

    get: function(item, callback) {
        var data = [];
        this.db.each('SELECT email, score, details FROM parkAttractionComments WHERE parkPermalink = ? AND attractionPermalink = ?',
            [item.parkPermalink, item.attractionPermalink],
            function(err, row) {
                data.push(
                    {
                        email: row.email,
                        score: row.score,
                        details: row.details
                    }
                );
            },
            function (err) {
                callback(err, data);
            }
        );
    }

};

exports.ParkCommentProvider = ParkCommentProvider;