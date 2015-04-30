/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'models/GPSData'
], function ($, _, Backbone, JST, GPSDataModel) {
    'use strict';

    var GPSDataOverviewView = Backbone.View.extend({

        className: "gps-data-overview-view",

        template: JST['app/scripts/templates/GPSDataOverviewView.hbs'],

        events: {
            "input input": "_onInputChanged",
            "click button.btn-primary": "_onExportClicked"
        },

        render: function () {
            //-------------------------------------------------------------------------------------------------------------
            // save this
            var that = this;

            //-------------------------------------------------------------------------------------------------------------
            // prepare the data
            var data = {
                title: "no title",
                pilot: "unknown pilot",
                beeLineDistance: 0,
                distance: 0,
                duration: 0,
                maxElevation: 0,
                maxLatitude: 0,
                maxLongitude: 0,
                maxSpeed: 0,
                minElevation: 0,
                minLatitude: 0,
                minLongitude: 0
            };

            //-------------------------------------------------------------------------------------------------------------
            // add further data
            if (this.model) {
                _.extend(data, this.model.toJSON(), {
                    startGPS: this.model.getStartGPSPoint().toJSON(),
                    startTime: this.model.getStartTime(),
                    endTime: this.model.getEndTime(),
                    endGPS: this.model.getEndGPSPoint().toJSON(),
                    orderDate: Backbone.Utils.moment(this.model.getOrderDate().toISOString()).format("YYYY-MM-DD"),
                    flightDate: Backbone.Utils.moment(this.model.getFlightDate().toISOString()).format("YYYY-MM-DD")
                });
            }

            //-------------------------------------------------------------------------------------------------------------
            // render the view
            this.$el.html(this.template(data));

            //-------------------------------------------------------------------------------------------------------------
            // return the view instance
            return this;
        },

        changeGPSDataModel: function (gpsDataModel) {
            //-------------------------------------------------------------------------------------------------------------
            // remove change listeners from the model
            if (this.model) this.stopListening(this.model, "change", this._onModelDataChanged);

            //-------------------------------------------------------------------------------------------------------------
            // update the model
            this.model = gpsDataModel;

            //-------------------------------------------------------------------------------------------------------------
            // re-render the view
            this.render();

            //-------------------------------------------------------------------------------------------------------------
            // return the instance
            return this;
        },

        _onInputChanged: function (event) {
            //-------------------------------------------------------------------------------------------------------------
            // get the name of the changed input
            var name = event.currentTarget.name;

            //-------------------------------------------------------------------------------------------------------------
            // get the value
            var value = event.currentTarget.value;

            //-------------------------------------------------------------------------------------------------------------
            // switch the action depending on the name
            switch (name) {
                case "gps-order-date":
                    if (this.model) this.model.set({"orderDate": (new Date(value)).getTime()});
                    break;

                case "gps-data-title":
                    if (this.model) this.model.set({"title": value});
                    break;

                case "gps-data-pilot":
                    if (this.model) this.model.set({"pilot": value});
                    break;
            }
        },

        _onExportClicked: function () {
            this.trigger("GPSDataOverviewView::ExportSVG", {model: this.model || null});
        }
    });

    return GPSDataOverviewView;
});
