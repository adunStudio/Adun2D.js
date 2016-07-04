
// 게임을 움직이는 핵심 로직


// #Heart
(function() {
    'use strict';

    var Heart;

    adun.Heart = adun.Class({
        extend: adun.EventTarget,

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

            this.on(adun.Event.HEART_RESIZE, this._onheartresize);

            this._width = width;
            this._height = height;

            this.scale = scale;

            this.fps = 30;

            this.frame = 0;

            this.ready = false;

            this.running = false;

            //assets

            this.currentScene = null;

            this.rootScene = new adun.Scene();
            //this.pushScene(this.rootScene);

            this.loadingScene = null;

            this.input = {};

            this.keyboardInputManager = new adun.KeyboardInputManager(window.document, this.input);
            this.keyboardInputManager.addBroadcastTarget(this);







        }

    });

})();
