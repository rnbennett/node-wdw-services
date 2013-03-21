var db = require('../database');

function Provider () {
    this.db = db;
}

Provider.prototype = {

    save: function() {
    },

    get: function() {
    }
};

exports.Provider = Provider;