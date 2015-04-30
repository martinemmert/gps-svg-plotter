/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/GPSDataListElementView'
], function ($, _, Backbone, JST, GPSDataListElementView) {
    'use strict';

    var GPSDataListView = Backbone.View.extend({

        template: JST['app/scripts/templates/GPSDataListView.hbs'],

        events: {
            "click .list-group-item": "_onListItemClicked"
        },

        initialize: function (options) {
            //-------------------------------------------------------------------------------------------------------------
            // bind events
            _.bindAll(this, "_onListItemClicked");

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
            this._$list = this.$("[data-template-part=gps-data-list-elements]");

            //-------------------------------------------------------------------------------------------------------------
            // return the instance
            return this;
        },

        setSelectedItem: function (model) {
            //-------------------------------------------------------------------------------------------------------------
            // remove the class from the current active element
            if (this._currentSelectedItem) this._listElementViews[this._currentSelectedItem.id || this._currentSelectedItem.cid].$el.removeClass("active");

            //-------------------------------------------------------------------------------------------------------------
            // add the class to the selected element
            this._listElementViews[model.id || model.cid].$el.addClass("active");

            //-------------------------------------------------------------------------------------------------------------
            // set the current selected item
            this._currentSelectedItem = model;

        },

        _renderGPSDataListElementView: function (model) {
            //-------------------------------------------------------------------------------------------------------------
            // create an instance for the view
            var view = new GPSDataListElementView({
                model: model
            });

            //-------------------------------------------------------------------------------------------------------------
            // store the view
            this._listElementViews[model.id || model.cid] = view;

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
            this._renderGPSDataListElementView(model);
        },

        _onCollectionRemove: function () {
            console.log(arguments);
        },

        _onListItemClicked: function (event) {
            //-------------------------------------------------------------------------------------------------------------
            // get the id
            var id = event.currentTarget.getAttribute("data-item-id");

            //-------------------------------------------------------------------------------------------------------------
            // abort if the selected item is the currentSelected item
            if (this._currentSelectedItem && (this._currentSelectedItem.id || this._currentSelectedItem.cid) == id) return false;

            //-------------------------------------------------------------------------------------------------------------
            // get the clicked item
            var item = this.collection.get(id);

            //-------------------------------------------------------------------------------------------------------------
            // bubble the event
            this.trigger("GPSDataListView::ItemClicked", {item: item});
        }


    });

    return GPSDataListView;
});
