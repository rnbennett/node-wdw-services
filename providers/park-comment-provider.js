var Provider = require('./provider.js').Provider;

function ParkCommentProvider () {}

ParkCommentProvider.prototype = new Provider();

ParkCommentProvider.prototype.save = function(item) {
    this.db.run('INSERT INTO parkAttractionComments (parkPermalink, attractionPermalink, email, score, details) VALUES (?, ?, ?, ?, ?)',
        [item.parkPermalink, item.attractionPermalink, item.email, item.score, item.details]);
};

ParkCommentProvider.prototype.get = function(item, callback) {
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
};

exports.ParkCommentProvider = ParkCommentProvider;