/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var MainView = Backbone.View.extend({

        template: JST['app/scripts/templates/MainView.hbs'],

        initialize: function (params) {

            //-------------------------------------------------------------------------------------------------------------
            // create an object to store the child views
            this._childViews = {};

            //-------------------------------------------------------------------------------------------------------------
            // create an object to store the rendered childViews
            this._renderedChildViews = {};

            //-------------------------------------------------------------------------------------------------------------
            // create an object to store the replaced regions
            this._replacedRegions = [];
        },

        addChildView: function (viewId, viewClass, viewInitParams, regionName, replaceRegion, sort) {
            //-------------------------------------------------------------------------------------------------------------
            // get the array of the region
            this._childViews[regionName] = this._childViews[regionName] || [];

            //-------------------------------------------------------------------------------------------------------------
            // push the child view into the regions array
            this._childViews[regionName].push({
                viewId: viewId,
                viewClass: viewClass,
                viewInitParams: viewInitParams || {},
                replaceRegion: replaceRegion || false,
                sort: sort || this._childViews[regionName].length
            });

            //-------------------------------------------------------------------------------------------------------------
            // return the view instance
            return this;
        },

        getChildView: function (id) {
            return this._renderedChildViews[id];
        },

        render: function () {
            //-------------------------------------------------------------------------------------------------------------
            // render the template
            this.$el.html(this.template());

            //-------------------------------------------------------------------------------------------------------------
            // register regions
            this._registerRegions();

            //-------------------------------------------------------------------------------------------------------------
            // render the child views
            this._renderChildViews();

            //-------------------------------------------------------------------------------------------------------------
            // return the view instance
            return this;
        },

        //-------------------------------------------------------------------------------------------------------------
        // register the template regions
        _registerRegions: function () {
            //-------------------------------------------------------------------------------------------------------------
            // secure the scope
            var that = this;

            //-------------------------------------------------------------------------------------------------------------
            // get the regions of the template
            this.$("[data-template-region]").each(function (index, element) {
                var name = element.getAttribute("data-template-region");

                if (!that._templateRegions) {
                    that._templateRegions = {};
                }

                that._templateRegions[name] = $(element);
            });
        },

        //-------------------------------------------------------------------------------------------------------------
        // render all registered child views
        _renderChildViews: function () {
            //-------------------------------------------------------------------------------------------------------------
            // secure the scope
            var that = this;

            //-------------------------------------------------------------------------------------------------------------
            // render all child views
            _.each(this._templateRegions, function (element, regionName) {
                if (that._childViews[regionName]) {
                    //-------------------------------------------------------------------------------------------------------------
                    // sort the child views
                    //todo: implement sorting

                    //-------------------------------------------------------------------------------------------------------------
                    // render the child views into the region
                    _.each(that._childViews[regionName], function (element, index) {
                        //-------------------------------------------------------------------------------------------------------------
                        // check if the regions exists and is not replaced
                        if (that._replacedRegions.indexOf(regionName) == -1) {
                            //-------------------------------------------------------------------------------------------------------------
                            // create the child view instance
                            var view = new element.viewClass(element.viewInitParams);
                            //-------------------------------------------------------------------------------------------------------------
                            // render the view
                            if (element.replaceRegion === true) {
                                that._templateRegions[regionName].replaceWith(view.render().el);
                                that._templateRegions[regionName] = view.el;
                                that._replacedRegions.push(regionName);
                            } else {
                                that._templateRegions[regionName].append(view.render().el);
                            }
                            //-------------------------------------------------------------------------------------------------------------
                            // store the view instance
                            that._renderedChildViews[element.viewId] = view;
                        } else {
                            console.warn("The Region " + regionName + " is replaced and is blocked from further usage");
                        }
                    });

                }
            });

            //-------------------------------------------------------------------------------------------------------------
            // return the instance of the current view
            return this;
        }

    });

    return MainView;
});
