var locationProvider = require('../providers/location-provider.js'),
    locations = new locationProvider();

exports.getLocations = function(req, res){
    locations.get(null, function(err, data) {
        res.jsonp(data);
    });
};