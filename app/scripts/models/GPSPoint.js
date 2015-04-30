/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var GPSPoint = Backbone.Model.extend({
        defaults: {
            elevation: 0,
            latitude: 0,
            longitude: 0,
            time: 0
        },

        constructor: function (attributes, options) {
            //-------------------------------------------------------------------------------------------------------------
            // convert the time to a timestamp
            attributes.time = (new Date(attributes.time)).getTime();

            //-------------------------------------------------------------------------------------------------------------
            // make sure that each value is a number
            attributes.elevation = parseFloat(attributes.elevation);
            attributes.latitude = parseFloat(attributes.latitude);
            attributes.longitude = parseFloat(attributes.longitude);

            //-------------------------------------------------------------------------------------------------------------
            // apply the super constructor
            Backbone.Model.apply(this, arguments);
        },

        getElevation: function () {
            return this.get("elevation");
        },

        getLatitude: function () {
            return this.get("latitude");
        },

        getLongitude: function () {
            return this.get("longitude");
        },

        getTimestamp: function () {
            return this.get("time");
        }
    });

    return GPSPoint;
});
