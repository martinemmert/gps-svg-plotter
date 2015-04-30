define(["underscore"], function (_) {

    var i18n = function () {
    };

    _.extend(i18n.prototype, {

        registerLanguage: function (abbr, json) {
            if (!this._availableLanguages) {
                this._availableLanguages = {};
            }

            this._availableLanguages[abbr] = json;
        },

        t: function (str, lang) {
            lang = lang || this.defaultLanguage;
            var txt = this._availableLanguages[lang][str];
            return txt || str;
        },

        registerGlobal: function (global, functionName) {
            var name = functionName || 't';
            var that = this;
            global[name] = function (string, lang) {
                return that.t(string, lang);
            }

        }

    });


    return new i18n();

});