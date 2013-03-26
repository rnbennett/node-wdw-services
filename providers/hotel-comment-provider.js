var Provider = require('./provider.js').Provider;

function HotelCommentProvider () {}

HotelCommentProvider.prototype = new Provider();

HotelCommentProvider.prototype.save = function(item) {
    this.db.run('INSERT INTO hotelComments (hotelPermalink, email, score, details) VALUES (?, ?, ?, ?)',
        [item.hotelPermalink, item.email, item.score, item.details]);
};

HotelCommentProvider.prototype.get = function(item, callback) {
    var data = [];
    this.db.each('SELECT email, score, details FROM hotelComments WHERE hotelPermalink = ?',
        [item.hotelPermalink],
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

exports.HotelCommentProvider = HotelCommentProvider;