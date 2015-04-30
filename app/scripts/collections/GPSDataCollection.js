/*global define*/

define([
    'underscore',
    'backbone',
    'models/GPSData'
], function (_, Backbone, GPSDataModel) {
    'use strict';

    var GPSDataCollection = Backbone.Collection.extend({
        model: GPSDataModel,

        addNewGPSDataModel: function (params) {
            //-------------------------------------------------------------------------------------------------------------
            // create a new instance
            var model = new GPSDataModel(params);

            //-------------------------------------------------------------------------------------------------------------
            // add it to the collection
            this.add(model);

            //-------------------------------------------------------------------------------------------------------------
            // debug message
            console.info("A new Model was added to the GPSDataCollection", model);

            //-------------------------------------------------------------------------------------------------------------
            // return the new model
            return model;
        }
    });

    return GPSDataCollection;
});
