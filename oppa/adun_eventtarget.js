// #EventTarget
(function() {
    'use strict';
    // 옵저버 패턴
    var EventTarget = adun.EventTarget = adun.Class({
        extend: null,

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
