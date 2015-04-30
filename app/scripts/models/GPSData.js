/*global define*/

define([
    'underscore',
    'backbone',
    'collections/GPSPointCollection'
], function (_, Backbone, GPSPointCollection) {
    'use strict';

    var GPSDataModel = Backbone.Model.extend({
        defaults: {
            title: "no title",
            name: "unnamed gps data",
            pilot: "unknown",
            beeLineDistance: 0,
            distance: 0,
            duration: 0,
            maxElevation: 0,
            maxLatitude: 0,
            maxLongitude: 0,
            maxSpeed: 0,
            minElevation: 0,
            minLatitude: 0,
            minLongitude: 0,
            orderDate: (new Date()).getTime()
        },

        constructor: function (attributes, options) {
            //-------------------------------------------------------------------------------------------------------------
            // create the GPSPointCollection
            this._gpsPointCollection = new GPSPointCollection(attributes.gpsPoints);

            //-------------------------------------------------------------------------------------------------------------
            // remove the gps data
            delete attributes.gpsPoints;

            //-------------------------------------------------------------------------------------------------------------
            // apply the super constructor
            Backbone.Model.apply(this, arguments);
        },

        getName: function () {
            return this.get("name");
        },

        getPilot: function () {
            return this.get("pilot");
        },

        getBeeLineDistance: function () {
            return this.get("beeLineDistance");
        },

        getDistance: function () {
            return this.get("distance");
        },

        getDuration: function () {
            return this.get("duration");
        },

        getEndGPSPoint: function () {
            return this.getGPSPoints().last();

        },

        getEndTime: function () {
            return this.getEndGPSPoint().getTimestamp();
        },

        getGPSPoints: function () {
            return this._gpsPointCollection;
        },

        getMaxElevation: function () {
            return this.get("maxElevation");
        },

        getMaxLatitude: function () {
            return this.get("maxLatitude");
        },

        getMaxLongitude: function () {
            return this.get("maxLongitude");
        },

        getMaxSpeed: function () {
            return this.get("maxSpeed");
        },

        getMinElevation: function () {
            return this.get("minElevation");
        },

        getMinLatitude: function () {
            return this.get("minLatitude");
        },

        getMinLongitude: function () {
            return this.get("minLongitude");
        },

        getStartGPSPoint: function () {
            return this.getGPSPoints().first();
        },

        getStartTime: function () {
            return this.getStartGPSPoint().getTimestamp();
        },

        getFlightDate: function () {
            return new Date(this.getStartTime());
        },

        getOrderDate: function () {
            return new Date(this.get("orderDate"));
        },

        getBBox: function () {
            var obj = {x1: this.getMinLongitude(), y1: this.getMaxLatitude(), x2: this.getMaxLongitude(), y2: this.getMinLatitude()};
            obj.width = Math.abs(obj.x2 - obj.x1);
            obj.height = Math.abs(obj.y2 - obj.y1);
            return obj;
        }
    });

    return GPSDataModel;
});
