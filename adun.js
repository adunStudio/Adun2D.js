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
 *  Version: 0.1.2
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

     for(var I = 0; I < LOGO.length; ++I) {
         STRING = '';
         for(var S = 0; S < LOGO[I].length; ++S) {
             STRING += LOGO[I][S];
         }
         console.log(STRING);
     }
 })();

(function(global) {
    'use strict';
    var adun = {
        ADUN_VESION: '0.1.2'
        // BASIC_COMPLETE_VERSION
    };

    global.ADUN = global.Adun = global.adun = adun;

    // 확장 메서드(얉은 복사, 깊은 복사)
    adun.extend = function() {
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
        if( !adun.Utils.isObject(target) ) {
            target = {};
        }

        // 복사할 참조가 없을 경우 this를 참조한다.
        if( i === length ) {
            target = this;
            --i;
        }

        for( ; i < length; ++i ) {
            // 인자로 넘어온 객체의 프로퍼티를 options로 참조 시키고,
            // 이 프로퍼티가 null이 아닌 경우 블록 안으로 진입한다.
            if( (options = arguments[i]) !== undefined ) {
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
                    if( deep && copy && ( (adun.Utils.isPlainObject(copy)) || (copyisArray = ADUN.Utils.isArray(copy)) ) ) {

                        // copy가 배열인 경우 빈 배열을, 객체인 경우 빈 객체를 clone에 참조한다.
                        // 만약 src가 같은 배열 or 객체이면 clone에 해당 배열 or 객체를 참조시킨다.
                        // -> 복사본에 같은 이름의 프로퍼티가 있는 경우 원본과 똑같은 배열이거나 객체라면 새롭게 참조시키지 않고, 복사본의 해당 프로퍼티에 추가한다.
                        if( copyisArray ) {
                            copyisArray = false;
                            clone = ( src && adun.Utils.isArray(src) ) ? src : [];
                        } else {
                            clone = ( src && adun.Utils.isPlainObject(src) ) ? src : {};
                        }

                        // extend 함수를 다시 호출한다.(= 재귀)
                        // clone에 copy를 복사한다. copy 객체안에 다시 객체 배열 or 객체가 있는 경우 다시 재귀 호출을 한다.
                        target[name] = adun.extend(deep, clone, copy);

                    } else if( copy != null ) {
                        target[name] = copy;
                    }
                }
            }

        }
        // 복사본을 반환한다.
        return target;
    };

})(window);

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

// #Class
(function() {
    'use strict';
    var Class = adun.Class = function(definition) {

        if( definition == null ) {
            throw new Error('definition is undefined (adun.Class)');
        }
        if( !definition.TYPE ) {
            throw new Error('definition.TYPE is undefined (adun.Class)');
        }

        var name, extend = definition.extend;
        var prototype = {};

        if( extend && adun.isObject(extend)) {
            if( extend.constructor != adun.Class ) {
                throw new Error('extend constructor is not adun.Class (adun.Class)');
            }

            prototype = new extend('!ADUN.INIT');
        }


        for( name in definition ) {
            if( adun.isPlainObject(definition[name]) && Object.getPrototypeOf(definition[name]) === Object.prototype ) {
                definition[name] = definition[name];
                definition[name].enumerable = true;
            } else {
                definition[name] = {
                    value: ( adun.isFunction(definition[name]) && adun.isFunction(prototype[name]) ) ?
                        (function(name, fn) {
                            return function() {
                                this.super = prototype[name];
                                var ret = fn.apply(this, arguments);
                                delete this.super;
                                return ret;
                            };
                        })(name, definition[name]) :
                        definition[name],

                    enumerable: true,
                    writable: true
                };
            }
        }

        var Class = function() {
            if( this.init && arguments[0] !== '!ADUN.INIT' ) {
                this.init.apply(this, arguments);
            }
            if( !this.objType ) {
                this.objType = function() {
                    return this.TYPE;
                }
            }
        };
        Class.prototype = Object.create(prototype, definition);
        Class.constructor = adun.Class;

        return Class;
    };
})();

// #ENV
(function() {
    'use strict';
    var ua = navigator.userAgent;

    var ENV = adun.ENV = {
        VERSION: adun.ADUN_VERSION,

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

        PREVENT_DEFAULT_KEY_TABLE: [13, 27, 32, 37, 38, 39, 40, 65, 83, 70, 81, 87, 69, 81, 123],

        DEFALUT_TAGS: ['input', 'textarea', 'select', 'area'],

        CANVAS_METHODS: [
            'putImageData', 'drawImage', 'drawFocusRing', 'fill', 'stroke',
            'clearRect', 'fillRect', 'strokeRect', 'fillText', 'strokeText'
        ],

        IMAGE: ['jpg', 'jpeg', 'gif', 'png', 'bmp'],

        SOUND: ['mp3', 'aac', 'm4a', 'wav', 'ogg'],

        // 디텍션 영역 => (COLOR_DETECTION_LEVEL * 2 + 1)px square
        COLOR_DETECTION_LEVEL: 2

    };
})();

// #Deferred
(function() {
    'use strict';

    var Deferred = adun.Deferred = adun.Class({
        extend: null,
        TYPE: 'Deferred',

        init: function() {
            this._success   =   this._fail   =   this._id   = null;
            this._tail = this;
        },

        _add: function(queue) {
            // 큐 방식의 연결리스트 자료구조를 사용한다.

            // 마지막에 추가된 Deferred 객체._next => 마지막에 추가된 Deferred 객체
            this._tail._next = queue;

            // 꼬리는 항상 마지막에 추가된 Deferred 객체를 가리킨다.
            this._tail = queue;

            // 연결리스트에서 맨 처음 Deferred 객체 반환.
            return this;
        },

        next: function(fn) {
            var queue = new adun.Deferred();
            queue._success = fn;

            return this._add(queue);
        },

        error: function(fn) {
            var queue = new adun.Deferred();
            queue._fail = fn;

            return this._add(queue);
        },

        call: function(arg) {
            var received, queue = this;

            // _fail 건너뛰기
            while( queue && !queue._success ) {
                queue = queue._next;
            }

            if( !(queue instanceof adun.Deferred) ) {
                return;
            }

            try {
                received = queue._success(arg);
            } catch(e) {
                return queue.fail(e);
            }

            if( received instanceof adun.Deferred ) {
                // 값이 Deferred의 인스턴스라면 삽입한다.
                adun.Deferred._insert(queue, received);
            } else if( queue._next instanceof adun.Deferred ) {
                queue._next.call(received);
            }
        },

        fail: function(arg) {
            var result, error, queue = this;

            // _success 건너뛰기
            while( queue && !queue._fail ) {
                queue = queue._next;
            }

            if( queue instanceof adun.Deferred ) {
                result = queue._fail(arg);
                queue.call(result);
            } else if( arg instanceof Error ) {
                //arg.stackTrace();
                throw arg;
            } else {
                error = new Error('faild in Deferred');
                error.arg = arg;
                throw error;
            }
        }
    });

    Deferred.next = function(fn) {
        var queue = new adun.Deferred().next(fn);

        // 타이머 함수를 이용하여 비동기성을 가진다.
        // (함수 스택이 모두 클리어되었을 때 실행된다.)
        queue._id = setTimeout(function() {
            queue.call();
        }, 0);

        return queue;
    };

    Deferred._insert = function(queue, ins) {
        // 만약 현재 큐의 _next가 Deferred의 인스턴스라면 블록에 진입
        if( queue._next instanceof adun.Deferred ) {
            ins._tail._next = queue._next;
        }

        // 현재 큐의 _next에 새로운 Deferred의 인스턴스를 참조시킨다.
        queue._next = ins;
    };

    // 평행
    Deferred.parallel = function(arg) {
        var q = new adun.Deferred();
        q._id = setTimeout(function() {
            q.call();
        }, 0);

        var progress = 0,
            ret = adun.isArray(arg) ? [] : {},
            p = new adun.Deferred(),
            prop;

        for( prop in arg ) {
            if( adun.has(arg, prop) ) {
                progress ++;

                // 복사본(Deferred 인스턴스)을 즉시실행함수에 바로 넘겨준다.
                (function(queue, name) {
                    // 복사본.next(fn)
                    queue.next(function(arg) {
                        progress --;

                        ret[name] = arg;    // 리턴된 값,

                        if( progress <= 0 ) {
                            p.call(ret);
                        }
                    }).error(function(err) {
                        p.fail(err);
                    });

                    if( adun.isNumber(queue._id) ) {
                        clearTimeout(queue._id);
                    }

                    queue._id = setTimeout(function() {
                        queue.call();
                    }, 0);

                })(arg[prop], prop);
            }
        }

        if( progress == 0 ) {
            p._id = setTimeout(function() {
                p.call(ret);
            }, 0);
        }

        return q.next(function() { return p; });
    };
})();


// #Matrix
(function() {
    'use strict';

    /**
     * Matrix
     * 2D 변환 행렬을 나타낸다.
     * HTML canvas transform() Method에 사용.
     * void ctx.transform(a, b, c, d, e, f)
     * [a c e]
     * [b d f]
     * [0 0 1]
     * - basic -
     * [1 0 tx]
     * [0 1 ty]
     * [0 0  1]
     *
     *
     * a (m11) => Horizonatal scaling => y축 scale
     * b (m12) => Horizonatal skewing => y축 rotate
     * c (m21) => Vertical skewing => x축 rotate
     * d (m22) => Vertical scaling => x축 scale
     * e (tx)  => Horizonatal moving => x축 이동
     * f (ty)  => Vertical moving => y축 이동
     *
     * 번외 행렬 변환
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

    var Matrix = adun.Matrix = adun.Class({
        TYPE: 'Matrix',

        init: function() {
            this.reset();
        },

        reset: function() {
            // ctx.transform(a, b, c, d, e, f)
            /**
            * [a c e]
            * [b d f]
            * [0 0 1]
            **/
            this.stack = [];

            this.stack.push([1, 0, 0, 1, 0, 0]);
        },

        makeTransformMatrix: function(node) {
            var x, y, width, height, w, h, rotation, scaleX, scaleY, theta, tmpcos, tmpsin,
                a, b, c, d, dx, dy, mat = [];

            x = node._x;
            y = node._y;
            width = node.width || 0;
            height = node.height || 0;
            w = adun.isNumber(node._originX) ? node._originX : width / 2;
            h = adun.isNumber(node._originY) ? node._originY : height / 2;
            scaleX = adun.isNumber(node._scaleX) ? node._scaleX : 1;
            scaleY = adun.isNumber(node._scaleY) ? node._scaleY : 1;
            rotation = node._rotation || 0;
            theta = rotation * Math.PI / 180;
            tmpcos = Math.cos(theta);
            tmpsin = Math.sin(theta);

            a = scaleX * tmpcos;
            b = scaleX * tmpsin;
            c = scaleY * tmpsin;
            d = scaleY * tmpcos;
            dx = (-a * w + c * h + x + w);
            dy = (-b * w - d * h + y + h);

            mat[0] = a;
            mat[1] = b;
            mat[2] = -c;
            mat[3] = d;
            mat[4] = dx;
            mat[5] = dy;

            return mat;
        },

        multiply: function(m1, m2) {
            var mat = [];

            var a11 = m1[0], a21 = m1[2], adx = m1[4];
            var a12 = m1[1], a22 = m1[3], ady = m1[5];

            var b11 = m2[0], b21 = m2[2], bdx = m2[4];
            var b12 = m2[1], b22 = m2[3], bdy = m2[5];

            mat[0] = a11 * b11 + a21 * b12;
            mat[1] = a12 * b11 + a22 * b12;
            mat[2] = a11 * b21 + a21 * b22;
            mat[3] = a12 * b21 + a22 * b22;
            mat[4] = a11 * bdx + a21 * bdy + adx;
            mat[5] = a12 * bdx + a22 * bdy + ady;

            return mat;
        },

        multiplyVec: function(m, vec) {
            var mat, x = vec[0], y = vec[1];
            mat = [];

            var a = m[0], c = m[2], dx = m[4];
            var b = m[1], d = m[3], dy = m[5];

            mat[0] = a * x + c * y + dx;
            mat[1] = b * x + d * y + dy;

            return mat;
        }
    });

    Matrix.instance = new Matrix();
})();

// #Event
(function() {
    'use strict';

    var Event = adun.Event = adun.Class({
        extend: null,
        TYPE: 'Event',

        init: function(type) {
            this.type = type;   // important!

            this.target = null;
            this.x = 0;
            this.y = 0;
            this.localX = 0;
            this.loacalY = 0;
        },

        _initPosition: function(pageX, pageY) {
            var heart = adun.Heart.instance;

            this.x = this.localX = (pageX - heart._pageX) / heart.scale;
            this.y = this.loaclY = (pageY - heart._pageY) / heart.scale;
        }
    });

    // 심장이 준비 완료되면 발생한다.
    // ex) 이미지 프리로딩
    Event.LOAD = 'load';

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

    // 씬이 끝날때 발생한다.
    Event.EXIT = 'exit';

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

    // 스프라이트에서 프레임에 null값이 할당되 애니메이션이 끝나면 발생한다.
    Event.ANIMATION_END = 'animationend';

    // 키가눌러졋을때 heart로 발생한다.
    Event.KEY_DOWN = 'keydown';

    Event.CLICK_START = 'clickstart';
    Event.CLICK_MOVE = 'clickmove';
    Event.CLICK_END = 'clickend';

})();

// #EventTarget
(function() {
    'use strict';
    // 옵저버 패턴
    var EventTarget = adun.EventTarget = adun.Class({
        extend: null,
        TYPE: 'EventTarget',

        init: function() {
            // 리스너 목록 => 빈 객체
            this._listeners = {};
        },

        addEventListener: function(type, listener) {
            // 리스터[타입] => 리스너 목록(배열)
            var listeners = this._listeners[type];

            // 리스너 목록이 없다면 if 블록에 진입
            if( listeners == undefined ) {
                this._listeners[type] = [listener];
            } else if( listeners.indexOf(listener) === -1 ) {
                // 리스너 목록 맨 앞에 추가
                listeners.unshift(listener);
            }
        },

        // on => addEventListener
        on: function() {
            this.addEventListener.apply(this, arguments);
        },

        removeEventListener: function(type, listener) {
            var listeners, i;

            listeners = this._listeners[type];

            if( listeners != undefined ) {
                i = listeners.indexOf(listener);

                if( i !== -1 ) {
                    listeners.splice(i, 1);
                }
            }
        },

        clearEventListener: function(type) {
            // 인자가 있을 경우 해당 타입의 리스너 모두 삭제
            // 인자가 없을 경우 리스너 모두 삭제

            if( type != undefined ) {
                delete this._listeners[type];
            } else {
                this._listeners = {};
            }
        },

        dispatchEvent: function(e) {
            e.target = this;
            e.localX = e.x - this._offsetX;
            e.localY = e.y - this._offsetY;

            if( this['on' + e.type] != undefined ) {
                this['on' + e.type](e);
            }
            var listeners = this._listeners[e.type];

            if( listeners != undefined ) {
                listeners = listeners.slice();

                for( var i = 0, len = listeners.length; i < len; ++i ) {
                    listeners[i].call(this, e);
                }
            }
        },

        // emit => dispatchEvent
        emit: function(e) {
            this.dispatchEvent.call(this, e);
        }
    });
})();

// 키보드를 담당한다.
// 1. 키보드매니저.keyBind(13, 'enter')
// 2. return  new adun.KeyboardInputSource(13); (즉 , 소스)
// 3. 키보드매니저.inputStore['enter'] = false
// 4. 소스.on(INPUT_STATE_CHANGED, _stateHandler)
// 5. 키보드매니저._binds[13] = 'enter' <=  _binds[_id] = name
//
// enter(keycode = 13) 키가 눌러졌을떄
//
// 1. adun.KeyboardInputSource[13].notifyStateChange
// 2. => emit(adun.Event.INPUT_STATE_CHANGED)  e.data = true, e.source = this
// 3. => 키보드매니저._stateHandler ( name = this._binds[13] = 'enter' ) ==> 키보드매니저._changeState('enter', true)
// 4. => this.down('enter');  여기서 this는 키보드 매니저
// 5. => valueStore['enter'] = true,  그리고 INPUT_CHANGE or INPU_START 그리고 enterbuttondown 이벤트(총 2개 ) broadcast

// 사용방법 heart.on('enterbuttondown', function() {
//           // 로직
//          });

// #InputManager
(function() {
    'strict mode';

    var InputManager = adun.InputManager = adun.Class({
        extend: adun.EventTarget,
        TYPE: 'InputManager',

        init: function(valueStore, source) {
            this.super();

            // 이벤트 타겟을 저장할 배열
            this.broadcastTarget = [];

            // 인풋 상태를 저장할 객체 => valueStore[name] = true || false
            this.valueStore = valueStore;

            //
            this.source = source || this;

            // id: name
            // 13: 'enter'
            this._binds = [];

            this._stateHandler = function(e) {
                var id, name;

                id = e.source._id; //      number ex) 13
                name = this._binds[id]; // string ex) 'enter'

                this.changeState(name, e.data);
            }.bind(this);
        },

        bind: function(inputSource, name) {
            inputSource.on(adun.Event.INPUT_STATE_CHANGED, this._stateHandler);
            this._binds[inputSource._id] = name;
        },

        unbind: function(inputSource) {
            inputSource.removeEventListener(adun.Event.INPUT_STATE_CHANGED, this._sateHandler);
            delete this._binds[inputSource._id];
        },

        addBroadcastTarget: function(eventTarget) {
            var i = this.broadcastTarget.indexOf(eventTarget);

            if( i === -1 ) {
                this.broadcastTarget.push(eventTarget);
            }
        },

        removeBroadcastTarget: function(eventTarget) {
            var i = this.broadcastTarget.indexOf(eventTarget);

            if( i !== -1) {
                this.broadcastTarget.splice(i, 1);
            }
        },

        broadcastEvent: function(e) {
            var i, len, target = this.broadcastTarget;

            for( i = 0, len = target.length; i < len; ++i) {
                target[i].emit(e);
            }
        },

        changeState: function(name, data) {

        }

    });
})();

// #BinaryInputManager
(function() {
    'use strict';

    var BinaryInputManager = adun.BinaryInputManager = adun.Class({
        extend: adun.InputManager,
        TYPE: 'BinaryInputManager',

        init: function(valueStore, activeEventNameSuffix, inactiveEventNameSuffix, source) {
            this.super(valueStore, source);

            this.activeInputNum = 0;

            this.activeEventNameSuffix = activeEventNameSuffix;
            this.inactiveEventNameSuffix = inactiveEventNameSuffix;
        },

        bind: function(binaryInputSource, name) {
            this.super(binaryInputSource, name);

            this.valueStore[name] = false;
        },

        unbind: function(binaryInputSource) {
            this.super(binaryInputSource);

            var name = this._binds[binaryInputSource._id];
            delete this.valueStore[name];
        },

        changeState: function(name, bool) {
            if( bool ) {
                this._down(name);
            } else {
                this._up(name);
            }
        },

        _down: function(name) {
            var inputEvent, downEvent;

            if( !this.valueStore[name] ) {  // if( false )
                this.valueStore[name] = true;

                inputEvent = new adun.Event((this.activeInputNum ++) ? adun.Event.INPUT_CHANGE : adun.Event.INPUT_START);  // 0 == false => true
                inputEvent.source = this.source;

                this.broadcastEvent(inputEvent);
            }


            downEvent = new adun.Event(name + this.activeEventNameSuffix);
            downEvent.source = this.source;

            this.broadcastEvent(downEvent);
        },

        _up: function(name) {
            var inputEvent, upEvent;

            if( this.valueStore[name] ) {
                this.valueStore[name] = false;

                inputEvent = new adun.Event((-- this.activeInputNum) ? adun.Event.INPUT_CHANGE : adun.Event.INPUT_END);
                inputEvent.source = this.source;

                this.broadcastEvent(inputEvent);
            }

            upEvent = new adun.Event(name + this.inactiveEventNameSuffix);
            upEvent.source = this.source;

            this.broadcastEvent(upEvent);
        }
    });
})();

// #KeyboardInputManager
(function() {
    'use strict';

    var KeyboardInputManager = adun.KeyboardInputManager = adun.Class({
        extend: adun.BinaryInputManager,
        TYPE: 'KeyboardInputManager',

        init: function(domElement, flagStore) {
            this.super(flagStore, 'buttondown', 'buttonup');
            this._attachDOMEvent(domElement, 'keydown', true);
            this._attachDOMEvent(domElement, 'keyup', false);
        },

        _attachDOMEvent: function(domElement, eventType, state) {
            domElement.addEventListener(eventType, function(e) {
                var code, source, heart = adun.Heart.instance;

                if( !heart || !heart.running ) {
                    return;
                }


                code = e.keyCode;

                source = adun.KeyboardInputSource.instance[code];
                if( source ) {
                    source.notifyStateChange(state);
                }

            }, true);
        },

        keybind: function(keyCode, name) {
            this.bind(adun.KeyboardInputSource.getByKeyCode('' + keyCode), name);
        },

        keyunbind: function(keyCode) {
            this.unbind(adun.KeyboardInputSource.getByKeyCode('' + keyCode));
        }

    });
})();


// #InputSource
(function() {
    'use strict';

    var InputSource = adun.InputSource = adun.Class({
        extend: adun.EventTarget,
        TYPE: 'InputSource',

        init: function(id) {
            this.super();

            this._id = id;
        },

        notifyStateChange: function(data) {
            var e = new adun.Event(adun.Event.INPUT_STATE_CHANGED);
            e.data = data;
            e.source = this;

            this.emit(e);
        }
    });
})();

// #KeyboardInputSource
(function() {
    'use strict';

    var KeyboardInputSource = adun.KeyboardInputSource = adun.Class({
        extend: adun.InputSource,
        TYPE: 'KeyboardInputSource',

        init: function(keyCode) {
            this.super(keyCode);
        }
    });

    // 키보드 인스턴스
    KeyboardInputSource.instance = {};

    KeyboardInputSource.getByKeyCode = function(keyCode) {
        if( !KeyboardInputSource.instance[keyCode] ) {
            KeyboardInputSource.instance[keyCode] = new adun.KeyboardInputSource(keyCode);
        }

        return KeyboardInputSource.instance[keyCode];
    };

})();


// 게임을 움직이는 핵심 로직
// #Heart
(function() {
    'use strict';

    var Heart;

    adun.Heart = adun.Class({
        extend: adun.EventTarget,
        TYPE: 'Heart',

        init: function(width, height) {

            if (window.document.body == null) {
                throw new Error("document.body is null. Please excute 'new Heart()' in window.onload.");
            }

            this.super();

            var initial = true;

            if( Heart ) {
                initial = false;
                Heart.stop();
            }

            Heart = adun.Heart.instance = this;

            this._calledTime = 0;
            this._mousedownID = 0;
            this._surfaceID = 0;
            this._soundID = 0;

            this._scenes = [];

            width = width || 320;
            height = height || 320;

            var stage = document.getElementById('adun_stage');
            var scale, style, sWidth, sHeight, bounding;

            if( !stage ) {

                stage = document.createElement('div');
                stage.id = 'adun_stage';
                stage.style.position = 'absolute';

                if( document.body.firstChild ) {
                    document.body.insertBefore(stage, document.body.firstChild);
                } else {
                    document.body.appendChild(stage);
                }

                scale = Math.min(window.innerWidth / width, window.innerHeight / height);

                this._pageX = stage.getBoundingClientRect().left;
                this._pageY = stage.getBoundingClientRect().top;

            } else {

                style = window.getComputedStyle(stage);
                sWidth = parseInt(style.width, 10);
                sHeight = parseInt(style.height, 10);

                if( sWidth && sHeight ) {
                    scale = Math.min(sWidth / width, sHeight / height);
                } else {
                    scale = 1;
                }

                while( stage.firstChild ) {
                    stage.removeChild(stage.firstChild);
                }

                stage.stype.position = 'relative';

                bounding = stage.getBoundingClientRect();

                this._pageX = Math.round(window.scrollX || window.pageXOffset + bounding.left);
                this._pageY = Math.round(window.scrollY || window.pageYOffset + bounding.top);

            }

            stage.style.fontSize = '12px';
            stage.style.webkitTextSizeAdjust = 'none';
            stage.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0)';

            this._element = stage;

            this.on(adun.Event.HEART_RESIZE, this._onHeartResize);

            this._width = width;
            this._height = height;

            this.scale = scale;

            this.fps = 30;

            this.frame = 0;

            this.ready = false;

            this.running = false;

            this.assets = {};
            this._assets = [];

            this.currentScene = null;

            this.rootScene = new adun.Scene();
            this.rootScene.aaaaaaaaaaaaaaaaaa= 1;
            this.pushScene(this.rootScene);

            this.loadingScene = new adun.LoadingScene();
            this.loadingScene.aaaaaaaaaaa= 1;

            this._activated = false;

            this._offsetX = 0;
            this._offsetY = 0;

            this.input = {};

            this.keyboardInputManager = new adun.KeyboardInputManager(window.document, this.input);
            this.keyboardInputManager.addBroadcastTarget(this);
            this._keybind = this.keyboardInputManager._binds;

            for( var prop in adun.ENV.KEY_BIND_TABLE ) {
                this.keybind(prop, adun.ENV.KEY_BIND_TABLE[prop]);
            }

            if( initial ) {

                stage = adun.Heart.instance._element;

                var evt;

                document.addEventListener('keydown', function(e) {

                    Heart.emit(new adun.Event(adun.Event.KEY_DOWN));

                    // if( adun.ENV.PREVENT_DEFAULT_KEY_TABLE[e.keyCode] !== -1 ) {
                    //     e.preventDefault();
                    //     e.stopPropagation();
                    // }

                }, true);

                this._clickEventTarget = {};

                stage.addEventListener('mousedown', function(e) {
                    var event, target;

                    event = new adun.Event(adun.Event.CLICK_START);
                    event._initPosition(e.pageX, e.pageY);

                    target = Heart.currentScene._determineEventTarget(event);

                    Heart._clickEventTarget[Heart._mousedownID] = target;

                    target.emit(event);
                    // var tagName = (e.target.tagName).toLowerCase();
                    //
                    // if( adun.ENV.DEFALUT_TAGS.indexOf(tagName) === -1 ) {
                    //     e.preventDefault();
                    //
                    //     Heart._mousedownID ++;
                    //
                    //     if( !Heart.running ) {
                    //         e.stopPropagation();
                    //     }
                    // }

                }, true);

                stage.addEventListener('mousemove', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();

                    if( adun.ENV.DEFALUT_TAGS.indexOf(tagName) === -1 ) {
                        e.preventDefault();

                        if( !Heart.running ) {
                            e.stopPropagation();
                        }
                    }
                }, this);

                stage.addEventListener('mouseup', function(e) {
                    var tagName = (e.target.tagName).toLowerCase();

                    if( adun.ENV.DEFALUT_TAGS.indexOf(tagName) === -1 ) {
                        e.preventDefault();

                        if( !Heart.running ) {
                            e.stopPropagation();
                        }
                    }
                });

            }



        },

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
        },

        _dispatchHeartResizeEvent: function() {
            var e = new adun.Event(adun.Event.HEART_RESIZE);
            e.width = this._width;
            e.height = this._height;
            e.scale = this._scale;
            this.emit(e);
        },

        _onHeartResize: function(e) {

            this._element.style.width = Math.floor(this._width * this._scale) + 'px';
            this._element.style.height = Math.floor(this._height * this._scale) + 'px';

            var i, len, scene;

            for( i = 0, len = this._scenes.length; i < len; ++i ) {
                scene = this._scenes[i];
                scene.emit(e);
            }
        },

        preload: function(assets) {
            var a, name;

            if( !adun.isArray(assets) ) {

                if( adun.isPlainObject(assets) ) {

                    a = [];

                    for( name in assets ) {
                        if( adun.has(assets, name) ) {
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

        load: function(src, name, callback, onerror) {
            var assetName, tmpCallback, ext;

            // name이 string이라면 블록에 진입
            if( adun.isString(name) ) {

                assetName = name;
                callback = callback || function() { };
                onerror = onerror || function() { };

            } else {

                assetName = src;
                tmpCallback = callback;
                callback = arguments[1] || function() { };
                onerror = tmpCallback || function() { };

            }

            ext = adun.findExtention(src);

            return adun.Deferred.next(function() {
                var d = new adun.Deferred();

                var _callback = function(e) {
                    d.call(e);
                    callback.call(this, e);
                };

                var _onerror = function(e) {
                    d.fail(e);
                    onerror.call(this, e);
                };

                if( adun.ENV.IMAGE.indexOf(ext) !== -1 ) {

                    adun.Heart.instance.assets[assetName] = adun.Surface.load(src, _callback, _onerror);

                } else if( adun.ENV.SOUND.indexOf(ext) !== -1 ) {

                    adun.Heart.instance.assets[assetName] = adun.Sound.load(src, 'audio/' + ext, _callback, _onerror);

                } else {
                    throw new Error('cannot this asset ' + ext);
                }

                return d;
            });
        },

        start: function(deferred) {

            var onloadTimeSetter = function() {
                this.frame = 0;
                this.removeEventListener(adun.Event.LOAD, onloadTimeSetter);
            };

            this.on(adun.Event.LOAD, onloadTimeSetter);

            this.currentTime = adun.getTime();

            this.running = true;

            this.ready = true;

            if( !this._activated ) {

                this._activated = true;

            }

            this._requestNextFrame(0);

            var ret = this._requestPreload().next(function(arg) {
                Heart.loadingScene.emit(new adun.Event(adun.Event.LOAD));
            });


        },

        _requestPreload: function() {
            var queue = {};
            var loaded, total, loadFunc;

            loaded = 0;
            total = 0;

            loadFunc = function() {
                var e = new adun.Event(adun.Event.PROGRESS);
                e.loaded = ++loaded;
                e.total = total;
                Heart.loadingScene.emit(e);
            };

            this._assets.reverse().forEach(function(asset) {
                var src, name;

                if( adun.isArray(asset) ) {
                    src = asset[0];
                    name = asset[1];
                } else {
                    src = name = asset;
                }

                if( !queue[name] ) {
                    queue[name] = this.load(src, name, loadFunc);
                    total++;
                }

            }, this);

            this.pushScene(this.loadingScene);

            return adun.Deferred.parallel(queue);
        },

        _requestNextFrame: function(delay) {

            if( !this.ready ) {
                return;
            }

            if( this.fps >= 60 || delay <= 16 ) {

                this._calledTime = adun.getTime();

                window.requestAnimationFrame(this._callTick);

            } else {

                setTimeout(function() {

                    var heart = adun.Heart.instance;
                    heart._clledTime = adun.getTime();

                    window.requestAnimationFrame(heart._callTick);

                }, Math.max(0, delay));

            }

        },

        _callTick: function(time) {
            adun.Heart.instance._tick(time);
        },

        _tick: function(time) {

            var e, now, elapsed, nodes, push, node;

            e = new adun.Event(adun.Event.ENTER_FRAME);

            now = adun.getTime();

            elapsed = e.elapsed = now - this.currentTime;

            this.currentTime = now;

            this.atualFps = elapsed > 0 ? (1000 / elapsed) : 0;


            nodes = this.currentScene.childNodes.slice();

            while( nodes.length ) {
                node = nodes.pop();
                node.age ++;
                node.emit(e);

                if( node.childNodes ) {
                    Array.prototype.push.apply(nodes, node.childNodes);
                }
            }

            this.currentScene.age ++;
            this.currentScene.emit(e);

            this.emit(e);

            this.emit(new adun.Event(adun.Event.EXIT_FRAME));

            this.frame ++;


            now = adun.getTime();

            this._requestNextFrame(1000 / this.fps - (now - this._calledTime));
        },

        getTime: function() {
            return adun.getTime();
        },

        pump: function(fn) {
            this.onload = fn;
        },

        stop: function() {
            this.ready = false;
            this.running = false;
        },

        // frame은 업데이트되지만, input은 업데이트되지 않는다.
        pause: function() {
            this.ready = false;
        },

        debug: function() {
            this._debug = true;
            return this.start();
        },

        resume: function() {
            if( this.ready ) {
                return;
            }

            this.currentTime = adun.getTime();
            this.ready = true;
            this.running = true;
            this._requestNextFrame(0);
        },

        pushScene: function(scene) {

            this._element.appendChild(scene._element);

            if( this.currentScene ) {
                this.currentScene.emit(new adun.Event(adun.Event.EXIT));
            }

            this.currentScene = scene;
            this.currentScene.emit(new adun.Event(adun.Event.ENTER));

            return this._scenes.push(scene);
        },

        popScene: function() {

            if(this.currentScene === this.rootScene ) {
                return this.currentScene;
            }

            this._element.removeChild(this.currentScene._element);

            this.currentScene.emit(new adun.Event(adun.Event.EXIT));
            this.currentScene = this._scenes[this._scenes.length - 2];
            this.currentScene.emit(new adun.Event(adun.Event.ENTER));

            return this._scenes.pop();
        },

        replaceScene: function(scene) {
            this.popScene();
            return this.pushScene(scene);
        },

        removeScene: function(scene) {
            if(this.currentScene == scene) {
                return this.popScene();
            } else {
                var i = this._scenes.indexOf(scene);
                if( i !== -1 ) {
                    this._scenes.splice(i, 1);
                    this._element.removeChild(_scene._element);
                    return scene;
                } else {
                    return null;
                }
            }
        },

        _buttonListener: function(e) {
            this.currentScene.emit(e);
        },

        keybind: function(key, button) {
            this.keyboardInputManager.keybind(key, button);
            this.on(button + 'buttondown', this._buttonListener);
            this.on(button + 'buttonup', this._buttonListener);
        },

        keyunbind: function(key) {
            var button = this._keybind[key];
            this.keyboardInputManager.keyunbind(key);
            this.removeEventListener(button + 'buttondown', this._buttonListener);
            this.removeEventListener(button + 'buttonup', this._buttonListener);

            return this;
        },

        changeButtonState: function(button, bool) {
            this.keyboardInputManager.changeState(button, state);
        },

        getElapsedTime: function() {
            return this.frame / this.fps;
        }

    });

    adun.Heart.instance = null;

})();

// #Node
(function() {
    'use strict';

    // 씬 안에서 보여지는 모든 객체의 부모
    var Node = adun.Node = adun.Class({
        extend: adun.EventTarget,
        TYPE: 'Node',

        init: function() {
            this.super();

            this._dirty = false;

            this._matrix = [1, 0, 0, 1, 0, 0];

            this._x = 0;
            this._y = 0;
            this._offsetX = 0;
            this._offsetY = 0;

            // Event.ENTER_FRAME 이벤트마다 1씩 증가한다.(= 프레임마다)
            this.age = 0;

            this.parentNode = null;

            this.scene = null;
        },

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
        },

        moveTo: function(x, y) {
            this.x = x;
            this.y = y;
        },

        moveBy: function(x, y) {
            this.x += x;
            this.y += y;
        },

        remove: function() {
            if( this.parentNode ) {
                this.parentNode.removeChild(this);
            }

            if( this.childNodes ) {
                var i, childNodes = this.childNodes.slice();
                for( i = childNodes.length -1; i > 0; --i ) {
                    childNodes[i].remove();
                }
            }

            this.clearEventListener();
        },

        _updateCoordinate: function() {
            var node, tree, parent, scene, matrix, stack,
            mat, newmat, i, len, ox, oy, vec;

            node = this;
            tree = [node];
            parent = node.parentNode;
            scene = this.scene;

            while( parent && node._dirty ) {
                tree.unshift(parent);

                node = node.parentNode;
                parent = node.parentNode;
            }

            mat = [];
            matrix = adun.Matrix.instance;
            stack = matrix.stack;

            stack.push(tree[0]._matrix);

            for( i = 1, len = tree.length; i < 1; ++i ) {
                node = tree[i];

                mat = matrix.makeTransformMatrix(node);
                newmat = matrix.multiply(stack[stack.length -1], mat);
                noe._matrix = newmat;

                stack.push(newmat);

                ox = (adun.isNumber(node._originX)) ? node._originX : nodw._width / 2 || 0;
                oy = (adun.isNumber(node._originY)) ? node._originY : nodw._height / 2 || 0;

                vec = [ox, oy];
                vec = matrix.multiplyVec(newmat, vec);

                node._offsetX = vec[0] - ox;
                node._offsetY = vec[1] - oy;

                node._dirty = false;
            }

            matrix.reset();

        }
    });

})();

// #Entity
(function() {
    'use strict';

    var Entity = adun.Entity = adun.Class({
        extend: adun.Node,
        TYPE: 'Entity',

        init: function() {
            this.super();

            //var heart = adun.Heart.instance;

            this._rotation = 0;
            this._scaleX = 1;
            this._scaleY = 1;

            this._clickEnabled = true;
            this._clipping = false;

            this._originX = null;
            this._originY = null;

            this._width = 0;
            this._width = 0;
            this._height = 0;
            this._backgroundColor = null;
            this._debugColor = '#0000ff';
            this._opacity = 1;
            this._visible = true;
            this._buttonMode = null;


            this._style = {};
            this._styleStatus = {};

            this._isContainedInCollection = false;

            this.compositeOperation = null;

            this.buttonMode = null;

            this.buttonPressed = null;

            this.enableCollection();
        },

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
            set: function(height) {
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
                this._opacity = parseFloat(opacity);
            }
        },

        visible: {
            get: function() {
                return this._visible;
            },
            set: function(visible) {
                this._visible = visible;
            }
        },

        scale: function(x, y) {
            this._scaleX = x;
            this._scaleY = (y != null) ? y : x;
            this._drity = true;
        },

        // 사각형 충돌
        intersect: function(other) {
            if( other instanceof adun.Entity ) {

                return this._intersectOne(other);

            } else if( adun.isFunction(other) && other.collection ) {

                return _intersectBetweenClassAndInstace(other, this);

            }

            return false;
        },



        _intersectOne: function(other) {
            if( this._dirty ) {
                this._updateCoordinate();
            }
            if( other._dirty ) {
                other._updateCoordinate();
            }

            return (this._offsetX < other._offsetX + other.width) && (other._offsetX < this._offsetX + this.width) &&
                   (this._offsetY < other._offsetY + other.height) && (other._offsetY < this._offsetY + this.height);
        },

        // 거리 충돌
        within: function(other, distance) {
            if( this._dirty ) {
                this._updateCoordinate();
            }
            if( other._dirty ) {
                other._updateCoordinate();
            }

            if( distance == null ) {
                distance = (this.width + this.height + other.width + other.height) / 4;
            }

            var x, y;

            x = this._offsetX - other._offsetX + (this.width - other.width) / 2;
            y = this._offsetY - other._offsetY + (this.height - other.height) / 2;

            return x * x + y * y < distance * distance;
        },

        enableCollection: function() {
            this.on(adun.Event.ADDED_TO_SCENE, this._addSelftToCollection);
            this.on(adun.Event.REMOVED_FROM_SCENE, this._removeSelftToCollection);

            if( this.scene ) {
                this._addSelftToCollection();
            }
        },

        disableCollection: function() {
            this.removeEventListenr(adun.Event.ADDED_TO_SCENE, this._addSelftToCollection);
            this.removeEventListenr(adun.Event.REMOVED_FROM_SCENE, this._removeSelftToCollection);

            if( this.scene ) {
                this._removeSelftToCollection();
            }
        },

        clearEventListener: function() {
            this.super();
            if( this.scene ) {
                this._removeSelftToCollection();
            }
        },

        getPrototype: function() {

            return Object.getPrototypeOf(this);

        },

        _addSelftToCollection: function() {
            if( this._isContainedInCollection ) {
                return;
            }

            var prototype = this.getPrototype();

        //    prototype._collectionTarget.forEach(function(c) {
        //        c.collection.push(this);
        //    }, this);

            this._isContainedInCollection = true;
        },

        _removeSelftToCollection: function() {
            if( !this._isContainedInCollection ) {
                return;
            }

            var i, prototype = this.getPrototype();

            prototype._collectionTarget.forEach(function(c) {
                i = c.collection.indexOf(this);

                if( i !== -1 ) {
                    c.collection.splice(i, 1);
                }
            }, this);

            this._isContainedInCollection = false;
        },

        getBoundingRect: function() {
            var w, h, mat;

            w = this.width || 0;
            h = this.height || 0;
            mat = this._matrix;

            var m11w = mat[0] * w, m12w = mat[1] * w,
                m21h = mat[3] * h, m22h = mat[4] * h,
                mdx  = mat[2]    , mdy  = mat[5];

            var xw = [mdx, m11w + mdx, m21h + mdx, m11w + m21h + mdx].sort(function(a, b) { return a - b ; });
            var yh = [mdy, m12w + mdy, m22h + mdy, m12w + m22h + mdy].sort(function(a, b) { return a - b ; });

            return {
                left: xw[0],
                top: yh[0],
                width: xw[3] - xw[0],
                height: yh[3] - yh[0]
            };
        },

        getOrientedBoundingRect: function() {
            var w, h, mat;

            w = this.width || 0;
            h = this.height || 0;
            mat = this._matrix;

            var m11w = mat[0] * w, m12w = mat[1] * w,
                m21h = mat[3] * h, m22h = mat[4] * h,
                mdx  = mat[2]    , mdy  = mat[5];

            return {
                leftTop: [ mdx, mdy ],
                rightTop: [ m11w + mdx, m12w + mdy ],
                leftBottom: [ m21h + mdx, m22h + mdy ],
                rightBottom: [ m11w + m21h + mdx, m12w + m22h + mdy ]
            };
        }

    });


    function _intersectBetweenClassAndInstace(Class, instance) {
        var c, i, len, ret = [];

        for( c = 0, len = Class.collection.length; i < len; ++i ) {
            c = Class.collection[i];

            if( instance._intersectOne(c) ) {
                ret.push(c);
            }
        }

        return ret;
    }


})();

// #Map
(function() {
    'use strict';

    var Map = adun.Map = adun.Class({
        extend: adun.Entity,
        TYPE: 'Map',

        init: function(tileWidth, tileHeight) {
            this.super();

            var heart = adun.Heart.instance;

            this.surface = new adun.Surface(heart.width, heart.height);

            var canvas = this.surface._element;
            canvas.style.position = 'absolute';
            canvas.width = heart.width;
            canvas.height = heart.height;

            this._context = canvas.getContext('2d');

            this._tileWidth = tileWidth || 0;
            this._tileHeight = tileHeight || 0;

            this._iamge = null;

            this.data = [[[]]];

            this._dirty = false;

            this._tight = false;

            this.clickEnabled = false;

            this.collisionData = null;

            this._listeners[adun.Event.RENDER] = null;
            this.on(adun.Event.RENDER, function() {

                if( this._dirty ) {
                    this._previousOffsetX = this._previousOffsetY = null;
                }
            });

        },

        image: {
            get: function() {
                return this._image;
            },
            set: function(image) {
                this._image = image;
                this.dirty = true;
            }
        },

        tileWidth: {
            get: function() {
                return this._tileWidth;
            },
            set: function(tileWidth) {
                if( this._tileWidth !== tileWidth ) {
                    this._tileWidth = tileWidth;
                    this._dirty = true;
                }
            }
        },

        tileHeight: {
            get: function() {
                return this._tileHeight;
            },
            set: function(tileHeight) {
                if( this._tileHeight !== tileHeight ) {
                    this._tileHeight = tileHeight;
                    this._dirty = true;
                }
            }
        },

        width: {
            get: function() {
                return this._tileWidth * this._data[0][0].length;
            }
        },

        height: {
            get: function() {
                return this._tileHeight * this._data[0].length;
            }
        },

        loadData: function(data) {
            var i, l, len, llen, x, y, c;

            this._data = Array.prototype.slice.apply(arguments);

            this._dirty = true;

            this._tight = false;

            for( i = 0, l = this._data.length; i < l; ++i ) {
                c = 0;
                data = this._data[i];

                for( y = 0, len = data.length; y < len; ++y ) {
                    for( x = 0, llen = data[y].length; x < llen; ++x ) {
                        if( data[y][x] >= 0 ) {
                            c++;
                        }
                    }
                }

                if( (c / (data.length * data[0].length)) > 0.2 ) {
                    this._tight = true;
                    break;
                }
            }
        },

        checkTile: function(x, y) {
            if( x < 0 || this.width <= x || y < 0 || this.height <= y ) {
                return false;
            }

            var width, height, tileWidth, tileHeight, data;

            width = this._iamge.width;
            height = this._iamge.height;

            tileWidth = this._tileWidth || width;
            tileHeight = this._tileHeight || height;

            x = x / tileWidth | 0;
            y = y / tileHeight | 0;

            data = this._data[0];

            return data[y][x];
        },

        hitTest: function(x, y) {
            if( x < 0 || this.width <= x || y < 0 || this.height <= y ) {
                return false;
            }

            var width, height, tileWidth, tileHeight, i, len, data, n;

            width = this._image.width;
            height = this._image.height;

            tileWidth = this._tileWidth || width;
            tileHeight = this._tileHeight || height;

            x = x / tileWidth | 0;
            y = y / tileHeight | 0;

            if( this.collisionData != null ) {
                return this.collisionData[y] && !!this.collisionData[y][x];
            } else {
                for( i = 0, len = this._data.length; i < len; ++i ) {
                    data = this._data[i];

                    if( data[y] != null && (n = data[y][x]) != null && 0 <= n && n < (width / tileWidth | 0) * (height / tileHeight | 0) ) {
                        return true;
                    }
                }
            }

            return false;
        },

        redraw: function(x, y, width, height) {    // 0, 0, heart.width, heart.height
            if( this._image == null ) {
                return;
            }

            var image, tileWidth, tileHeight, dx, dy;

            image = this._image;
            tileWidth = this._tileWidth;
            tileHeight = this._tileHeight;
            dx = -this._offsetX;
            dy = -this._offsetY;

            var row = image.width / tileWidth | 0;
            var col = image.height / tileHeight | 0;
            var left = Math.max((x + dx) / tileWidth | 0, 0);
            var top = Math.max((y + dy) / tileHeight | 0, 0);
            var right = Math.ceil((x + dx + width) / tileWidth);
            var bottom = Math.ceil((y + dy + height) / tileHeight);

            var source = image._element;
            var context = this._context;
            var canvas = context.canvas;

            context.clearRect(x, y, width, height);

            for( var i = 0, len = this._data.length; i < len; ++i ) {

                var data = this._data[i];
                var r = Math.min(right, data[0].length);
                var b = Math.min(bottom, data.length);

                for( y = top; y < b; ++y ) {
                    for( x = left; x < r; ++x ) {
                        var n = data[y][x];

                        if( 0 <= n && n < row * col ) {
                            var sx = (n % row) * tileWidth;
                            var sy = (n / row | 0) * tileHeight;
                            context.drawImage(
                                source,
                                sx, sy, tileWidth, tileHeight,
                                x * tileWidth - dx, y * tileHeight - dy, tileWidth, tileHeight
                            );
                        }
                    }
                }
            }
        },

        updateBuffer: function() {
            if( this._visible === undefined || this._visible ) {
                var heart = adun.Heart.instance;

                if( this._dirty || this.previousOffsetX == null) {

                    this.redraw(0, 0, heart.width, heart.height);

                } else if( this.offsetX !== this._previousOffsetX || this._offsetY !== this._previousOffsetY ) {
                    if(this._tight) {
                                                                // 오른쪽으로 한칸 이동했다고 친다 (타일셋은 30px)
                        var x  = -this._offsetX;                // 현재 -60
                        var y  = -this._offsetY;
                        var px = -this._previousOffsetX;        // 이전 -30
                        var py = -this._previousOffsetY;
                        var w1 = x - px + heart.width;          // (-60 + 33)   = -30 + 300 = 270
                        var w2 = px - x + heart.width;          // (-30 + 60)   =  30 + 300 = 330
                        var h1 = y - py + heart.height;
                        var h2 = py - y + heart.height;

                        if( w1 > this._tileWidth && w2 > this._tileWidth && h1 > this._tileHeight && h2 > this._tileHeight ) {
                            var sx, sy, dx, dy, sw, sh;

                            if( w1 < w2 ) { // 270 < 330 true
                                sx = 0;
                                dx = px - x;
                                sw = w1;
                            } else {
                                sx = x - px;
                                dx = 0;
                                sw = w2;
                            }

                            if( h1 < h2 ) {
                                sy = 0;
                                dy = py - y;
                                sh = h1;
                            } else {
                                sy = y - py;
                                dy = 0;
                                sh = h2;
                            }

                            if( heart._buffer == null ) {
                                heart._buffer = document.createElement('canvas');
                                heart._buffer.width = this._context.canvas.width;
                                heart._buffer.height = this._context.canvas.width;
                            }

                            var context = heart._buffer.getContext('2d');
                            context.cleartRect(0, 0, sw, sh);
                            context.drawImage(this._context.canvas,
                                              sx, sy, sw, sh,
                                              0, 0, sw, sh);
                            context = this._context;
                            context.clearRect(dx, dy, sw, sh);
                            context.drawImage(heart._buffer,
                                              0, 0, sw, sh,
                                              dx, dy, sw, sh);

                        }


                    }
                }
            }
        },

        cvsRender: function(ctx) {
            if( this.width !== 0 && this.height !== 0 ) {
                var heart = adun.Heart.instance;
                this.updateBuffer();
                ctx.save();
                //ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.drawImage(this._context.canvas, 0, 0, heart.width, heart.height);
                ctx.restore();
            }
        }

    });
})();

// #Sprite
(function() {
    'use strict';

    var Sprite = adun.Sprite = adun.Class({
        extend: adun.Entity,
        TYPE: 'Sprite',

        init: function(width, height) {
            this.super();

            this.width = width;
            this.height = height;

            this._image = null;
            this._debugColor = '#ff0000';

            this._frameLeft = 0;
            this._frameTop = 0;
            this._frame = 0;
            this._frameSequence = null;
        },

        image: {
            get: function() {
                return this._image;
            },
            set: function(image) {
                if( image == null ) {
                    throw new Error('image is undefined');
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

        height: {
            get: function() {
                return this._height;
            },
            set: function(height) {
                this._height = height;
                this._computeFramePosition();
                this._dirty = true;
            }
        },

        frame: {
            get: function() {
                return this._frame;
            },
            set: function(frame) {
                if( ((this._frameSequence == null) && (this._frame == frame)) || this._deepCompareToPreviousFrame(frame) ) {
                    return;
                }

                if( adun.isArray(frame) ) {
                    this._frameSequence = frame;
                } else {
                    this._frameSequence = null;
                    this._frame = frame;
                    this._computeFramePosition();
                }
            }
        },

        _frameSequence: {
            get: function() {
                return this.__frameSequence;
            },

            set: function(frameSequence) {
                if( frameSequence && !this.__frameSequence ) {

                    this.on(adun.Event.ENTER_FRAME, this._rotateFrameSequence);

                } else if( !frameSequence && this._frameSequence ) {

                    this.removeEventListener(adun.Event.ENTER_FRAME, this._rotateFrameSequence);

                }

                if( frameSequence ) {
                    this.__frameSequence = frameSequence.slice();
                    this._originalFrameSequence = frameSequence.slice();
                    this._rotateFrameSequence();
                } else {
                    this.__frameSequence = null;
                    this._originalFrameSequence = null;
                }
            }
        },

        _computeFramePosition: function() {
            var col, image = this._image;

            if( image != null ) {
                col = image.width / this._width | 0;    // => or 연산자 (정수 반환)
                this._frameLeft = (this._frame % col | 0) * this._width;
                this._frameTop = (this._frame / col | 0) * this._height % image.height;
            }
        },

        _deepCompareToPreviousFrame: function(frameArray) {
            if( frameArray === this._originalFrameSequence ) {
                return true;
            }

            if( frameArray == null || this._originalFrameSequence == null ) {
                return false;
            }

            if( frameArray.length !== this._originalFrameSequence ) {
                return false;
            }

            for( var i = 0, len = frameArray.length; i < len; ++i ) {
                if( frameArray[i] !== this._originalFrameSequence[i] ) {
                    return false;
                }
            }

            return true;
        },

        _rotateFrameSequence: function() {
            var nextFrame, frameSequence = this._frameSequence;

            if( frameSequence && frameSequence.length !==0 ) {
                nextFrame = frameSequence.shift();

                if( nextFrame === null ) {

                    this._frameSequence = null;
                    this.emit(new adun.Event(adun.Event.ANIMATION_END));

                } else {

                    this._frame = nextFrame;
                    this._computeFramePosition();
                    frameSequence.push(nextFrame);  // 뺀걸 맨 마지막에 넌다.

                }
            }
        },

        cvsRender: function(ctx) {
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

// #Label
(function() {
    'use strict';

    var Label = adun.Label = adun.Class({
        extend: adun.Entity,
        TYPE: 'Label',

        init: function(text) {
            this.super();

            this.text = text || '';
            this.width = 300;
            this.font = '14px serif';
            this.textAlign = 'left';

            this._debugColor = 'green';
        },

        width: {
            get: function() {
                return this._width;
            },

            set: function(width) {
                this._width = width;
                this._dirty = true;

                this.updateBoundArea();
            }
        },

        text: {
            get: function() {
                return this._text;
            },

            set: function(text) {
                text = '' + text;
                if( this._text === text ) {
                    return;
                }

                this._text = text;
                text = text.replace(/<br ?\/?>/gi, '<br/>');
                this._splitText = text.split('<br/>');
                this.updateBoundArea();

                for( var i = 0, len = this._splitText.length; i < len; ++i ) {
                    text = this._splitText[i];
                    var metrics = this.getMetrics(text);
                    this._splitText[i] = {};
                    this._splitText[i].text = text;
                    this._splitText[i].height = metrics.height;
                    this._splitText[i].width = metrics.width;
                }
            }
        },

        textAlign: {
            get: function() {
                return this._style['text-align'];
            },

            set: function(textAlign) {
                this._style['text-align'] = textAlign;
                this.updateBoundArea();
            }
        },

        font: {
            get: function() {
                return this._style.font;
            },

            set: function(font) {
                this._style.font = font;
                this.updateBoundArea();
            }
        },

        color: {
            get: function() {
                return this._style.color;
            },

            set: function() {
                this._style.color = color;
            }
        },

        getMetrics: function(text) {
            var ret, div, name, width, height;

            ret = {};

            if( document.body ) {
                div = document.createElement('div');
                for( name in this._style ) {
                    if ( name !== 'width' && name !== 'height' ) {
                        div.style[name] = this._style[name];
                    }
                }

                text = text || this._text;
                div.innerHTML = text.replace(/ /g, '$nbsp;');
                div.style.whiteSpace = 'noWrap';
                div.style.lineHeight = 1;

                document.body.appendChild(div);

                var computedStyle = getComputedStyle(div);
                ret.height = parseInt(computedStyle.height, 10) +1;
                div.style.position = 'absolute';
                ret.width = parseInt(computedStyle.width, 10) + 1;

                document.body.removeChild(div);
            } else {
                ret.width = this.width;
                ret.height = this.height;
            }

            return ret;
        },

        updateBoundArea: function() {
            var metrics = this.getMetrics();

            this._boundWidth = metrics.width;
            this._boundHiehgt = metrics.height;

            if( this.textAlign == 'center') {
                this._boundOffset = (this.width - this._boundWidth) / 2;
            } else if( this.textAlign == 'right' ) {
                this._boundOffset = this.width - this._boundWidth;
            } else {
                this._boundOffset = 0;
            }
        },

        detectRender: function(ctx) {
            ctx.fillRect(this._boundOffset, 0, this._boundWidth, this.boundHeight);
        },

        cvsRender: function(ctx) {
            var x, y = 0;
            var labelWidth = this.width;
            var charWidth, amount, line, text, c, buf, increase, len, bufWidth;

            if( this._splitText ) {
                ctx.textBaseline = 'top';
                ctx.font = this.font;
                ctx.fillStyle = this.color || '#000000';

                charWidth = ctx.measureText(' ').width;

                amount = labelWidth / charWidth;

                for( var i = 0, l = this._splitText.length; i < l; ++i) {
                    line = this._splitText[i];
                    text = line.text;
                    c = 0;

                    while( text.length > c + amount || ctx.measureText(text.slice(c, c + amount)).width > labelWidth) {
                        buf = '';
                        increase = amount;

                        len = 0;

                        while( increase > 0 ) {
                            if( ctx.measureText(buf).width < labelWidth ) {
                                len += increase;
                                buf = text.slice(c, c + len);
                            } else {
                                len -= increase;
                                buf = text.slice(c, c + len);
                            }

                            increase = increase / 2 | 0;
                        }

                        ctx.fillText(buf, 0, y);
                        y += line.height - 1;
                        c += len;
                    }

                    buf = text.slice(c, c + text.length);

                    if( this.textAlign == ' center' ) {
                        x = (labelWidth - ctx.measureText(buf).width) / 2;
                    } else if( this.textAlign == 'right' ) {
                        x = labelWidth - ctx.measureText(buf).width;
                    } else {
                        x = 0;
                    }

                    ctx.fillText(buf, x, y);
                    y += line.height -1;
                }
            }
        }



    });
})();

// #Surface
(function() {
    'use strict';

    var Surface = adun.Surface = adun.Class({
        extend: adun.EventTarget,
        TYPE: 'Surface',

        init: function(width, height) {
            this.super();
            this.width = Math.ceil(width);
            this.height = Math.ceil(height);

            this.context = null;

            this._element = document.createElement('canvas');
            this._element.width = width;
            this._element.height = height;
            this._element.style.position = 'absolute';

            this.context = this._element.getContext('2d');
            adun.ENV.CANVAS_METHODS.forEach(function(name) {

                var method = this.context[name];

                this.context[name] = function() {
                    method.apply(this, arguments);
                    this._dirty = true;
                };

            }, this);

        },

        getPixel: function(x, y) {
            return this.context.getImageData(x, y, 1, 1);
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
            image = image._element;

            if( arguments.length ==- 1 ) {
                this.context.drawImage(image, 0, 0);
            } else {
                var args = arguments;
                args[0] = image;

                this.context.drawImage.apply(this.context, args);
            }
        },

        clone: function() {
            var clone = new adun.Surface(this.width, this.height);
            clone.draw(this);

            return clone;
        },

        toDateURL: function() {
            var src = this._element.src;

            if( src ) {

                if( src.slice(0, 5) === 'data:' ) {
                    return src;
                } else {
                    return this.clone().toDateURL();
                }

            } else {

                return this._element.toDateURL();
            }
        }
    });

    Surface.load = function(src, callback, onerror) {
        var image, surface;

        image = new Image();

        surface = new adun.Surface('!ADUN.INIT');
        surface._element = image;
        surface.context = null;

        adun.EventTarget.prototype.init.call(surface);

        surface.on(adun.Event.LOAD, callback);
        surface.on(adun.Event.ERROR, onerror);

        image.onerror = function() {
            var e = new adun.Event(adun.Event.ERROR);
            e.message = 'Cannot load an asset: ' + image.src;

            adun.Heart.instance.emit(e);
            surface.emit(e);
        };

        image.onload = function() {
            surface.width = image.width;
            surface.height = image.height;

            surface.emit(new adun.Event(adun.Event.LOAD));
        };

        image.src = src;

        return surface;
    };

    Surface._staticCanvas2DContext = document.createElement('canvas').getContext('2d');

    Surface._getPattern = function(surface, force) {

        if( !surface._pattern || force ) {
            surface._pattern = this._staticCanvas2DContext.createPattern(surface._element, 'repeat');
        }

        return surface._pattern;
    };

})();

// #Group
(function() {
    'use strict';

    var Group = adun.Group = adun.Class({
        extend: adun.Node,
        TYPE: 'Group',

        init: function() {
            this.super();

            this.childNodes = [];

            this._rotation = 0;
            this._scaleX = 0;
            this._scaleY = 0;
            this.__dirty = false;

            [adun.Event.ADDED_TO_SCENE, adun.Event.REMOVED_FROM_SCENE]
                .forEach(function(event) {
                    this.on(event, function(e) {
                        this.childNodes.forEach(function(child) {
                            child.scene = this.scene;
                            child.emit(e);
                        });
                    });
                }, this);

        },

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
                return this._scaleX;
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
                return this._scaleY;
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
        },

        addChild: function(node) {
            if( node.parentNode ) {
                node.parentNode.removeChild(node);
            }

            this.childNodes.push(node);
            node.parentNode = this;

            var childAdded = new adun.Event(adun.Event.CHILD_ADDED);
            childAdded.node = node;
            childAdded.next = null;

            this.emit(childAdded);

            node.emit(new adun.Event(adun.Event.ADDED));

            if( this.scene ) {
                node.scene = this.scene;
                var addedToScene = new adun.Event(adun.Event.ADDED_TO_SCENE);
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

                var childAdded = new adun.Event(adun.Event.CHILD_ADDED);
                childAdded.node = node;
                childAdded.next = reference;

                this.emit(childAdded);
                node.emit(new adun.Event(adun.Event.ADDED));

                if( this.scene ) {
                    node.scene = this.scene;
                    var addedToScene = new adun.Event(adun.Event.ADDED_TO_SCENE);
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
                node.parentNode = null;

                var childRemoved = new adun.Event(adun.Event.CHILD_REMOVED);
                childRemoved.node = node;

                this.emit(childRemoved);
                node.emit(new adun.Event(adun.Event.REMOVED));

                if( this.scene ) {
                    node.scene = null;

                    var removedFromScene = new adun.Event(adun.Event.REMOVED_FROM_SCENE);
                    node.emit(removedFromScene);
                }
            }
        }
    });

})();

// #Scene
(function() {
    'use strict';

    var Scene = adun.Scene = adun.Class({
        extend: adun.Group,
        TYPE: 'Scene',

        init: function() {
            this.super();

            var heart = adun.Heart.instance;

            this.scene = this;

            this._backgroundColor = null;

            this._element = document.createElement('div');
            this._element.style.position = 'absolute';
            this._element.style.overflow = 'hidden';
            this._element.style[adun.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0 0';

            this._layers = {};
            this._layerPriorty = [];

            this.on(adun.Event.CHILD_ADDED, this._onchildadded);
            this.on(adun.Event.CHILD_REMOVED, this._onchildremoved);
            this.on(adun.Event.ENTER, this._onenter);
            this.on(adun.Event.EXIT, this._onexit);

            var self = this;

            this._dispatchExitframe = function() {
                var layer;

                for( var prop in self._layers ) {

                    layer = self._layers[prop];
                    layer.emit(new adun.Event(adun.Event.EXIT_FRAME));
                }
            };

            this.on(adun.Event.HEART_RESIZE, this._onHeartResize);

            this._onHeartResize(heart);

        },

        x: {
            get: function() {
                return this._x;
            },
            set: function(x) {
                this._x = x;
                for( var type in this._layers ) {
                    console.log(type)

                    this._layers[type].x = x;
                }
            }
        },

        y: {
            get: function() {
                return this._y;
            },
            set: function(y) {
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

        remove: function() {
            this.clearEventListener();

            while( this.childNodes.length > 0 ) {
                this.childNodes[0].remove();
            }

            return adun.Heart.instance.removeScene(this);
        },

        _determineEventTarget: function(e) {
            var layer, target, i;

            for( i = this._layerPriorty.length -1; i >= 0; --i ) {
                layer = this._layers[this._layerPriorty[i]];
                target = layer._determineEventTarget(e);

                if( target ) {
                    break;
                }
            }

            if( !target ) {
                target = this;
            }

            return target;
        },

        _onHeartResize: function(e) {
            this._element.style.width = e.width + 'px';
            this.width = e.width;
            this._element.style.height = e.height + 'px';
            this.height = e.height;
            this._element.style[adun.ENV.VENDOR_PREFIX + 'Transform'] = 'scale(' + e.scale + ')';

            for( var type in this._layers ) {
                this._layers[type].emit(e);
            }
        },

        addLayer: function(type, i) {

            var heart = adun.Heart.instance;

            if( this._layers[type] ) {
                return;
            }

            var layer = new adun[type + 'Layer']();

            if( heart.currentScene === this ) {
                layer._startRendering();
            }

            this._layers[type] = layer;

            var element = layer._element;

            if( adun.isNumber(i) ) {           // if 'Dom' the i = 1  if else 'Canvas' i = 0
                var nextSibling = this._element.childNodes[i];

                if( nextSibling ) {

                    this._element.insertBefore(element, nextSibling);
                } else {
                    this._element.appendChild(element);
                }

                this._layerPriorty.splice(i, 0, type);

            } else {
                this._element.appendchild(element);
                this._layerPriorty.push(type);
            }

            layer._scene = this;
        },

        _onchildadded: function(e) {
            var child, next, target, i;

            child = e.node;
            next = e.next;

            if( child._element ) {
                target = 'Dom';          // Surface || CanvasLayer
                i = 1;
            } else {
                target = 'Canvas';
                i = 0;
            }

            if( !this._layers[target] ) {
                this.addLayer(target, i);
            }

            child._layer = this._layers[target];
            this._layers[target].insertBefore(child, next);
            child.parentNode = this;

        },

        _onchildremoved: function(e) {
            var child = e.node;
            child._layer.removeChild(child);
            child._layer = null;
        },

        _onenter: function() {
            for(var type in this._layers) {
                this._layers[type]._startRendering();
            }

            adun.Heart.instance.on(adun.Event.EXIT_FRAME, this._dispatchExitframe);
        },

        _onexit: function() {
            for(var type in this._layers) {
                this._layers[type]._stopRendering();
            }

            adun.Heart.instance.removeEventListener(adun.Event.EXIT_FRAME, this._dispatchExitframe);
        }

    });
})();



// #CanvasScene
(function() {
    'use strict';

    var CanvasScene = adun.CanvasScene = adun.Class({
        extend: adun.Scene,
        TYPE: 'CanvasScene',

        init: function() {
            this.super();

            this.addLayer('Canvas');
        },

        _determineEventTarget: function(e) {
            var target = this._layers.Canvas._determinEventTarget(e);

            if( !target ) {
                target = this;
            }

            return target;
        },

        _onchildadded: function(e) {
            var child, next;

            child._layer = this._layers.Canvas;
            this._layers.Canvas.insertBefore(child, next);
        },

        _onenter: function() {

            this._layers.Canvas._startRendering();
            adun.Heart.instance.on(adun.Event.EXIT_FRAME, this._dispatchExitframe);
        },

        _onexit: function() {

            this._layers.Canvas._stopRendering();
            adun.Heart.instance.removeEventListener(adun.Event.EXIT_FRAME, this._dispatchExitframe);
        }
    });
})();



// #DomScene
(function() {
    'use strict';

    var DOMScene = adun.DOMScene = adun.Class({
        extend: adun.Scene,
        TYPE: 'DOMScene',

        init: function() {
            this.super();

            this.addLayer('Dom');
        },

        _determineEventTarget: function(e) {
            var target = this._layers.Dom._determinEventTarget(e);

            if( !target ) {
                target = this;
            }

            return target;
        },

        _onchildadded: function(e) {
            var child, next;

            child._layer = this._layers.Dom;
            this._layers.Dom.insertBefore(child, next);
        },

        _onenter: function() {

            this._layers.Dom._startRendering();
            adun.Heart.instance.on(adun.Event.EXIT_FRAME, this._dispatchExitframe);
        },

        _onexit: function() {

            this._layers.Dom._stopRendering();
            adun.Heart.instance.removeEventListener(adun.Event.EXIT_FRAME, this._dispatchExitframe);
        }
    });
})();

// #LoadingScene
(function() {
    'use strict';

    var LoadingScene = adun.LoadingScene = adun.Class({
        extend: adun.Scene,
        TYPE: 'LoadingScene',

        init: function() {
            this.super();
            this.t = 1;


            this.on(adun.Event.PROGRESS, function(e) {
            });

            this.on(adun.Event.LOAD, function(e) {
                var heart = adun.Heart.instance;

                heart.removeScene(heart.loadingScene);
                heart.emit(new adun.Event(adun.Event.LOAD));
            });
        },

    });
})();

// #DetectColorManager
(function() {
    'use strict';

    var DetectColorManager = adun.DetectColorManager = adun.Class({
        TYPE: 'DetectColorManager',

        init: function(reso, max) {
            this.reference = [];
            this.colorResoultion = reso || 16;
            this.max = max || 1;
            this.capacity = Math.pow(this.colorResoultion, 3);

            for( var i = 1, len = this.capacity; i < len; ++i ) {
                this.reference[i] = null;
            }
        },

        attachDetectColor: function(sprite) {
            var i = this.reference.indexOf(null);

            if( i === -1 ) {
                i = 1;
            }

            this.reference[i] = sprite;

            return this._getColor(i);
        },

        detachDetectColor: function(sprite) {
            var i = this.reference.indexOf(sprite);

            if( i !== -1 ) {
                this.reference[i] = null;
            }
        },

        _getColor: function(n) {
            var C, d;

            C = this.colorResoultion;
            d = C / this.max;

            return [
                parseInt((n / C / C) % C, 10) / d,
                parseInt((n / C) % C, 10) / d,
                parseInt(n % C, 10) / d,
                1.0
            ];
        },

        _decodeDetectColor: function(color, i) {
            i = i || 0;
            var C = this.colorResoultion;

            return ~~(color[i] * C * C * C / 256) + ~~(color[i + 1] * C * C / 256) + ~~(color[i + 2] * C / 256);
        },

        getSpriteByColor: function(color) {
            return this.reference[this._decodeDetectColor(color)];
        },

        getSpriteByColors: function(rgba) {
            var i , len, id, result, score, found;

            score = 0;
            found = {};


            for( i = 0, len = rgba.length; i < len; i += 4 ) {
                id = this._decodeDetectColor(rgba, i);
                found[id] = (found[id] || 0) + 1;
            }

            for( id in found ) {
                if( found[id] > score ) {
                    score = found[id];
                    result = id;
                }
            }

            return this.reference[id];
        }
    });
})();

// #CanvasLayer
(function() {
    'use strict';

    var CanvasLayer = adun.CanvasLayer = adun.Class({
        extend: adun.Group,
        TYPE: 'CanvasLayer',

        init: function() {
            this.super();

            var heart = adun.Heart.instance;

            this._cvsCache = {
                matrix: [1, 0, 0, 1, 0, 0],
                detectColor: '#000000'
            };
            this._cvsCache.layer = this;

            this._element = document.createElement('canvas');
            this._element.style.position = 'absolute';
            this._element.style.left = this._element.style.top = '0px';

            this._detect = document.createElement('canvas');
            this._detect.style.position = 'absolute';
            this._lastDetected = 0;

            this.context = this._element.getContext('2d');
            this._dctx = this._detect.getContext('2d');

            this._setImageSmoothingEnable();

            this._colorManager = new adun.DetectColorManager(16, 256);

            this.width = heart.width;
            this.height = heart.height;

            var __onchildadded= function(e) {
                var child, self, layer, render;

                child = e.node;
                self = e.target;

                if( self instanceof adun.CanvasLayer ) {
                    layer = self._scene._layers.Canvas;
                } else {
                    layer = self.scene._layers.Canvas;
                }


                adun.CanvasLayer._attachCache(child, layer, __onchildadded, __onchildremoved);

                render = new adun.Event(adun.Event.RENDER);

                if( self._dirty ) {
                    self._updateCoordinate();
                }

                child._dirty = true;

                adun.Matrix.instance.stack.push(self._matrix);
                adun.CanvasRenderer.instance.render(layer.context, child, render);
                adun.Matrix.instance.stack.pop(self._matirx);

            };

            var __onchildremoved = function(e) {
                var child, self, layer;

                child = e.node;
                self = e.target;

                if( self instanceof adun.CanvasLayer ) {
                    layer = self._scene._layers.Canvas;
                } else {
                    layer = self.scene._layers.Canvas;
                }

                adun.CanvasLayer._detachCache(child, layer, __onchildadded, __onchildremoved);
            };



            this.on(adun.Event.CHILD_ADDED, __onchildadded);
            this.on(adun.Event.CHILD_REMOVED, __onchildremoved);

            [ adun.Event.CLICK_START, adun.Event.CLICK_MOVE, adun.Event.CLICK_END ].forEach(function(type) {
                this.on(type, function(e) {
                    if( this._scene ) {
                        this._scene.emit(e);
                    }
                });
            }, this);
        },

        width: {
            get: function() {
                return this._width;
            },
            set: function(width) {
                this._width = width;
                this._element.width = this._detect.width = width;
                this._setImageSmoothingEnable();
            }
        },

        height: {
            get: function() {
                return this._height;
            },
            set: function(height) {
                this._height = height;
                this._element.height = this._detect.height = height;
                this._setImageSmoothingEnable();
            }
        },

        addChild: function(node) {

            this.childNodes.push(node);
            node.parentNode = this;

            var childAdded = new adun.Event(adun.Event.CHILD_ADDED);
            childAdded.node = node;
            childAdded.next = null;
            this.emit(childAdded);
            node.emit(new adun.Event(adun.Event.ADDED));
        },

        insertBefore: function(node, reference) {
            var i = this.childNodes.indexOf(reference);

            if( i !== -1 ) {
                this.childNodes.splice(i, 0, node);
                node.parentNode = this;

                var childAdded = new adun.Event(adun.Event.CHILD_ADDED);
                childAdded.node = node;
                childAdded.next = reference;

                this.emit(childAdded);
                node.emit(new adun.Event(adun.Event.ADDED));

            } else {
                this.addChild(node);
            }
        },

        _startRendering: function() {
            this.on(adun.Event.EXIT_FRAME, this._onexitframe);
            this._onexitframe();
        },

        _stopRendering: function() {
            this.removeEventListener(adun.Event.EXIT_FRAME, this._onexitframe);
            this._onexitframe();
        },

        _onexitframe: function() {
            var heart, ctx, render;

            heart = adun.Heart.instance;
            ctx = this.context;
            ctx.clearRect(0, 0, heart.width, heart.height);


            render = new adun.Event(adun.Event.RENDER);
            adun.CanvasRenderer.instance.render(ctx, this, render);
        },

        _setImageSmoothingEnable: function() {
            this._dctx.imageSmoothingEnabled =
                this._dctx.msImageSmoothingEnabled =
                this._dctx.mozImageSmoothingEnabled =
                this._dctx.webkitImageSmoothingEnabled = false;
        },

        _determineEventTarget: function(e) {
            return this._getEntityByPosition(e.x, e.y);
        },

        _getEntityByPosition: function(x, y) {
            var heart, ctx, extra, rgba;

            heart = adun.Heart.instance;
            ctx = this._dctx;

            if( this._lastDetected < heart.frame ) {

                ctx.clearRect(0, 0, this.width, this.height);
                adun.CanvasRenderer.instance.detectRender(ctx, this);
                this._lastDetected = heart.frame;
            }

            extra = adun.ENV.COLOR_DETECTION_LEVEL - 1;
            rgba = ctx.getImageData(x - extra, y - extra, 1 + extra * 2, 1 + extra * 2).data;

            return this._colorManager.getSpriteByColors(rgba);

        }
    });

    CanvasLayer._attachCache = function(node, layer, onchildadded, onchildremoved) {
        var child, i, len;
        if( !node._cvsCache ) {
            node._cvsCache = {};
            node._cvsCache.matrix = [1, 0 ,0 ,1, 0, 0];
            node._cvsCache.detectColor = 'rgba(' + layer._colorManager.attachDetectColor(node) + ')';
            node.addEventListener(adun.Event.CHILD_ADDED, onchildadded);
            node.addEventListener(adun.Event.CHILD_REMOVED, onchildremoved);
        }

        if( node.childNodes ) {
            for( i = 0, len = node.childNodes.length; i < len; ++i ) {
                child = node.childNodes[i];
                adun.CanvasLayer._attachCache(child, layer, onchildadded, onchildremoved);
            }
        }
    };

    CanvasLayer._detachCache = function(node, layer, onchidadded, onchildremoved) {
        var child, i, len;

        if( node._cvsCache ) {

            node.removeEventListener(adun.Event.CHILD_ADDED, onchildadded);
            node.removeEventListener(adun.Event.CHILD_REMOVED, onchildremoved);
            delete node._cvsCache;
        }

        if( node.childNodes ) {
            for( i = 0, len = node.childNodes.length; i < len; ++i ) {
                child = node.childNodes[i];
                adun.CanvasLayer._detachCache(child, layer, onchildadded, onchildremoved);
            }
        }
    };

})();

// #CanvasRenderer
(function() {
    'use strict';

var a = 1;
    var CanvasRenderer = adun.CanvasRenderer = adun.Class({
        TYPE: 'CanvasRenderer',

        render: function(ctx, node, e) {
            var width, height, child;

            ctx.save();

            node.emit(e);

            this.transform(ctx, node);

            if( adun.isUndefined(node._visible) || node._visible ) {

                width = node.width;
                height = node.height;

                if( node.compositeOperation ) {
                    ctx.globalCompositeOperation = node.compositeOperation;
                }

                ctx.globalAlpha = adun.isNumber(node._opacity) ? node._opacity : 1.0;

                if( node._backgroundColor ) {
                    ctx.fillStyle = node._backgroundColor;
                    ctx.fillRect(0, 0, width, height);
                }

                if( node.cvsRender ) {
                    node.cvsRender(ctx);
                }

                if( adun.Heart.instance._debug && node._debugColor ) {
                    ctx.strokeStyle = node._debugColor;
                    ctx.strokeRect(0, 0, width, height);
                }

                if( node._clipping ) {
                    ctx.beginPath();
                    ctx.rect(0, 0, width, height);
                    ctx.clip();
                }

                if( node.childNodes ) {
                    for( var i = 0, len = node.childNodes.length; i < len; ++i ) {
                        child = node.childNodes[i];
                        this.render(ctx, child, e);
                    }
                }
            }

            ctx.restore();

            adun.Matrix.instance.stack.pop();
        },

        detectRender: function(ctx, node, e) {
            var width, height, child;

            if( adun.isUndefined(node._visible) || node._visible ) {

                width = node.width;
                height = node.height;

                ctx.save();
                this.transform(ctx, node);
                ctx.fillStyle = node._cvsCache.detectColor;

                if( node._clickEnabled ) {
                    if( node.detectRender ) {
                        node.detectRender(ctx);
                    } else {
                        ctx.fillRect(0, 0, width, height);
                    }
                }

                if( node._clipping ) {
                    ctx.beginPath();
                    ctx.rect(0, 0, width, height);
                    ctx.clip();
                }

                if( node.childNodes ) {
                    for( var i = 0, len = node.childNodes.length; i < len; ++i ) {
                        child = node.childNodes[i];
                        this.detectRender(ctx, child, e);
                    }
                }

                ctx.restore();

                adun.Matrix.instance.stack.pop();

            }
        },

        transform: function(ctx, node) {
            var matrix, stack, newmat, ox, oy, vec;

            matrix = adun.Matrix.instance;
            stack = matrix.stack;

            if( node._dirty ) {

                node._cvsCache.matrix = matrix.makeTransformMatrix(node);

                newmat = matrix.multiply(stack[stack.length -1], node._cvsCache.matrix);

                node._matrix = newmat;

                ox = adun.isNumber(node._originX) ? node._originX : node._width / 2 || 0;
                oy = adun.isNumber(node._originY) ? node._originY : node._height / 2 || 0;

                vec = matrix.multiplyVec(newmat, [ox, oy]);

                node._offsetX = vec[0] - ox;
                node._offsetY = vec[1] - oy;

                node._dirty = false;
            } else {
                newmat = node._matrix;
            }

            stack.push(newmat);
            ctx.setTransform.apply(ctx, newmat);
        }
    });

    CanvasRenderer.instance = new adun.CanvasRenderer();
})();
