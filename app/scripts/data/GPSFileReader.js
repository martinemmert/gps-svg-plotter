/**
 * @author:  Martin Emmert
 * @created: 05.08.14 - 18:36
 *
 * @package:
 * @name:
 */
define(["underscore", "jquery", "backbone", 'data/GPSCalculator'], function (_, $, Backbone, GPSCalculator) {

    var GPSFileReader = function () {

        //-------------------------------------------------------------------------------------------------------------
        // setup some config vars
        this._chunkSize = 2048;
        this._currentChunk = 0;

        //-------------------------------------------------------------------------------------------------------------
        // create an instance of the FileReader
        this._fileReader = new FileReader();

        //-------------------------------------------------------------------------------------------------------------
        // add event listener
        this._fileReader.onloadstart = this._onFileReaderLoadStart.bind(this);
        this._fileReader.onerror = this._onFileReaderError.bind(this);
        this._fileReader.onabort = this._onFileReaderAbort.bind(this);
        this._fileReader.onload = this._onFileReaderLoad.bind(this);
        this._fileReader.onloadend = this._onFileReaderLoadEnd.bind(this);

    };

    //-------------------------------------------------------------------------------------------------------------
    // static Event Names
    GPSFileReader.EVENT_FILE_READ_START = "GPSFileReader::ReadStart";
    GPSFileReader.EVENT_FILE_READ_PROGRESS = "GPSFileReader::ReadProgress";
    GPSFileReader.EVENT_FILE_READ_COMPLETED = "GPSFileReader::ReadCompleted";

    _.extend(GPSFileReader.prototype, Backbone.Events, {

        //-------------------------------------------------------------------------------------------------------------
        // handle a given file
        handleFile: function (file) {
            if (this._fileReader.readyState == FileReader.EMPTY || this._fileReader.readyState == FileReader.DONE) {
                this._currentFile = file;
                this._currentFileSize = (file.size - 1);
                this._currentChunk = 0;
                this._currentProgress = 0;
                this._currentFileContent = null;
                this.trigger(GPSFileReader.EVENT_FILE_READ_START, {file: this._currentFile});
                this._readChunk();
            } else {
                throw new Error("GPSFileReader is not yet ready!");
            }
        },

        _readChunk: function () {
            //-------------------------------------------------------------------------------------------------------------
            // calc the next chunk size
            var nextChunk = Math.min(this._currentChunk + this._chunkSize, this._currentFileSize);

            //-------------------------------------------------------------------------------------------------------------
            // create the blob to read
            var blob = this._currentFile.slice(this._currentChunk, nextChunk);

            //-------------------------------------------------------------------------------------------------------------
            // read the blobs content
            this._fileReader.readAsText(blob);
        },

        //
        //-------------------------------------------------------------------------------------------------------------
        // EVENT HANDLER
        //-------------------------------------------------------------------------------------------------------------
        //

        _onFileReaderLoadStart: function () {
//            console.log("onFileReaderLoadStart", arguments);
        },

        _onFileReaderError: function () {
            console.log("onFileReaderError", arguments);
        },

        _onFileReaderAbort: function () {
            console.log("onFileReaderAbort", arguments);
        },

        _onFileReaderLoad: function () {

            //-------------------------------------------------------------------------------------------------------------
            // store the current content
            if (!this._currentFileContent) {
                this._currentFileContent = this._fileReader.result;
            } else {
                this._currentFileContent += this._fileReader.result;
            }

            //-------------------------------------------------------------------------------------------------------------
            // calc the current progress
            this._currentProgress = Math.min((this._currentChunk += this._chunkSize) / this._currentFileSize, 1);

            //-------------------------------------------------------------------------------------------------------------
            // trigger an process event
            this.trigger(GPSFileReader.EVENT_FILE_READ_PROGRESS, {file: this._currentFile, progress: this._currentProgress});

            //-------------------------------------------------------------------------------------------------------------
            // read next chunk if file is not done
            if (this._currentChunk < this._currentFileSize) {
                this._readChunk();
            }
            //-------------------------------------------------------------------------------------------------------------
            // complete the read progress
            else {
                //-------------------------------------------------------------------------------------------------------------
                // save this
                var that = this;

                //-------------------------------------------------------------------------------------------------------------
                // get references to the to be deleted properties
                var file = this._currentFile;
                var fileContent = this._currentFileContent;

                //-------------------------------------------------------------------------------------------------------------
                // call the FileReadCompleted event
                setTimeout(function () {
                    that.trigger(GPSFileReader.EVENT_FILE_READ_COMPLETED, {file: file, content: fileContent});
                }, 0);

                //-------------------------------------------------------------------------------------------------------------
                // unset the files content
                this._currentFile = null;
                this._currentFileContent = null;
            }
        },

        _onFileReaderLoadEnd: function () {

        }

    });

    return GPSFileReader;

});
