/**
 * @author:  Martin Emmert
 * @created: 06.08.14 - 13:41
 *
 * @package:
 * @name:
 */
define(["underscore", "jquery"], function (_, $) {

    var GPXParser = function () {

    };

    _.extend(GPXParser.prototype, {

        parse: function (xmlString) {

            //-------------------------------------------------------------------------------------------------------------
            // parse the string to an xml object
            var xml = $.parseXML(xmlString);

            //-------------------------------------------------------------------------------------------------------------
            // define needed variables
            var lat, lon, ele, time, json = {gps: []};

            //-------------------------------------------------------------------------------------------------------------
            // helper function to get an attribute
            function getAttr(node, name) {
                if (node && node.jquery) node = node[0];
                return (node && node.getAttribute && node.getAttribute(name)) || null;
            }

            //-------------------------------------------------------------------------------------------------------------
            // find all gps log entries

            //-------------------------------------------------------------------------------------------------------------
            // get the first track insinde the gpx data
            var trk = xml.querySelector("trk");

            _.each(trk.querySelectorAll("trkpt"), function (element) {

                //-------------------------------------------------------------------------------------------------------------
                // get the latitude
                lat = getAttr(element, "lat");

                //-------------------------------------------------------------------------------------------------------------
                // get the longitude
                lon = getAttr(element, "lon");

                //-------------------------------------------------------------------------------------------------------------
                // get the elevation
                ele = element.querySelector("ele").innerHTML;

                //-------------------------------------------------------------------------------------------------------------
                // get the time
                time = element.querySelector("time").innerHTML;

                //-------------------------------------------------------------------------------------------------------------
                // get min/max of latitude
                json.minLat = Math.min(json.minLat || Number.MAX_VALUE, lat);
                json.maxLat = Math.max(json.maxLat || Number.MIN_VALUE, lat);

                //-------------------------------------------------------------------------------------------------------------
                // get min/max of longitude
                json.minLon = Math.min(json.minLon || Number.MAX_VALUE, lon);
                json.maxLon = Math.max(json.maxLon || Number.MIN_VALUE, lon);

                //-------------------------------------------------------------------------------------------------------------
                // get min/max of elevation
                json.minEle = Math.min(json.minEle || Number.MAX_VALUE, ele);
                json.maxEle = Math.max(json.maxEle || Number.MIN_VALUE, ele);

                //-------------------------------------------------------------------------------------------------------------
                // store the value into an object and push it into the json's gps array
                json.gps.push({
                    latitude: lat,
                    longitude: lon,
                    elevation: ele,
                    time: time
                });

            });

            //-------------------------------------------------------------------------------------------------------------
            // get the start/end time
            json.startTime = json.gps[0].time;
            json.endTime = json.gps[json.gps.length - 1].time;

            //-------------------------------------------------------------------------------------------------------------
            // get the start/end location
            json.startGPS = json.gps[0];
            json.endGPS = json.gps[json.gps.length - 1];

            //-------------------------------------------------------------------------------------------------------------
            // return the json
            return json;
        }


    });

    //-------------------------------------------------------------------------------------------------------------
    // return the Class as singleton instance
    return new GPXParser();

});