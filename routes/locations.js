var locations = [
    {"permalink":"parks","name":"Theme Parks"},
    {"permalink":"hotels","name":"Hotels"},
    {"permalink":"dining","name":"Dining"}
];

exports.getLocations = function(req, res){
    res.jsonp(locations);
};