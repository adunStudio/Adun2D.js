
// #InputManager
(function() {
    'strict use';

    var InputManager = ADUN.InputManager = ADUN.Class({
        EXTEND: ADUN.EventTarget,

        init: function(valueStore, source) {
            this.super();

            // 이벤트 타겟을 저장할 배열
            this.broadcastTarget = [];

            // 인풋 상태를 저장할 객체 => valueStore[name] => true || false
            // 'enter': false
            this.valueStore = valueStore;

            // 이벤트 객체에 의하여 추가될 소스
            this.source = source || this;

            // 13: 'enter'
            this._binds = {};

            this._stateHandler = function(e) {
                var id = e.source._id;
                var name = this._binds[id];
                this.changeState(name, e.data);
            }.bind(this);
        },

        bind: function(inputSource, name) {
            inputSource.addEventListener(ADUN.Event.INPUT_STATE_CHANGED, this._stateHandler);
            this._binds[inputSource._id] = name;
        },

        unbind: function(inputSource) {
            inputSource.removeEventListener(ADUN.Event.INPUT_STATE_CHANGED, this._stateHandler);
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
            if( i !== -1 ) {
                this.broadcastTarget.splice(i, 1);
            }
        },

        broadcastEvent: function(e) {
            var i, length, target = this.broadcastTarget;
            for( i = 0, length = target.length; i < length; ++i ) {
                target[i].emit(e);
            }
        },

        changeState: function(name, data) {

        }
    });
})();

// #InputSource
(function() {
    var InputSource = ADUN.InputSource = ADUN.Class({
        EXTEND: ADUN.EventTarget,

        init: function(id) {
            this.super();
            this._id = id;
        },

        notifyStateChange: function(data) {
            var e = new ADUN.Event(ADUN.Event.INPUT_STATE_CHANGED);
            e.data = data;
            e.source = this;
            this.emit(e);
        }
    });
})();

// #BinaryInputManager
(function() {
    'use strict';
    var BinaryInputManager = ADUN.BinaryInputManager = ADUN.Class({
        EXTEND: ADUN.InputManager,

        init: function(flagStore, activeEventNameSuffix, inactiveEventNameSuffix, source) {
            this.super(flagStore, source);

            this.activeInputNum = 0;

            this.activeEventNameSuffix = activeEventNameSuffix;
            this.inactiveEventNameSuffix = inactiveEventNameSuffix;
        },

        bind: function(binaryInputSource, name) {
            this.super(binaryInputSource, name);
            this.valueStore[name] = false;
        },

        unbind: function(binaryInputSource) {
            var name = this._binds[binaryInputSource._id];
            this.super(binaryInputSource);
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
            if( !this.valueStore[name] ) {
                this.valueStore[name] = true;
                inputEvent = new ADUN.Event(( this.activeInputNum++ ) ? 'inputchange' : 'inputstart' );
                inputEvent.source = this.source;
                this.broadcastEvent(inputEvent);
            }
            downEvent = new ADUN.Event(name + this.activeEventNameSuffix);
            downEvent.source = this.source;
            this.broadcastEvent(downEvent);
        },

        _up: function(name) {
            var inputEvent, upEvent;
            if( this.valueStore[name] ) {
                this.valueStore[name] = false;
                inputEvent = new ADUN.Event(( --this.activeInputNum ) ? 'inputchange' : 'inputend' );
                inputEvent.source = this.source;
                this.broadcastEvent(inputEvent);
            }
            upEvent = new ADUN.Event(name + this.inactiveEventNameSuffix);
            upEvent.source = this.source;
            this.broadcastEvent(upEvent);
        }
    });
})();


// #BinaryInputSource
(function() {
     'use strict';
    var BinaryInputSource = ADUN.BinaryInputSource = ADUN.Class({
        EXTEND: ADUN.InputSource,

        init: function(id) {    //(keyCode)
            this.super(id);
        }
    });
})();

// #KeyboardInputManager
(function() {
    'use strict';
    var KeyboardInputManager = ADUN.KeyboardInputManager = ADUN.Class({
        EXTEND: ADUN.BinaryInputManager,

        init: function(domElement, flagStore) {
            this.super(flagStore, 'buttondown', 'buttonup');
            this._attachDOMEvent(domElement, 'keydown', true);
            this._attachDOMEvent(domElement, 'keyup', false);
        },

        _attachDOMEvent: function(domElement, eventType, state) {
            domElement.addEventListener(eventType, function(e) {
                var code, source, heart;

                heart = ADUN.Heart.instance;

                if(!heart || !heart.running) {
                    return;
                }

                code = e.keyCode;

                source = ADUN.KeyboardInputSource._instances[code];

                if( source ) {
                    source.notifyStateChange(state);
                }
            }, true);
        },

        keybind: function(keyCode, name) {
            this.bind(ADUN.KeyboardInputSource.getByKeyCode('' + keyCode), name);
        },

        keyunbind: function(keyCode) {
            this.unbind(ADUN.KeyboardInputSource.getByKeyCode('' + keyCode));
        }
    });
})();

// #KeyboardInputSource
(function() {
    var KeyboardInputSource = ADUN.KeyboardInputSource = ADUN.Class({
        EXTEND: ADUN.BinaryInputSource,

        init: function(keyCode) {
            this.super(keyCode);
        }
    });

    // 키보드 인스턴스
    KeyboardInputSource._instances = {};

    KeyboardInputSource.getByKeyCode = function(keyCode) {
        if( !this._instances[keyCode] ) {
            this._instances[keyCode] = new ADUN.KeyboardInputSource(keyCode);
        }
        return this._instances[keyCode];
    }
})();