# node-wdw-services

A Node.js + express web application that provides data about Walt Disney World attractions via JSON endpoints.

Data is pulled dynamically from the [TouringPlans.com](http://www.touringplans.com) API, which does not support JSONP, and caches it in a simple SQLite table.

This service makes a great (and fun) base for trying out JavaScript MVC frameworks including AngularJS and Backbone.js.

This app is configured to use EJS, which I find easier to use when bootstrapping a single page app that is already written in pure HTML. Uncomment line 36 in app.js to enable the index route.

If you don't plan on bootstrapping with server-side data, you can place static HTML in the public folder, using index.html as an entry point.

# Prerequisites

[Node.js](http://nodejs.org)

[npm](https://npmjs.org)

[SQLite3](http://www.sqlite.org)

# Running the web server

For the first run, clone this project, then:

	$ npm install
	$ nodemon
	
Use `nodemon` to run the app any time after. `nodemon` will restart the web server each time it detects a file change; use Ctrl-C to stop. You can find the `nodemon` documentation [here](https://github.com/remy/nodemon).

# Endpoints

**/locations** - lists the type of locations in Walt Disney World.

	[
	  {
	    "permalink": "parks",
	    "name": "Theme Parks"
	  },
	  {
	    "permalink": "hotels",
	    "name": "Hotels"
	  },
	  {
	    "permalink": "dining",
	    "name": "Dining"
	  }
	]
	
**/locations/parks** - lists the Theme Parks available.

	{
	  "location": {
	    "permalink": "parks",
	    "name": "Theme Parks"
	  },
	  "parks": [
	    {
	      "permalink": "magic-kingdom",
	      "name": "Magic Kingdom"
	    },
	    {
	      "permalink": "epcot",
	      "name": "Epcot"
	    },
	    {
	      "permalink": "hollywood-studios",
	      "name": "Disney's Hollywood Studios"
	    },
	    {
	      "permalink": "animal-kingdom",
	      "name": "Disney's Animal Kingdom"
	    }
	  ]
	}
	
Note: Hotels and Dining are not yet implemented.
	
**/locations/parks/:parkPermaLink** - lists the attractions in a Theme Park.

	{
	  "park": {
	    "permalink": "magic-kingdom",
	    "name": "Magic Kingdom"
	  },
	  "attractions": [
	    {
	      "permalink": "ariels-grotto",
	      "name": "Ariel's Grotto",
	      "short_name": "Ariel's Grotto"
	    },
	    {
	      "permalink": "astro-orbiter",
	      "name": "Astro Orbiter",
	      "short_name": "Astro Orbiter"
	    }
	  ]
	}
	
**/locations/parks/:parkPermaLink/:attractionPermaLink** - lists an attraction's details.

	{
	  "park": {
	    "permalink": "magic-kingdom",
	    "name": "Magic Kingdom"
	  },
	  "attraction": {
		...
	    "name": "Ariel's Grotto",
	    "scope_and_scale_code": "minor_attraction",
	    "intense": false
		...
	  }
	}
