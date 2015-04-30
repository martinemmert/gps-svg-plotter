/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var FileDropView = Backbone.DropZoneView.extend({

        className: "file-drop-view col-xs-12 col-xs-12 col-lg-12",

        template: JST['app/scripts/templates/FileDropView.hbs'],

        render: function () {
            this.$el.html(this.template());
            this.enableDropZone();
            return this;
        },

        _validateDragEvent: function (event) {
            //----------------------------------------------------------------------------------------------------------
            // validate the drag event to control if the drop zone could be a target to dragged element

            //-------------------------------------------------------------------------------------------------------------
            // get the original event dataTransfer Object
            var dataTransfer = event.originalEvent.dataTransfer;

            //-------------------------------------------------------------------------------------------------------------
            // get any items
            var items = dataTransfer.items;

            //-------------------------------------------------------------------------------------------------------------
            // check if the given items are files
            if (this.isDropZoneEnabled() && items) {
                for (var i = 0, l = items.length; i < l; i++) {
                    var item = items[i];
                    var kind = item.kind;
                    var type = item.type;

                    //-------------------------------------------------------------------------------------------------------------
                    // check if kind is available and true when its value is file
                    if (kind && kind == "file") {
                        return true;
                    }

                    //todo: add more tests here
                }
            }

            //-------------------------------------------------------------------------------------------------------------
            // return false
            return false;
        },

        _getDragDropEventParams: function (event) {
            //----------------------------------------------------------------------------------------------------------
            // override the returned object
            return {files: event.originalEvent.dataTransfer.files};
        }

    });

    return FileDropView;
});
