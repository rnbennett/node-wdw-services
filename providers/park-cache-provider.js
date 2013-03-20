var Provider = require('./provider.js').Provider;

function ParkCacheProvider () {}

ParkCacheProvider.prototype = new Provider();

ParkCacheProvider.prototype.save = function(item) {
    this.db.run('INSERT INTO parkCache (parkPermalink, attractionPermalink, data) VALUES (?, ?, ?)',
        [item.parkPermalink, item.attractionPermalink, item.data]);
};

ParkCacheProvider.prototype.get = function(item, callback) {
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
};

exports.ParkCacheProvider = ParkCacheProvider;