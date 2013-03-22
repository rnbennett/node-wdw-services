
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    config = require('./config.js'),
    locations = require('./routes/locations.js');
    parks = require('./routes/parks.js');

//Export app so it is accessible for unit testing.
exports.app = app = express();

app.configure(function(){
  app.set('port', process.env.PORT || config.server.listenPort);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(config.server.publicFolder));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/locations', locations.getLocations);
app.get('/locations/parks', parks.getParks);
app.get('/locations/parks/:parkPermalink', parks.getParkAttractions);
app.get('/locations/parks/:parkPermalink/:attractionPermalink', parks.getParkAttractionDetails);
app.post('/locations/parks/:parkPermalink/:attractionPermalink/comment', parks.setParkAttractionComment);

//Only run the server if this file is run directly. Lets us use test-helper for testing.
if (__filename == process.argv[1]) {
    http.createServer(app).listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port'));
    });
}