
/**********************************************************************
 *     █████╗  ██████╗  ██╗   ██╗ ███╗   ██╗          ██╗ ███████╗    *
 *    ██╔══██╗ ██╔══██╗ ██║   ██║ ████╗  ██║          ██║ ██╔════╝    *
 *    ███████║ ██║  ██║ ██║   ██║ ██╔██╗ ██║          ██║ ███████╗    *
 *    ██╔══██║ ██║  ██║ ██║   ██║ ██║╚██╗██║     ██   ██║ ╚════██║    *
 *    ██║  ██║ ██████╔╝ ╚██████╔╝ ██║ ╚████║ ██╗ ╚█████╔╝ ███████║    *
 *    ╚═╝  ╚═╝ ╚═════╝   ╚═════╝  ╚═╝  ╚═══╝ ╚═╝  ╚════╝  ╚══════╝    *
 **********************************************************************/

/*
 *  adun.js
 *  http://oppacoding.com
 *
 *  Version: 0.0.1
 *  Create by ADUNStudio
 *  https://github.com/ADUNStudio
 *  MIT-style license
 */

(function() {
    var LOGO = [
        [' █████╗  ██████╗  ██╗   ██╗ ███╗   ██╗          ██╗ ███████╗'],
        ['██╔══██╗ ██╔══██╗ ██║   ██║ ████╗  ██║          ██║ ██╔════╝'],
        ['███████║ ██║  ██║ ██║   ██║ ██╔██╗ ██║          ██║ ███████╗'],
        ['██╔══██║ ██║  ██║ ██║   ██║ ██║╚██╗██║     ██   ██║ ╚════██║'],
        ['██║  ██║ ██████╔╝ ╚██████╔╝ ██║ ╚████║ ██╗ ╚█████╔╝ ███████║'],
        ['╚═╝  ╚═╝ ╚═════╝   ╚═════╝  ╚═╝  ╚═══╝ ╚═╝  ╚════╝  ╚══════╝']
    ];
    var STRING = '';
    function colorTrace(msg) {
        console.log("%c" + msg, 'color:#FF0000;background:yellow;');
    }

    for(var I = 0; I < LOGO.length; ++I) {
        STRING = '';
        for(var S = 0; S < LOGO[I].length; ++S) {
            STRING += LOGO[I][S];
        }
        console.log(STRING);
    }
})();

(function(global){
    'use strict';

    var ADUN =  {
        VERSION: '0.0.1'
    };

    global.ADUN = global.Adun = global.adun = ADUN;

    // 확장 메서드
    ADUN.extend = function() {
        var src, copyisArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // 첫 번째 인자로 Boolean 값을 넣어 깊은 복사를 할 것인지 선택할 수 있다.
        if( ADUN.Utils.isBoolean(target) ) {
            deep = target;
            target = arguments[i] || {};
            ++i;
        }

        // 복사할 참조가 순수 객체가 아닐경우 빈 객체를 참조한다.
        if( !ADUN.Utils.isObject(target) ) {
            target = {};
        }

        // 복사할 참조가 없을 경우 this를 참조한다.
        if( i === length ) {
            target = this;
            --i;
        }

        for( ; i < length; ++i) {
            // 인자로 넘어온 객체의 프로퍼티를 options로 참조 시키고,
            // 이 프로퍼티가 null이 아닌 경우 블록 안으로 진입한다.
            if( (options = arguments[i]) != null) {
                for(name in options) {
                    // src  는 반환될 복사본 target의 프로퍼티를 참조하고,
                    // copy 는 복사할 원본의 프로퍼티를 참조한다.
                    src = target[name];
                    copy = options[name];


                    // 같은 참조일 경우 continue
                    if( target == copy ) {
                        continue;
                    }

                    // copy 프로퍼티가 객체이거나 배열인 경우 재귀 호출을 하려고 블록 안으로 진입한다.
                    if( deep && copy && ( (ADUN.Utils.isPlainObject(copy)) || (copyisArray = ADUN.Utils.isArray(copy)) ) ) {

                        // copy가 배열인 경우 빈 배열을, 객체인 경우 빈 객체를 clone에 참조한다.
                        // 만약 src가 같은 배열 or 객체이면 clone에 해당 배열 or 객체를 참조시킨다.
                        // -> 복사본에 같은 이름의 프로퍼티가 있는 경우 원본과 똑같은 배열이거나 객체라면 새롭게 참조시키지 않고, 복사본의 해당 프로퍼티에 추가한다.
                        if( copyisArray ) {
                            copyisArray = false;
                            clone = ( src && ADUN.Utils.isArray(src) ) ? src : [];
                        } else {
                            clone = ( src && ADUN.Utils.isPlainObject(src) ) ? src : {};
                        }

                        // extend 함수를 다시 호출한다.(= 재귀)
                        // clone에 copy를 복사한다. copy 객체안에 다시 객체 배열 or 객체가 있는 경우 다시 재귀 호출을 한다.
                        target[name] = ADUN.extend(deep, clone, copy);

                    } else if( copy !== undefined ) {

                        target[name] = copy;
                    }
                }
            }

        }
        // 복사본을 반환한다.
        return target;

    };

    // 객체가 프로퍼티를 직접적으로 가지고 있는가?
    ADUN.has = function(obj, key) {
        return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
    };

    ADUN.keys = function(obj) {
        if( !ADUN.Utils.isObject(obj)) { return []; }
        var key, keys = [];
        for(key in obj) {
            if( ADUN.has(obj, key) ) {
                keys.push(key);
            }
        }
        return keys;
    };

    ADUN.each = ADUN.forEach = function(obj, iterate, context) {
        iterate = optimize(iterate, context);
        var i, length;

        if( ADUN.Utils.isArrayLike(obj) ) {
            for(i = 0, length = obj.length; i < length; ++i) {
                iterate(obj[i], i, obj); // value, index, obj
            }
        } else {

        }

    };

    function optimize(func, context, argCount) {
        if(context === void 0) return func;
        switch(argCount == null ? 3 : argCount) {
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
        }
    }

})(window);


// #Utils
(function() {
    'use strict';

    var Utils = ADUN.Utils = {};

    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

    // 인자가 객체(= 배열, 함수)인가?.
    Utils.isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    // 인자가 {}, new Object로 만들언진 순수 객체인가?
    Utils.isPlainObject = function(obj) {
        return Utils.isObject(obj) && !Utils.isArray(obj) && !Utils.isFunction(obj);
    };

    // 인자가 배열인가?
    Utils.isArray = Array.isArray || function(obj) {
            return Object.prototype.toString.call(obj === '[object Array]');
        };

    // 인자가 배열이나, arguments등과 같은 유사배열 객체인가?
    Utils.isArrayLike = function(collection) {
        return typeof collection.length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    // 인자가 Boolean값인가?
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

    // 인자가 Type값 인가? 에 대한 isType 메서드를 추가한다.
    // Type => Arguments, Function, String, Number, Date, RegExp, Error
    ADUN.each(['Arguments,', 'Function', 'String', 'Nunmber', 'Date', 'RegExp', 'Error'], function(name) {
        ADUN.Utils['is' + name] = function() {
            return Object.prototype.toString.call(arguments[0]) === '[object ' + name + ']';
        }
    });


})();

(function() {
    'use strict';

    var Class = ADUN.Class = function(definition) {
        if(definition == null) {
            throw new Error('definition is undefined (adun.Class)');
        }

        var name, extend = definition.extend;
        var prototype = {};  // 빈 객체

        if( extend && ADUN.Utils.isObject(extend) ) {
            if( extend.constructor != adun.Class ) {
                throw new Error('extend constructor is not adun.Class (adun.Class)');
            }
            prototype = new extend('!ADUN.INIT');
        }

        for ( name in definition ) {
            prototype[name] = ( ADUN.Utils.isFunction(definition[name]) && adun.Utils.isFunction(prototype[name]) ) ?
                (function(name, fn) {
                    return function() {
                        this.super = extend.prototype[name];
                        var ret = fn.apply(this, arguments);
                        delete this.super;
                        return ret;
                    }
                })(name, definition[name]) :
                definition[name];

        }


        var Class = function() {
            if(this.init && arguments[0] !== '!ADUN.INIT') {
                this.init.apply(this, arguments);
            }
        };
        Class.prototype = prototype;
        Class.constructor = definition.TYPE ||  ADUN.Class  ;

        return Class;
    }
})();

(function() {
    var ua = navigator.userAgent;

    var ENV = ADUN.ENV = {

        VERSION: ADUN.VERSION,

        // 사용자 브라우저
        BROWSER: (function(ua) {
            if (/Eagle/.test(ua)) {
                return 'eagle';
            } else if (/Opera/.test(ua)) {
                return 'opera';
            } else if (/MSIE|Trident/.test(ua)) {
                return 'ie';
            } else if (/Chrome/.test(ua)) {
                return 'chrome';
            } else if (/(?:Macintosh|Windows).*AppleWebKit/.test(ua)) {
                return 'safari';
            } else if (/(?:iPhone|iPad|iPod).*AppleWebKit/.test(ua)) {
                return 'mobilesafari';
            } else if (/Firefox/.test(ua)) {
                return 'firefox';
            } else if (/Android/.test(ua)) {
                return 'android';
            } else {
                return '';
            }
        })(ua),

        // 사용자 벤더
        VENDOR_PREFIX: (function() {
            if (ua.indexOf('Opera') !== -1) {
                return 'O';
            } else if (/MSIE|Trident/.test(ua)) {
                return 'ms';
            } else if (ua.indexOf('WebKit') !== -1) {
                return 'webkit';
            } else if (navigator.product === 'Gecko') {
                return 'Moz';
            } else {
                return '';
            }
        })(),

        // 터치
        TOUCH_ENABLED: (function() {
            return 'ontouchstart' in window || navigator.maxTouchPoints;
        })(),

        KEY_BIND_TABLE: {
            13: 'enter',
            27: 'esc',
            32: 'space',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            65: 'a',
            83: 's',
            68: 'd',
            70: 'f',
            81: 'q',
            87: 'w',
            69: 'e',
            82: 'r'
        }
    }
})();

(function() {
    'use strict';

    var EventTarget = ADUN.EventTarget = ADUN.Class({
        init: function() {
            // 리스너 목록 => 빈 객체
            this._listeners = {};
        },

        addEventListener: function(type, listener) {
            // 리스터[타입] = > 리스너 목록(배열)
            var listeners = this._listeners[type];

            // 리스너 목록이 없다면 IF 블록에 진입.
            if( ADUN.Utils.isUndefined(listeners) ) {
                this.listeners[type] = [listener];

            } else if( listener.indexOf(listener) === -1 ) {
                // 리스너 목록 맨 앞에 추가.
                listener.unshift(listener);
            }
        },

        // on == addEventListener
        on: function() {
            this.addEventListener.apply(this, arguments);
        },

        clearEventListener: function(type) {
            // 인자가 있을 경우 해당 타입의 리스너 삭제.
            // 인자가 없을 경우 리스너 모두 삭제.
            if( !ADUN.Utils.isUndefined(type) ) {
                delete this._listeners[type];
            } else {
                this._listeners = {};
            }
        },

        dispatchEvent: function(e) {

        },

        // emit === dispatchEvent
        emit: function(e) {
            this.dispatchEvent.call(this, e);
        }
    });
})();
















