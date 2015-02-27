'use strict';

/* @ngInject */
module.exports = function($parse, translate) {
    var akamTranslateFilter = function(translationId, params) {
        if (!angular.isObject(params)) {
            params = $parse(params)(this);
        }
        return translate.sync(translationId, params);
    };
    akamTranslateFilter.$stateful = true;
    return akamTranslateFilter;
};