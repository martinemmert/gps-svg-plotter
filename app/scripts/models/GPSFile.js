/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';


    var GPSFileModel = Backbone.Model.extend(
        // properties
        {
            defaults: {
                loadProgress: 0,
                processProgress: 0
            },

            initialize: function () {
                //-------------------------------------------------------------------------------------------------------------
                // set the current state
                this.set({"state": GPSFileModel.STATE_NOT_LOADED});

                //-------------------------------------------------------------------------------------------------------------
                // get the current filename
                var fileName = this.getFileName();

                //-------------------------------------------------------------------------------------------------------------
                // split the filename extension
                var fileNameExt = fileName.split(".");
                fileNameExt = fileNameExt[fileNameExt.length - 1];

                //-------------------------------------------------------------------------------------------------------------
                // set the file extension
                this.set({"fileExtension": fileNameExt});
            },

            getFileName: function () {
                return this.get("fileName");
            },

            getFileExtension: function () {
                return this.get("fileExtension");
            },

            getFileSize: function () {
                return this.get("fileSize");
            },

            getFileType: function () {
                return this.get("fileType") || this.getFileExtension();
            },

            getLastModified: function () {
                return this.get("lastModified");
            },

            getIsLoaded: function () {
                var state = this.get("state");
                return state == GPSFileModel.STATE_LOADED_NOT_PROCESSED || state == GPSFileModel.STATE_LOADED_AND_PROCESSED;
            },

            getIsProcessed: function () {
                var state = this.get("state");
                return state == GPSFileModel.STATE_LOADED_AND_PROCESSED;
            },

            getState: function () {
                var state = this.get("state");
                return state;
            },

            setState: function (state) {
                //todo: make some checks if the given state is allowed
                this.set({"state": state});
            },

            getLoadProgress: function () {
                return Number(this.get("loadProgress"));
            },

            setLoadProgress: function (value) {
                //-------------------------------------------------------------------------------------------------------------
                // throw an arrow if value is NaN or not a Number
                if (_.isNaN(value) || !_.isNumber(value)) throw new Error("given value must be a number");

                //-------------------------------------------------------------------------------------------------------------
                // check if the state allows the following operation
                if (this.getState() == GPSFileModel.STATE_CURRENTLY_LOADING) {
                    //-------------------------------------------------------------------------------------------------------------
                    // prevent that the progress could be greater than 1
                    this.set({"loadProgress": Math.min(value, 1)});
                }
                //-------------------------------------------------------------------------------------------------------------
                // throw an error due to the wrong state
                else {
                    throw new Error("the current state does not allow to set the load progress")
                }
            },

            getProcessProgress: function () {
                return Number(this.get("processProgress"));
            },

            setProcessProgress: function (value) {
                //-------------------------------------------------------------------------------------------------------------
                // throw an arrow if value is NaN or not a Number
                if (_.isNaN(value) || !_.isNumber(value)) throw new Error("given value must be a number");

                //-------------------------------------------------------------------------------------------------------------
                // check if the state allows the following operation
                if (this.getState() == GPSFileModel.STATE_CURRENTLY_PROCESSING) {
                    //-------------------------------------------------------------------------------------------------------------
                    // prevent that the progress could be greater than 1
                    this.set({"processProgress": Math.min(value, 1)});
                }
                //-------------------------------------------------------------------------------------------------------------
                // throw an error due to the wrong state
                else {
                    throw new Error("the current state does not allow to set the process progress")
                }
            },

            getTotalProgress: function () {
                //-------------------------------------------------------------------------------------------------------------
                // get the current progress
                var loadProgress = this.getLoadProgress();
                var processProgress = this.getProcessProgress();

                //-------------------------------------------------------------------------------------------------------------
                // calculate the current total progress
                var totalProgress = (loadProgress + processProgress) / 2;

                //-------------------------------------------------------------------------------------------------------------
                // prevent a higher progress than 1
                totalProgress = Math.min(totalProgress, 1);

                //-------------------------------------------------------------------------------------------------------------
                // return the result
                return totalProgress || 0;
            }
        },
        // class properties
        {
            STATE_NOT_LOADED: "GPSFileModel::StateNotLoaded",
            STATE_CURRENTLY_LOADING: "GPSFileModel::StateCurrentlyLoading",
            STATE_LOADED_NOT_PROCESSED: "GPSFileModel::StateLoadedNotProcessed",
            STATE_CURRENTLY_PROCESSING: "GPSFileModel::StateCurrentlyProcessing",
            STATE_LOADED_AND_PROCESSED: "GPSFileModel::StateLoadedAndProcessed"
        }
    );

    return GPSFileModel;
});
