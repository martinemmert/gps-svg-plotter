/**
 * @author:  Martin Emmert
 * @created: 05.08.14 - 14:19
 *
 * @package:
 * @name:
 */
define(["underscore", "jquery", "backbone",
    // collections
    'collections/GPSFileCollection',
    'collections/GPSDataCollection',
    // mediators
    'mediators/GPSFileMediator'
], function (_, $, Backbone, /* collections */ GPSFileCollection, GPSDataCollection, /* mediators */ GPSFileMediator) {

    //-------------------------------------------------------------------------------------------------------------
    // collection storage
    var Storage = {};

    //-------------------------------------------------------------------------------------------------------------
    // mediators
    var Mediators = {};

    //-------------------------------------------------------------------------------------------------------------
    // constructor
    var Application = function () {
        //-------------------------------------------------------------------------------------------------------------
        // build the storage
        Storage.GPSFileCollection = new GPSFileCollection();
        Storage.GPSDataCollection = new GPSDataCollection();

        //-------------------------------------------------------------------------------------------------------------
        // build the mediators
        Mediators.GPSFileMediator = new GPSFileMediator(Storage.GPSFileCollection, Storage.GPSDataCollection);
    };

    //-------------------------------------------------------------------------------------------------------------
    // extend the prototype
    _.extend(Application.prototype, {

        initialize: function (BaseRouter) {
            //-------------------------------------------------------------------------------------------------------------
            // create the base router
            this._router = new BaseRouter(this);

            //-------------------------------------------------------------------------------------------------------------
            // return the instance
            return this;
        },

        start: function () {
            //-------------------------------------------------------------------------------------------------------------
            // start the Backbone history
            Backbone.history.start({
                pushState: false,
                hashChange: true,
                root: ''
            });

            //-------------------------------------------------------------------------------------------------------------
            // return the instance
            return this;
        },

        getCollection: function (collectionName) {
            //-------------------------------------------------------------------------------------------------------------
            // throw an error if the collection does not exist
            if (!Storage[collectionName]) {
                throw new Error("A Collection with the name: " + collectionName + " does not exist!");
            }

            //-------------------------------------------------------------------------------------------------------------
            // return the collection
            return Storage[collectionName];
        }

    });

    return Application;

});