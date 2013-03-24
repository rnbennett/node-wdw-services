var Provider = require('./provider.js').Provider;

function HotelCacheProvider () {}

HotelCacheProvider.prototype = new Provider();

HotelCacheProvider.prototype.save = function(item) {
    this.db.run('INSERT INTO hotelCache (hotelPermalink, data) VALUES (?, ?)',
        [item.hotelPermalink, item.data]);
};

HotelCacheProvider.prototype.get = function(item, callback) {
    this.db.get('SELECT * FROM hotelCache WHERE hotelPermalink = ?',
        [item.hotelPermalink],
        function(err, row) {
            var data = row ? JSON.parse(row.data) : null;
            callback(err, data);
        }
    );
};

exports.HotelCacheProvider = HotelCacheProvider;