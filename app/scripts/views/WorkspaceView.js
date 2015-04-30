/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/GPSDataListView',
    'views/GPSFileListView',
    'views/FileDropView',
    'views/GPSDataOverviewView',
    'views/GPSDataRenderView'
], function ($, _, Backbone, JST, GPSDataListView, GPSFileListView, FileDropView, GPSDataOverviewView, GPSDataRenderView) {
    'use strict';

    var WorkspaceView = Backbone.View.extend({

        className: "workspace-view",

        template: JST['app/scripts/templates/WorkspaceView.hbs'],

        initialize: function (params) {
            //-------------------------------------------------------------------------------------------------------------
            // store the reference to the GPSFileCollection
            this._gpsFileListCollection = params.GPSFileCollection;
            this._gpsDataListCollection = params.GPSDataCollection;
        },

        render: function () {
            //-------------------------------------------------------------------------------------------------------------
            // render the template
            this.$el.html(this.template());

            //-------------------------------------------------------------------------------------------------------------
            // render the gps data list view
            this._renderGPSDataListView();

            //-------------------------------------------------------------------------------------------------------------
            // render the gps file list view
            this._renderGPSFileListView();

            //-------------------------------------------------------------------------------------------------------------
            // render the file drop view
            this._renderFileDropView();

            //-------------------------------------------------------------------------------------------------------------
            // render the gps data render view
            this._renderGPSDataRenderView();

            //-------------------------------------------------------------------------------------------------------------
            // render the gps data overview view
            this._renderGPSDataOverviewView();

            //-------------------------------------------------------------------------------------------------------------
            // return the instance
            return this;
        },

        _renderGPSDataListView: function () {
            //-------------------------------------------------------------------------------------------------------------
            // create the instance of the gps data list view
            this._gpsDataListView = new GPSDataListView({
                el: this.$("[data-template-part=gps-data-list-view]")[0],
                collection: this._gpsDataListCollection
            });

            //-------------------------------------------------------------------------------------------------------------
            // add some event listener
            this.listenTo(this._gpsDataListView, 'GPSDataListView::ItemClicked', this._onGPSDataListViewItemClicked);

            //-------------------------------------------------------------------------------------------------------------
            // render the gps file list view
            this._gpsDataListView.render();

            //-------------------------------------------------------------------------------------------------------------
            // return the instance
            return this;
        },

        _renderGPSFileListView: function () {
            //-------------------------------------------------------------------------------------------------------------
            // create the instance of the gps file list view
            this._gpsFileListView = new GPSFileListView({
                el: this.$("[data-template-part=gps-file-list-view]")[0],
                collection: this._gpsFileListCollection
            });

            //-------------------------------------------------------------------------------------------------------------
            // render the gps file list view
            this._gpsFileListView.render();

            //-------------------------------------------------------------------------------------------------------------
            // return the instance
            return this;
        },

        _renderFileDropView: function () {
            //-------------------------------------------------------------------------------------------------------------
            // create the instance of the file drop view
            this._fileDropView = new FileDropView({
                el: this.$("[data-template-part=file-drop-view]")[0]
            });

            //-------------------------------------------------------------------------------------------------------------
            // add listeners to the file drop view
            this.listenTo(this._fileDropView, Backbone.eventTypes.DropZoneView.DragDrop, this._onDropZoneViewDrop);

            //-------------------------------------------------------------------------------------------------------------
            // render the file drop view
            this._fileDropView.render();

            //-------------------------------------------------------------------------------------------------------------
            // return the instance
            return this;
        },

        _renderGPSDataRenderView: function () {
            //-------------------------------------------------------------------------------------------------------------
            // create an instance of the view
            this._gpsDataRenderView = new GPSDataRenderView({
                el: this.$("[data-template-part=gps-data-render-view]")
            });

            //-------------------------------------------------------------------------------------------------------------
            // render the view
            this._gpsDataRenderView.render();

            //-------------------------------------------------------------------------------------------------------------
            // return the instance
            return this;
        },

        _renderGPSDataOverviewView: function () {
            //-------------------------------------------------------------------------------------------------------------
            // create or get the instance of the view
            this._gpsDataOverviewView = this._gpsDataOverviewView || new GPSDataOverviewView({
                el: this.$("[data-template-part=gps-data-overview-view]")
            });

            //-------------------------------------------------------------------------------------------------------------
            // render the view
            this._gpsDataOverviewView.render();

            //-------------------------------------------------------------------------------------------------------------
            // listen to the export event
            this.listenTo(this._gpsDataOverviewView, "GPSDataOverviewView::ExportSVG", this._exportSVG);

            //-------------------------------------------------------------------------------------------------------------
            // return the instance
            return this;
        },

        _onDropZoneViewDrop: function (params) {
            //-------------------------------------------------------------------------------------------------------------
            // bubble the event
            this.trigger("WorkspaceView::FilesDropped", params);
        },

        _onGPSDataListViewItemClicked: function (params) {
            //-------------------------------------------------------------------------------------------------------------
            // get the selected item
            var item = params.item;

            //-------------------------------------------------------------------------------------------------------------
            // set the selection on the view
            this._gpsDataListView.setSelectedItem(item);

            //-------------------------------------------------------------------------------------------------------------
            // render the gps data at the overview
            this._gpsDataOverviewView.changeGPSDataModel(item);

            //-------------------------------------------------------------------------------------------------------------
            // render the selected item
            this._gpsDataRenderView.renderGPSData(item);

        },

        _exportSVG: function (params) {
            //-------------------------------------------------------------------------------------------------------------
            // check if the mediator is available
            if (Backbone.availableCommands.FileMediator) {
                //-------------------------------------------------------------------------------------------------------------
                // execute the command to handle all given files
                Backbone.executeCommand(Backbone.availableCommands.FileMediator.storeSVGFile, {
                    svgString : this._gpsDataRenderView.getSVGData(),
                    model: params.model
                });
            } else {
                alert("The FileMediator is Missing!!");
            }
        }

    });

    return WorkspaceView;
});
