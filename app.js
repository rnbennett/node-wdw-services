
/**
 * Module dependencies.
 */

var express = require('express')
  , sqlite3 = require('sqlite3')
  , routes = require('./routes')
  , parks = require('./routes/parks')
  , http = require('http')
  , path = require('path');

var app = express();
var db = new sqlite3.Database('./app.db');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(function(req, res, next) {
    req.db = db;
    next();
  });  
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// app.get('/', routes.index);
app.get('/locations', parks.getLocations)
app.get('/locations/parks', parks.getParks)
app.get('/locations/parks/:parkPermalink', parks.getParkAttractions)
app.get('/locations/parks/:parkPermalink/:attractionPermalink', parks.getParkAttractionDetails)

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});