
(function() {
    'use strict';

    var _ = adun._ = {};

    // 객체가 프로퍼티를 직접적으로 가지고 있는가?
    _.has = function(obj, key) {
        return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
    };

    _.keys = function(obj) {
        if( !adun.Utils.isObject(obj) ) { return []; }

        var key, keys = [];

        for( key in obj ) {
            if( _.has(obj, key) ) {
                keys.push(key);
            }
        }
    };

    _.each = _.forEach = function(obj, iterate, context) {

    }
})();