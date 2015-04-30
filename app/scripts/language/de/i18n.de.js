define(["i18n", "text!language/de/lang.json"], function (i18n, lang) {

    i18n.registerLanguage("de", JSON.parse(lang));

    if (i18n.defaultLanguage == undefined) {
        i18n.defaultLanguage = "de";
    }

    return i18n;

});