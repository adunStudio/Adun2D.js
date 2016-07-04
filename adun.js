

(function(global) {
    'use strict';
    var adun = {
        ADUN_VESION: '0.0.1'
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
