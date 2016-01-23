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

    journeyDirect: function(from, to, callback) {
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
    }

  }

}
