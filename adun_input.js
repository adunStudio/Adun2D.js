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
// 5. => valueStore['enter'] = true,  그리고 INPUT_CHANGE or INPU_START 그리고 enterbuttondown 이벤트(총 2개 ) 발생

// 사용방법 heart.on('enterbuttondown', function() {
//           // 로직
//          });

// #InputManager
(function() {
    'strict mode';

    var InputManager = adun.InputManager = adun.Class({
        extend: adun.EventTarget,

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
        },

        _stateHandler: function() {
            var id, name;

            id = e.source._id; //      number ex) 13
            name = this._binds[id]; // string ex) 'enter'

            this.changeState(name, e.data);
        }.bind(this),


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
            var i, len, target = this.boradcastTarget;

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
        extend: adun.inputManager,

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

                source = adun.KeyboardInputSource[code];

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

    var InputSource = adun.Class({
        extend: adun.EventTarget,

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
        extend: adun.inputSource,

        init: function(keyCode) {
            this.super(keyCode);
        }
    });

    // 키보드 인스턴스
    KeyboardInputSource.instances = {};

    KeyboardInputSource.getByKeyCode = function(keyCode) {
        if( !KeyboardInputSource.instance[keyCode] ) {
            KeyboardInputSource.instance[keyCode] = new adun.KeyboardInputSource(keyCode);
        }

        return KeyboardInputSource.instances[keyCode];
    };

})();
