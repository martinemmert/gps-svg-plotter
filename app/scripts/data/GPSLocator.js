/**
 * @author:  Martin Emmert
 * @created: 06.08.14 - 14:34
 *
 * @package:
 * @name:
 */
define(["underscore", "jquery", "Backbone"], function (_, $, Backbone) {

    var GPSLocator = function () {

    };

    _.extend(GPSLocator.prototype, Backbone.Events, {

        locate: function (lat, lon) {

        }

    });

    return GPSLocator;

});