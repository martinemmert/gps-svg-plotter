/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'renderer/SVGRenderer'
], function ($, _, Backbone, JST, SVGRenderer) {
    'use strict';

    var GPSDataRenderView = Backbone.View.extend({

        className: "gps-data-render-view",

        template: JST['app/scripts/templates/GPSDataRenderView.hbs'],

        initialize: function (params) {

        },

        render: function () {
            //-------------------------------------------------------------------------------------------------------------
            // render the template
            this.$el.html(this.template());

            //-------------------------------------------------------------------------------------------------------------
            // create the renderer instance
            this._svgRenderer = new SVGRenderer(this.el);

            //-------------------------------------------------------------------------------------------------------------
            // return the instance
            return this;
        },

        renderGPSData: function (gpsDataModel) {

            //-------------------------------------------------------------------------------------------------------------
            // remove event listeners
            if (this._currentModel) {
                this.stopListening(this._currentModel);
            }

            //-------------------------------------------------------------------------------------------------------------
            // set the current model
            this._currentModel = gpsDataModel;

            //-------------------------------------------------------------------------------------------------------------
            // listen to changes
            this.listenTo(this._currentModel, "change", this._onModelDataChanged);

            //-------------------------------------------------------------------------------------------------------------
            // render the svg
            this._svgRenderer.render(gpsDataModel);

            //-------------------------------------------------------------------------------------------------------------
            // return the instance
            return this;
        },

        getSVGData: function () {
            return this._svgRenderer.exportSVG();
        },

        _rerender: function (part) {
            this._svgRenderer.rerender(part, this._currentModel);
        },

        _onModelDataChanged: function (model) {
            //-------------------------------------------------------------------------------------------------------------
            // get the changed properties
            var changedAttributes = _.keys(model.changed);

            //-------------------------------------------------------------------------------------------------------------
            // re-render the title if it has changed
            if (changedAttributes.indexOf("title") != -1) {
                this._rerender("title");
            }
        }
    });

    return GPSDataRenderView;
});
