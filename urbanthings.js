'use strict';

var request = require('request');

module.exports = function(apiKey) {

  return {

    'baseUrl': 'https://bristol.api.urbanthings.io/api/',
    'version': 2.0,

    getStation: function(name, callback) {

      var opts = {
        url: this.baseUrl + this.version + '/static/places/List',
        method: 'GET',
        json: true,
        qs: {
          name: name,
          placepointtypes: 102,
          apikey:apiKey
        }
      };

      return request(opts, function(error, response, body) {
        var returnObject = {
          error: error,
          response: response,
          body: body
        };

        return callback(error, response, body)
      });

    },

    journeyDirect: function(from, to, timestamp, callback) {

      var body = {
        "Origin": {
          PlacePointType: 102,
          lat: from.lat,
          lng: from.lng
        },
        "Destination": {
          PlacePointType: 102,
          lat: to.lat,
          lng: to.lng
        },
        "DepartureTime": timestamp,
        "MaximumJourneys": 5,
        "Options": {
          "MaximumLegs": 2,
          "AcceptableVehicleTypes": [
            9
          ]
        }
      } ;
      console.log(body);
      var opts = {
        url: this.baseUrl + this.version + '/plan/directions',
        method: 'POST',
        json: true,
        qs: {
          apikey:apiKey
        },
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json'
        },
        body: body
      };
      return request(opts, function(error, response, body) {
        var returnObject = {
          error: error,
          response: response,
          body: body
        };
        return callback(error, response, body)
      });
    }

  }

}
