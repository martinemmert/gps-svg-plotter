/**
 * @author:  Martin Emmert
 * @created: 14.08.14 - 17:26
 *
 * @package:
 * @name:
 */
define(["underscore", "jquery", "backbone"], function (_, $, Backbone) {

    var SVGRenderer = function (node) {

        //-------------------------------------------------------------------------------------------------------------
        // create a new svg instance
        this._paper = SVG(node);

        //-------------------------------------------------------------------------------------------------------------
        // set the svgs ViewBox
        this._paperViewBox = this._paper.viewbox({
            x: 0,
            y: 0,
            width: 1417.65,
            height: 1417.65
        });
    };

    _.extend(SVGRenderer.prototype, Backbone.Events, {

        exportSVG: function () {
            //-------------------------------------------------------------------------------------------------------------
            // return the svg string
            return this._paper.exportSvg({whitespace: "\t", width: "500mm", height: "500mm"});
        },

        render: function (gpsDataModel) {

            //-------------------------------------------------------------------------------------------------------------
            // render the bbox
            this._renderBBox();

            //-------------------------------------------------------------------------------------------------------------
            // render the gps coordinates
            this._renderGPSCoordinates(gpsDataModel.getStartGPSPoint(), gpsDataModel.getEndGPSPoint());

            //-------------------------------------------------------------------------------------------------------------
            // render the flight data
            this._renderFlightData(gpsDataModel.getStartTime(), gpsDataModel.getDuration(), gpsDataModel.getBeeLineDistance(), gpsDataModel.getDistance(), gpsDataModel.getMaxElevation(), gpsDataModel.getMinElevation());

            //-------------------------------------------------------------------------------------------------------------
            // render the max elevation texts
            this._renderMaxElevationTexts(gpsDataModel.getStartGPSPoint().getElevation(), gpsDataModel.getMaxElevation(), gpsDataModel.getEndGPSPoint().getElevation());

            //-------------------------------------------------------------------------------------------------------------
            // render the text decial
            // todo: maybe this will be reinserted again
            //this._renderDecialText("FLIEGER*", "glück");

            //-------------------------------------------------------------------------------------------------------------
            // render the title
            this._renderTitleText(gpsDataModel.get("title"));

            //-------------------------------------------------------------------------------------------------------------
            // render the gps track
            this._drawTheGPSTrack(gpsDataModel);

            //-------------------------------------------------------------------------------------------------------------
            // update the svg viewport
//            this._snap.attr({
//                "viewBox": "0 0 " + this._blackSVG.asPX("width") + " 3400",
//                "preserveAspectRatio": "xMidYMin meet"
//            })
        },

        rerender: function (part, gpsDataModel) {
            switch (part) {
                case "title":
                    this._renderTitleText(gpsDataModel.get("title"));
                    break;
            }
        },

        _renderBBox: function () {
            //-------------------------------------------------------------------------------------------------------------
            // get the current bbox
            var bbox = this._paper.bbox();
            console.log(bbox);
            //-------------------------------------------------------------------------------------------------------------
            // draw a bounding box
            this._bbBox = this._paper.rect(this._paper.width(), this._paper.height())
                .stroke('#ff0000')
                .fill("none");
        },

        _drawTheGPSTrack: function (gpsDataModel) {
            //-------------------------------------------------------------------------------------------------------------
            // save this
            var that = this;

            //-------------------------------------------------------------------------------------------------------------
            // create the path string
            var pathPoints = [];
            var maxElevationPoint = null;
            var startPoint = gpsDataModel.getStartGPSPoint();
            var endPoint = gpsDataModel.getEndGPSPoint();
            var scaleF = 1;

            console.log(gpsDataModel.getBBox());

            //-------------------------------------------------------------------------------------------------------------
            // convert the gps data to a string
            gpsDataModel.getGPSPoints().each(function (model, index) {
                var x = model.getLongitude() - gpsDataModel.getBBox().x1;
                var y = (model.getLatitude() - gpsDataModel.getBBox().y1) * -1; // mirror the y position due to the mirrored coord systems


                scaleF = Math.max(gpsDataModel.getBBox().width, gpsDataModel.getBBox().height) / that._paper.bbox().width;

                console.log(x, y, scaleF);

                x /= scaleF;
                y /= scaleF;

                pathPoints.push([x, y]);

                if (gpsDataModel.getMaxElevation() == model.getElevation()) {
                    maxElevationPoint = model;
                }
            });

            //-------------------------------------------------------------------------------------------------------------
            // create draw the line
            var path = this._paper.polyline(pathPoints).stroke({width: "2mm", color: "#48ff75"}).fill("none").attr({"stroke-linejoin": "round", "stroke-linecap": "round"});

            //-------------------------------------------------------------------------------------------------------------
            // draw the start point
            this._startCircle = this._paper.circle("8mm").stroke({width: "2mm", color: "#FF0000"}).fill("none").attr({
                cx: (startPoint.getLongitude() - gpsDataModel.getBBox().x1) / scaleF,
                cy: (startPoint.getLatitude() - gpsDataModel.getBBox().y1) * -1 / scaleF
            });

            this._midCircle = this._paper.circle("8mm").stroke({width: "2mm", color: "#00FFFF"}).fill("none").attr({
                cx: (maxElevationPoint.getLongitude() - gpsDataModel.getBBox().x1) / scaleF,
                cy: (maxElevationPoint.getLatitude() - gpsDataModel.getBBox().y1) * -1 / scaleF
            });

            this._endCircle = this._paper.circle("8mm").stroke({width: "2mm", color: "#0000FF"}).fill("none").attr({
                cx: (endPoint.getLongitude() - gpsDataModel.getBBox().x1) / scaleF,
                cy: (endPoint.getLatitude() - gpsDataModel.getBBox().y1) * -1 / scaleF
            });

        },

        _renderGPSCoordinates: function (startGPS, endGPS) {

            //-------------------------------------------------------------------------------------------------------------
            // save this
            var that = this;

            //-------------------------------------------------------------------------------------------------------------
            // prep the gps text attributes
            var attr = {
                "font-family": "Myriad Pro",
                "font-weight": "bold",
                "font-size": "183pt",
                "fill": "#000000",
                "font-stretch": "semi-expanded",
                "letter-spacing": -8 * 183 / 1000 + "pt",
                "text-anchor": "start"
            };

            //-------------------------------------------------------------------------------------------------------------
            // prep the start gps values
            var startGPSLat = that._preZero(startGPS.getLatitude().toFixed(6));
            var startGPSLon = that._preZero(startGPS.getLongitude().toFixed(6));

            //-------------------------------------------------------------------------------------------------------------
            // prep the end gps values
            var endGPSLat = that._preZero(endGPS.getLatitude().toFixed(6));
            var endGPSLon = that._preZero(endGPS.getLongitude().toFixed(6));

            //-------------------------------------------------------------------------------------------------------------
            // create the start gps coordinates text
            this._startGPSText = this._paper.text(function (add) {
                add.tspan(startGPSLat);
                add.tspan(startGPSLon)
                    .x(0)
                    .dy("143pt");
            }).attr(attr);

            //-------------------------------------------------------------------------------------------------------------
            // set some attributes for the start gps text

            //-------------------------------------------------------------------------------------------------------------
            // create the end gps coordinates text
            this._endGPSText = this._paper.text(function (add) {
                add.tspan(endGPSLat);
                add.tspan(endGPSLon)
                    .x(0)
                    .dy("143pt");
            }).attr(attr);

            //-------------------------------------------------------------------------------------------------------------
            // get the bbox of the first text
            var startBBox = this._startGPSText.bbox();

            //-------------------------------------------------------------------------------------------------------------
            // reposition the start gps
            this._startGPSText.attr({
                y: startBBox.y * -1
            });

            //-------------------------------------------------------------------------------------------------------------
            // reposition the end gps
            this._endGPSText.attr({
                y: startBBox.y2 + startBBox.y * -2
            });

            //-------------------------------------------------------------------------------------------------------------
            // create the gps text group
            this._gpsTextGroup = this._paper.group();

            //-------------------------------------------------------------------------------------------------------------
            // add the texts to the group
            this._gpsTextGroup.add(this._startGPSText);
            this._gpsTextGroup.add(this._endGPSText);

        },

        _renderFlightData: function (startTime, duration, beeLineDistance, distance, maxElevation, minElevation) {
            //-------------------------------------------------------------------------------------------------------------
            // save this
            var that = this;

            //-------------------------------------------------------------------------------------------------------------
            // prep the base text attr
            var attr = {
                "font-family": "Myriad Pro",
                "font-weight": 600,
                "font-size": "33pt",
                "fill": "#FFFFFF",
                "letter-spacing": -10 * 33 / 1000 + "pt",
                "font-stretch": "semi-expanded"
            };

            //-------------------------------------------------------------------------------------------------------------
            // convert the data
            var date = new Date(startTime);
            date = Backbone.Utils.moment(date.toISOString());

            var startDate = date.format("DD.MM.YYYY");
            startTime = date.format("HH:mm");

            beeLineDistance = Math.floor(beeLineDistance).toFixed(0);
            distance = Math.floor(distance).toFixed(0);

            duration = Math.round(Backbone.Utils.moment.duration(duration).asMinutes());

            //-------------------------------------------------------------------------------------------------------------
            // create the start date and flight duration
            this._startDateText = this._paper.text(startDate + ", " + duration + " Min.").attr(attr);

            //-------------------------------------------------------------------------------------------------------------
            // create the start time
            this._startTimeText = this._paper.text("Start: " + startTime + " Uhr")
                .attr(attr)
                .x(0)
                .y(this._startDateText.bbox().y2);

            //-------------------------------------------------------------------------------------------------------------
            // create the track details
            this._trackText = this._paper.text(function (add) {
                add.tspan("Strecke");
                add.tspan("1: ").dx("5mm");
                add.tspan(beeLineDistance + " m");
                add.tspan("2: ").dx("5mm");
                add.tspan(distance + " m");
            }).attr(attr)
                .x(0)
                .y(this._startTimeText.bbox().y2);

            //-------------------------------------------------------------------------------------------------------------
            // create a group
            this._flightDataTextGroup = this._paper.group();

            //-------------------------------------------------------------------------------------------------------------
            // add the stuff
            this._flightDataTextGroup.add(this._startDateText);
            this._flightDataTextGroup.add(this._startTimeText);
            this._flightDataTextGroup.add(this._trackText);

            //-------------------------------------------------------------------------------------------------------------
            // get the bbox of the gps text group
            console.log(this._gpsTextGroup.rbox(), this._gpsTextGroup.bbox());
            var gpsTextGroupBBox = this._gpsTextGroup.bbox();

            //-------------------------------------------------------------------------------------------------------------
            // reposition the group
            this._flightDataTextGroup.translate(0, gpsTextGroupBBox.y2 + 50)
        },

        _renderMaxElevationTexts: function (startElevation, maxElevation, endElevation) {
            //-------------------------------------------------------------------------------------------------------------
            // prep the text attributes
            var attr = {
                "font-family": "Myriad Pro",
                "font-weight": "bold",
                "font-size": "33pt",
                "fill": "#48ff75",
                "letter-spacing": -25 * 33 / 1000 + "pt",
                "font-stretch": "semi-expanded"
            };

            //-------------------------------------------------------------------------------------------------------------
            // prepare the data
            startElevation = Math.floor(startElevation).toFixed(0);
            maxElevation = Math.floor(maxElevation).toFixed(0);
            endElevation = Math.floor(endElevation).toFixed(0);

            //-------------------------------------------------------------------------------------------------------------
            // create the start elevation text
            this._startElevationText = this._paper.text(function (add) {
                add.tspan("startEl:").fill("#ff0000");
                add.tspan(startElevation + " m").dx("20mm");
            }).attr(attr);

            //-------------------------------------------------------------------------------------------------------------
            // create the max elevation text
            this._maxElevationText = this._paper.text(function (add) {
                add.tspan("maxEl:").fill("#00ffFF");
                add.tspan(maxElevation + " m").dx("20mm");
            })
                .attr(attr)
                .y(this._startElevationText.bbox().y2 + 10);

            //-------------------------------------------------------------------------------------------------------------
            // create the end elevation text
            this._endElevationText = this._paper.text(function (add) {
                add.tspan("endEl:").fill("#0000ff");
                add.tspan(endElevation + " m").dx("20mm");
            })
                .attr(attr)
                .y(this._maxElevationText.bbox().y2 + 10);

            //-------------------------------------------------------------------------------------------------------------
            // create a group
            this._elevationTextGroup = this._paper.group();

            //-------------------------------------------------------------------------------------------------------------
            // add the stuff
            this._elevationTextGroup.add(this._startElevationText);
            this._elevationTextGroup.add(this._maxElevationText);
            this._elevationTextGroup.add(this._endElevationText);

            //-------------------------------------------------------------------------------------------------------------
            // get the bbox of the track data
            var trackDataBBox = this._flightDataTextGroup.bbox();

            //-------------------------------------------------------------------------------------------------------------
            // reposition the group
            this._elevationTextGroup.translate(0, trackDataBBox.y2 + 100);
        },

        _renderTitleText: function (title) {
            //-------------------------------------------------------------------------------------------------------------
            // prep the attributes
            var attr = {
                "font-family": "Myriad Pro",
                "font-weight": "bold",
                "font-size": "69pt",
                "fill": "#48ff75",
                "letter-spacing": -25 * 69 / 1000 + "pt",
                "font-stretch": "semi-expanded"
            };

            //-------------------------------------------------------------------------------------------------------------
            // star points
            var starPolygonPoints = [
                [17.5, 0],
                [22.919, 10.976],
                [35, 12.737],
                [26.233, 21.262],
                [28.304, 33.309],
                [17.465, 27.613],
                [6.662, 33.274],
                [8.733, 21.228],
                [0, 12.702],
                [12.081, 10.942]
            ];

            //-------------------------------------------------------------------------------------------------------------
            // create the text or replace it
            if (!this._titleText) {
                this._titleText = this._paper.text(title).attr(attr);
            } else {
                this._titleText.text(title);
            }

            //-------------------------------------------------------------------------------------------------------------
            // create the star if it does not exists
            if (!this._titleStar) {
                this._titleStar = this._paper.polygon("51.8,0 66.5,32.2 101.3,38.4 75.2,62.3 80.2,97.3 49.3,79.9 17.5,95.4 24.6,60.7 0,35.3 35.2,31.2 ").fill('#48ff75');
            }

            //-------------------------------------------------------------------------------------------------------------
            // get the bbox of the text
            var titleBBox = this._titleText.bbox();

            this._titleStar.translate(titleBBox.width - 28, titleBBox.height - 18);

            if (!this._titleTextGroup) {
                // create a group for the elements
                this._titleTextGroup = this._paper.group();

                //-------------------------------------------------------------------------------------------------------------
                // add the stuff to the group
                this._titleTextGroup.add(this._titleText);
                this._titleTextGroup.add(this._titleStar);
            }

            //-------------------------------------------------------------------------------------------------------------
            // get the bbox of the elevation texts
            var elBBox = this._elevationTextGroup.bbox();

            //-------------------------------------------------------------------------------------------------------------
            // reposition the group
            this._titleTextGroup.translate(0, elBBox.y2 + 100);

        },

        _renderDecialText: function (text1, text2) {
            var attr1 = {
                "font-family": "Myriad Pro",
                "font-weight": "bold",
                "font-size": "32pt",
                "fill": "#FFFFFF",
                "letter-spacing": -10 * 33 / 1000 + "pt",
                "font-stretch": "semi-expanded"
            };

            var attr2 = {
                "font-family": "Bickley Script",
                "font-size": "53pt",
                "fill": "#48ff75",
                "letter-spacing": -11 * 33 / 1000 + "pt",
                "font-stretch": "semi-expanded"
            };

            var decialText = this._blackSVG.text(0, "1040pt", [text1, text2]);
            decialText.attr(attr1);
            decialText.select(":last-child").attr(attr2);
            //-------------------------------------------------------------------------------------------------------------
        },

        _pt2mm: function (value) {
            return value / 0.35;
        },

        _mm2percent: function (value) {
            return value / 500;
        },

        _px2mm: function (value) {
            return value / 300 * 25.4;
        },

        _preZero: function (value) {
            var parts = value.toString().split(".");
            var isNeg = parseFloat(value) < 0;
            var part0 = Math.abs(parts[0]);
            var str = (part0 < 10 ? "0" + part0 : part0) + "." + parts[1];
            return isNeg ? "-" + str : str;
        }
    });

    return SVGRenderer;

});