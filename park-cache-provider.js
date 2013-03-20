var sqlite3 = require('sqlite3'),
    fs = require('fs');

    function ParkCacheProvider () {
        // Create application database if it does not exist.
        this.db = null;

        var that = this;

        fs.exists('./app.db', function (exists) {
            that.db = new sqlite3.Database('./app.db');

            if (!exists) {
                console.info('Creating database. This may take a while...');
                fs.readFile('app.sql', 'utf8', function (err, data) {
                    if (err) throw err;
                    that.db.exec(data, function (err) {
                        if (err) throw err;
                        console.info('Done.');
                    });
                });
            }
        });
    }

    ParkCacheProvider.prototype = {

        insert: function(item) {
            this.db.run('INSERT INTO parkCache (parkPermalink, attractionPermalink, data) VALUES (?, ?, ?)',
                [item.parkPermalink, item.attractionPermalink, item.data]);
        },

        get: function(item, callback) {
            //parkPermalink, attractionPermalink
            var whereParkPermalink = item.parkPermalink ? "parkPermalink = ?" : "parkPermalink IS NULL";
            var whereAttractionPermalink = item.attractionPermalink ? "attractionPermalink = ?" : "attractionPermalink IS NULL";
            var query = 'SELECT * FROM parkCache WHERE ' + whereParkPermalink + ' AND ' + whereAttractionPermalink;

            this.db.get(query,
                [item.parkPermalink, item.attractionPermalink],
                function(err, row) {
                    var data = row ? JSON.parse(row.data) : null;
                    callback(err, data);
                }
            );
        }
    };

exports.ParkCacheProvider = ParkCacheProvider;