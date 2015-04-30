/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var GPSDataListElementView = Backbone.View.extend({

        tagName: "a",

        className: "list-group-item",

        template: JST['app/scripts/templates/GPSDataListElementView.hbs'],

        initialize: function (options) {
            //-------------------------------------------------------------------------------------------------------------
            // save the reference to the model
            this.model = options.model;
        },

        render: function () {
            //-------------------------------------------------------------------------------------------------------------
            // render the template
            this.$el.html(this.template({
                id: this.model.id || this.model.cid,
                name: this.model.getName(),
                distance: this.model.getDistance(),
                date: this.model.getStartTime(),
                pilot: this.model.getPilot()
            }));

            //-------------------------------------------------------------------------------------------------------------
            // set the id
            this.$el.attr("data-item-id", this.model.id || this.model.cid);

            //-------------------------------------------------------------------------------------------------------------
            // return the instance
            return this;
        }

    });

    return GPSDataListElementView;
});
