/**
 * @author:  Martin Emmert
 * @created: 06.08.14 - 15:04
 *
 * @package:
 * @name:
 */
define(["underscore", "backbone"], function (_, Backbone) {

    var GPSCalculator = function () {
        this._init();
    };

    GPSCalculator.EVENT_START = "GPSCalculator::Start";
    GPSCalculator.EVENT_PROGRESS = "GPSCalculator::Progress";
    GPSCalculator.EVENT_COMPLETE = "GPSCalculator::Complete";

    GPSCalculator.DEG_2_RAD = Math.PI / 180;
    GPSCalculator.EARTH_RADIUS = 6378137;

    _.extend(GPSCalculator.prototype, Backbone.Events, {

        _init: function () {
            this._maxTime = 40;
        },

        processGPSData: function (gpsData) {
            this._currentGPSData = gpsData;
            this._currentIndex = 0;
            this._maxIndex = this._currentGPSData.gps.length - 1;
            this._currentGPSData.distance = 0;


            this._startTime = Date.now();

            this.trigger(GPSCalculator.EVENT_START);
            this._process();
        },

        _process: function () {
            //-------------------------------------------------------------------------------------------------------------
            // get the start time
            var start = Date.now();
            var totalTime = 0;

            //-------------------------------------------------------------------------------------------------------------
            // iterate through the next gps objects
            for (; this._currentIndex < this._maxIndex; this._currentIndex++) {
                totalTime += Date.now() - start;
//                console.log(totalTime, this._currentIndex);
                if (totalTime > this._maxTime) break;
                var gps1 = this._currentGPSData.gps[this._currentIndex];
                var gps2 = this._currentGPSData.gps[this._currentIndex + 1];
                var distance = this._calculateDistanceBetween(gps1.latitude, gps1.longitude, gps2.latitude, gps2.longitude);
                var speed = this._calculateSpeedBetween(distance, gps1.time, gps2.time);
                if (this._currentGPSData.maxSpeed || Number.MIN_VALUE < speed) {
                    this._currentGPSData.maxSpeed = speed;
                    this._currentGPSData.maxSpeedData = [distance, gps1.time, gps2.time];
                }
                this._currentGPSData.distance += distance;
                if (this._currentGPSData.maxDistance || Number.MIN_VALUE < distance) {
                    this._currentGPSData.maxDistance = distance;
                    this._currentGPSData.maxDistanceData = [gps1, gps2];
                }
            }

            //-------------------------------------------------------------------------------------------------------------
            // check if we are done yet
            if (this._currentIndex < this._maxIndex) {
                //-------------------------------------------------------------------------------------------------------------
                // trigger the progress event
                this.trigger(GPSCalculator.EVENT_PROGRESS, {progress: this._currentIndex / this._maxIndex});

                //-------------------------------------------------------------------------------------------------------------
                // continue the processing
                this._process();
            } else {
                //-------------------------------------------------------------------------------------------------------------
                // calculate the bee line distance
                this._currentGPSData.beeLineDistance = this._calculateDistanceBetween(this._currentGPSData.startGPS.latitude, this._currentGPSData.startGPS.longitude, this._currentGPSData.endGPS.latitude, this._currentGPSData.endGPS.longitude);
                this._currentGPSData.duration = this._calculateDuration(this._currentGPSData.startGPS.time, this._currentGPSData.endGPS.time);

                //-------------------------------------------------------------------------------------------------------------
                // trigger the progress event
                this.trigger(GPSCalculator.EVENT_PROGRESS, {progress: 1});

                console.log(Date.now() - this._startTime + "ms");

                //-------------------------------------------------------------------------------------------------------------
                // trigger the complete event and return the gps json
                this.trigger(GPSCalculator.EVENT_COMPLETE, {json: this._currentGPSData});
            }
        },

        _calculateDistanceBetween: function (lat1, lon1, lat2, lon2) {

            var dLat, dLon, a, c, d;

            dLat = ((lat2 - lat1) * GPSCalculator.DEG_2_RAD) / 2;
            dLon = ((lon2 - lon1) * GPSCalculator.DEG_2_RAD) / 2;
            lat1 = lat1 * GPSCalculator.DEG_2_RAD;
            lat2 = lat2 * GPSCalculator.DEG_2_RAD;

            a = Math.sin(dLat) * Math.sin(dLat) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon) * Math.sin(dLon);
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            d = GPSCalculator.EARTH_RADIUS * c;

            return d;
        },

        _calculateSpeedBetween: function (distance, time1, time2) {

            var time_s, meter_s;

            time1 = new Date(time1);
            time2 = new Date(time2);

            time_s = (time2.getTime() - time1.getTime()) / 1000;
            meter_s = distance / time_s;

            return (meter_s * 3600) / 1000;
        },

        _calculateDuration: function (time1, time2) {
            time1 = new Date(time1);
            time2 = new Date(time2);
            console.log(time1.getTime(), time2.getTime(), time1, time2)
            return time2.getTime() - time1.getTime();
        }

    });

    return GPSCalculator;

});