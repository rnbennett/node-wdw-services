// Adapted from http://blog.drewolson.org/post/14684497867/
var request = require('request');

var Requester = (function() {

    function Requester() {}

    Requester.prototype.get = function(path, callback) {
        return request.get("http://localhost:3000" + path, callback);
    };

    Requester.prototype.post = function(path, body, callback) {
        return request.post({
            url: "http://localhost:3000" + path,
            body: body
        }, callback);
    };

    Requester.prototype.postJSON = function(path, body, callback) {
        return request.post({
            url: "http://localhost:3000" + path,
            headers: {
                'content-type': 'application/json'
            },
            body: body
        }, callback);
    };

    return Requester;

})();

exports.withServer = function(done, callback) {
    var app, server, stopServer;
    app = require("../app.js").app;
    stopServer = function() {
        server.close();
        done();
    };
    server = app.listen(3000);
    return callback(new Requester(), stopServer);
};