/**
 * Created by martin on 02.06.14.
 */
define(['handlebars', 'i18n', 'templates', "moment"], function (Handlebars, i18n, JST, moment) {

    Handlebars.registerHelper("t", function (str) {
        return (i18n != undefined ? i18n.t(str) : str);
    });


    Handlebars.registerHelper("prettyMeters", function (value) {
        return value.toFixed(2);
    });

    Handlebars.registerHelper("date", function (value) {
        var date = new Date(value);
        return value > 0 ? moment(date.toISOString()).format("DD.MM.YYYY") : "-";
    });

    Handlebars.registerHelper("time", function (value) {
        var date = new Date(value);
        return value > 0 ? moment(date.toISOString()).format("HH:mm") : "-";
    });

    Handlebars.registerHelper("durationInMinutes", function (value) {
        return value > 0 ? Math.round(moment.duration(value).asMinutes()) : "-";
    });

    Handlebars.registerHelper("gpsCoords", function (value) {
        return value > 0 ? value.toFixed(6) : "-";
    });

    return Handlebars;
});