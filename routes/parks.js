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
	var park = _.findWhere(parks.parks, {"permalink": req.params.parkPermalink})
	req.db.get('SELECT * FROM parkCache WHERE permalink = ?', req.params.parkPermalink, function(err, row){
		if (row) {
			data = {
				park: park,
				attractions: JSON.parse(row.data)
			};
			res.jsonp(data);
		} else {
			sourceUrl = TOURINGPLANS_PARK_ATTRACTION_LIST_URL.replace(/{{parkPermalink}}/g, req.params.parkPermalink);
			http.get(sourceUrl, function(response) {
				var data = '';

				response.on('data', function(chunk) {
					data += chunk;
				});

				response.on('end', function() {
					req.db.run('INSERT INTO parkCache VALUES(?, ?)', [req.params.parkPermalink, data]);					
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
	var park = _.findWhere(parks.parks, {"permalink": req.params.parkPermalink})
	var cacheKey = req.params.parkPermalink + '|' + req.params.attractionPermalink;
	req.db.get('SELECT * FROM parkCache WHERE permalink = ?', cacheKey, function(err, row){
		if (row) {
			data = {
				park: park,
				attraction: JSON.parse(row.data)
			};
			res.jsonp(data);
		} else {
			sourceUrl = TOURINGPLANS_PARK_ATTRACTION_DETAIL_URL.replace(/{{parkPermalink}}/g, req.params.parkPermalink);
			sourceUrl = sourceUrl.replace(/{{attractionPermalink}}/g, req.params.attractionPermalink);
			http.get(sourceUrl, function(response) {
				var data = '';

				response.on('data', function(chunk) {
					data += chunk;
				});

				response.on('end', function() {
					req.db.run('INSERT INTO parkCache VALUES(?, ?)', [cacheKey, data]);
					data = JSON.parse(data);
					resData = {
						park: park,
						attraction: data
					};
					res.jsonp(resData);
				});
			});
		}
	});
};

/* Unit test on command line with:
 curl -X POST -d '{"email":"test@cli.com", "score": 5, "details": "test comment"}' http://localhost:3000/locations/parks/magic-kingdom/space-mountain/comment -H "Content-Type:application/json"
*/
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