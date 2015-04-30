/*global define*/

define([
    'underscore',
    'backbone',
    'models/GPSFile'
], function (_, Backbone, GPSFileModel) {
    'use strict';

    var GPSFileCollection = Backbone.Collection.extend({
        model: GPSFileModel,

        addNewGPSFileModel: function (params) {
            //-------------------------------------------------------------------------------------------------------------
            // create a new GPSFileModel
            var model = new GPSFileModel(params);

            //-------------------------------------------------------------------------------------------------------------
            // add the model
            this.add(model);

            //-------------------------------------------------------------------------------------------------------------
            // debug message
            console.info("A new model was added to the GPSFileCollection", model);

            //-------------------------------------------------------------------------------------------------------------
            // return the model instance
            return model;
        }
    });

    return GPSFileCollection;
});
