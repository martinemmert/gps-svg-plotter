/*global define*/

define([
    'jquery',
    'backbone',
    // needed views
    'views/MainView', 'views/MainNavigationView', 'views/WorkspaceView'
], function ($, Backbone, /* views */ MainView, MainNavigationView, WorkspaceView) {
    'use strict';

    var BaseRouter = Backbone.Router.extend({

        routes: {
            "": "indexAction"
        },

        initialize: function (App) {
            //-------------------------------------------------------------------------------------------------------------
            // store the reference to the app
            this._app = App;

            //-------------------------------------------------------------------------------------------------------------
            // check if the needed js apis are available
            if (FileReader == undefined) {
                alert("Your Browser is not able to run this Application!");
            }

            //todo: add further tests
        },

        //-------------------------------------------------------------------------------------------------------------
        // ROUTES
        //-------------------------------------------------------------------------------------------------------------

        indexAction: function (params) {
            //-------------------------------------------------------------------------------------------------------------
            // say Hay!
            console.log("Hello Sir!");

            //-------------------------------------------------------------------------------------------------------------
            // create the main view
            if (!this._mainView) {

                //-------------------------------------------------------------------------------------------------------------
                // create the instance of the main view
                this._mainView = new MainView({
                    el: $("#application-root")
                });

                //-------------------------------------------------------------------------------------------------------------
                // register child views
                this._mainView.addChildView("MainNavigationView", MainNavigationView, {}, "main-navigation", true);
                this._mainView.addChildView("WorkspaceView", WorkspaceView, {
                    GPSFileCollection: this._app.getCollection("GPSFileCollection"),
                    GPSDataCollection: this._app.getCollection("GPSDataCollection")
                }, "content", false);

                //-------------------------------------------------------------------------------------------------------------
                // render the main view
                this._mainView.render();

                //-------------------------------------------------------------------------------------------------------------
                // register events
                this._mainView.getChildView("WorkspaceView").on("WorkspaceView::FilesDropped", function (params) {
                    //-------------------------------------------------------------------------------------------------------------
                    // get the files
                    var files = params.files;

                    //-------------------------------------------------------------------------------------------------------------
                    // check if the needed file mediator is available
                    if (Backbone.availableCommands.FileMediator) {
                        //-------------------------------------------------------------------------------------------------------------
                        // execute the command to handle all given files
                        Backbone.executeCommand(Backbone.availableCommands.FileMediator.handleGivenFiles, files);
                    } else {
                        alert("The FileMediator is Missing!!");
                    }
                });

            }
        }


    });

    return BaseRouter;
});
