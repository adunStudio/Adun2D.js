
// #Scene
(function() {
    'use strict';

    var Scene = adun.Scene = adun.Class({
        extend: adun.Group,
        TYPE: 'Scene',

        init: function() {
            this.super();

            var heart = adun.Heart.instance;

            this.scene = this;

            this._backgroundColor = null;

            this._element = document.createElement('div');
            this._element.style.position = 'absolute';
            this._element.style.overflow = 'hidden';
            this._element.style[adun.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0 0';

            this._layers = {};
            this._layerPriorty = [];

            this.on(adun.Event.CHILD_ADDED, this._onchildadded);
            this.on(adun.Event.CHILD_REMOVED, this._onchildremoved);
            this.on(adun.Event.ENTER, this._onenter);
            this.on(adun.Event.EXIT, this._onexit);

            var self = this;

            this._dispatchExitframe = function() {
                var layer;

                for( var prop in self._layers ) {

                    layer = self._layers[prop];
                    layer.emit(new adun.Event(adun.Event.EXIT_FRAME));
                }
            };

            this.on(adun.Event.HEART_RESIZE, this._onHeartResize);

            this._onHeartResize(heart);

        },

        x: {
            get: function() {
                return this._x;
            },
            set: function(x) {
                this._x = x;
                for( var type in this._layers ) {
                    this._layers[type].x = x;
                }
            }
        },

        y: {
            get: function() {
                return this._y;
            },
            set: function(x) {
                this._y = y;
                for( var type in this._layers ) {
                    this._layers[type].y = y;
                }
            }
        },

        width: {
            get: function() {
                return this._width;
            },
            set: function(width) {
                this._width = width;
                for (var type in this._layers) {
                    this._layers[type].width = width;
                }
            }
        },

        height: {
            get: function() {
                return this._height;
            },
            set: function(height) {
                this._height = height;
                for (var type in this._layers) {
                    this._layers[type].height = height;
                }
            }
        },

        rotation: {
            get: function() {
                return this._rotation;
            },
            set: function(rotation) {
                this._rotation = rotation;
                for (var type in this._layers) {
                    this._layers[type].rotation = rotation;
                }
            }
        },

        scaleX: {
            get: function() {
                return this._scaleX;
            },
            set: function(scaleX) {
                this._scaleX = scaleX;
                for (var type in this._layers) {
                    this._layers[type].scaleX = scaleX;
                }
            }
        },

        scaleY: {
            get: function() {
                return this._scaleY;
            },
            set: function(scaleY) {
                this._scaleY = scaleY;
                for (var type in this._layers) {
                    this._layers[type].scaleY = scaleY;
                }
            }
        },

        backgroundColor: {
            get: function() {
                return this._backgroundColor;
            },
            set: function(color) {
                this._backgroundColor = this._element.style.backgroundColor = color;
            }
        },

        remove: function() {
            this.clearEventListener();

            while( this.childNodes.length > 0 ) {
                this.childNodes[0].remove();
            }

            return adun.Heart.instance.removeScene(this);
        },

        _determineEventTarget: function(e) {
            var layer, target, i;

            for( i = this._layerPriorty.length -1; i >= 0; --i ) {
                layer = this._layers[this._layerPriorty[i]];
                target = layer._determineEventTarget(e);

                if( target ) {
                    break;
                }
            }

            if( !target ) {
                target = this;
            }

            return target;
        },

        _onHeartResize: function(e) {
            this._element.style.width = e.width + 'px';
            this.width = e.width;
            this._element.style.height = e.height + 'px';
            this.height = e.height;
            this._element.style[adun.ENV.VENDOR_PREFIX + 'Transform'] = 'scale(' + e.scale + ')';

            for( var type in this._layers ) {
                this._layers[type].emit(e);
            }
        },

        addLayer: function(type, i) {

            var heart = adun.Heart.instance;

            if( this._layers[type] ) {
                return;
            }

            var layer = new adun[type + 'Layer']();

            if( heart.currentScene === this ) {
                layer._startRendering();
            }

            this._layers[type] = layer;

            var element = layer._element;

            if( adun.isNumber(i) ) {           // if 'Dom' the i = 1  if else 'Canvas' i = 0
                var nextSibling = this._element.childNodes[i];

                if( nextSibling ) {

                    this._element.insertBefore(element, nextSibling);
                } else {
                    this._element.appendChild(element);
                }

                this._layerPriorty.splice(i, 0, type);

            } else {
                this._element.appendchild(element);
                this._layerPriorty.push(type);
            }

            layer._scene = this;
        },

        _onchildadded: function(e) {
            var child, next, target, i;

            child = e.node;
            next = e.next;

            if( child._element ) {
                target = 'Dom';          // Surface || CanvasLayer
                i = 1;
            } else {
                target = 'Canvas';
                i = 0;
            }

            if( !this._layers[target] ) {
                this.addLayer(target, i);
            }

            child._layer = this._layers[target];
            this._layers[target].insertBefore(child, next);
            child.parentNode = this;

        },

        _onchildremoved: function(e) {
            var child = e.node;
            child._layer.removeChild(child);
            child._layer = null;
        },

        _onenter: function() {
            for(var type in this._layers) {
                this._layers[type]._startRendering();
            }

            adun.Heart.instance.on(adun.Event.EXIT_FRAME, this._dispatchExitframe);
        },

        _onexit: function() {
            for(var type in this._layers) {
                this._layers[type]._stopRendering();
            }

            adun.Heart.instance.removeEventListener(adun.Event.EXIT_FRAME, this._dispatchExitframe);
        }

    });
})();



// #CanvasScene
(function() {
    'use strict';

    var CanvasScene = adun.CanvasScene = adun.Class({
        extend: adun.Scene,

        init: function() {
            this.super();

            this.addLayer('Canvas');
        },

        _determineEventTarget: function(e) {
            var target = this._layers.Canvas._determinEventTarget(e);

            if( !target ) {
                target = this;
            }

            return target;
        },

        _onchildadded: function(e) {
            var child, next;

            child._layer = this._layers.Canvas;
            this._layers.Canvas.insertBefore(child, next);
        },

        _onenter: function() {

            this._layers.Canvas._startRendering();
            adun.Heart.instance.on(adun.Event.EXIT_FRAME, this._dispatchExitframe);
        },

        _onexit: function() {

            this._layers.Canvas._stopRendering();
            adun.Heart.instance.removeEventListener(adun.Event.EXIT_FRAME, this._dispatchExitframe);
        }
    });
})();



// #DomScene
(function() {
    'use strict';

    var DOMScene = adun.DOMScene = adun.Class({
        extend: adun.Scene,

        init: function() {
            this.super();

            this.addLayer('Dom');
        },

        _determineEventTarget: function(e) {
            var target = this._layers.Dom._determinEventTarget(e);

            if( !target ) {
                target = this;
            }

            return target;
        },

        _onchildadded: function(e) {
            var child, next;

            child._layer = this._layers.Dom;
            this._layers.Dom.insertBefore(child, next);
        },

        _onenter: function() {

            this._layers.Dom._startRendering();
            adun.Heart.instance.on(adun.Event.EXIT_FRAME, this._dispatchExitframe);
        },

        _onexit: function() {

            this._layers.Dom._stopRendering();
            adun.Heart.instance.removeEventListener(adun.Event.EXIT_FRAME, this._dispatchExitframe);
        }
    });
})();
