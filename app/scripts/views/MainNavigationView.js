/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var MainNavigationView = Backbone.View.extend({

        tagName: "nav",

        className: "navbar navbar-default navbar-fixed-top",

        template: JST['app/scripts/templates/MainNavigationView.hbs'],

        initialize: function (params) {

        },

        render: function () {

            this.$el.html(this.template());

            this.$el.attr("role", "navigation");

            return this;
        }
    });

    return MainNavigationView;
});
