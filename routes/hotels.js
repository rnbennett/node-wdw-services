var http = require('http'),
    config = require('../config'),
    cacheProvider = require('../providers/hotel-cache-provider.js').HotelCacheProvider,
    commentProvider = require('../providers/hotel-comment-provider.js').HotelCommentProvider,
    cache = new cacheProvider();
    comments = new commentProvider();

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
    var filter = {"hotelPermalink": hotelPermalink};
    cache.get(filter, function(err, data) {
        if (data) {

            result = data;

            // Get attraction comments.
            comments.get(filter, function(err, data) {
                result.comments = data;
                res.jsonp(result);
            });

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

// Unit test on command line with:
// curl -X POST -d '{"email":"test@cli.com", "score": 5, "details": "test comment"}' http://localhost:3000/locations/hotels/disneys-contemporary-resort/comment -H "Content-Type:application/json"
exports.setHotelComment = function (req, res) {
    var data = {
        "hotelPermalink": req.params.hotelPermalink,
        "email": req.body.email,
        "score": req.body.score,
        "details": req.body.details
    };

    comments.save(data);

    res.send(200, {status: 'ok'});
};