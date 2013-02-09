'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['ngCookies', 'myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/parks', {templateUrl: 'partials/parks.html', controller: ParksCtrl});
    $routeProvider.when('/parks/:park', {templateUrl: 'partials/park-attractions.html', controller: ParksAttractionListCtrl});
    $routeProvider.when('/parks/:park/:attraction', {templateUrl: 'partials/park-attraction-detail.html', controller: ParksAttractionListCtrl});
    $routeProvider.otherwise({redirectTo: '/parks'});
  }]);