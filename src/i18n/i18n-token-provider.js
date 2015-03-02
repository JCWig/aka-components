'use strict';

/* @ngInject */
module.exports = function i18nTokenProvider(i18nConfig) {
    var compLocalePath = i18nConfig.localePath.replace(/\{version\}/g, i18nConfig.baseVersion);
    this.urls = [compLocalePath];
    var self = this;

    /**
     * This function adds path and part value to URLs array and it will be used in the i18nCustomLoader service.
     * if path is array type, path value should contain part value if any already, and implemented by caller.
     * If path is string type, then it will atrempt to append the part value if any
     */
    var usePathAndPart = function(path, part) {
        if (angular.isUndefined(path) || path === null) {
            return;
        }
        if (angular.isArray(path) && path.length) {
            self.urls.push.apply(self.urls, path);
        } else if (angular.isString(path) && path.trim().length) {
            self.urls.push(path + (part || ""));
        } else {
            return;
        }
    };

    /**
     * @ngdoc method
     * @name i18nTokenProvider#addAppLocalePath
     * @methodOf akamai.components.i18n.service:i18nTokenProvider
     *
     * @description provider method to add app locale files path and part
     * @param {array | string} path - an array of URL path value or URL path string value
     * @param {string=}  part - a value to append to the path, e.g. "message" prefix: "message_en_US"
     *
     */
    this.addAppLocalePath = function(path, part) {
        return usePathAndPart(path, part);
    };

    /**
     * i18nToken is a simple service used by the i18nTokenProvider to pass values set during app config phase
     * The locale value here is determined by AKALOCALE cookie set by Luna portal, all app will be based on and using that, fallback value will be "en_US"
     * @return {object} it returns object hash contains 2 getter methods mainly for customLoader to use
     */
    /* @ngInject */
    this.$get = function i18nTokenFactory($cookies, i18nConfig) {
        var cookieLocale = $cookies[i18nConfig.localeCookie],
            locale =  cookieLocale? atob(cookieLocale.split('+')[0]) : i18nConfig.defaultLocale,
            localeUrls = this.urls;
        return {
            /**
             * @ngdoc function
             * @name i18nToken#getUrls
             * @methodOf akamai.components.i18n.service:i18nToken
             *
             * @description get a list of URLs for locale files
             *
             */
            getUrls: function() {
                return localeUrls;
            },
            /**
             * @ngdoc function
             * @name i18nToken#getCurrentLocale
             * @methodOf akamai.components.i18n.service:i18nToken
             *
             * @description get current locale value
             *
             */
            getCurrentLocale: function() {
                return locale;
            }
        };
    };
};
