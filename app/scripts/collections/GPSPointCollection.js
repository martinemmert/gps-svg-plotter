/*global define*/

define([
    'underscore',
    'backbone',
    'models/GPSPoint'
], function (_, Backbone, GPSPointModel) {
    'use strict';

    var GPSPointCollection = Backbone.Collection.extend({
        model: GPSPointModel,

        addNewGPSPointModel: function (params) {
            //-------------------------------------------------------------------------------------------------------------
            // create a new GPSPoint Model instance
            var model = new GPSPointModel(params);

            //-------------------------------------------------------------------------------------------------------------
            // add the model to the collection
            this.add(model);

            //-------------------------------------------------------------------------------------------------------------
            // return the new model
            return model;
        }
    });

    return GPSPointCollection;
});
