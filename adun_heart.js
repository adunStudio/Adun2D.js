
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

            this.on(adun.Event.HEART_RESIZE, this._onHeartResize);

            this._width = width;
            this._height = height;

            this.scale = scale;

            this.fps = 30;

            this.frame = 0;

            this.ready = false;

            this.running = false;

            this._assets = [];

            this.currentScene = null;

            this.rootScene = new adun.Scene();
            //this.pushScene(this.rootScene);

            this.loadingScene = null;

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

                stage.addEventListener('mousedown', function(e) {

                    var tagName = (e.target.tagName).toLowerCase();

                    if( adun.ENV.DEFALUT_TAGS.indexOf(tagName) === -1 ) {
                        e.preventDefault();

                        Heart._mousedownID ++;

                        if( !Heart.running ) {
                            e.stopPropagation();
                        }
                    }

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

        keybind: function(key, button) {
            this.keyboardInputManager.keybind(key, button);
            this.on(button + 'buttondown', function() {
                //alert('keydown');
            });
            this.on(button + 'buttonup', function() {
                alert('keyup');
            });
        },

        preload: function(assets) {
            var a, name;

            if( !adun.isArray(assets) ) {

                if( !adun.isPlainObject(assets) ) {

                    a = [];

                    for( name in assets ) {
                        if( adun.has(assets, name) ) {
                            a.push([assets[name], name]);
                        }
                    }

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

            });
        }

    });

})();
