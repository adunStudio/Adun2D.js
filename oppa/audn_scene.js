
// #Scene
(function() {
    'use strict';

    var Scene = adun.Scene = adun.Class({
        extend: adun.Group,

        init: function() {
            this.super();

            var heart = adun.Heart.instance;

            this.scene = this;

            this._backgroundColor = null;

            this._element = doucument.createElement('div');
            this._element.style.position = 'absolute';
            this._emelent.style.overflow = 'hidden';
            this._element.style[adun.ENV.VENDOR_PREFIX + 'TransformOrigin'] = '0 0';

            this._layers = {};
            this._layerPriorty = [];

            this.on(adun.Event.CHILD_ADDED, this._onchildadded);
            this.on(adun.Event.CHILD_REMOVED, this._onchildremoved);
            this.on(adun.Event.ENTER, this._onenter);
            this.on(adun.Event.EXIT, this._onexit);

            this.on(adun.Event.HEART_RESIZE, this._onheartresize);


            var self = this;

            this._oncoreresize(heart);

            Object.defineProperties(this, {
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
            });
        },

        remove: function() {
            this.clearEventListener();

            while( this.childNodes.length > 0 ) {
                this.childNodes[0].remove();
            }

            return adun.Heart.instance.removeScene(this);
        },

        _onheartresize: function(e) {
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

        }


    });
})();
