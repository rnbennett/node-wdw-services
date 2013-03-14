var http = require('http');
var _ = require('underscore');

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

var cache = {};

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
    var park = _.findWhere(parks.parks, {"permalink": permalink})
	req.db.get('SELECT * FROM parkCache WHERE parkPermalink = ? AND attractionPermalink IS NULL', permalink, function(err, row){
		if (row) {
			data = {
				park: park,
				attractions: JSON.parse(row.data)
			};
			res.jsonp(data);
		} else {
			sourceUrl = TOURINGPLANS_PARK_ATTRACTION_LIST_URL.replace(/{{parkPermalink}}/g, permalink);
			http.get(sourceUrl, function(response) {
				var data = '';

				response.on('data', function(chunk) {
					data += chunk;
				});

				response.on('end', function() {
                    req.db.run('INSERT INTO parkCache (parkPermalink, data) VALUES (?, ?)', [permalink, data]);
					data = JSON.parse(data);
					resData = {
						park: park,
						attractions: data
					};
					res.jsonp(resData);
				});
			});
		}
	});
};

exports.getParkAttractionDetails = function (req, res) {
    var parkPermalink = req.params.parkPermalink;
    var attractionPermalink = req.params.attractionPermalink;
    var park = _.findWhere(parks.parks, {"permalink": parkPermalink})
	req.db.get('SELECT * FROM parkCache WHERE parkPermalink = ? AND attractionPermalink = ?',
        [parkPermalink, attractionPermalink],
        function(err, row) {
            if (row) {
                // We have visited this endpoint before and cached the data.
                // Setup return data payload.
                data = {
                    park: park,
                    attraction: JSON.parse(row.data)
                };

                data.attraction.comments = [];

                // Get attraction comments.
                req.db.each('SELECT email, score, details FROM parkAttractionComments WHERE parkPermalink = ? AND attractionPermalink = ?',
                    [parkPermalink, attractionPermalink],
                    function(err, row) {
                        data.attraction.comments.push(
                            {
                                email: row.email,
                                score: row.score,
                                details: row.details
                            }
                        );
                    },
                    function (err, numRows) {
                        res.jsonp(data);
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
                        req.db.run('INSERT INTO parkCache VALUES(?, ?, ?)', [parkPermalink, attractionPermalink, data]);
                        data = JSON.parse(data);
                        resData = {
                            park: park,
                            attraction: data
                        };
                        res.jsonp(resData);
                    });
                });
            }
        }
    );
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