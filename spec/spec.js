var helper = require('./test-helper.js'),
    parkCacheProvider = require('../providers/park-cache-provider.js').ParkCacheProvider,
    parkCache = new parkCacheProvider(),
    hotelCacheProvider = require('../providers/hotel-cache-provider.js').HotelCacheProvider,
    hotelCache = new hotelCacheProvider(),
    _ = require('underscore'),
    timestamp = new Date();

describe("The WDW Node Park Service Endpoints", function() {
    describe("GET /locations", function() {

        it("responds successfully", function(done) {
            helper.withServer(done, function(r, end) {
                r.get("/locations", function(err, res, body){
                    expect(res.statusCode).toEqual(200);
                    end();
                }) ;
            });
        });

        it("contains Theme Parks as a location", function(done) {
            helper.withServer(done, function(r, end) {
                r.get("/locations", function(err, res, body){
                    data = JSON.parse(body);
                    expect(data).toContain({"permalink":"parks","name":"Theme Parks"});
                    end();
                }) ;
            });
        });

    });

    describe("GET /locations/parks", function() {

        it("responds successfully", function(done) {
            helper.withServer(done, function(r, end) {
                r.get("/locations/parks", function(err, res, body){
                    expect(res.statusCode).toEqual(200);
                    end();
                }) ;
            });
        });

        it("provides the location type", function(done) {
            helper.withServer(done, function(r, end) {
                r.get("/locations/parks", function(err, res, body){
                    data = JSON.parse(body);
                    expect(data.location.permalink).toMatch(/parks/);
                    end();
                });
            });
        });

        it("contains four parks", function(done) {
            helper.withServer(done, function(r, end) {
                r.get("/locations/parks", function(err, res, body){
                    data = JSON.parse(body);
                    expect(data.parks.length).toBe(4);
                    end();
                });
            });
        });

    });

    describe("GET /locations/parks/:parkPermalink", function() {

        it("responds successfully", function(done) {
            helper.withServer(done, function(r, end) {
                r.get("/locations/parks/magic-kingdom", function(err, res, body){
                    expect(res.statusCode).toEqual(200);
                    end();
                }) ;
            });
        });

        it("provides the park type", function(done) {
            helper.withServer(done, function(r, end) {
                r.get("/locations/parks/magic-kingdom", function(err, res, body){
                    data = JSON.parse(body);
                    expect(data.park.permalink).toMatch(/magic-kingdom/);
                    end();
                });
            });
        });

        it("contains Space Mountain", function(done) {
            helper.withServer(done, function(r, end) {
                r.get("/locations/parks/magic-kingdom", function(err, res, body){
                    var data = JSON.parse(body);
                    var result = _.findWhere(data.attractions, {"permalink": "space-mountain"});
                    expect(result).toBeTruthy();
                    end();
                });
            });
        });

        it("has been placed in cache", function(done) {
            parkCache.get({"parkPermalink": "magic-kingdom"}, function(err, data) {
                expect(data).toBeTruthy();
                done();
            });
        });

    });

    describe("GET /locations/parks/:parkPermalink/:attractionPermalink", function() {

        it("responds successfully", function(done) {
            helper.withServer(done, function(r, end) {
                r.get("/locations/parks/magic-kingdom/space-mountain", function(err, res, body){
                    expect(res.statusCode).toEqual(200);
                    end();
                }) ;
            });
        });

        it("provides the park type", function(done) {
            helper.withServer(done, function(r, end) {
                r.get("/locations/parks/magic-kingdom/space-mountain", function(err, res, body){
                    data = JSON.parse(body);
                    expect(data.park.permalink).toMatch(/magic-kingdom/);
                    end();
                });
            });
        });

        it("contains the right Space Mountain opening date", function(done) {
            helper.withServer(done, function(r, end) {
                r.get("/locations/parks/magic-kingdom/space-mountain", function(err, res, body){
                    var data = JSON.parse(body);
                    var result = _.contains(data.attraction, "1975-01-15");
                    expect(result).toBeTruthy();
                    end();
                });
            });
        });

        it("has been placed in cache", function(done) {
            parkCache.get({"parkPermalink": "magic-kingdom", "attractionPermalink": "space-mountain"}, function(err, data){
                expect(data).toBeTruthy();
                done();
            });
        });

    });

    describe("POST /locations/parks/:parkPermalink/:attractionPermalink/comment", function() {

        it("rejects GET requests", function(done) {
            helper.withServer(done, function(r, end) {
                r.get("/locations/parks/magic-kingdom/space-mountain/comment", function(err, res, body){
                    expect(res.statusCode).toEqual(404);
                    end();
                }) ;
            });
        });

        it("accepts JSON data", function(done) {
            helper.withServer(done, function(r, end) {
                data = {"email": "test@spec.com", "score": 5, "details": timestamp.valueOf().toString()};
                r.postJSON( "/locations/parks/magic-kingdom/space-mountain/comment", JSON.stringify(data), function(err, res, body){
                    expect(res.statusCode).toEqual(200);
                    end();
                });
            });
        });

    });

    describe("Attraction comments in GET /locations/parks/:parkPermalink/:attractionPermalink", function() {

        it("contains the comment POSTed in the last test", function(done) {
            helper.withServer(done, function(r, end) {
                r.get("/locations/parks/magic-kingdom/space-mountain", function(err, res, body){
                    var data = JSON.parse(body);
                    var result = _.findWhere(data.attraction.comments, {"details": timestamp.valueOf().toString()});
                    expect(result).toBeTruthy();
                    end();
                });
            });
        });

    });
});

describe("The WDW Node Service Hotel Endpoints", function() {

    describe("GET /locations/hotels", function() {

        it("responds successfully", function(done) {
            helper.withServer(done, function(r, end) {
                r.get("/locations/hotels", function(err, res){
                    expect(res.statusCode).toEqual(200);
                    end();
                }) ;
            });
        });

        it("contains four categories", function(done) {
            helper.withServer(done, function(r, end) {
                r.get("/locations/hotels", function(err, res, body){
                    data = JSON.parse(body);
                    expect(data.length).toBe(4);
                    end();
                });
            });
        });

        it("has been placed in cache", function(done) {
            hotelCache.get({"hotelPermalink": "all"}, function(err, data){
                expect(data).toBeTruthy();
                done();
            });
        });

    });

    describe("GET /locations/hotels/:hotelPermalink", function() {

        it("responds successfully", function(done) {
            helper.withServer(done, function(r, end) {
                r.get("/locations/hotels/disneys-contemporary-resort", function(err, res){
                    expect(res.statusCode).toEqual(200);
                    end();
                }) ;
            });
        });

        it("provides the correct hotel", function(done) {
            helper.withServer(done, function(r, end) {
                r.get("/locations/hotels/disneys-contemporary-resort", function(err, res, body){
                    data = JSON.parse(body);
                    expect(data.permalink).toMatch(/disneys-contemporary-resort/);
                    end();
                });
            });
        });

        it("has been placed in cache", function(done) {
            hotelCache.get({"hotelPermalink": "disneys-contemporary-resort"}, function(err, data){
                expect(data).toBeTruthy();
                done();
            });
        });

    });

    describe("POST /locations/hotels/:hotelPermalink/comment", function() {

        it("rejects GET requests", function(done) {
            helper.withServer(done, function(r, end) {
                r.get("/locations/hotels/disneys-contemporary-resort/comment", function(err, res){
                    expect(res.statusCode).toEqual(404);
                    end();
                }) ;
            });
        });

        it("accepts JSON data", function(done) {
            helper.withServer(done, function(r, end) {
                data = {"email": "test@spec.com", "score": 5, "details": timestamp.valueOf().toString()};
                r.postJSON( '/locations/hotels/disneys-contemporary-resort/comment', JSON.stringify(data), function(err, res){
                    expect(res.statusCode).toEqual(200);
                    end();
                });
            });
        });

    });

    describe("Attraction comments in GET /locations/hotels/:hotelPermalink", function() {

        it("contains the comment POSTed in the last test", function(done) {
            helper.withServer(done, function(r, end) {
                r.get("/locations/hotels/disneys-contemporary-resort", function(err, res, body){
                    var data = JSON.parse(body);
                    var result = _.findWhere(data.comments, {"details": timestamp.valueOf().toString()});
                    expect(result).toBeTruthy();
                    end();
                });
            });
        });

    });
});