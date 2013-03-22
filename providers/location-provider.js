function LocationProvider () {}

LocationProvider.prototype.get = function(item, callback) {
    var data = [
        {"permalink":"parks","name":"Theme Parks"},
        {"permalink":"hotels","name":"Hotels"},
        {"permalink":"dining","name":"Dining"}
    ];

    return callback(null, data);
};

module.exports = LocationProvider;