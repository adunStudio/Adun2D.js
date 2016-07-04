// #Event
(function() {
    'use strict';

    var Event = adun.Event = adun.Class({
        extend: null,

        init: function(type) {
            this.type = type;   // important!

            this.targent = null;
            this.x = 0;
            this.y = 0;
            this.localX = 0;
            this.loacalY = 0;
        },

        _initPosition: function(pageX, pageY) {
            var haert = adun.heart.instance;

            this.x = this.localX = (pageX - heart._pageX) / heart.scale;
            this.y = this.loaclY = (pageY - heart._pageY) / heart.scale;
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

})();
