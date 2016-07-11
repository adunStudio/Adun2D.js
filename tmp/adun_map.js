
// #Map
(function() {
    'use strict';

    var Map = adun.Map = adun.Class({
        extend: adun.Entity,
        TYPE: 'Map',

        init: function(tileWidth, tileHeight) {
            this.super();

            var heart = adun.Heart.instance;

            this.surface = new adun.Surface(heart.width, heart.height);

            var canvas = this.surface._element;
            canvas.style.position = 'absolute';
            canvas.width = heart.width;
            canvas.height = heart.height;

            this._context = canvas.getContext('2d');

            this._tileWidth = tileWidth || 0;
            this._tileHeight = tileHeight || 0;

            this._iamge = null;

            this.data = [[[]]];

            this._dirty = false;

            this._tight = false;

            this.clickEnabled = false;

            this.collisionData = null;

            this._listeners[adun.Event.RENDER] = null;
            this.on(adun.Event.RENDER, function() {

                if( this._dirty ) {
                    this._previousOffsetX = this._previousOffsetY = null;
                }
            });

        },

        image: {
            get: function() {
                return this._image;
            },
            set: function(image) {
                this._image = image;
                this.dirty = true;
            }
        },

        tileWidth: {
            get: function() {
                return this._tileWidth;
            },
            set: function(tileWidth) {
                if( this._tileWidth !== tileWidth ) {
                    this._tileWidth = tileWidth;
                    this._dirty = true;
                }
            }
        },

        tileHeight: {
            get: function() {
                return this._tileHeight;
            },
            set: function(tileHeight) {
                if( this._tileHeight !== tileHeight ) {
                    this._tileHeight = tileHeight;
                    this._dirty = true;
                }
            }
        },

        width: {
            get: function() {
                return this._tileWidth * this._data[0][0].length;
            }
        },

        height: {
            get: function() {
                return this._tileHeight * this._data[0].length;
            }
        },

        loadData: function(data) {
            var i, l, len, llen, x, y, c;

            this._data = Array.prototype.slice.apply(arguments);

            this._dirty = true;

            this._tight = false;

            for( i = 0, l = this._data.length; i < l; ++i ) {
                c = 0;
                data = this._data[i];

                for( y = 0, len = data.length; y < len; ++y ) {
                    for( x = 0, llen = data[y].length; x < llen; ++x ) {
                        if( data[y][x] >= 0 ) {
                            c++;
                        }
                    }
                }

                if( (c / (data.length * data[0].length)) > 0.2 ) {
                    this._tight = true;
                    break;
                }
            }
        },

        checkTile: function(x, y) {
            if( x < 0 || this.width <= x || y < 0 || this.height <= y ) {
                return false;
            }

            var width, height, tileWidth, tileHeight, data;

            width = this._iamge.width;
            height = this._iamge.height;

            tileWidth = this._tileWidth || width;
            tileHeight = this._tileHeight || height;

            x = x / tileWidth | 0;
            y = y / tileHeight | 0;

            data = this._data[0];

            return data[y][x];
        },

        hitTest: function(x, y) {
            if( x < 0 || this.width <= x || y < 0 || this.height <= y ) {
                return false;
            }

            var width, height, tileWidth, tileHeight, i, len, data, n;

            width = this._image.width;
            height = this._image.height;

            tileWidth = this._tileWidth || width;
            tileHeight = this._tileHeight || height;

            x = x / tileWidth | 0;
            y = y / tileHeight | 0;

            if( this.collisionData != null ) {
                return this.collisionData[y] && !!this.collisionData[y][x];
            } else {
                for( i = 0, len = this._data.length; i < len; ++i ) {
                    data = this._data[i];

                    if( data[y] != null && (n = data[y][x]) != null && 0 <= n && n < (width / tileWidth | 0) * (height / tileHeight | 0) ) {
                        return true;
                    }
                }
            }

            return false;
        },

        redraw: function(x, y, width, height) {    // 0, 0, heart.width, heart.height
            if( this._image == null ) {
                return;
            }

            var image, tileWidth, tileHeight, dx, dy;

            image = this._image;
            tileWidth = this._tileWidth;
            tileHeight = this._tileHeight;
            dx = -this._offsetX;
            dy = -this._offsetY;

            var row = image.width / tileWidth | 0;
            var col = image.height / tileHeight | 0;
            var left = Math.max((x + dx) / tileWidth | 0, 0);
            var top = Math.max((y + dy) / tileHeight | 0, 0);
            var right = Math.ceil((x + dx + width) / tileWidth);
            var bottom = Math.ceil((y + dy + height) / tileHeight);

            var source = image._element;
            var context = this._context;
            var canvas = context.canvas;

            context.clearRect(x, y, width, height);

            for( var i = 0, len = this._data.length; i < len; ++i ) {

                var data = this._data[i];
                var r = Math.min(right, data[0].length);
                var b = Math.min(bottom, data.length);

                for( y = top; y < b; ++y ) {
                    for( x = left; x < r; ++x ) {
                        var n = data[y][x];

                        if( 0 <= n && n < row * col ) {
                            var sx = (n % row) * tileWidth;
                            var sy = (n / row | 0) * tileHeight;
                            context.drawImage(
                                source,
                                sx, sy, tileWidth, tileHeight,
                                x * tileWidth - dx, y * tileHeight - dy, tileWidth, tileHeight
                            );
                            //console.log(sx, sy, tileWidth, tileHeight, x * tileWidth - dx, y  * tileHeight - dy, tileWidth, tileHeight)
                        }
                    }
                }
            }
        },

        updateBuffer: function() {
            if( this._visible === undefined || this._visible ) {
                var heart = adun.Heart.instance;

                if( this._dirty || this._previousOffsetX == null) {

                    this.redraw(0, 0, heart.width, heart.height);

                } else if( this.offsetX !== this._previousOffsetX || this._offsetY !== this._previousOffsetY ) {

                    if(this._tight) {
                                                                // 오른쪽으로 한칸 이동했다고 친다 (타일셋은 30px)
                        var x  = -this._offsetX;                // 현재 -60
                        var y  = -this._offsetY;
                        var px = -this._previousOffsetX;        // 이전 -30
                        var py = -this._previousOffsetY;
                        var w1 = x - px + heart.width;          // (-60 + 33)   = -30 + 300 = 270
                        var w2 = px - x + heart.width;          // (-30 + 60)   =  30 + 300 = 330
                        var h1 = y - py + heart.height;
                        var h2 = py - y + heart.height;

                        if( w1 > this._tileWidth && w2 > this._tileWidth && h1 > this._tileHeight && h2 > this._tileHeight ) {
                            var sx, sy, dx, dy, sw, sh;

                            if( w1 < w2 ) { // 270 < 330 true
                                sx = 0;
                                dx = px - x;
                                sw = w1;
                            } else {
                                sx = x - px;
                                dx = 0;
                                sw = w2;
                            }

                            if( h1 < h2 ) {
                                sy = 0;
                                dy = py - y;
                                sh = h1;
                            } else {
                                sy = y - py;
                                dy = 0;
                                sh = h2;
                            }

                            if( heart._buffer == null ) {
                                heart._buffer = document.createElement('canvas');
                                heart._buffer.width = this._context.canvas.width;
                                heart._buffer.height = this._context.canvas.width;
                            }

                            var context = heart._buffer.getContext('2d');
                            context.cleartRect(0, 0, sw, sh);
                            context.drawImage(this._context.canvas,
                                              sx, sy, sw, sh,
                                              0, 0, sw, sh);
                            context = this._context;
                            context.clearRect(dx, dy, sw, sh);
                            context.drawImage(heart._buffer,
                                              0, 0, sw, sh,
                                              dx, dy, sw, sh);

                        }


                    }
                }
            }
        },

        cvsRender: function(ctx) {
            if( this.width !== 0 && this.height !== 0 ) {
                var heart = adun.Heart.instance;
                this.updateBuffer();
                ctx.save();
                //ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.drawImage(this._context.canvas, 0, 0, heart.width, heart.height);
                ctx.restore();
            }
        }

    });
})();
