
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
