var http = require('http');

exports.getHotels = function(req, res){
    sourceUrl = config.touringplans.hotel.hotelList;
    http.get(sourceUrl, function(response) {
        var data = '';

        response.on('data', function(chunk) {
            data += chunk;
        });

        response.on('end', function() {
            //cache.save({"parkPermalink": permalink, "data": data});
            data = JSON.parse(data);
            res.jsonp(data);
        });
    });
};

exports.getHotelDetails = function (req, res) {
    var hotelPermalink = req.params.hotelPermalink;
    sourceUrl = config.touringplans.hotel.hotelDetail.replace(/{{hotelPermalink}}/g, hotelPermalink);
    http.get(sourceUrl, function(response) {
        var data = '';

        response.on('data', function(chunk) {
            data += chunk;
        });

        response.on('end', function() {
//            cache.save({"parkPermalink": parkPermalink, "attractionPermalink": attractionPermalink, "data" : data});
            data = JSON.parse(data);
            res.jsonp(data);
        });
    });
};