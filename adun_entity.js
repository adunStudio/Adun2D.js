
// #Entity
(function() {
    'use strict';

    var Entity = adun.Entity = adun.Class({
        extend: adun.Node,

        init: function() {
            this.super();

            //var heart = adun.Heart.instance;

            this._rotation = 0;
            this._scaleX = 0;
            this._scaleY = 0;

            this._toucnEnabled = true;
            this._clipping = false;

            this._originX = null;
            this._originY = null;

            this._width = 0;
            this._width = 0;
            this._height = 0;
            this._backgroundColor = null;
            this._debugColor = '#0000ff';
            this._opacity = 1;
            this._visible = true;
            this._buttonMode = null;

            this._style = {};
            this._styleStatus = {};

            this._isContainedInCollection = false;

            this.compositeOperation = null;

            this.buttonMode = null;

            this.buttonPressed = null;

            this.enableCollection();
        },

        rotation: {
            get: function() {
                return this._rotation;
            },
            set: function(rotation) {
                if (this._rotation !== rotation ) {
                    this._rotation = rotation;
                    this._dirty = true;
                }
            }
        },

        originX: {
            get: function() {
                return this._originX;
            },
            set: function(originX) {
                if ( this._originX !== originX ) {
                    this._originX = originX;
                    this._dirty = true;
                }
            }
        },

        originY: {
            get: function() {
                return this._originY;
            },
            set: function(originY) {
                if ( this._originY !== originY ) {
                    this._originY = originY;
                    this._dirty = true;
                }
            }
        },

        width: {
            get: function() {
                return this._width;
            },
            set: function(width) {
                if(this._width !== width) {
                    this._width = width;
                    this._dirty = true;
                }
            }
        },

        height: {
            get: function() {
                return this._height;
            },
            set: function(height) {
                if(this._height !== height) {
                    this._height = height;
                    this._dirty = true;
                }
            }
        },

        backgroundColor: {
            get: function() {
                return this._backgroundColor;
            },
            set: function(color) {
                this._backgroundColor = color;
            }
        },

        opacity: {
            get: function() {
                return this._opacity;
            },
            set: function(opacity) {
                this._opactiy = parseFloat(opacity);
            }
        },

        visible: {
            get: function() {
                return this._visible;
            },
            set: function(visible) {
                this._visible = visible;
            }
        },

        // 사각형 충돌
        intersect: function(other) {
            if( other instanceof adun.Entity ) {

                return this._intersectOne(other);

            } else if( adun.isFunction(other) && other.collection ) {

                return _intersectBetweenClassAndInstace(other, this);

            }

            return false;
        },



        intersectOne: function(other) {
            if( this._dirty ) {
                this._updateCoordinate();
            }
            if( other._dirty ) {
                other._updateCoordinate();
            }

            return (this._offsetX < other._offsetX + other.width) && (other._offsetX < this._offsetX + this.width) &&
                   (this._offsetY < other._offsetY + other.height) && (other._offsetY < this._offsetY + this.height);
        },

        // 거리 충돌
        within: function(other, distance) {
            if( this._dirty ) {
                this._updateCoordinate();
            }
            if( other._dirty ) {
                other._updateCoordinate();
            }

            if( distance == null ) {
                distance = (this.width + this.height + other.width + other.height) / 4;
            }

            var tmp;

            return (tmp = this._offsetX - other.offsetX + (this.width - other.width) / 2) * tmp +
                   (tmp = this._offsetY - other.offsetY + (this.height - other.height) / 2) * tmp < distance * distance;
        },

        enableCollection: function() {
            this.on(adun.Event.ADDED_TO_SCENE, this._addSelftToCollection);
            this.on(adun.Event.REMOVED_FROM_SCENE, this._removeSelftToCollection);

            if( this.scene ) {
                this._addSelftToCollection();
            }
        },

        disableCollection: function() {
            this.removeEventListenr(adun.Event.ADDED_TO_SCENE, this._addSelftToCollection);
            this.removeEventListenr(adun.Event.REMOVED_FROM_SCENE, this._removeSelftToCollection);

            if( this.scene ) {
                this._removeSelftToCollection();
            }
        },

        clearEventListener: function() {
            this.super();
            if( this.scene ) {
                this._removeSelftToCollection();
            }
        },

        getPrototype: function() {

            return Object.getPrototypeOf(this);

        },

        _addSelftToCollection: function() {
            if( this._isContainedInCollection ) {
                return;
            }

            var prototype = this.getPrototype();

            prototype._collectionTarget.forEach(function(c) {
                c.collection.push(this);
            }, this);

            this._isContainedInCollection = true;
        },

        _removeSelftToCollection: function() {
            if( !this._isContainedInCollection ) {
                return;
            }

            var i, prototype = this.getPrototype();

            prototype._collectionTarget.forEach(function(c) {
                i = c.collection.indexOf(this);

                if( i !== -1 ) {
                    c.collection.splice(i, 1);
                }
            }, this);

            this._isContainedInCollection = false;
        },

        getBoundingRect: function() {
            var w, h, mat;

            w = this.width || 0;
            h = this.height || 0;
            mat = this._matrix;

            var m11w = mat[0] * w, m12w = mat[1] * w,
                m21h = mat[3] * h, m22h = mat[4] * h,
                mdx  = mat[2]    , mdy  = mat[5];

            var xw = [mdx, m11w + mdx, m21h + mdx, m11w + m21h + mdx].sort(function(a, b) { return a - b ; });
            var yh = [mdy, m12w + mdy, m22h + mdy, m12w + m22h + mdy].sort(function(a, b) { return a - b ; });

            return {
                left: xw[0],
                top: yh[0],
                width: xw[3] - xw[0],
                height: yh[3] - yh[0]
            };
        },

        getOrientedBoundingRect: function() {
            var w, h, mat;

            w = this.width || 0;
            h = this.height || 0;
            mat = this._matrix;

            var m11w = mat[0] * w, m12w = mat[1] * w,
                m21h = mat[3] * h, m22h = mat[4] * h,
                mdx  = mat[2]    , mdy  = mat[5];

            return {
                leftTop: [ mdx, mdy ],
                rightTop: [ m11w + mdx, m12w + mdy ],
                leftBottom: [ m21h + mdx, m22h + mdy ],
                rightBottom: [ m11w + m21h + mdx, m12w + m22h + mdy ]
            };
        }

    });


    function _intersectBetweenClassAndInstace(Class, instance) {
        var c, i, len, ret = [];

        for( c = 0, len = Class.collection.length; i < len; ++i ) {
            c = Class.collection[i];

            if( instance._intersectOne(c) ) {
                ret.push(c);
            }
        }

        return ret;
    }

})();
