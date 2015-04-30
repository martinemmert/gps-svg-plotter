/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        handlebars: {
            exports: 'Handlebars'
        },
        snap: {
            exports: "snap"
        }
    },
    moment: {
        noGlobal: true
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        "Backbone.DropZoneView": "../plugins/Backbone.DropZoneView",
        "Backbone.CommandHub": "../plugins/Backbone.CommandHub",
        underscore: '../bower_components/underscore/underscore',
        bootstrap: '../bower_components/sass-bootstrap/dist/js/bootstrap',
        handlebars: '../bower_components/handlebars/handlebars',
        "FileMediator": "mediators/FileMediator",
        "FileHandler": "data/GPSFileReader",
        "GPXFileParser": 'data/GPXFileParser',
        i18n: 'language/i18n',
        snap: '../bower_components/Snap.svg/dist/snap.svg-min',
        "moment": "../bower_components/moment/min/moment.min",
        "FileSaver": "../bower_components/FileSaver/FileSaver",
        "Raphael": "../bower_components/raphael/raphael"
    },

    map: {
        '*': {
            "backbone": "adapter/backbone-adapter",
            'handlebars': 'adapter/handlebars-adapter'
        },

        "adapter/backbone-adapter": {
            "backbone": "backbone"
        },

        'adapter/handlebars-adapter': {
            'handlebars': 'handlebars'
        },

        "Backbone.DropZoneView": {
            "backbone": "backbone"
        },

        "Backbone.CommandHub": {
            "backbone": "backbone"
        }

    }
});

require([
    'backbone',
    'app',
    "routes/BaseRouter",
], function (Backbone, App, BaseRouter) {
    //-------------------------------------------------------------------------------------------------------------
    // create the app
    var app = new App();

    //-------------------------------------------------------------------------------------------------------------
    // initialize the app with the base router
    app.initialize(BaseRouter);

    //-------------------------------------------------------------------------------------------------------------
    // start the app
    app.start();
});
