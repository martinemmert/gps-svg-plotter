/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/GPSFileListElementView'
], function ($, _, Backbone, JST, GPSFileListElementView) {
    'use strict';

    var GPSFileListView = Backbone.View.extend({

        template: JST['app/scripts/templates/GPSFileListView.hbs'],

        initialize: function (options) {
            //-------------------------------------------------------------------------------------------------------------
            // store the reference to the collection
            this.collection = options.collection;

            //-------------------------------------------------------------------------------------------------------------
            // add some event listeners to the collection
            this.collection.on("add", this._onCollectionAdd, this);
            this.collection.on("remove", this._onCollectionRemove, this);

            //-------------------------------------------------------------------------------------------------------------
            // create an object to store the element views
            this._listElementViews = {};
        },

        render: function () {
            //-------------------------------------------------------------------------------------------------------------
            // render the template
            this.$el.html(this.template());

            //-------------------------------------------------------------------------------------------------------------
            // get a reference to the list
            this._$list = this.$("[data-template-part=gps-file-list-elements]");

            //-------------------------------------------------------------------------------------------------------------
            // return the instance
            return this;
        },

        _renderGPSFileListElementView: function (model) {
            //-------------------------------------------------------------------------------------------------------------
            // create an instance for the view
            var view = new GPSFileListElementView({
                model: model
            });

            //-------------------------------------------------------------------------------------------------------------
            // store the view
            this._listElementViews[model.cid] = view;

            //-------------------------------------------------------------------------------------------------------------
            // render the view
            view.render();

            //-------------------------------------------------------------------------------------------------------------
            // append the item to the list
            this._$list.append(view.$el);

            //-------------------------------------------------------------------------------------------------------------
            // return the instance
            return this;
        },

        _onCollectionAdd: function (model, collection, options) {
            //-------------------------------------------------------------------------------------------------------------
            // render the view for the model
            this._renderGPSFileListElementView(model);
        },

        _onCollectionRemove: function () {
            console.log(arguments);
        }
    });

    return GPSFileListView;
});
