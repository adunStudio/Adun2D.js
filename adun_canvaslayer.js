
// #CanvasLayer
(function() {
    'use strict';

    var CanvasLayer = adun.CanvasLayer = adun.Class({
        extend: adun.Group,
        TYPE: 'CanvasLayer',

        init: function() {
            this.super();

            var heart = adun.Heart.instance;

            this._cvsCache = {
                matrix: [1, 0, 0, 1, 0, 0],
                detectColor: '#000000'
            };
            this._cvsCache.layer = this;

            this._element = document.createElement('canvas');
            this._element.style.position = 'absolute';
            this._element.style.left = this._element.style.top = '0px';
            this.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa= 1;

            this._detect = document.createElement('canvas');
            this._detect.style.position = 'absolute';
            this._lastDetected = 0;

            this.context = this._element.getContext('2d');
            this._dctx = this._detect.getContext('2d');

            this._setImageSmoothingEnable();

            this._colorManager = new adun.DetectColorManager(16, 256);

            this.width = heart.width;
            this.height = heart.height;

            var __onchildadded= function(e) {
                var child, self, layer, render;

                child = e.node;
                self = e.target;

                if( self instanceof adun.CanvasLayer ) {
                    layer = self._scene._layers.Canvas;
                } else {
                    layer = self.scene._layers.Canvas;
                }


                adun.CanvasLayer._attachCache(child, layer, __onchildadded, __onchildremoved);

                render = new adun.Event(adun.Event.RENDER);

                if( self._dirty ) {
                    self._updateCoordinate();
                }

                child._dirty = true;

                adun.Matrix.instance.stack.push(self._matrix);
                adun.CanvasRenderer.instance.render(layer.context, child, render);
                adun.Matrix.instance.stack.pop(self._matirx);

            };

            var __onchildremoved = function(e) {
                var child, self, layer;

                child = e.node;
                self = e.target;

                if( self instanceof adun.CanvasLayer ) {
                    layer = self._scene._layers.Canvas;
                } else {
                    layer = self.scene._layers.Canvas;
                }

                adun.CanvasLayer._detachCache(child, layer, __onchildadded, __onchildremoved);
            };



            this.on(adun.Event.CHILD_ADDED, __onchildadded);
            this.on(adun.Event.CHILD_REMOVED, __onchildremoved);

            [ adun.Event.CLICK_START, adun.Event.CLICK_MOVE, adun.Event.CLICK_END ].forEach(function(type) {
                this.on(type, function(e) {
                    if( this._scene ) {
                        this._scene.emit(e);
                    }
                });
            }, this);
        },

        width: {
            get: function() {
                return this._width;
            },
            set: function(width) {
                this._width = width;
                this._element.width = this._detect.width = width;
                this._setImageSmoothingEnable();
            }
        },

        height: {
            get: function() {
                return this._height;
            },
            set: function(height) {
                this._height = height;
                this._element.height = this._detect.height = height;
                this._setImageSmoothingEnable();
            }
        },

        addChild: function(node) {

            this.childNodes.push(node);
            node.parentNode = this;

            var childAdded = new adun.Event(adun.Event.CHILD_ADDED);
            childAdded.node = node;
            childAdded.next = null;
            this.emit(childAdded);
            node.emit(new adun.Event(adun.Event.ADDED));
        },

        insertBefore: function(node, reference) {
            var i = this.childNodes.indexOf(reference);

            if( i !== -1 ) {
                this.childNodes.splice(i, 0, node);
                node.parentNode = this;

                var childAdded = new adun.Event(adun.Event.CHILD_ADDED);
                childAdded.node = node;
                childAdded.next = reference;

                this.emit(childAdded);
                node.emit(new adun.Event(adun.Event.ADDED));

            } else {
                this.addChild(node);
            }
        },

        _startRendering: function() {
            this.on(adun.Event.EXIT_FRAME, this._onexitframe);
            this._onexitframe();
        },

        _stopRendering: function() {
            this.removeEventListener(adun.Event.EXIT_FRAME, this._onexitframe);
            this._onexitframe();
        },

        _onexitframe: function() {
            var heart, ctx, render;

            heart = adun.Heart.instance;
            ctx = this.context;
            ctx.clearRect(0, 0, heart.width, heart.height);


            render = new adun.Event(adun.Event.RENDER);
            adun.CanvasRenderer.instance.render(ctx, this, render);
        },

        _setImageSmoothingEnable: function() {
            this._dctx.imageSmoothingEnabled =
                this._dctx.msImageSmoothingEnabled =
                this._dctx.mozImageSmoothingEnabled =
                this._dctx.webkitImageSmoothingEnabled = false;
        },

        _determineEventTarget: function(e) {
            return this._getEntityByPosition(e.x, e.y);
        },

        _getEntityByPosition: function(x, y) {
            var heart, ctx, extra, rgba;

            heart = adun.Heart.instance;
            ctx = this._dctx;

            if( this._lastDetected < heart.frame ) {

                ctx.clearRect(0, 0, this.width, this.height);
                adun.CanvasRenderer.instance.detectRender(ctx, this);
                this._lastDetected = heart.frame;

            }

            extra = adun.ENV.COLOR_DETECTION_LEVEL - 1;
            rgba = ctx.getImageData(x - extra, y - extra, 1 + extra * 2, 1 + extra * 2).data;

            console.dir(rgba);
            return this._colorManager.getSpriteByColors(rgba);

        }
    });

    CanvasLayer._attachCache = function(node, layer, onchildadded, onchildremoved) {
        var child, i, len;
        if( !node._cvsCache ) {
            node._cvsCache = {};
            node._cvsCache.matrix = [1, 0 ,0 ,1, 0, 0];
            node._cvsCache.detectColor = 'rgba(' + layer._colorManager.attachDetectColor(node) + ')';
            node.addEventListener(adun.Event.CHILD_ADDED, onchildadded);
            node.addEventListener(adun.Event.CHILD_REMOVED, onchildremoved);
        }

        if( node.childNodes ) {
            for( i = 0, len = node.childNodes.length; i < len; ++i ) {
                child = node.childNodes[i];
                adun.CanvasLayer._attachCache(child, layer, onchildadded, onchildremoved);
            }
        }
    };

    CanvasLayer._detachCache = function(node, layer, onchidadded, onchildremoved) {
        var child, i, len;

        if( node._cvsCache ) {

            node.removeEventListener(adun.Event.CHILD_ADDED, onchildadded);
            node.removeEventListener(adun.Event.CHILD_REMOVED, onchildremoved);
            delete node._cvsCache;
        }

        if( node.childNodes ) {
            for( i = 0, len = node.childNodes.length; i < len; ++i ) {
                child = node.childNodes[i];
                adun.CanvasLayer._detachCache(child, layer, onchildadded, onchildremoved);
            }
        }
    };

})();
