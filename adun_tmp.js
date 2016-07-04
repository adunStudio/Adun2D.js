
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



//#ADUN NAMESPACE
(function(global){
    'use strict';



    var ADUN =  {
        ADUN_VERSION: '0.0.1'  ,
        name: 'odu'
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

    ADUN._loadFuncs = {};
    ADUN._loadFuncs['jpg'] =
        ADUN._loadFuncs['jpeg'] =
            ADUN._loadFuncs['gif'] =
                ADUN._loadFuncs['png'] =
                    ADUN._loadFuncs['bmp'] = function(src, ext, callback, onerror) {
                        return ADUN.Surface.load(src, callback, onerror);
                    };
    ADUN._loadFuncs['mp3'] =
        ADUN._loadFuncs['aac'] =
            ADUN._loadFuncs['m4a'] =
                ADUN._loadFuncs['wav'] =
                    ADUN._loadFuncs['ogg'] = function(src, ext, callback, onerror) {
                        return ADUN.Sound.load(src, 'audio/' + ext, callback, onerror);
                    };

    ADUN.getTime = (function() {
        var origin = Date.now();

        if( window.performance && window.performance.now ) {
            return function() {
                return origin + window.performance.now();
            }
        } else if( window.performance && window.performance.webkitNow ) {
            return function() {
                return origin + window.performance.now();
            }
        } else {
            return function() {
                return Date.now;
            }
        }
    })();



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

        VERSION: ADUN.ADUN_VERSION,

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
        },

        PREVENT_DEFAULT_KEY_TABLE: [13, 27, 32, 37, 38, 39, 40, 65, 83, 70, 81, 87, 69, 81],

        CANVAS_METHODS: [
            'putImageData', 'drawImage', 'drawFocusRing', 'fill', 'stroke',
            'clearRect', 'fillRect', 'strokeRect', 'fillText', 'strokeText'
        ]
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

    // 심장이 준비 완료되면 발생한다.
    // ex) 이미지 프리로딩
    Event.Load = 'load';

    // 에러가 발생하면 발생한다.
    Event.ERROR = 'error';

    // display 사이즈가 변경되면 발생한다.
    Event.HEART_RESIZE = 'heartresize';

    // 심장이 로딩중일때 발생한다.
    // ex) 각 이미지라 로딩중일때
    Event.PROGRESS = 'progress';

    // 새로운 프레임마다 발생한다. (fps_)
    Event.ENTER_FRAME = 'enterframe';

    // 프레임이 끝나면 발생난다.
    Event.EXIT_FRAME = 'exitframe';

    // 새로운 씬에  진입할때 발생한다.
    Event.ENTER = 'enter';

    // child가 Node에 추가될때 발생한다.
    Event.CHILD_ADDED = 'childadded';

    // 노드가 그룹에 추가될때 발생한다.
    Event.ADDED = 'added';

    // 노드가 씬에 추가될때 발생한다.
    Event.ADDED_TO_SCENE = 'addedtoscene';

    // child가 Node에서 제거될때 발생한다.
    Event.CHILD_REMOVED = 'childremoved';

    // 노드가 그룹에서 제거될때 발생한다.
    Event.REMOVED = 'removed';

    // 노드가 씬에서 제거될때 발생한다.
    Event.REMOVED_FROM_SCENE = 'removedfromscene';

    // Entity가 렌더될때 발생한다.
    Event.RENDER = 'render';

    // 버튼 인풋이 눌려졌을때 발생한다.
    Event.INPUT_START = 'inputstart';

    // 버튼 인풋 상태가 바겻을때 발생한다.
    Event.INPUT_CHANGE = 'inputchange';

    // 버튼 인풋이 끝나면 발생한다.
    Event.INPUT_END = 'inputend';

    // 인풋 상태가 변경되면 발생한다.
    Event.INPUT_STATE_CHANGED = 'inputstatechanged';


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
                this._listeners[type] = [listener];

            } else if( listener.indexOf(listener) === -1 ) {
                // 리스너 목록 맨 앞에 추가.
                listener.unshift(listener);
            }
        },

        // on == addEventListener
        on: function() {
            this.addEventListener.apply(this, arguments);
        },

        removeEventListener: function(type, listener) {
            var listeners, i;

            listeners = this._listeners[type];
            if( !ADUN.isUndefined(listener) ) {
                i = listener.indexOf(listener);

                if( i !== -1 ) {
                    listener.splice(i, 1);
                }
            }
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
            e.loaclX = e.x - this._offsetX;
            e.localY = e.y - this._offsetY;

            if( !ADUN.Utils.isUndefined(this['on' + e.type]) ) {
                this['on' + e.type](e);
            }

            var listeners = this._listeners[e.type];
            if( listeners != null ) {
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
     * [x  x]
     * [y  y]
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
     * [sinΘ   cosΘ] [y]    =>  [y']   Θ만틈 반시계 방향으로 회전한 회전변환 행렬
     *
     * [cosΘ  sinΘ] [x]    =>  [x']
     * [-sinΘ cosΘ] [y]    =>  [y']   Θ만틈 시계 방향으로 회전한 회전변환 행렬
     *
     *
     *
     * [a, c, tx]
     * [b, d, ty]
     *
     * [1, 0, 0]
     * [0, 1, 1]
     */


    var Matrix = ADUN.Matrix = ADUN.Class({

        init: function() {
            this.reset();
        },

        reset: function() {
           /**
            * [a    b    tx]
            * [c    d    ty]
            *
            * [1    0    0]
            * [0    1    0]
            */

            this.stack = [];
            this.stack.push([ 1, 0, 0, 0, 1, 0 ]);
        },

        makeTransformMatrix: function(node, dest) {
            var x, y, width, height, w, h, rotation, scaleX, scaleY, theta, tmpcos, tmpsin,
                a11, a12, a21, a22, atx, aty;

            x = node._x;
            y = node._y;
            width = node.width || 0;
            height = node.height || 0;
            w = ( ADUN.isNumber(node._originX) ) ? node._originX : width / 2;
            h = ( ADUN.isNumber(node._originY) ) ? node._originY : height / 2;
            scaleX = ( ADUN.isNumber(node._scaleX) ) ? node._scaleX : 1;          // (|k| > 1) => x -> k배 확대,  (k < 0) => y축 대칭
            scaleY = ( ADUN.isNumber(node._scaleY) ) ? node._scaleY : 1;          // (|k| > 1) => y -> k백 확대,  (k < 0) => x축 대칭
            rotation = node._rotation || 0;
            theta = rotation * Math.PI / 180;
            tmpcos = Math.cos(theta);            // Math.cos(0) == 1
            tmpsin = Math.sin(theta);            // Math.sin(0) == 0

            a11 = scaleX * tmpcos; a12 = scaleX * tmpsin; atx = -a11 * w + a21* h + x + w;
            a21 = scaleY * tmpsin; a22 = scaleY * tmpcos; aty = -a12 * w - a22 * h + y + h;

            dest[0] =  a11; dest[1] = a12; dest[2] = atx;
            dest[3] = -a21; dest[4] = a22; dest[5] = aty;
        },

        multiply: function(m1, m2, dest) {
            var a11 = m1[0], a12 = m1[1], atx = m1[2];
            var a21 = m1[3], a22 = m1[4], aty = m1[5];

            var b11 = m2[0], b12 = m2[1], btx = m2[2];
            var b21 = m2[3], b22 = m2[4], bty = m2[5];

            dest[0] = a11 * b11 + a12 * b21; dest[1] = a11 * b12 + a12 * b22; dest[2] = a11 * btx + a12 * bty + atx;
            dest[3] = a21 * b12 + a22 * b22; dest[4] = a21 * b12 + a22 * b22; dest[5] = a21 * btx + a22 * bty + aty;
        },
    });


    ADUN.Matrix.instance = new Matrix();
})();


// #Node
(function() {
    // 씬 안에서의 보여지는 모든 객체의 부모이다.
    var Node = ADUN.Node = ADUN.Class({
        EXTEND: ADUN.EventTarget,

        init: function() {
            this.super();

            this._dirty = false;

            this._matrix = [1, 0, 0, 0, 1, 0];

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

            var matrix = ADUN.Matrix.instance;
            var stack = matrix.stack;
            var mat = [];
            var newmat, ox, oy;

            stack.push(tree[0]._matrix);

            for(var i = 1, length = tree.length; i < length; ++i) {
                node = tree[i];
                newmat = [];
                matrix.makeTransformMatrix(node, mat);
                matrix.multiply(stack[stack.length - 1], mat, newmat) ;
                node._matrix = newmat;
                stack.push(newmat);

                // ....
            }
        },

        remove: function() {
            if( this.parentNode ) {
                this.parentNode.removeChild(this);
            }

            if( this.childNodes ) {
                var i, childNodes = this.childNodes.slice();
                for( i = childNodes.length -1; i >= 0; --i ) {
                    childNodes[i].remove();
                }
            }

            this.clearEventListener();
        }

    })
})();

// #Entity
(function() {
    'use strict';

    var Entity = ADUN.Entity = ADUN.Class({
        EXTEND: ADUN.Node,

        init: function() {
            var heart = ADUN.Heart.instance;

            this.super();

            this._rotation = 0;
            this._scaleX = 1;
            this._scaleY = 1;

            this._clipping = false;

            this._originX = null;
            this._originY = null;

            this._width = 0;
            this._height = 0;
            this._backgroundColor = null;
            this._opacity = 1;
            this._visible = true;


            Object.defineProperties(this, {
                rotation: {
                    get: function() {
                        return this._rotation;
                    },
                    set: function(rotation) {
                        if (this._rotation !== rotation ) {
                            this._rotation = rotation;
                            this._dirty = true;
                        }
                    }
                },

                originX: {
                    get: function() {
                        return this._originX;
                    },
                    set: function(originX) {
                        if ( this._originX !== originX ) {
                            this._originX = originX;
                            this._dirty = true;
                        }
                    }
                },

                originY: {
                    get: function() {
                        return this._originY;
                    },
                    set: function(originY) {
                        if ( this._originY !== originY ) {
                            this._originY = originY;
                            this._dirty = true;
                        }
                    }
                },

                width: {
                    get: function() {
                        return this._width;
                    },
                    set: function(width) {
                        if(this._width !== width) {
                            this._width = width;
                            this._dirty = true;
                        }
                    }
                },

                height: {
                    get: function() {
                        return this._height;
                    },
                    set: function(heigth) {
                        if(this._height !== height) {
                            this._height = height;
                            this._dirty = true;
                        }
                    }
                },

                backgroundColor: {
                    get: function() {
                        return this._backgroundColor;
                    },
                    set: function(color) {
                        this._backgroundColor = color;
                    }
                },

                opacity: {
                    get: function() {
                        return this._opacity;
                    },
                    set: function(opacity) {
                        this._opactiy = parseFloat(opacity);
                    }
                },

                visible: {
                    get: function() {
                        return this._visible;
                    },
                    set: function(visible) {
                        this._visible = visible;
                    }
                }
            });

        },

        scale: function(x, y) {
            this._scaleX *= x;
            this._scaleY *= ( y != null )  ? y : x;
            this._dirty = true;
        },

        rotate: function(deg) {
            this.rotation += deg;
        }
    });
})();

(function() {
    'use strict';

    var Sprite = ADUN.Sprite = ADUN.Class({
        EXTEND: ADUN.Entity,

        init: function(width, heigh) {
            this.super();

            this.width = width;
            this.height = height;

            this._image = null;
            this._frameLeft = 0;
            this._frameTop = 0;
            this._frame = 0;
            this._frameSequence = null;

            Object.defineProperties(this, {
                image: {
                    get: function() {
                        return this._image;
                    },
                    set: function(image) {
                        if( image != null ) {
                            throw new Error('image is undefined')
                        }
                        if( image == this._image ) {
                            return;
                        }

                        this._image = image;
                        this._computeFramePosition();
                    }
                },

                width: {
                    get: function() {
                        return this._width;
                    },
                    set: function(width) {
                        this._width = width;
                        this._computeFramePosition();
                        this._dirty = true;
                    }
                },

                height:{
                    get: function() {
                        return this._height;
                    },
                    set: function(height) {
                        this._height = height;
                        this._computeFramePosition();
                        this._dirty = true;
                    }
                }
            });

        },

        _computeFramePosition: function() {
            var col, image = this._image;

            if( image != null ) {
                col = image.width / this._width | 0;      // -> or 연산자 (정수 반환)
                this._frameLeft = (this._frame % col | 0) * this._width;
                this._frameTop = (this._frame / col | 0) * this._height % image.height;
            }
        },

        render: function(ctx) {
            var image, w, h, iw, ih, elem, sx, sy, sw, sh;

            image = this._image;
            w = this._width;
            h = this._height;

            if( image && w !== 0 && h !== 0 ) {
                iw = image.width;
                ih = image.height;
                if( iw < w || ih < h) {
                    ctx.fillStyle = ADUN.Surface._getPattern(image);
                    ctx.fillRect(0, 0, w, h);
                } else {
                    elem = image._element;
                    sx = this._frameLeft;
                    sy = Math.min(this._frameTop, ih - h);
                    sw = Math.max(0.01, Math.min(iw - sx, w));
                    sh = Math.max(0.01, Math.min(ih - sy, h));

                    ctx.drawImage(elem, sx, sy, sw, sh, 0, 0, w, h);
                }
            }
        }
    });
})();


// #Surface
(function() {
    'use strict';

    var Surface = ADUN.Surface = ADUN.Class({
        EXTEND: ADUN.EventTarget,

        init: function(width, height) {
            this.super();

            var heart = ADUN.Heart.instance;

            this.width = Math.ceil(width);
            this.height = Math.ceil(height);

            this._element = document.createElement('canvas');
            this._element.width = width;
            this._element.height = height;
            this._element.style.position = 'absolute';

            this.context = this._element.getContext('2d');

            ADUN.ENV.CANVAS_METHODS.forEach(function(name) {
                var method = this.context[name];
                this.context[name] = function() {
                    method.apply(this, arguments);
                    this._dirty = true;
                }
            }, this);
        },

        getPixel: function(x, y) {
            return this.context.getImageData(x, y, 1, 1).data;
        },

        setPixel: function(x, y, r, g, b, a) {
            var pixel = this.context.createImageData(1, 1);
            pixel.data[0] = r;
            pixel.data[1] = g;
            pixel.data[2] = b;
            pixel.data[3] = a;
            this.context.putImageData(pixel, x, y);
        },

        clear: function() {
            this.context.clearRect(0, 0, this.width, this.height);
        },

        draw: function(image) {
            var args, image = image._element;

            if( arguments.length === 1 ) {
                this.context.drawImage(image, 0, 0);
            } else {
                args = arguments;
                args[0] = image;
                this.context.drawImage.apply(this.context, args);
            }
        },

        clone: function() {
            var clone = new ADUN.Surface(this.width, this.height);
            clone.draw(this);

            return clone;
        },

        toDataURL: function() {
            var src = this._element.src;

            if( src ) {
                if( src.slice(0, 5) === 'data:' ) {
                    return src;
                } else {
                    return this.clone().toDataURL();
                }
            } else {
                return this._element.toDataURL();
            }
        }
    });

    Surface._staticCanvas2DContext = document.createElement('canvas').getContext('2d');

    Surface._getPattern = function(surface, force) {
        if( !surface._pattern || force ) {
            surface._pattern = this._staticCanvas2DContext.createPattern(surface._element, 'repeat');
        }

        return surface._pattern;
    };

    Surface.load = function(src, callback, onerror) {
        var image = new Image();
        image.src = src;
        var surface = new ADUN.Surface();
        surface.context = null;
        surface._element = image;
        surface.addEventListener('load', callback);
        surface.addEventListener('error', onerror);
        image.onerror =  function() {
            var e = new ADUN.Event(ADUN.Event.ERROR);
            e.message = 'Cannot load an asset: ' + image.src;
            ADUN.Heart.instance.emit(e);
            surface.emit(e);
        };
        image.onload = function() {
            surface.width = image.width;
            surface.height = image.height;
            surface.emit(new ADUN.Event('load'));
        };
        return surface;
    }
})();


// ADUN.js 의 심장
// #Heart
(function() {
    var H;

    var Heart = ADUN.Heart= ADUN.Class({
        EXTEND: ADUN.EventTarget,

        init: function(width, height) {

            if( window.document.body === null ) {
                throw new Error("documet.body is null. Please excute 'new Heart()' in window.onload (ADUN.Heart)");
            }

            var initial = true;

            // 이미 심장이 있다면 블록안에 진입
            if( H ) {
                //throw new Error("ADUN.HEART instance already Exist (ADUN.Heart)");
                initial = false;
                Heart.stop();
            }

            this.super();

            H = ADUN.Heart.instance = this;

            this._calledTime = 0;
            this._mouseDownID = 0;
            this._surfaceID = 0;
            this._soundID = 0;

            this._scenes = [];

            width = width || 320;
            height = height || 320;

            var stage, scale, sWidth, sHeight;

            stage = document.createElement('div');
            stage.id = 'ADUN_stage';
            stage.position = 'absolute';

            if(document.body.firstChild) {
                document.body.insertBefore(stage, document.body.firstChild);
            } else {
                document.body.appendChild(stage);
            }

            scale = Math.min(window.innerWidth / width, window.innerHeight / height);

            this._pageX = stage.getBoundingClientRect().left;
            this._pageY = stage.getBoundingClientRect().top;

            stage.style.fontSize = '12px';
            stage.style.webkitTextSizeAdjust = 'none';
            stage.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0)';

            this._element = stage;

            this.on(ADUN.Event.HEART_RESIZE, this._onheartresize);

            this._width = width;
            this._height = height;
            this.scale = scale;

            // 심장의 프레임 빈도
            this.fps = 30;

            // 심장이 뛰기시작한 이래로의 프레임 수
            this.frame = 0;

            this.ready = false;

            this.running = false;

            this.assets = {};
            var assets = this._assets = [];


            // 현재 보여지는 씬을 가리킨다.
            // 현재 보여지는 씬은 항상 스택의 탑이다.
            this.currentScene = null;

            // 루트 씬
            //this.rootScene = new ADUN.Scene();
            //this.pushScene(this.rootScene);

            // 로딩 씬
            //this.loadingScene = new ADUN.LoadingScene();

            this._activated = false;

            this._offsetX = 0;
            this._offsetY = 0;

            this.input = {};

            this.keyboardInputManager = new ADUN.KeyboardInputManager(window.document, this.input);
            this.keyboardInputManager.addBroadcastTarget(this);

            for( var name in ADUN.ENV.KEY_BIND_TABLE ) {
                this.keybind(name, ADUN.ENV.KEY_BIND_TABLE[name]);
            }

            if( initial ) {
                stage = ADUN.Heart.instance._element;
                var evt;

                document.addEventListener('keydown', function(e) {
                    H.emit(new ADUN.Event('keydown'));
                    if( ADUN.ENV.PREVENT_DEFAULT_KEY_TABLE.indexOf(e.keyCode) !== -1) {
                        e.preventDefault ? e.preventDefault() : e.returnValue = false;
                        e.stopPropagation();
                    }
                }, true);
            }


            Object.defineProperties(this, {
                width: {
                    get: function() {
                        return this._width;
                    },
                    set: function(w) {
                        this._width = w;
                        this._dispatchHeartResizeEvent();
                    }
                },

                height: {
                    get: function() {
                        return this._height;
                    },
                    set: function(h) {
                        this._height = h;
                        this._dispatchHeartResizeEvent();
                    }
                },

                scale: {
                    get: function () {
                        return this._scale;
                    },
                    set: function (s) {
                        this._scale = s;
                        this._dispatchHeartResizeEvent();
                    }
                }

            });




        },

        _dispatchHeartEvent: function() {
            var e = new ADUN.Event('heartresize');
            e.width = this._width;
            e.height = this._height;
            e.scale = this._scale;
            this.emit(e);
        },

        _onheartresize: function(e) {
            this._element.style.width = Math.floor(this._width * this._scale) + 'px';
            this._element.style.height = Math.floor(this._height * this._scale) + 'px';

            var scene, i, length;

            for( i = 0, length = this._scene.length; i < 1; ++i ) {
                scene = this._scene[i];
                scene.emit(e);
            }
        },

        keybind: function(key, button) {
            this.keyboardInputManager.keybind(key, button);
            this.addEventListener(button + 'buttondown', this._buttonListener);
            this.addEventListener(button + 'buttonup', this._buttonListener);
        },

        _buttonListener: function(e) {
            this.currentScene.emit(e);
        },

        preload: function(assets) {
            var a, name;

            if( !ADUN.isArray(assets) ) {

                if( ADUN.isPlainObject(assets) ) {
                    a = [];

                    for( name in assets ) {
                        if( ADUN.has(assets, name) ) {
                            a.push([assets[name], name]);
                        }
                    }
                    assets = a;
                } else {
                    assets = Array.prototype.slice.call(arguments);
                }
            }

            Array.prototype.push.apply(this._assets, assets);

            return this;
        },

        load: function(src, alias, callback, onerror) {
            var assetName, tempCallback, ext;

            // alias가 string 이라면 블록안에 진입
            if( ADUN.isString(arguments[1]) ) {
                assetName = alias;
                callback = callback || function() { };
                onerror = onerror || function() { };
            } else {
                assetName = src;
                tempCallback = callback;
                callback = arguments[1] || function() { };
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

                if( ADUN._loadFuncs[ext] ) {
                    ADUN.Heart.instance.assets[assetName] = ADUN._loadFuncs[ext](src, ext, _callback, _onerror);
                } else {
                    console.log('cannot this asset ' + ext);
                   // throw new Error('');
                }

                return d;
            });
        },

        start: function(deferred) {
            var onloadTimeSetter = function() {
                this.frame = 0;
                this.removeEventListener('load', onloadTimeSetter);
            };

            this.addEventListener('load', onloadTimeSetter);

            this.currentTime = ADUN.getTime();

            this.running = true;
            this.ready = true;

            if ( !this._activated ) {
                this.activated = true;
            }



        }

    });
})();



// #Group
(function() {
    'use strict';
    var Group = ADUN.Group = ADUN.Class({
        EXTEND: ADUN.Node,

        init: function() {
            this.childNodes = [];
            this.super();

            this._rotation = 0;
            this._scaleX = 1;
            this._scaleY = 1;

            this._originX = null;
            this._originY = null;

            this.__dirty = false;

            [ADUN.Event.ADDED_TO_SCENE, ADUN.Event.REMOVED_FROM_SCENE]
                .forEach(function(event) {
                    this.addEventListener(event, function(e) {
                        this.childNodes.forEach(function(child) {
                            child.scene = this.scene;
                            child.emit(e);
                        });
                    });
                }, this);


            Object.defineProperties(this, {
                firstChild: {
                    get: function() {
                        return this.childNodes[0];
                    }
                },

                lastChild: {
                    get: function() {
                        return this.childNodes[this.childNodes.length -1];
                    }
                },

                rotation: {
                    get: function() {
                        return this._rotation;
                    },
                    set: function(rotation) {
                        if( this._rotation !== rotation ) {
                            this._rotation = rotation;
                            this._dirty = false;
                        }
                    }
                },

                scaleX: {
                    get: function() {
                        return this._scaleX
                    },
                    set: function(scale) {
                        if( this._scaleX !== scale) {
                            this._scaleX = scale;
                            this._dirty = false;
                        }
                    }
                },

                scaleY: {
                    get: function() {
                        return this._scaleY
                    },
                    set: function(scale) {
                        if( this._scaleY !== scale) {
                            this._scaleY = scale;
                            this._dirty = false;
                        }
                    }
                },

                originX: {
                    get: function() {
                        return this._originX;
                    },
                    set: function(originX) {
                        if(this._originX !== originX) {
                            this._originX = originX;
                            this._dirty = true;
                        }
                    }
                },

                originY: {
                    get: function() {
                        return this._originY;
                    },
                    set: function(originY) {
                        if(this._originY !== originY) {
                            this._originY = originY;
                            this._dirty = true;
                        }
                    }
                },

                _dirty: {
                    get: function() {
                        return this.__dirty;
                    },
                    set: function(dirty) {
                        dirty = !!dirty;
                        this.__dirty = dirty;
                        if( dirty ) {
                            for( var i = 0, length = this.childNodes.length; i < length; ++i ) {
                                this.childNodes[i]._dirty = true;
                            }
                        }
                    }
                }
            });

        },

        addChild: function(node) {
            if( node.parentNode ) {
                node.parentNode.removeChild(node);
            }

            this.childNodes.push(node);
            node.parentNode = this;

            var childAdded = new ADUN.Event('childadded');
            childAdded.node = node;
            childAdded.next = null;
            this.emit(childAdded);

            if( this.scene ) {
                node.scene = this.scene;
                var addedToScene = new ADUN.Event('addedtoscene');
                node.emit(addedToScene);
            }
        },

        insertBefore: function(node, reference) {
            if( node.parentNode ) {
                node.parentNode.removeChild(node);
            }

            var i = this.childNodes.indexOf(reference);

            if( i !== -1 ) {
                this.childNodes.splice(i, 0, node);
                node.parentNode = this;

                var childAdded = new ADUN.Event('childadded');
                childAdded.node = node;
                childAdded.next = reference;
                this.emit(childAdded);
                node.emit(new enchant.Event('added'));

                if( this.scene ) {
                    node.scene = this.scene;
                    var addedToScene = new ADUN.Event('addedtoscene');
                    node.emit(addedToScene);
                }
            } else {
                this.addChild(node);
            }
        },

        removeChild: function(node) {
            var i = this.childNodes.indexOf(node);

            if( i !== -1 ) {
                this.childNodes.splice(i, 1);
                node.parendNode = null;

                var childRemoved = new ADUN.Event('childremoved');
                childRemoved.node = node;
                this.emit(childRemoved);
                node.emit(new ADUN.Event('removed'));

                if( this.scene ) {
                    node.scene = null;
                    var removedFromScene = new ADUN.Event('removedfromscene');
                    node.dispatchEvent(removedFromScene)
                }
            }
        }


    });
})();


// #Scene
(function() {
    'use strict';

    var Scene = ADUN.Scene = ADUN.Class({
        EXTEND: ADUN.Group,

        init: function() {
            var heart = ADUN.Heart.instance;

            this.super();

            this.scene = this;

            this._backgroundColor = null;

            this._element = doucment.createElement('div');
            this._element.style.position = 'absolute';
            this._element.style.overflow = 'hidden';
            this._element.style[ADUN.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0 0';

            this._layers = {};
            this._layerPriority = [];

            this.addEventListener(ADUN.Event.CHILD_ADDED, this._onchildadded);
            this.addEventListener(ADUN.Event.CHILD_REMOVED, this._onchildremoved);
            this.addEventListener(ADUN.Event.ENTER, this._onenter);
            this.addEventListener(ADUN.Event.EXIT, this._onexit);

            var self = this;

            this._dispatchExitframe = function() {
                var layer, name;
                for( name in self._layers ) {
                    layer = self._layers[name];
                    layer.emit(new ADUN.Event(ADUN.Event.EXIT_FRAME));
                }
            };

            this.addEventListener(ADUN.HEART_RESIZE, this._onheartresize);

            this._onheartresize(heart);

            Object.defineProperties(this, {
                x: {
                    get: function() {
                        return this._x;
                    },
                    set: function(x) {
                        this._x = x;
                        for( var type in this._layers ) {
                            this._layers[type].x = x;
                        }
                    }
                },

                y: {
                    get: function() {
                        return this._y;
                    },
                    set: function(x) {
                        this._y = y;
                        for( var type in this._layers ) {
                            this._layers[type].y = y;
                        }
                    }
                },

                width: {
                    get: function() {
                        return this._width;
                    },
                    set: function(width) {
                        this._width = width;
                        for (var type in this._layers) {
                            this._layers[type].width = width;
                        }
                    }
                },

                height: {
                    get: function() {
                        return this._height;
                    },
                    set: function(height) {
                        this._height = height;
                        for (var type in this._layers) {
                            this._layers[type].height = height;
                        }
                    }
                },

                rotation: {
                    get: function() {
                        return this._rotation;
                    },
                    set: function(rotation) {
                        this._rotation = rotation;
                        for (var type in this._layers) {
                            this._layers[type].rotation = rotation;
                        }
                    }
                },

                scaleX: {
                    get: function() {
                        return this._scaleX;
                    },
                    set: function(scaleX) {
                        this._scaleX = scaleX;
                        for (var type in this._layers) {
                            this._layers[type].scaleX = scaleX;
                        }
                    }
                },

                scaleY: {
                    get: function() {
                        return this._scaleY;
                    },
                    set: function(scaleY) {
                        this._scaleY = scaleY;
                        for (var type in this._layers) {
                            this._layers[type].scaleY = scaleY;
                        }
                    }
                },

                backgroundColor: {
                    get: function() {
                        return this._backgroundColor;
                    },
                    set: function(color) {
                        this._backgroundColor = this._element.style.backgroundColor = color;
                    }
                },
            });
        },

        remove: function() {
            this.clearEventListener();

            while( this.childNodes.length > 0) {
                this.childNodes[0].remove();
            }
        },

        onheartresize: function(e) {
            this._element.style.width = e.width + 'px';
            this.width = e.width;
            this._element.style.height = e.height + 'px';
            this.height = e.height;
            this._element.style[ADUN.ENV.VENDOR_PREFIX + 'Transform'] = 'scale(' + e.scale + ')';

            for (var type in this._layers) {
                this._layers[type].dispatchEvent(e);
            }
        },

        addLayer: function(type, i) {
            var heart = ADUN.heart.instance;
            if( this._layers[type] ) {
                return;
            }


        }
    });
})();
