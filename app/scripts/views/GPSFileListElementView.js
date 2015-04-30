/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var GPSFileListElementView = Backbone.View.extend({

        tagName: "li",

        className: "list-group-item",

        template: JST['app/scripts/templates/GPSFileListElementView.hbs'],

        initialize: function (options) {
            //-------------------------------------------------------------------------------------------------------------
            // save the reference to the model
            this.model = options.model;

            //-------------------------------------------------------------------------------------------------------------
            // add event listener to the model
            this.model.on("change", this._onModelDataChanged, this);
        },

        render: function () {
            //-------------------------------------------------------------------------------------------------------------
            // render the template
            this.$el.html(this.template({
                fileName: this.model.getFileName(),
                fileSize: this.model.getFileSize(),
                fileExtension: this.model.getFileExtension(),
                state: this.model.getState()
            }));

            //-------------------------------------------------------------------------------------------------------------
            // return the instance
            return this;
        },

        _onModelDataChanged: function (model, options) {
            //-------------------------------------------------------------------------------------------------------------
            // iterate through the changed properties
            for (var prop in model.changed) {
                var value = model.changed[prop];

                //-------------------------------------------------------------------------------------------------------------
                // get the correct action for the changed property
                switch (prop) {
                    case 'loadProgress':
                    case 'processProgress':
                        this._onProgressChanged(value);
                        break;

                    case 'state':
                        this._onStateChanged(value);
                        break;
                }
            }
        },

        _onProgressChanged: function (value) {
            //-------------------------------------------------------------------------------------------------------------
            // get the progressbar
            this._$progressBar = this._$progressBar || this.$("[role=progressbar]");

            //-------------------------------------------------------------------------------------------------------------
            // get the progress and convert it to percent
            var progress = Math.round(this.model.getTotalProgress() * 100);

            //-------------------------------------------------------------------------------------------------------------
            // update the progress
            this._$progressBar
                .css({width: progress + "%"})
                .text(progress + " %");
        },

        _onStateChanged: function (state) {
            //-------------------------------------------------------------------------------------------------------------
            // get state display
            this._$stateDisplay = this._$stateDisplay || this.$("[data-template-part=state-display]");

            //-------------------------------------------------------------------------------------------------------------
            // set the correct state
            console.log(state);
            this._$stateDisplay
                .removeClass("label-default label-info label-warning")
                .text(state);


            switch (state) {
                case "GPSFileModel::StateCurrentlyLoading":
                    this._$stateDisplay.addClass("label-info");
                    break;

                case "GPSFileModel::StateLoadedNotProcessed":
                    this._$stateDisplay.addClass("label-warning");
                    break;

                case "GPSFileModel::StateCurrentlyProcessing":
                    this._$stateDisplay.addClass("label-info");
                    break;

                case "GPSFileModel::StateLoadedAndProcessed":
                    this._$stateDisplay.addClass("label-success");
                    break;
            }

        }
    });

    return GPSFileListElementView;
});
