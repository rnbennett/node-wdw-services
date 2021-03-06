var http = require('http'),
    _ = require('underscore'),
    config = require('../config'),
    cacheProvider = require('../providers/park-cache-provider.js').ParkCacheProvider,
    parkProvider = require('../providers/park-provider.js'),
    commentProvider = require('../providers/park-comment-provider.js').ParkCommentProvider,
    cache = new cacheProvider(),
    parks = new parkProvider(),
    comments = new commentProvider();

exports.getParks = function(req, res){
    parks.get(null, function(err, data) {
        res.jsonp(data);
    });
};

exports.getParkAttractions = function (req, res) {
    var permalink = req.params.parkPermalink;
    var park;
    parks.get({"permalink": permalink}, function(err, data) {
        park = data;
        cache.get({"parkPermalink": permalink}, function(err, data){
            if (data) {
                result = {
                    park: park,
                    attractions: data
                };
                res.jsonp(result);
            }
            else {
                sourceUrl = config.touringplans.park.attractionList.replace(/{{parkPermalink}}/g, permalink);
                http.get(sourceUrl, function(response) {
                    var data = '';

                    response.on('data', function(chunk) {
                        data += chunk;
                    });

                    response.on('end', function() {
                        cache.save({"parkPermalink": permalink, "data": data});
                        data = JSON.parse(data);
                        result = {
                            park: park,
                            attractions: data
                        };
                        res.jsonp(result);
                    });
                });
            }
        });
    });
};

exports.getParkAttractionDetails = function (req, res) {
    var parkPermalink = req.params.parkPermalink;
    var attractionPermalink = req.params.attractionPermalink;
    var filter = {"parkPermalink": parkPermalink, "attractionPermalink": attractionPermalink};
    var park;
    parks.get({"permalink": parkPermalink}, function(err, data) {
        park = data;
        cache.get(filter, function(err, data) {
            if (data) {
                // We have visited this endpoint before and cached the data.
                // Setup return data payload.

                result = {
                    park: park,
                    attraction: data
                };

                // Get attraction comments.
                comments.get(filter, function(err, data) {
                    result.attraction.comments = data;
                    res.jsonp(result);
                });
            } else {
                // This is the first time we're visiting this TouringPlans endpoint.
                // We're assuming that there are no comments since we've never visited this endpoint before.
                sourceUrl = config.touringplans.park.attractionDetail.replace(/{{parkPermalink}}/g, req.params.parkPermalink);
                sourceUrl = sourceUrl.replace(/{{attractionPermalink}}/g, req.params.attractionPermalink);
                http.get(sourceUrl, function(response) {
                    var data = '';

                    response.on('data', function(chunk) {
                        data += chunk;
                    });

                    response.on('end', function() {
                        cache.save({"parkPermalink": parkPermalink, "attractionPermalink": attractionPermalink, "data" : data});
                        data = JSON.parse(data);
                        result = {
                            park: park,
                            attraction: data
                        };
                        res.jsonp(result);
                    });
                });
            }
        });
    });
};

// Unit test on command line with:
// curl -X POST -d '{"email":"test@cli.com", "score": 5, "details": "test comment"}' http://localhost:3000/locations/parks/magic-kingdom/space-mountain/comment -H "Content-Type:application/json"
exports.setParkAttractionComment = function (req, res) {
    var data = {
        "parkPermalink": req.params.parkPermalink,
        "attractionPermalink": req.params.attractionPermalink,
        "email": req.body.email,
        "score": req.body.score,
        "details": req.body.details
    };

    comments.save(data);

    res.send(200, {status: 'ok'});
};