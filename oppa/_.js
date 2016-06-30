
(function() {
    'use strict';

    var _ = adun._ = {};

    // ��ü�� ������Ƽ�� ���������� ������ �ִ°�?
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