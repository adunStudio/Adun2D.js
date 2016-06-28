
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



//# ADUN NAMESPACE
(function(global){
    'use strict';



    var ADUN =  {
        VERSION: '0.0.1'
    };

    global.ADUN = global.Adun = global.adun = ADUN;

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

        for(var I = 0; I < LOGO.length; ++I) {
            STRING = '';
            for(var S = 0; S < LOGO[I].length; ++S) {
                STRING += LOGO[I][S];
            }
            console.log(STRING);
        }
    })();

    // 확장 메서드
    ADUN.extend = function() {
        var src, copyisArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // 첫 번째 인자로 Boolean 값을 넣어 깊은 복사를 할 것인지 선택할 수 있다.
        if( typeof target === "boolean" ) {
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
                for( name in options ) {
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

    if( typeof Function.prototype.bind !== 'function' ) {
        Function.prototype.bind = function(thisObject) {
            var func = this;
            var args = Array.prototype.slice.call(arguments, 1);
            var Nop = function() { };
            var bound = function() {
                var a = args.concat(Array.prototype.slice.call(arguments));
                return func.apply(this instanceof Nop ? this : thisObject || window, a);
            };
            Nop.prototype = func.prototye;
            bound.prototye = new Nop();
            return bound;
        }
    }


    // 파일 확장자 찾기
    ADUN.findExtention = function(path) {
        var extention = path.match(/\.\w+$/);  // 확장자

        if( extention && extention.length > 0) {
            return extention[0].slice(1).toLowerCase();
        }

        // data URI
        if( path.indexOf('data:') == 0 ) {
            return path.split(/[\/;]/)[1].toLowerCase();
        }

        return null;
    };

})(window);

// _
(function() {
    'use strict';

    var _ = ADUN._ = {};

    // 객체가 프로퍼티를 직접적으로 가지고 있는가?
    ADUN.has = _.has = function(obj, key) {
        return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
    };

    ADUN.keys = _.keys = function(obj) {
        if( !ADUN.Utils.isObject(obj)) { return []; }
        var key, keys = [];
        for(key in obj) {
            if( ADUN.has(obj, key) ) {
                keys.push(key);
            }
        }
        return keys;
    };

    ADUN.each = _.each = ADUN.forEach = function(obj, iterate, context) {
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
})();



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
    ADUN.each(['Arguments,', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
        ADUN.Utils['is' + name] = function() {
            return Object.prototype.toString.call(arguments[0]) === '[object ' + name + ']';
        }
    });

   ADUN.extend(ADUN, ADUN.Utils);
})();

// #ENV
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

// #Class
(function() {
    'use strict';

    var Class = ADUN.Class = function(definition) {
        if(definition == null) {
            throw new Error('definition is undefined (ADUN.Class)');
        }

        var name, extend = definition.EXTEND;
        var prototype = {};  // 빈 객체

        if( extend && ADUN.Utils.isObject(extend) ) {
            if( extend.constructor != ADUN.Class ) {
                throw new Error('extend constructor is not adun.Class (ADUN.Class)');
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
        Class.constructor =  ADUN.Class;

        return Class;
    }
})();

// # deferred
(function() {
    'use strict';

    var Deferred = ADUN.Deferred = ADUN.Class({
        EXTEND: null,

        init: function() {
            this._success   =   this._fail  =   this._next  =   this._id    = null;
            this._tail = this;
        },

        _add: function(queue) {

            // 큐 방식의 연결리스트 자료구조를 사용한다.

            // 마지막에 추가된 Deffered 객체._next => 마지막에 추가된 Deffered 객체
            this._tail._next = queue;

            // 꼬리는 항상 마지막에 추가된 Deffered 객체를 가리킨다.
            this._tail = queue;

            // 연결리스트에서 맨 처음 Deffered 객체 반환 (체이닝 기법?)
            return this;
        },

        next: function(func) {
            var queue = new ADUN.Deferred();
            queue._success = func;
            return this._add(queue);
        },

        error: function(func) {
            var queue = new ADUN.Deferred();
            queue._fail = func;
            return this._add(queue);
        },

        call: function(arg) {
            var received;
            var queue = this;

            // _fail 건너뛰기
            while( queue && !queue._success ) {
                queue = queue._next;
            }

            if( !(queue instanceof ADUN.Deferred ) ) {
                return;
            }

            try {
                received = queue._success(arg);
            } catch (e) {
                return queue.fail(arg);
            }

            if( received instanceof ADUN.Deferred ) {
                ADUN.Deferred._insert(queue, received);
            } else if( queue._next instanceof ADUN.Deferred ) {
                // 연결리스트에서 다음 객체가 Deferred의 인스턴스라면 진입.
                queue._next.call(received);
            }
        },

        fail: function(arg) {
            var result, err, queue = this;

            // _sucess 건너뛰기
            while( queue && !queue._fail ) {
                queue = queue._next;
            }

            if( queue instanceof ADUN.Deferred ) {
                result = queue._fail(arg);
                queue.call(result);
            } else if ( arg instanceof Error ) {
                throw arg;
            } else {
                err = new Error('faild in Deferred');
                err.arg = arg;
                throw err;
            }
        }
    });

    Deferred.next = function(func) {
        var queue = new ADUN.Deferred().next(func);

        // 타이머 함수를 이용하여 비동기성을 가진다.
        // (함수 스택이 클리어되었을때 실행된다.)
        queue._id = setTimeout(function() {
            queue.call();
        }, 0);

        return queue;
    };

    Deferred._insert = function(queue, ins) {
        // 만약 현재 큐의 _next가 Deffered의 인스턴스라면 블록에 진입
        if ( queue._next instanceof ADUN.Deferred ) {
            ins._tail._next = queue._next;
        }
        // 현재 큐의 _next에 새로운 Defferd의 인스턴스를 참조시킨다.
        queue._next = ins;
    };

    // 평행
    Deferred.parallel = function(arg) {
        var q = new ADUN.Deferred();
        q._id = setTimeout(function() {
            q.call();
        }, 0);

        var progress = 0,
            ret = ( ADUN.Utils.isArray(arg) ) ? [] : {},
            p = new ADUN.Deferred(),
            prop;

        for(prop in arg) {
            if( ADUN.has(arg, prop) ) {
                progress ++;
                // 복사본(Deferred 인스턴스)을 즉시실행함수에 바로 넘겨준다.
                (function(queue, name) {
                    // 복사본.next(fn)
                    queue.next(function(arg) {
                        progress --;

                        ret[name] = arg;   // 리턴된 값,

                        // 모든 Deferred가 리턴되었다면 블록안에 진입.
                        if( progress <= 0 ) {
                            //
                            p.call(ret);
                        }

                    }).error(function(err) { p.fail(err); });

                    // Defereed.next에서 호출했던 타이머함수 clear
                    if ( ADUN.Utils.isNumber(queue._id) ) {
                        clearTimeout(queue._id);
                    }

                    queue._id = setTimeout(function() {
                        queue.call();
                    }, 0);

                })(arg[prop], prop); // Deffered 함수, 이름
            }
        }

        // Deffered 객체가 없다면...
        if( progress == 0 ) {
            p._id = setTimeout(function() {
                p.call(ret);
            }, 0);
        }

        //                                  p => ret를 반환하는 Deferred 인스턴스
        return q.next(function() { return p; });
    }
})();


// #Event
(function() {
    'use strict';
    var Event = ADUN.Event = ADUN.Class({
        init: function(type) {
            this.type = type;
            this.target = null;
            this.x = 0;
            this.y = 0;
            this.localX = 0;
            this.localY = 0;
        },

        _initPosition: function(pageX, pageY) {
            var heart = ADUN.Heart.instance;
            this.x = this.localX = (pageX - heart._pageX) / heart.scale;
            this.y = this.localY = (pageX - heart._pageY) / heart.scale;
        }
    });

    Event.LOAD = 'load';
    Event.ERROR = 'error';
    Event.HEART_RESIZE = 'heartresize';
    Event.PROGRESS = 'progress';
    Event.ENTER_FRAME = 'enterframe';
    Event.EXIT_FRAME = 'exitframe';
    Event.ENTER = 'enter';
    Event.EXIT = 'exit';

})();


// #EventTarget
(function() {
    'use strict';

    var EventTarget = ADUN.EventTarget = ADUN.Class({
        EXTEND: null,

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
            e.target = this;

            if( !ADUN.Utils.isUndefined(this['on' + e.type]) ) {
                this['on' + e.type](e);
            }

            var listeners = this._listeners[e.type];
            if( !ADUN.Utils.isUndefined(listeners[e.type]) ) {
                listeners = listeners.slice();
                for(var i = 0, len = listeners.length; i < len; ++i) {
                    listeners[i].call(this, e);
                }
            }
        },

        // emit === dispatchEvent
        emit: function(e) {
            this.dispatchEvent.call(this, e);
        }
    });
})();

// #InputManager
(function() {
    'use strict';

    var InputManager = ADUN.inputManager = ADUN.Class({
        EXTEND: ADUN.EventTarget,

        init: function(valueStore, source) {
            this.super();

            // event target을 저장하는 배열
            this.broadcastTarget = [];

            //
            this.valueStore = valueStore;

            this.source = source || this;

            this._binds = {};

            this._stateHandler = function(e) {
                var id = e.source.identifier;
                var name = this._binds[id];
                this.changeState(name, e.data);
            }.bind(this);
        },

        bind: function(inputSource, name) {

        }
    })

})();


// #heart
(function() {
    'use strict';
    var INSTANCE  = null;

    var Heart = ADUN.Heart = ADUN.Class({
        EXTEND: ADUN.EventTarget,

        init: function(id, height, width) {
            if( window.document.body == null ) { throw new Error("document.body is null. Please excute 'new ADUN.Heart()' in window.onload. (ADUN.Heart)"); }

            // 싱글톤
            if ( INSTANCE ) { throw new Error("Instances of Heart shall be only one. (ADUN.Heart)"); }

            var stage = document.getElementById(id);
            if( !stage ) { throw new Error("main canvas is undefined (ADUN.Heart)"); }


            this.super();

            INSTANCE = ADUN.Heart.instance = this;

            this._calledTime = 0;
            this._mouseDownID = 0;
            this._surfaceID = 0;
            this._soundID = 0;

            this._scenes = [];

            width = width || 320;
            height = height || 320;

            var style, scale, sWidth, sHeight;
            style = window.getComputedStyle(stage) || stage.currentStyle;
            sWidth = parseInt(style.width, 10);
            sHeight = parseInt(style.height, 10);

            if(sWidth && sHeight) {
                scale = Math.min(sWidth / width, sHeight / height);
            }

            stage.style.position = 'relative';

            var bounding = stage.getBoundingClientRect();
            this._pageX = Math.round(window.scrollX || window.pageXOffset + bounding.left);
            this._pageY = Math.round(window.scrollY || window.pageYOffset + bounding.top);

            stage.style.fontSize = '12px';
            stage.style.webkitTextSizeAdjust = 'none';
            stage.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0)';
            this._canvas = stage;

            this._width = width;
            this._height = height;
            this.scale = scale;

            this.fps = 30;

            this.frame = 0;

            this.ready = false;

            this.running = false;

            this.assets = {};



        },



        preLoad: function(assets) {
            var name, ASSETS = [];
            if( !ADUN.Utils.isArray(assets) ) {
                if( ADUN.Utils.isObject(assets) ) {
                    for(name in assets) {
                        if( ADUN.has(assets, name) ) {
                            ASSETS.push([assets[name], name]);
                        }
                    }
                    assets = ASSETS;
                } else {
                    assets = Array.prototype.slice.call(arguments);
                }
            }

            Array.prototype.push.apply(this._pre, assets);
            return this;
        },






    })

})();


// # ASSET
(function() {
    'use strict';

    var Asset = ADUN.Asset = {};

    Asset._pre = ADUN._pre = [];
    Asset._assets = ADUN._assets = [];

    Asset.asset = function(assets) {
        var name, ASSETS = [];

        if( !ADUN.Utils.isArray(assets) ) {
            if( ADUN.Utils.isObject(assets) ) {
                for(name in assets) {
                    if( ADUN.has(assets, name) ) {
                        ASSETS.push([assets[name], name]);
                    }
                }
                assets = ASSETS;
            }
            else {
                assets = Array.prototype.slice.call(arguments);
            }
        }
        Array.prototype.push.apply(this._assets, assets);
    };

    Asset.load = function(src, alias, callback, onerror) {
        var assetName, tempCallback, ext;
        if( ADUN.Utils.isString(arguments[1]) ) {
            assetName = alias;
            callback = callback || function() { };
            onerror = onerror || function() { };
        } else {
            assetName = src;
            tempCallback = callback;
            callback = arguments[1];
            onerror = tempCallback || function() { };
        }

        ext = ADUN.findExtention(src);

        return ADUN.Deferred.next(function() {
            var d = new ADUN.Deferred();
            var _callback = function(e) {
                d.call(e);
                callback.call(this, e);
            };
            var _onerror = function(e) {
                d.fail(e);
                onerror.call(this, e);
            };

        });

    }
})();

// #Matrix
(function() {
    'use strict';

    /**
     * Matrix
     * 2D 변환 행렬을 나타낸다.
     * 다른 좌표 공간 사이에서
     *
     *
     *
     * stack[0] = a = 1 => 행렬(0, 0) => scale과 rotate에 영향을 준다.
     * stack[1] = b = 0 => 행렬(0, 1) => scale과 roate에 영향을 준다.
     * stack[2] = c = 0 => 행렬(1, 0) => scale과 roate에 영향을 준다.
     * stack[3] = d = 1 => 행렬(1, 1) => scale과 roate에 영향을 준다.
     * stack[4] = tx = 0 => 행렬(2, 0) => x축 변환에 영향을 준다.
     * stack[5] = ty = 0 => 행렬(2, 1) => y축 변환에 영향을 준다.
     *
     *
     *
     * [k  0] [x]    =>[kx]
     * [0  k] [y]    =>[ky]    k배 확대 닮은 변환 행렬
     *
     *
     * [1  0][x]     =>[x]
     * [0 -1][y]     =>[-y]   x축 대칭 행렬
     *
     *
     * [-1 0][x]     =>[-x]
     * [0  1][y]     =>[y]    y축 대칭 행렬
     *
     *
     * [-1 0][x]     => [-x]
     * [0 -1][y]     => [-y]  원점 대칭 행렬
     *
     *
     * [0  1][x]     => [y]
     * [1  0][y]     => [x]   y=x 대칭 변환 행렬
     *
     *
     * [0 -1][x]     => [-y]
     * [-1 0][y]     => [-x]   y=-x 대칭 변환 행렬
     *
     *
     * [cosΘ  -sinΘ] [x]    =>  [x']
     * [sinΘ   cosΘ] [y]    =>  [y']   Θ만틈 회전한 회전변환 행렬
     *
     */


    var Matrix = ADUN.Matrix =  ADUN.Class({
        init: function() {
            this.reset();
        },

        reset: function() {
            this.stack = [];
            this.stack.push([ 1, 0, 0, 1, 0, 0]);
        },

        makeTransformMatrix: function(node, dest) {
            var x, y, width, height, rotation, scaleX, scaleY, theta, tmpcos, tmpsin, w, h, a, b, c, d, tx, ty;

            x = node._x;
            y = node._y;
            width = node.width || 0;
            height = node.height || 0;
            rotation = node._rotation || 0;
            scaleX = ADUN.isNumber(node._scaleX) ? node._scaleX : 1;       // (|k| > 1) => x -> k배 확대,  (k < 0) => y축 대칭
            scaleY = ADUN.isNumber(node._scaleY) ? node._scaleY : 1;       // (|k| > 1) => y -> k백 확대,  (k < 0) => x축 대칭
            theta = rotation * Math.PI / 180;
            tmpcos = Math.cos(theta);                           // Math.cos(0) == 1
            tmpsin = Math.sin(theta);                           // Math.sin(0) == 0
            w = ADUN.isNumber(node._originX) ? node._originX : (width / 2);
            h = ADUN.isNumber(node._originY) ? node._originY : (height / 2);

            a = scaleX * tmpcos;
            b = scaleX * tmpsin;
            c = scaleY * tmpsin;
            d = scaleY * tmpcos;

            dest[0] = a;
            dest[1] = b;
            dest[2] = -c;
            dest[3] = d;
            dest[4] = (-a * w + c * x + w);
            dest[5] = (-b * w + d * y + h);
        }
    })

})();


// #Node
(function() {
    // 씬 안에서의 보여지는 모든 객체의 부모이다.
    var Node = ADUN.Node = ADUN.Class({
        EXTEND: ADUN.EventTarget,

        init: function() {
            this.super();

            this._dirty = false;

            this._matrix = [1, 0, 0, 1, 0, 0];

            this._x = 0;
            this._y = 0;
            this._offsetX = 0;
            this._offsetY = 0;

            // Event.ENTER_FRAME 이벤트마다 1씩 증가한다.
            this.age = 0;

            this.parentNode = null;

            this.scene = null;


            Object.defineProperties(this, {
                x: {
                    get: function() {
                        return this._x;
                    },
                    set: function(x) {
                        if(this._x !== x) {
                            this._x = x;
                            this._dirty = true;
                        }
                    }
                },

                y: {
                    get: function() {
                        return this._y;
                    },
                    set: function(y) {
                        if(this._y !== y) {
                            this._y = y;
                            this._dirty = true;
                        }
                    }
                }
            });
        },

        moveTo: function(x, y) {
            this.x = x;
            this.y = y;
        },

        moveBy: function(x, y) {
            this.x += x;
            this.y += y;
        },

        _updateCoordinate: function() {
            var node = this;
            var tree = [ node ];
            var parent  = node.parentNode;
            var scene = this.scene;

            while( parent && node._dirty ) {
                tree.unshift(parent);
                node = node.parentNode;
                parent = node.parentNode;
            }

        }

    })
})();
















