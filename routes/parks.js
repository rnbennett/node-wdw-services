var http = require('http'),
    _ = require('underscore'),
    cacheProvider = require('../park-cache-provider.js').ParkCacheProvider,
    cache = new cacheProvider();

var locations = [
	                {"permalink":"parks","name":"Theme Parks"},
	                {"permalink":"hotels","name":"Hotels"},
	                {"permalink":"dining","name":"Dining"}
            	];

var parks = {
				"location": {"permalink":"parks","name":"Theme Parks"},
				"parks": [
		            	{"permalink":"magic-kingdom","name":"Magic Kingdom"},
			            {"permalink":"epcot","name":"Epcot"},
			            {"permalink":"hollywood-studios","name":"Disney's Hollywood Studios"},
			            {"permalink":"animal-kingdom","name":"Disney's Animal Kingdom"}
				]
			};

var TOURINGPLANS_PARK_ATTRACTION_LIST_URL = 'http://touringplans.com/{{parkPermalink}}/attractions.json';
var TOURINGPLANS_PARK_ATTRACTION_DETAIL_URL = 'http://touringplans.com/{{parkPermalink}}/attractions/{{attractionPermalink}}.json';

exports.getLocations = function(req, res){
  res.jsonp(locations);
};

exports.getParks = function(req, res){
  res.jsonp(parks);
};

exports.getParkAttractions = function (req, res) {
    var permalink = req.params.parkPermalink;
    var park = _.findWhere(parks.parks, {"permalink": permalink});
    cache.get({"parkPermalink": permalink}, function(err, data){
        if (data) {
            result = {
                park: park,
                attractions: data
            };
            res.jsonp(result);
        }
        else {
            sourceUrl = TOURINGPLANS_PARK_ATTRACTION_LIST_URL.replace(/{{parkPermalink}}/g, permalink);
            http.get(sourceUrl, function(response) {
                var data = '';

                response.on('data', function(chunk) {
                    data += chunk;
                });

                response.on('end', function() {
                    cache.insert({"parkPermalink": permalink, "data": data});
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
};

exports.getParkAttractionDetails = function (req, res) {
    var parkPermalink = req.params.parkPermalink;
    var attractionPermalink = req.params.attractionPermalink;
    var park = _.findWhere(parks.parks, {"permalink": parkPermalink})
    cache.get({"parkPermalink": parkPermalink, "attractionPermalink": attractionPermalink}, function(err, data) {
       if (data) {
           // We have visited this endpoint before and cached the data.
           // Setup return data payload.
           result = {
               park: park,
               attraction: data
           };

           result.attraction.comments = [];

           // Get attraction comments.
           req.db.each('SELECT email, score, details FROM parkAttractionComments WHERE parkPermalink = ? AND attractionPermalink = ?',
               [parkPermalink, attractionPermalink],
               function(err, row) {
                   result.attraction.comments.push(
                       {
                           email: row.email,
                           score: row.score,
                           details: row.details
                       }
                   );
               },
               function (err, numRows) {
                   res.jsonp(result);
               }
           );
       } else {
           // This is the first time we're visiting this TouringPlans endpoint.
           // We're assuming that there are no comments since we've never visited this endpoint before.
           sourceUrl = TOURINGPLANS_PARK_ATTRACTION_DETAIL_URL.replace(/{{parkPermalink}}/g, req.params.parkPermalink);
           sourceUrl = sourceUrl.replace(/{{attractionPermalink}}/g, req.params.attractionPermalink);
           http.get(sourceUrl, function(response) {
               var data = '';

               response.on('data', function(chunk) {
                   data += chunk;
               });

               response.on('end', function() {
                   cache.insert({"parkPermalink": parkPermalink, "attractionPermalink": attractionPermalink, "data" : data});
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
};

// Unit test on command line with:
// curl -X POST -d '{"email":"test@cli.com", "score": 5, "details": "test comment"}' http://localhost:3000/locations/parks/magic-kingdom/space-mountain/comment -H "Content-Type:application/json"
exports.setParkAttractionComment = function (req, res) {
    var parkPermalink = req.params.parkPermalink;
    var attractionPermalink = req.params.attractionPermalink;
    var email = req.body.email;
    var score = req.body.score;
    var details = req.body.details;

    req.db.run('INSERT INTO parkAttractionComments (parkPermalink, attractionPermalink, email, score, details) VALUES (?, ?, ?, ?, ?)',
        [parkPermalink, attractionPermalink, email, score, details]);

    res.send(200, {status: 'ok'});
};