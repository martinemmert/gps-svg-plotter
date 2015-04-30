/* global define */
define([
    "backbone",
    // LOAD ALL NEEDED PLUGINS
    "Backbone.DropZoneView",
    "Backbone.CommandHub",
    "moment"
], function (Backbone, foo, bar, moment) {
    Backbone.Utils = {
        moment: moment
    };
    return Backbone;
});
