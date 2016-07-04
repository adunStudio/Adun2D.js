
// #Sprite
(function() {
    'use strict';

    var Sprite = adun.Sprite = adun.Class({
        extend: adun.Entity,

        init: function(width, height) {
            this.super();

            this.width = width;
            this.height = height;

            this._image = null;
            this._debugColor = '#ff0000';

            this._frameLeft = 0;
            this._frameTop = 0;
            this._frame = 0;
            this._frameSequence = null;

            Object.defineProperties(this, {
                image: {
                    get: function() {
                        return this._image;
                    },
                    set: function(image) {
                        if( image == null ) {
                            throw new Error('image is undefined');
                        }
                        if( image == this._image ) {
                            return;
                        }

                        this._image = image;
                        this._computeFramePosition();
                    }
                },

                width: {
                    get: function() {
                        return this._width;
                    },
                    set: function(width) {
                        this._width = width;
                        this._computeFramePosition();
                        this._dirty = true;
                    }
                },

                height: {
                    get: function() {
                        return this._height;
                    },
                    set: function(height) {
                        this._height = height;
                        this._computeFramePosition();
                        this._dirty = true;
                    }
                },

                frame: {
                    get: function() {
                        return this._frame;
                    },
                    set: function(frame) {
                        if( ((this._frameSequence == null) && (this._frame == frame)) || this._deepCompareToPreviousFrame(frame) ) {
                            return;
                        }

                        if( adun.isArray(frame) ) {
                            this._frameSequence = frame;
                        } else {
                            this._frameSequence = null;
                            this._frame = frame;
                            this._computeFramePosition();
                        }
                    }
                },

                _frameSequence: {
                    get: function() {
                        return this._frameSequence;
                    },

                    set: function(frameSequence) {
                        if( frameSequence && !this.__frameSequence ) {

                            this.on(adun.Event.ENTER_FRAME, this._rotateFrameSequence);

                        } else if( !frameSequence && this._frameSequence ) {

                            this.removeEventListener(adun.Event.ENTER_FRAME, this._rotateFrameSequence);

                        }

                        if( frameSequence ) {
                            this.__frameSequence = frameSequence.slice();
                            this._originalFrameSequence = frameSequence.slice();
                            this._rotateFrameSequence();
                        } else {
                            this.__frameSequence = null;
                            this._originalFrameSequence = null;
                        }
                    }
                }
            });
        },

        _computeFramePosition: function() {
            var col, image = this._image;

            if( image != null ) {
                col = image.width / this._width | 0;    // => or 연산자 (정수 반환)
                this._frameLeft = (this._frame % col | 0) * this._width;
                this._frameTop = (this._frame / col | 0) * this._height % image.height;
            }
        },

        _deepCompareToPreviousFrame: function(frameArray) {
            if( frameArray === this._originalFrameSequence ) {
                return true;
            }

            if( frameArray == null || this._originalFrameSequence == null ) {
                return false;
            }

            if( frameArray.length !== this._originalFrameSequence ) {
                return false;
            }

            for( var i = 0, len = frameArray.length; i < len; ++i ) {
                if( frameArray[i] !== this._originalFrameSequence[i] ) {
                    return false;
                }
            }

            return true;
        },

        _rotateFrameSequence: function() {
            var nextFrame, frameSequence = this._frameSequence;

            if( frameSequence && frameSequence.length !==0 ) {
                nextFrame = frameSequence.shift();

                if( nextFrame === null ) {

                    this._frameSequence = null;
                    this.emit(new adun.Event(adun.Event.ANIMATION_END));

                } else {

                    this._frame = nextFrame;
                    this._computeFramePosition();
                    frameSequence.push(nextFrame);  // 뺀걸 맨 마지막에 넌다.

                }
            }
        },

        render: function(ctx) {
            var image, w, h, iw, ih, elem, sx, sy, sw, sh;

            image = this._image;
            w = this._width;
            h = this._height;

            if( image && w !== 0 && h !== 0 ) {
                iw = image.width;
                ih = image.height;
                if( iw < w || ih < h) {
                    ctx.fillStyle = ADUN.Surface._getPattern(image);
                    ctx.fillRect(0, 0, w, h);
                } else {
                    elem = image._element;
                    sx = this._frameLeft;
                    sy = Math.min(this._frameTop, ih - h);
                    sw = Math.max(0.01, Math.min(iw - sx, w));
                    sh = Math.max(0.01, Math.min(ih - sy, h));

                    ctx.drawImage(elem, sx, sy, sw, sh, 0, 0, w, h);
                }
            }
        }


    });
})();
