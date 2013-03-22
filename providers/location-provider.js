function LocationProvider () {
    //private data accessible to private / privileged methods
    var data = [
        {"permalink":"parks","name":"Theme Parks"},
        {"permalink":"hotels","name":"Hotels"},
        {"permalink":"dining","name":"Dining"}
    ];

    //privileged public method
    this.get = function(item, callback) {
        return callback(null, data);
    };
}

module.exports = LocationProvider;