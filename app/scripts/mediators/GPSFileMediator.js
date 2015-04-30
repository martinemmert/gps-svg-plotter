define(["underscore", "jquery", "backbone", "FileHandler", "GPXFileParser", "data/GPSCalculator", "FileSaver"], function (_, $, backbone, FileHandler, GPXFileParser, GPSCalculator) {

    var GPSFileMediator = function (GPSFileCollection, GPSDataCollection) {
        this._init(GPSFileCollection, GPSDataCollection);
    };

    _.extend(GPSFileMediator.prototype, {

        availableEvents: {

        },

        _init: function (GPSFileCollection, GPSDataCollection) {
            //-------------------------------------------------------------------------------------------------------------
            // set the reference to the GPSFilesCollection
            this._gpsFileCollection = GPSFileCollection;
            this._gpsDataCollection = GPSDataCollection;

            //-------------------------------------------------------------------------------------------------------------
            // extend the available commands
            _.extend(Backbone.availableCommands, {
                FileMediator: {
                    "handleGivenFiles": "GPSFileMediator::HandleGivenFiles",
                    "storeSVGFile": "GPSFileMediator::StoreSVGFile"
                }
            });

            //-------------------------------------------------------------------------------------------------------------
            // setup the commands
            Backbone.CommandHub.addCommand(Backbone.availableCommands.FileMediator.handleGivenFiles, this._handleGivenFiles, this);
            Backbone.CommandHub.addCommand(Backbone.availableCommands.FileMediator.storeSVGFile, this._storeSVGFile, this);

            //-------------------------------------------------------------------------------------------------------------
            // setup the FileHandler
            this._fileHandler = new FileHandler();

            //-------------------------------------------------------------------------------------------------------------
            // add event listener to the file handler
            this._fileHandler.on(FileHandler.EVENT_FILE_READ_START, this._onFileReadStart, this);
            this._fileHandler.on(FileHandler.EVENT_FILE_READ_PROGRESS, this._onFileReadProgress, this);
            this._fileHandler.on(FileHandler.EVENT_FILE_READ_COMPLETED, this._onFileReadCompleted, this);

            //-------------------------------------------------------------------------------------------------------------
            // setup the GPSCalculator
            this._gpsCalculator = new GPSCalculator();

            //-------------------------------------------------------------------------------------------------------------
            // add event listener to the gps calculator
            this._gpsCalculator.on(GPSCalculator.EVENT_START, this._onGPSCalculatorStart, this);
            this._gpsCalculator.on(GPSCalculator.EVENT_PROGRESS, this._onGPSCalculatorProgress, this);
            this._gpsCalculator.on(GPSCalculator.EVENT_COMPLETE, this._onGPSCalculatorComplete, this);
        },

        _handleGivenFiles: function (fileList) {
            //-------------------------------------------------------------------------------------------------------------
            // add the given files to the queue
            for (var i = 0, l = fileList.length; i < l; i++) {
                var file = fileList[i];

                //-------------------------------------------------------------------------------------------------------------
                // create and add new file model
                this._gpsFileCollection.addNewGPSFileModel({
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    lastModified: file.lastModifiedDate.getTime()
                }).__fileReference = file;
            }

            //-------------------------------------------------------------------------------------------------------------
            // start the file handling of the files inside the queue
            if (!this._fileHandlingRunning) {
                this._startFileHandling();
            }
        },

        _storeSVGFile: function (params) {

            //-------------------------------------------------------------------------------------------------------------
            // create the filename
            var filename = Backbone.Utils.moment(params.model.getOrderDate().toISOString()).format("YYYY-MM-DD");
            filename += "_";
            filename += Backbone.Utils.moment(params.model.getFlightDate().toISOString()).format("YYYY-MM-DD");
            filename += "_";
            filename += params.model.getPilot();
            filename += ".svg";

            var dataBlob = new Blob([params.svgString], {type: 'image/svg+xml'});
            saveAs(dataBlob, filename);
        },

        _startFileHandling: function () {
            //-------------------------------------------------------------------------------------------------------------
            // get next unloaded model
            var nextModel = this._gpsFileCollection.find(function (model) {
                return model.getIsLoaded() == false;
            });

            //-------------------------------------------------------------------------------------------------------------
            // check if any model was found
            if (nextModel != undefined) {
                //-------------------------------------------------------------------------------------------------------------
                // set the flag that the handling process is running
                this._fileHandlingRunning = true;

                //-------------------------------------------------------------------------------------------------------------
                // set the current file model
                this._currentFileModel = nextModel;

                //-------------------------------------------------------------------------------------------------------------
                // handle the next file
                this._fileHandler.handleFile(nextModel.__fileReference);
            }
            //-------------------------------------------------------------------------------------------------------------
            // no unloaded files stop
            else {
                //-------------------------------------------------------------------------------------------------------------
                // unset the flag that the handling process is running
                this._fileHandlingRunning = false;
            }
        },

        _onFileReadStart: function (params) {
            //-------------------------------------------------------------------------------------------------------------
            // get the fileModel

            //-------------------------------------------------------------------------------------------------------------
            // set the designated state of the current file
            this._currentFileModel.setState(this._gpsFileCollection.model.STATE_CURRENTLY_LOADING);
        },

        _onFileReadProgress: function (params) {
            //-------------------------------------------------------------------------------------------------------------
            // get the file
            var file = params.file;

            //-------------------------------------------------------------------------------------------------------------
            // get the current progress
            var progress = params.progress;

            //-------------------------------------------------------------------------------------------------------------
            // set the progress
            this._currentFileModel.setLoadProgress(progress);
        },

        _onFileReadCompleted: function (params) {
            //-------------------------------------------------------------------------------------------------------------
            // get the file and the content of the file
            var file = params.file;
            var content = params.content;
            var parsedContent = GPXFileParser.parse(content);

            //-------------------------------------------------------------------------------------------------------------
            // update the state of the model
            this._currentFileModel.setState(this._gpsFileCollection.model.STATE_LOADED_NOT_PROCESSED);

            //-------------------------------------------------------------------------------------------------------------
            // remove the file reference
            this._currentFileModel.__fileReference = null;
            delete this._currentFileModel.__fileReference;

            //-------------------------------------------------------------------------------------------------------------
            // parse the file which just has been read
            // todo: include file extension test here for additional parser

            //-------------------------------------------------------------------------------------------------------------
            // do the math
            this._gpsCalculator.processGPSData(parsedContent);
        },

        _onGPSCalculatorStart: function () {
            //-------------------------------------------------------------------------------------------------------------
            // update the state of the model
            this._currentFileModel.setState(this._gpsFileCollection.model.STATE_CURRENTLY_PROCESSING);
        },

        _onGPSCalculatorProgress: function (params) {
            //-------------------------------------------------------------------------------------------------------------
            // get the progress
            var progress = params.progress;

            //-------------------------------------------------------------------------------------------------------------
            // update the progress
            this._currentFileModel.setProcessProgress(progress);
        },

        _onGPSCalculatorComplete: function (params) {
            //-------------------------------------------------------------------------------------------------------------
            // set the new values
            var data = params.json;

            var start = Date.now();

            //-------------------------------------------------------------------------------------------------------------
            // create the new GPSDataModel
            this._gpsDataCollection.addNewGPSDataModel({
                name: this._currentFileModel.getFileName().replace("." + this._currentFileModel.getFileExtension(), ""),
                gpsPoints: data.gps,
                beeLineDistance: data.beeLineDistance,
                distance: data.distance,
                duration: data.duration,
                maxElevation: data.maxEle,
                maxLatitude: data.maxLat,
                maxLongitude: data.maxLon,
                maxSpeed: data.maxSpeed,
                minElevation: data.minEle,
                minLatitude: data.minLat,
                minLongitude: data.minLon
            });

            //-------------------------------------------------------------------------------------------------------------
            // update the state of the model
            this._currentFileModel.setState(this._gpsFileCollection.model.STATE_LOADED_AND_PROCESSED);

            console.log("-----> " + (Date.now() - start) + "ms <-----");

            //-------------------------------------------------------------------------------------------------------------
            // restart the file handling to load any not loaded file
            this._startFileHandling();
        }

    });


    return GPSFileMediator;
});