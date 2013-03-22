var _ = require('underscore');

function ParkProvider () {
    //private data accessible to private / privileged methods
    var data = {
        "location": {"permalink":"parks","name":"Theme Parks"},
        "parks": [
            {"permalink":"magic-kingdom","name":"Magic Kingdom"},
            {"permalink":"epcot","name":"Epcot"},
            {"permalink":"hollywood-studios","name":"Disney's Hollywood Studios"},
            {"permalink":"animal-kingdom","name":"Disney's Animal Kingdom"}
        ]
    };

    //privileged public method
    this.get = function(item, callback) {
        var result = data;

        if (item) {
            result = _.findWhere(data.parks, item);
        }

        return callback(null, result);
    };
}

module.exports = ParkProvider;