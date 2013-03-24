var helper = require('./test-helper.js'),
    cacheProvider = require('../providers/hotel-cache-provider.js').HotelCacheProvider,
    cache = new cacheProvider(),
    _ = require('underscore'),
    timestamp = new Date();

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
            cache.get({"hotelPermalink": "all"}, function(err, data){
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
            cache.get({"hotelPermalink": "disneys-contemporary-resort"}, function(err, data){
                expect(data).toBeTruthy();
                done();
            });
        });

    });
});