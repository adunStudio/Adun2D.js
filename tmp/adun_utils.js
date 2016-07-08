(function() {
    'use strict';

    var Utils = adun.Utils = {};

    // 시간 get
    Utils.getTime = (function() {

        var origin = Date.now();

        if( window.performance && window.performance.now ) {
            return function() {
                return origin + window.performance.now();
            };
        } else if( window.performance && winodw.performance.webkitNow ) {
            return function() {
                return origin + window.performance.webkitNow();
            };
        } else {
            return function() {
                return Date.now();
            };
        }

    })();

    // 파일 확장자 찾기
    Utils.findExtention = function(path) {

        var extention = path.match(/\.\w+$/);

        // jpg, png...
        if( extention && extention.length > 0 ) {
            return extention[0].slice(1).toLowerCase();
        }

        // date URI
        if( path.indexOf('data:') === 0 ) {
            return path.split(/[\/;]/)[1].toLowerCase();
        }

        return null;
    };

    Utils.has = function(obj, key) {
        return obj !== null && Object.prototype.hasOwnProperty.call(obj, key);
    };

    Utils.keys = function(obj) {
        var key, keys = [];

        for( key in obj ) {
            if( Utils.has(obj, key) ) {
                keys.push(key);
            }
        }

        return keys;
    };

    Utils.each = Utils.forEach = function(obj, iterate, context) {
        iterate = optimize(iterate, context);
        var i, len;

        if( Utils.isArrayLike(obj) ) {
            for( i = 0, len = obj.length; i < len; ++i ) {
                iterate(obj[i], i, obj);    // value, index, obj
            }
        }
    };

    function optimize(func, context, argCount) {
        if(context === void 0) return func;

        switch( ( argCount === null || argCount === undefined ) ? 3 : argCount ) {
            case 1:
                return function(value) {
                    return func.call(context, value);
                };
            case 2:
                return function(value, other) {
                    return func.call(context, value, other);
                };
            case 3:
                return function(value, index, collection) {
                    return func.call(context, value, index, collection);
                };
            case 4:
                return function(accumulator, value , index, collection) {
                    return func.call(context , accumulator, value, index, collection);
                };

        }
        return function() {
            return func.apply(context, arguments);
        };
    }

    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

    // 인자가 객체(=배열, 함수)인가?
    Utils.isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    // 인자가 {}, new Object로 만들어진 순수 객체인가?
    Utils.isPlainObject = function(obj) {
        return Utils.isObject(obj) && !Utils.isArray(obj) && !Utils.isFunction(obj);
    };

    // 인자가 배열이나, arguments등과 같은 유사배열 객체인가?
    Utils.isArrayLike = function(obj) {
        var length = obj.length;
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    // 인자가 배열인가?
    Utils.isArray = Array.isArray || function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    // 인자가 Bolean타입인가?
    Utils.isBoolean = function(obj) {
        return obj === true || obj === false || Object.prototype.toString.call(obj) === '[object Bollean]';
    };

    // 인자가 undefined인가?
    Utils.isUndefined = function(obj) {
        return obj === void 0;
    };

    // 인자가 null값인가?
    Utils.isNull = function(obj) {
        return obj === null;
    };

    // 인자가 Type값인가?
    // Type => Arguments, Function, String, Number, Date, RegExp, Error
    Utils.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
        Utils['is' + name] = function(obj) {
            return Object.prototype.toString.call(obj) === '[object ' + name + ']';
        };
    });


    // adun.Utils 말고 adun 객체에서 바로 접근할 수 있다.
    adun.extend(adun, Utils);
})();
