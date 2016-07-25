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


// -----------------------------------
// extend: 상속
// get, set 정의가능
// 메서드 오버라이드 가능
// 메서드 내에서 super로 상위 클래스 참조


var Person = adun.Class({
    TYPE: 'Person',

    init: function(name, id, age) {
        this.name = name;
        this._id = id;
    },
    id: {
        set: function() {},
        get: function() {
            return this._id;
        }
    },
    talk: function() {
        alert('제 이름은 ' + this.name + "입니다.");
    }
});

var Student = adun.Class({
    extend: Person,
    TYPE: 'Student',

    init: function(name, id, age) {
        this.super(name, id);
        this.age = age;
    },
    talk: function() {
        alert('제 이름은 ' + this.name + "이고 나이는 " + this.age + "입니다.");
    }
});

var p = new Student('아둔', '940101', 23);
