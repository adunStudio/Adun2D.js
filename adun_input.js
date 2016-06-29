

// #InputManger
(function() {
   var InputManager = ADUN.InputManager = ADUN.Class({
       EXTEND: ADUN.EventTarget,

       init: function (valueStore, source) {
           this.super();

           // 이벤트 타겟을 저장하는 배열
           this.boardcastTarget = [];

           // valueStore[네임] => 인풋 상태를 참조하는 객체
           this.valueStore = valueStore;

           // 소스는 e 객체에 의해서 추가된다.
           this.source = source || this;

           // _binds[인풋소스.id] = name
           this._binds = {};

           this._stateHandler = function (e) {
               var name;

               name = this._binds[e.source.identifier];
               this.changeState(name, e.data);
           }.bind(this);
       },

       bind: function (inputSource, name) {
           inputSource.addEventListener(ADUN.Event.INPUT_STATE_CHANGED, this._stateHandler);
           this._binds[inputSource.identifier] = name;
       },

       unbind: function (inputSource) {
           inputSource.removeEventListener(ADUN.Event.INPUT_STATE_CHANGED, this._stateHandler);
       },

       addBroadcastTarget: function (eventTarget) {
           var i = this.broadcastTarget.indexOf(eventTarget);

           if (i === -1) {
               this.boardcastTarget.push(eventTarget);
           }
       },

       removeBroadcastTarget: function (eventTarget) {
           var i = this.broadcastTarget.indexOf(eventTarget);
           if (i !== -1) {
               this.broadcastTarget.splice(i, 1);
           }
       },

       broadcastEvent: function(e) {
           var i, length, target = this.boardcastTarget;

           for( i = 0, length = target.length; i < length; ++i ) {
               target[i].emit(e);
           }
       }
   });
})();


// #InputSource
(function() {
    var InputSource = ADUN.InputSource = ADUN.Class({
        EXTEND: ADUN.EventTarget,

        init: function(identifier) {
            this.super();

            this.identifier = identifier;  // @type String
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
    'strict use';

    var BinaryInputManger = ADUN.BinaryInputManager = ADUN.Class({
        EXTEND: ADUN.InputManager,

        init: function(flagStore, activeEventNameSuffix, inactiveEventNameSuffix, source) {
            this.super(flagStore, source);

            this.activeInputsNum = 0;

            this.activeEventNameSuffix = activeEventNameSuffix;

            this.inactiveEventNameSuffix = inactiveEventNameSuffix;
        },

        bind: function(binaryInputSource, name) {
            this.super(binaryInputSource, name);
            this.valueStore[name] = false;
        },

        unbind: function(binaryInputSource) {
            var name = this._binds[binaryInputSource.identifier];
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
                inputEvent = new ADUN.Event((this.activeInputsNum++) ? 'inputchange': 'inputstart');
                inputEvent.source = this.source;
                this.broadcastEvent(inputEvent);
            }

            var downEvent = new ADUN.Event(name + this.activeEventNameSuffix);
            downEvent.source = this.source;
            this.broadcastEvent(downEvent);
        },

        _up: function(name) {
            var inputEvent, upEvent;

            if( this.valueStore[name] ) {
                this.valueStore[name] = false;
                inputEvent = new ADUN.Event((this.activeInputsNum++) ? 'inputchange': 'inputend');
                inputEvent.source = this.source;
                this.broadcastEvent(inputEvent);
            }

            var upEvent = new ADUN.Event(name + this.inactiveEventNameSuffix);
            upEvent.source = this.source;
            this.broadcastEvent(upEvent);
        }
    });
})();

// #BinaryInputSource
(function() {
    'strict use';
    var BinaryInputSource = ADUN.BinaryInputSource = ADUN.Class({
        EXTEND: ADUN.InputSource,

        init: function(identifier) {
            this.super(identifier);
        }
    });
})();
