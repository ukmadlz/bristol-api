'use strict';

// Config
require('dotenv').load();

// Dependencies Requires
var Hapi           = require('hapi');
var Path           = require('path');
var dateFormat     = require('dateformat');

// Crappy homebrew
var urbanThings = require('./urbanthings')(process.env.urbanKey);

// format
var format = 'd mmm HH:MM:ss';

// Instantiate the server
var server = new Hapi.Server({
  debug: {
    request: ['error', 'good'],
  },
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'public'),
      },
    },
  },
});

// Set Hapi Connections
server.connection({
  port: process.env.VCAP_APP_PORT || process.env.PORT || 3000,
});

// Hapi Log
server.log(['error', 'database', 'read']);

// Planning
server.route({
    method: 'GET',
    path: '/planning/{from}/{to}',
    handler: (request, reply) => {

      var fromName = request.params.from;
      var toName = request.params.to;

      urbanThings.getStation(fromName, function(error, response, body){
        if (error || !body.success) return false;
        var origin = {
          lat: body.data.placePoints[0].lat,
          lng: body.data.placePoints[0].lng
        };
        console.log('FROM---',body.data.placePoints[0])
        urbanThings.getStation(toName, function(error, response, body){
          if (error || !body.success) return false;
          var destination = {
            lat: body.data.placePoints[0].lat,
            lng: body.data.placePoints[0].lng
          };
          console.log('To---',body.data.placePoints[0])
          var timestamp = (new Date()).toISOString();
          urbanThings.journeyDirect(origin, destination, timestamp, function(error, response, body){
            console.log(timestamp);
            for(var i = 0; i < body.data.journeys.length; i++) {
              console.log(body.data.journeys[i].departureTime);
              if(new Date(body.data.journeys[i].departureTime)>new Date(timestamp)) {
                console.log(body.data.journeys[i]);
                break;
              }
            }
          });
        });
      });

      reply({
          "start_destination" : request.params.from,
          "final_destination" : request.params.to,
          "sheduled_time" : (new Date()).toISOString(),
          "actual_time" : (new Date()).toISOString(),
      }).code( 200 );
    },
  });

// Start Hapi
server.start(function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log(dateFormat(new Date(), format) + ' - Server started at: ' + server.info.uri);
  }
});
