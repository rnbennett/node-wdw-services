var http = require('http'),
    config = require('../config'),
    cacheProvider = require('../providers/hotel-cache-provider.js').HotelCacheProvider,
    cache = new cacheProvider();

exports.getHotels = function(req, res){
    cache.get({"hotelPermalink": "all"}, function(err, data) {
        if (data) {
            res.jsonp(data);
        } else {
            sourceUrl = config.touringplans.hotel.hotelList;
            http.get(sourceUrl, function(response) {
                var data = '';

                response.on('data', function(chunk) {
                    data += chunk;
                });

                response.on('end', function() {
                    cache.save({"hotelPermalink": "all", "data": data});
                    data = JSON.parse(data);
                    res.jsonp(data);
                });
            });
        }
    });
};

exports.getHotelDetails = function (req, res) {
    var hotelPermalink = req.params.hotelPermalink;
    cache.get({"hotelPermalink": hotelPermalink}, function(err, data) {
        if (data) {
            res.jsonp(data);
        } else {
            sourceUrl = config.touringplans.hotel.hotelDetail.replace(/{{hotelPermalink}}/g, hotelPermalink);
            http.get(sourceUrl, function(response) {
                var data = '';

                response.on('data', function(chunk) {
                    data += chunk;
                });

                response.on('end', function() {
                    cache.save({"hotelPermalink": hotelPermalink, "data" : data});
                    data = JSON.parse(data);
                    res.jsonp(data);
                });
            });
        }
    });
};