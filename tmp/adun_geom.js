
// #Geom
(function() {
     'use strict';

    var Geom = adun.Geom = {};

    // #AABB
    var AABB = Geom.AABB = adun.Class({
        TYPE: 'AABB',

        init: function(cx, cy, width, height) {
            this.cx = adun.isNumber(cx) ? cx : 0;
            this.cy = adun.isNumber(cy) ? cy : 0;
            this.halfWidth = adun.isNumber(width) ? width / 2 : 0;
            this.halfHeight = adun.isNumber(height) ? height / 2 : 0;
        },

        height: {
            get: function() {
                return this.halfHeight * 2;
            }
        },

        width: {
            get: function() {
                return this.halfWidth * 2;
            },

            enumerable: true,
            configurable: true
        },

        draw: function(ctx) {

            ctx.beginPath();
            ctx.moveTo(this.cx - this.halfWidth, this.cy);
            ctx.lineTo(this.cx + this.halfWidth, this.cy);
            ctx.moveTo(this.cx, this.cy - this.halfHeight);
            ctx.moveTo(this.cx, this.cy + this.halfHeight);
            ctx.stroke();

            return this;
        },

        setPosition: function(cx, cy) {
            this.cx = cx;
            this.cy = cy;

            return this;
        },

        setPositionPoint: function(pos) {
            this.cx = pos.x;
            this.cy = pos.y;

            return this;
        },

        toRect: function() {
            return new Geom.Rectangle(this.cx - this.halfWidth, this.cy - this.halfHeight, this.halfWidth * 2, this.halfHeight * 2);
        },

        fromRect: function(rect) {
            this.halfWidth = rect.width / 2;
            this.halfHeight = rect.height / 2;
            this.cx = rect.x + this.halfWidth;
            this.cy = rect.y + this.halfHeight;

            return this;
        }
    });


    // #Circle
    var Circle = Geom.Circle = adun.Class({
        TYPE: 'Circle',

        init: function(x, y, diameter) {
            x = adun.isNumber(x) ? x : 0;
            y = adun.isNumber(y) ? y : 0;
            diameter = adun.isNumber(diameter) ? diameter : 0;

            this._diameter = 0;

            this._radius = 0;

            this.x = 0;

            this.y = 0;

            this.setTo(x, y, diameter);
        },

        diameter: {
            get: function() {
                return this._diameter;
            },

            set: function(diameter) {
                if( diameter > 0 && diameter != this._diameter ) {
                    this._diameter = diameter;
                    this._radius = diameter * 0.5;
                }
            }
        },

        radius: {
            get: function() {
                return this._radius;
            },

            set: function(radius) {
                if( radius > 0 && radius != this._radius ) {
                    this._radius = radius;
                    this._diameter = radius * 2;
                }
            }
        },

        circumference: {
            get: function() {
                return 2 * (Math.PI * this._radius);
            }
        },

        bottom: {
            get: function() {
                return this.y + this._radius;
            },

            set: function(bottom) {
                if( !isNaN(bottom) ) {
                     if( bottom < this.y ) {
                         this._radius = 0;
                         this._diameter = 0;
                     } else {
                         this.radius = bottom - this.y;
                     }
                }
            }
        },

        left: {
            get: function() {
                return this.x - this._radius;
            },

            set: function(left) {
                if( !isNaN(left) ) {
                    if( left < this.x ) {
                        this.radius = this.x - left;
                    } else {
                        this._radius = 0;
                        this._diameter = 0;
                    }
                }
            }
        },

        right: {
            get: function() {
                return this.x + this._radius;
            },

            set: function(right) {
                if( !isNaN(right) ) {
                    if( right > this.x ) {
                        this.radius = value - this.x;
                    } else {
                        this._radius = 0;
                        this._diameter = 0;
                    }
                }
            }
        },

        area: {
            get: function() {
                if( this._radius > 0 ) {
                    return Math.PI * this._radius * this._radius;
                } else {
                    return 0;
                }
            }
        },

        isEmpty: {
            get: function() {
                return this._diameter <= 0;
            }
        },

        clone: function(output) {
            if( adun.isUndefined(output) ) {
                output = new Geom.Circle();
            }

            return output.setTo(this.x, this.y, this._diameter);
        },

        copyFrom: function(source) {
            return this.setTo(source.x, source.y, source.diameter);
        },

        copyTo: function(target) {
            return target.copyFrom(this);
        },

        distanceTo: function(target, round) {
            if( adun.isUndefined(round) ) {
                round = false;
            }

            var dx, dy;

            dx = this.x - target.x;
            dy = this.y - target.y;

            if( round === true ) {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            } else {
                return Math.sqrt(dx * dx + dy * dy);
            }
        },

        equals: function(toCompare) {
            return this.x === toCompare.x && this.y === toCompare.y && this.diameter === toCompare.diameter;
        },

        intersects: function(toIntersect) {
            return this.distanceTo(toIntersect, false) < this._radius + toIntersect._radius;
        },

        circumferencePoint: function(angle, asDegrees, output) {
            if( adun.isUndefined(asDegrees) ) {
                asDegrees = false;
            }
            if( adun.isUndefined(output) ) {
                output = new Geom.Point();
            }

            if( asDegrees === true ) {
                angle = angle * (Math.PI / 180);
            }

            output.x = this.x + this._radius * Math.cos(angle);
            output.y = this.y + this._radius * Math.sin(angle);

            return output;
        },

        offset: function(dx, dy) {
            if( !isNaN(dx) && !isNaN(dy) ) {
                this.x += dx;
                this.y += dy;
            }

            return offset;
        },

        offsetPoint: function(point) {
            return this.offset(point.x, point.y);
        },

        setTo: function(x, y, diameter) {
            this.x = x;
            this.y = y;
            this._diameter = diameter;
            this._radius = diameter * 0.5;

            return this;
        },

        toString: function() {
            return "[{Circle (x=" + this.x + " y=" + this.y + " diameter=" + this.diameter + " radius=" + this.radius + ")}]";
        }
    });

    // #Line
    var Line = Geom.Line = adun.Class({
        TYPE: 'Line',

        init: function(x1, y1, x2, y2) {
            x1 = adun.isNumber(x1) ? x1 : 0;
            y1 = adun.isNumber(y1) ? y1 : 0;
            x2 = adun.isNumber(x2) ? x2 : 0;
            y2 = adun.isNumber(y2) ? y2 : 0;

            this.x1 = 0;
            this.y1 = 0;
            this.x2 = 0;
            this.y2 = 0;

            this.setTo(x1, y1, x2, y2);
        },

        length: {
            get: function() {
                return Math.sqrt((this.x2 - this.x1) * (this.x2 - this.x1) + (this.y2 - this.y1) * (this.y2 - this.y1));
            }
        },

        angle: {
            get: function() {
                return Math.atan2(this.y2 - this.y1, this.x2 - this.x1);
            }
        },

        slope: {  // 기울기 y의 증가량 / x의 증가량
            get: function() {
                return (this.y2 - this.y1) / (this.x2 - this.x1);
            }
        },

        perpslope: { // 90도로 교차하는 기울기
            get: function() {
                return -((this.x2 - this.x1) / (this.y2 - this.y1));
            }
        },

        yIntercept: { // y절편   y = ax + b 에서 b가 y절편
            get: function() {
                return (this.y1 - this.slope * this.x1);
            }
        },

        getY: function(x) {    // y = ax + b
            if( this.x1 === this.x2 ) {
                return null;
            } else {
                return this.slope * x + this.yIntercept;
            }
        },

        isPointOnLine: function(x, y) {
            return ((x - this.x1) * (this.y2 - this.y1) === (this.x2 - this.x1) * (y - this.y1));
        },

        isPointOnLineSegment: function(x, y) {
            var xMin = Math.min(this.x1, this.x2);
            var xMax = Math.max(this.x1, this.x2);
            var yMin = Math.min(this.y1, this.y2);
            var yMax = Math.max(this.y1, this.y2);

            return ( this.isPointOnLine(x, y) && (x >= xMin && x <= xMax) && (y >= yMin && y <= yMax) );
        },

        intersectLineLine: function(line) {
            return Geom.Intersect.lineToLine(this, line);
        },

        perp: function(x, y, output) {
            if( adun.isUndefined(output) ) {
                output = new Geom.Line();
            }

            var pt, yInt;

            // 만약 수평선이라면 수직선 리턴
            if( this.y1 === this.y2 ) {
                ouptput.setTo(x, y, x, this.y1);

                return output;
            }

            // 만약 수직선이라면 수평선 리턴
            if( this.x1 === this.x2 ) {
                output.setTo(x, y, this.x1, y);

                return output;
            }

            yInt = (y - this.perpslope * x);

            if( x !== 0 ) {
                pt = this.intersectLineLine({ x1: x, y1: y, x2: 0, y2: yInt });
            } else {
                pt = this.intersectLineLine({ x1: x, y1: y, x2: 1, y2: yInt + this.perpSlope });
            }

            output.setTo(x, y, pt.x, pt.y);

            return output;
        },

        clone: function(output) {
            if( adun.isUndefined(output) ) {
                output = new Geom.Line();
            }

            return output.setTo(this.x1, this.y1, this.x2, this.y2);
        },

        copyFrom: function(source) {
            return this.setTo(source.x1, source.y1, source.x2, source.y2);
        },

        copyTo: function(target) {
            return target.copyFrom(this);
        },

        setTo: function(x1, y1, x2, y2) {
            x1 = adun.isNumber(x1) ? x1 : 0;
            y1 = adun.isNumber(y1) ? y1 : 0;
            x2 = adun.isNumber(x2) ? x2 : 0;
            y2 = adun.isNumber(y2) ? y2 : 0;

            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;

            return this;
        },

        toString: function() {
            return "[{Line (x1=" + this.x1 + " y1=" + this.y1 + " x2=" + this.x2 + " y2=" + this.y2 + ")}]";
        }
    });


    // #Ray
    var Ray = Geom.Ray = adun.Class({
        extend: Geom.Line,
        TYPE: 'Ray',

        init: function(x1, y1, x2, y2) {
            this.super(x1, y1, x2, y2);
        },

        clone: function(output) {
            if( adun.isUndefined(output) ) {
                output = new Geom.Ray();
            }

            return output.setTo(this.x1, this.y1, this.x2, this.y2);
        },

        isPointOnRay: function(x, y) {
            if( (x - this.x1) * (this.y2 - this.y1) === (this.x2 - this.x1) * (y - this.y1) ) {
                if( Math.atan2(y - this.y1, x - this.x1) === Math.atan2(this.y2 - this.y1, this.x2 - this.x1) ) {
                    return true;
                }
            }

            return false;
        },

        toString: function() {
            return "[{Ray (x1=" + this.x1 + " y1=" + this.y1 + " x2=" + this.x2 + " y2=" + this.y2 + ")}]";
        }
    });

    // #Rectangle
    var Rectangle = Geom.Rectangle = adun.Class({
        TYPE: 'Rectangle',

        init: function(x, y, width, height) {
            x = adun.isNumber(x) ? x : 0;
            y = adun.isNumber(y) ? y : 0;
            width = adun.isNumber(width) ? width : 0;
            height = adun.isNumber(height) ? height : 0;

            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;

            this.setTo(x, y, width, height);
        },

        bottom: {
            get: function() {
                return this.y + this.height;
            },
            set: function(bottom) {
                if( bottom ) {
                    if( bottom < this.y ) {
                        this.height = 0;
                    } else {
                        this.height = value;
                    }
                }
            }
        },

        center: {
            get: function() {
                var output = new Geom.Point();
                return output.setTo(Math.round(this.width / 2), Math.round(this.height / 2));
            }
        },

        bottomRight: {
            get: function() {
                var output = new Geom.Point();
                return output.setTo(this.right, this.bottom);
            },
            set: function(value) {
                if( value ) {
                    this.right = value.x;
                    this.bottom = value.y;
                }
            }
        },

        left: {
            get: function() {
                return this.x;
            },
            set: function(value) {
                if( value ) {
                    var diff = this.x - value;
                    if( this.width + diff < 0 ) {
                        this.width = 0;
                        this.x = value;
                    } else {
                        this.width += diff;
                        this.x = value;
                    }
                }
            }
        },

        right: {
            get: function() {
                return this.x + this.width;
            },
            set: function(value) {
                if( value ) {
                    if( value < this.x ) {
                        this.width = 0;
                    } else {
                        this.width = value - this.x;
                    }
                }
            }
        },

        size: {
            get: function() {
                var output = new Geom.Point();
                return output.setTo(this.width, this.height);
            }
        },

        volume: {
            get: function() {
                return this.width * this.height;
            }
        },

        // 둘레
        perimeter: {
            get: function() {
                return (this.width * 2) + (this.height * 2);
            }
        },

        top: {
            get: function() {
                return this.y;
            },
            set: function(value) {
                if( value ) {
                    var diff = this.y - value;
                    if( this.height + diff < 0 ) {
                        this.height = 0;
                        this.y = value;
                    } else {
                        this.height += diff;
                        this.y = value;
                    }
                }
            }
        },

        topLeft: {
            get: function() {
                var output = new Geom.Point();
                return output.setTo(this.x, this.y);
            },
            set: function(value) {
                if( value ) {
                    this.x = value.x;
                    this.y = value.y;
                }
            }
        },

        clone: function(output) {
            if( adun.isUndefined(output) ) {
                output = new Geom.Rectangle();
            }

            return output.setTo(this.x, this.y, this.width, this.height);
        },

        contains: function(x, y) {
            return x >= this.x && x <= this.right && y >= this.y && y <= this.bottom;
        },

        containsPoint: function(point) {
            return this.contains(point.x, point.y);
        },

        containsRect: function(rect) {
            if( rect.volume > this.volume ) {
                return false;
            }

            return rect.x >= this.x && rect.y >= this.y && rect.right <= this.right && rect.bottom <= this.bottom;
        },

        copyFrom: function(source) {
            return this.setTo(source.x, source.y, source.width, source.height);
        },

        copyTo: function(target) {
            if( adun.isUndefined(target) ) {
                target = new Geom.Rectangle();
            }

            return target.copyFrom(this);
        },

        equals: function(toCompare) {
            return this.x === toCompare.x && this.y === toCompare.y && this.width === toCompare.width && this.height === toCompare.height;
        },

        // 부풀리기
        inflate: function(dx, dy) {
            if( !isNaN(dx) && !isNaN(dy) ) {
                this.x -= dx;
                this.width += 2 * dx;
                this.y -= dy;
                this.height += 2 * dy;
            }

            return this;
        },

        inflatePoint: function(point) {
            return this.inflate(point.x, point.y);
        },

        intersects: function(tointersect) {
            if( tointersect.x > this.right -1 ) {
                return false;
            }

            if( tointersect.right - 1 < this.x ) {
                return false;
            }

            if( tointersect.bottom -1 < this.y ) {
                return false;
            }

            if( tointersect.y > this.bottom -1 ) {
                return false;
            }

            return true;
        },

        intersection: function(toIntersect, output) {
            if( adun.isUndefined(output) ) {
                output = new Geom.Rectangle();
            }

            if( this.intersect(toIntersect) === true ) {
                output.x = Math.max(toIntersect.x, this.x);
                output.y = Math.max(toIntersect.y, this.y);
                output.width = Math.min(toIntersect.right, this.right) - output.x;
                output.height = Math.min(toIntersect.bottom, this.bottom) - output.y;
            }

            return output;
        },

        overlap: function(rect) {
            var result = {
                top: false,
                bottom: false,
                left: false,
                right: false,
                contains: false,
                contained: false
            };

            var interRect = this.intersection(rect);

            if( interRect.isEmpty )
                return result;
            if( this.containsRect(rect) )
                result.contains = true;
            if( rect.containsRect(this) )
                result.contained = true;
            if( this.top < rect.top )
                result.top = true;
            if( this.bottom > rect.bottom )
                result.bottom = true;
            if( this.left < rect.left )
                result.left = true;
            if( this.right > rect.right )
                result.right = true;

            return result;
        },

        isEmpty: function() {
            if( this.width < 1 || this.height < 1 ) {
                return true;
            }

            return false;
        },

        offset: function(dx, dy) {
            if( !isNaN(dx) && !isNaN(dy) ) {
                this.x += dx;
                this.y += dy;
            }

            return this;
        },

        offsetPoint: function(point) {
            return this.offset(point.x, point.y);
        },

        setEmtpty: function() {
            return this.setTo(0, 0, 0, 0);
        },

        setTo: function(x, y, width, height) {
            if (!isNaN(x) && !isNaN(y) && !isNaN(width) && !isNaN(height)) {
                this.x = x;
                this.y = y;
                if( width >= 0 ) {
                    this.width = width;
                }
                if( height >= 0 ) {
                    this.height = height;
                }
            }

            return this;
        },


        // 합집합
        union: function(toUnion, output) {
            if( adun.isUndefined(output) ) {
                output = new Geom.Rectangle();
            }

            return output.setTo(Math.min(toUnion.x, this.x), Math.min(toUnion.y, this.y), Math.max(toUnion.right, this.right), Math.max(toUnion.bottom, this.bottom));
        },

        scale: function(x, y, translation) {

        },

        toString: function() {
            return "[{Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + " isEmpty=" + this.isEmpty() + ")}]";
        }
    });


    // #Intersect
    var Intersect = Geom.Intersect = adun.Class({
        TYPE: 'Intersect',

        /**
         * 지정한 두개의 좌표사이의 거리를 반환한다.
         * @method distance
         *
         */
        distance: function(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        },

        /**
         * 지정한 두개의 좌표사이의 거리제곱을 반환한다.
         * @method distanceSquared
         */
        distanceSquared: function(x1, y1, x2, y2) {
            return Math.sqrt(x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        },

        /**
         * ------------------------------------------------------------------------
         * Lines
         * ------------------------------------------------------------------------
         */

        lineToLine: function(line1, line2, output) {
            if( adun.isUndefined(output) ) {
                output = new Geom.IntersectResult();
            }
            output.result = false;

            var d = (line1.x1 - line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 - line2.x2);

            if( d !== 0 ) {
                output.result = true;
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (line2.x1 - line2.x2) - (line1.x1 - line1.x2) * (line2.x1 * line2.y2 - line2.y1 * line2.x2)) / d;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 * line2.y2 - line2.y1 * line2.x2)) / d;
            }

            return output;
        },

        lineToLineSegment: function(line1, seg, output) {
            if( adun.isUndefined(output) ) {
                output = new Geom.IntersectResult();
            }
            output.result = false;

            var d = (line1.x1 - seg.x2) * (seg.y1 - seg.y2) - (line1.y1 - line1.y2) * (seg.x1 - seg.x2);

            if( d !== 0 ) {
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (seg.x1 - seg.x2) - (line1.x1 - line1.x2) * (seg.x1 * seg.y2 - seg.y1 * seg.x2)) / d;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (seg.y1 - seg.y2) - (line1.y1 - line1.y2) * (seg.x1 * seg.y2 - seg.y1 * seg.x2)) / d;
                var maxX = Math.max(seg.x1, seg.x2);
                var minX = Math.min(seg.x1, seg.x2);
                var maxY = Math.max(seg.y1, seg.y2);
                var minY = Math.min(seg.y1, seg.y2);
                if ( (output.x <= maxX && output.x >= minX) === true && (output.y <= maxY && output.y >= minY) === true ) {
                    output.result = true;
                }
            }

            return output;
        }



    });



    // #IntersectResult
    var IntersectResult = Geom.IntersectResult = adun.Class({
        TYPE: 'IntersectResult',

        init: function() {
            this.result = false;
        },


        setTo: function(x1, y1, x2, y2, width, height) {
            this.x1 = adun.isNumber(x1) ? x1 : 0;
            this.y1 = adun.isNumber(y1) ? y1 : 0;
            this.x2 = adun.isNumber(x2) ? x2 : 0;
            this.y2 = adun.isNumber(y2) ? y2 : 0;
            this.width = adun.isNumber(width) ? width : 0;
            this.height = adun.isNumber(height) ? height : 0;
        }
    });


    // #Point
    var Point = Geom.Point = adun.Class({
        TYPE: 'Point',

        init: function(x, y) {
            x = adun.isNumber(x) ? x : 0;
            y = adun.isNumber(x) ? y : 0;

            this.setTo(x, y);
        },

        polar: function(distance, angle) {
            this.x = distance * Math.cos(angle);
            this.y = distance * Math.sin(angle);

            return this;
        },

        add: function(toAdd, output) {
            if( adun.isUndefined(output) ) {
                output = new Geom.Point();
            }

            return output.setTo(this.x + toAdd.x, this.y + toAdd.y);
        },

        addTo: function(x, y) {
            x = adun.isNumber(x) ? x : 0;
            y = adun.isNumber(x) ? y : 0;

            return this.setTo(this.x + x, this.y + y);
        },

        subtractFrom: function(x, y) {
            x = adun.isNumber(x) ? x : 0;
            y = adun.isNumber(x) ? y : 0;

            return this.setTo(this.x - x, this.y - y);
        },

        invert: function() {
            return this.setTo(this.y, this.x);
        },

        clampX: function(min, max) {
            this.x = Math.max(Math.min(this.x, max), min);
            return this;
        },

        clampY: function(min, max) {
            this.y = Math.max(Math.min(this.y, max), min);
            return this;
        },

        clamp: function(x, y) {
            this.clampX(x);
            this.clampY(y);

            return this;
        },

        clone: function(output) {
            if( adun.isUndefined(output) ) {
                output = new Geom.Point();
            }

            return output.setTo(this.x, this.y);
        },

        copyFrom: function(source) {
            return this.setTo(source.x, source.y);
        },

        copyTo: function(target) {
            return target.setTo(this.x, this.y);
        },

        angleTo: function(target) {
            return Math.atan2(target.y - this.y, target.x - this.x);
        },

        angleToXY: function(x, y) {
            return Math.atan2(y - this.y, x - this.x);
        },

        distanceTo: function(target, round) {
            if( adun.isUndefined(round) ) {
                round = false;
            }
            var dx, dy;

            dx = this.x = target.x;
            dy = this.y - target.y;

            if( round === true ) {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            } else {
                return Math.sqrt(dx * dx + dy * dy);
            }
        },

        distanceToXY: function(x, y, round) {
            if( adun.isUndefined(round) ) {
                round = false;
            }
            var dx, dy;

            dx = this.x - x;
            dy = this.y - y;

            if( round === true ) {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            } else {
                return Math.sqrt(dx * dx + dy * dy);
            }
        },

        distanceBetween: function(pointA, pointB, round) {
            if( adun.isUndefined(round) ) {
                round = false;
            }
            var dx, dy;

            dx = pointA.x - pointB.x;
            dy = pointA.y - pointB.y;

            if( round === true ) {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            } else {
                return Math.sqrt(dx * dx + dy * dy);
            }
        },

        distanceCompare: function(target, distance) {
            return this.distanceTo(target) >= distance;
        }
    });

    Point.polar = function(length, angle) {
        return new Geom.Point(length * Math.cos(angle), length * Math.sin(angle));
    }



    // #Transform
    var Transform = Geom.Transform = adun.Class({
        TYPE: 'Transform',

        init: function(x, y, scaleX, scaleY, rotation, rotPointX, rotPointY) {
            if ( !adun.isNumber(x) ) { x = 0; }
            if ( !adun.isNumber(y) ) { y = 0; }
            if ( !adun.isNumber(scaleX) ) { scaleX = 1; }
            if ( !adun.isNumber(scaleY) ) { scaleY = 1; }
            if ( !adun.isNumber(rotation) ) { rotation = 0; }
            if ( !adun.isNumber(rotPointX) ) { rotPointX = 0; }
            if ( !adun.isNumber(rotPointY) ) { rotPointY = 0; }

            this._x = 0;
            this._y = 0;
            this._scaleX = 1;
            this._scaleY = 1;
            this._rotation = 0;
            this._rotPointX = 0;
            this._rotPointY = 0;
            this._parent = null;
            this._locked = false;
            this._ignoreParent = false;
            this._ignoreChild = false;
            this._dirty = true;

            this.setTransform(x, y, scaleX, scaleY, rotation, rotPointX, rotPointY);

            this._matrix = new Geom.Matirx();
            this._cachedConcatenatedMatrix = new Geom.Matirx();
            this._matrix.setFromOffsetTransform(this._x, this._y, this._scaleX, this._scaleY, this._rotation, this._rotPointX, this._rotPointY);
        },

        x: {
            get: function() {
                return this._x;
            },
            set: function(value) {
                this._x = value;
                this._dirty = true;
            }
        },

        y: {
            get: function() {
                return this._y;
            },
            set: function(value) {
                this._y = value;
                this._dirty = true;
            }
        },

        scaleX: {
            get: function() {
                return this._scaleX;
            },
            set: function(value) {
                this._scaleX = value;
                this._dirty = true;
            }
        },

        scaleY: {
            get: function() {
                return this._scaleY;
            },
            set: function(value) {
                this._scaleY = value;
                this._dirty = true;
            }
        },

        rotation: {
            get: function() {
                return this._rotation;
            },
            set: function(value) {
                this._rotation = value;
                this._dirty = true;
            }
        },

        rotPointX: {
            get: function() {
                return this._rotPointX;
            },
            set: function(value) {
                this._rotPointX = value;
                this._dirty = true;
            }
        },

        rotPointY: {
            get: function() {
                return this._rotPointY;
            },
            set: function(value) {
                this._rotPointY = value;
                this._dirty = true;
            }
        },

        anchorPointX: {
            get: function() {
                return this.rotPointX;
            },
            set: function(value) {
                this.rotPointX = value;
            }
        },

        anchorPointY: {
            get: function() {
                return this.rotPointY;
            },
            set: function(value) {
                this.rotPointY = value;
            }
        },

        matrix: {
            get: function() {
                return this._matrix;
            }
        },

        worldX: {
            get: function() {
                return this.getConcatenateMatirx().tx - this._rotPointX;
            }
        },

        worldY: {
            get: function() {
                return this.getConcatenateMatirx().ty - this._rotPointY;
            }
        },

        parent: {
            get: function() {
                return this._parent;
            },
            set: function(value) {
                if( !this.checkAncestor(value) ) {
                    this._parent = value;
                    this._dirty = true;
                }
            }
        },

        locked: {
            get: function() {
                return this._locked;
            },
            set: function(value) {
                this._locked = value;
                if( this._locked ) {
                    this._matrix.setFromOffsetTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.anchorPointX, this.anchorPointY);
                }
            }
        },

        ignoreParent: {
            get: function() {
                return this._ignoreParent;
            },
            set: function(value) {
                this._ignoreParent = value;
            }
        },

        ignoreChild: {
            get: function() {
                return this._ignoreParent;
            },
            set: function(value) {
                this._ignoreChild = value;
            }
        },

        scale: {
            set: function(value) {
                this._scaleX = value;
                this._scaleY = value;
                this._dirty = true;
            }
        },

        setPosition: function(x, y) {
            this._x = x;
            this._y = y;
            this._dirty = true;

            return this;
        },

        setPositionFromPoint: function(point) {
            return this.setPosition(point.x, point.y);
        },

        translatePositionFromPoint: function(point) {
            this._x += point.x;
            this._y += point.y;
            this._dirty = true;

            return this;
        },

        getPositionPoint: function(output) {
            if( adun.isUndefined(output) ) {
                output = new Geom.Point();

                return output.setTo(this._x, this._y);
            }
        },

        setTransform: function(x, y, scaleX, scaleY, rotation, rotPointX, rotPointY) {
            if ( !adun.isNumber(x) ) { x = 0; }
            if ( !adun.isNumber(y) ) { y = 0; }
            if ( !adun.isNumber(scaleX) ) { scaleX = 1; }
            if ( !adun.isNumber(scaleY) ) { scaleY = 1; }
            if ( !adun.isNumber(rotation) ) { rotation = 0; }
            if ( !adun.isNumber(rotPointX) ) { rotPointX = 0; }
            if ( !adun.isNumber(rotPointY) ) { rotPointY = 0; }

            this._x = x;
            this._y = y;
            this._scaleX = scaleX;
            this._scaleY = scaleY;
            this._rotation = rotation;
            this._rotPointX = rotPointX;
            this._rotPointY = rotPointY;
            this._dirty = true;

            return this;
        },

        getParentMatrix: function() {
            if( this._parent ) {
                return this._parent.getConcatenatedMatrix();
            }

            return null;
        },

        getConcatenatedMatrix: function() {
            if( this._drity && !this.locked ) {
                this._matrix.setFromOffsetTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.anchorPointX, this.anchorPointY);
            }

            this._cachedConcatenatedMatrix.copyFrom(this._matrix);

            if( this._parent && !this._parent.ignoreChild && !this.ignoreParent ) {
                this._cachedConcatenatedMatrix.tx -= this._parent.anchorPointX;
                this._cachedConcatenatedMatrix.ty -= this._parent.anchorPointY;
                this._cachedConcatenatedMatrix.prependMatrix(this.getParentMatrix());
            }

            this._dirty = false;

            return this._cachedConcatenatedMatrix;
        },

        transformPoint: function(point) {
            var mat = this.getConcatenatedMatrix;

            return mat.transformPoint(point);
        },

        copyFrom: function(source) {
            this.setTransform(source.x, source.y, source.scaleX, source.scaleY, source.rotation, source.rotPointX, source.rotPointY);
            this.praent = source.parent;
            this._matrix = source.matrix.clone();

            return this;
        },

        copyTo: function(destination) {
            destination.copyFrom(this);

            return this;
        },

        clone: function(output) {
            if( adun.isUndefined(output) ) {
                output = new Geom.Transform();
            }
            output.copyFrom(this);

            return output;
        },

        checkAncestor: function(){
            return false;
        },

        toString: function() {
            return "[{Transform (x=" + this._x + " y=" + this._y + " scaleX=" + this._scaleX + " scaleY=" + this._scaleY + " rotation=" + this._rotation + " regX=" + this._rotPointX + " regY=" + this.rotPointY + " matrix=" + this._matrix + ")}]";
        }
    });

    var Matrix = Geom.Matrix = adun.Class({
        TYPE: 'Matirx',

        init: function(a, b, c, d, tx, ty) {
            a = adun.isNumber(a) ? a : 1;
            b = adun.isNumber(b) ? b : 0;
            c = adun.isNumber(c) ? c : 0;
            d = adun.isNumber(d) ? d : 1;
            tx = adun.isNumber(tx) ? tx : 0;
            ty = adun.isNumber(ty) ? ty : 0;

            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.tx = 0;
            this.ty = 0;
        },

        setTo: function(a, b, c, d, tx, ty) {
            a = adun.isNumber(a) ? a : 1;
            b = adun.isNumber(b) ? b : 0;
            c = adun.isNumber(c) ? c : 0;
            d = adun.isNumber(d) ? d : 1;
            tx = adun.isNumber(tx) ? tx : 0;
            ty = adun.isNumber(ty) ? ty : 0;

            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;

            return this;
        },

        identity: function() {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.tx = 0;
            this.ty = 0;

            return this;
        },

        setFromTransform: function(tx, ty, scaleX, scaleY, rotation) {
            this.identity();

            var cos = Math.cos(rotation);
            var sin = Math.sin(rotation);

            this.append(cos * scaleX, sin * scaleX, -sin * scaleX, cos * scaleY, tx, ty);

            return this;
        },

        setFromOffsetTransform: function(tx, ty, scaleX, scaleY, rotation, rotPointX, rotPointY) {
            this.identity();

            var cos = Math.cos(rotation);
            var sin = Math.sin(rotation);

            this.append(cos * scaleX, sin * scaleX, -sin * scaleX, cos * scaleY, tx + rotPointX, ty + rotPointY);

            return this;
        },

        prepend: function(a, b, c, d, tx, ty) {
            a = adun.isNumber(a) ? a : 1;
            b = adun.isNumber(b) ? b : 0;
            c = adun.isNumber(c) ? c : 0;
            d = adun.isNumber(d) ? d : 1;
            tx = adun.isNumber(tx) ? tx : 0;
            ty = adun.isNumber(ty) ? ty : 0;

            var tx1 = this.tx;
            var a1 = this.a;
            var c1 = this.c;

            this.a = a1 * a + this.b * c;
            this.b = a1 * b + this.b * d;
            this.c = c1 * a + this.d * c;
            this.d = c1 * b + this.d * d;
            this.tx = tx1 * a + this.ty * c + tx;
            this.ty = tx1 * b + this.ty * d + ty;

            return this;
        },

        prependMatrix: function(m) {
            var tx1 = this.tx;
            var a1 = this.a;
            var c1 = this.c;

            this.a = a1 * m.a + this.b * m.c;
            this.b = a1 * m.b + this.b * m.d;
            this.c = c1 * m.a + this.d * m.c;
            this.d = c1 * m.b + this.d * m.d;
            this.tx = tx1 * m.a + this.ty * m.c + m.tx;
            this.ty = tx1 * m.b + this.ty * m.d + m.ty;

            return this;
        },

        append: function(a, b, c, d, tx, ty) {
            a = adun.isNumber(a) ? a : 1;
            b = adun.isNumber(b) ? b : 0;
            c = adun.isNumber(c) ? c : 0;
            d = adun.isNumber(d) ? d : 1;
            tx = adun.isNumber(tx) ? tx : 0;
            ty = adun.isNumber(ty) ? ty : 0;

            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;

            this.a = a * a1 + b * c1;
            this.b = a * b1 + b * d1;
            this.c = c * a1 + d * c1;
            this.d = c * b1 + d * d1;
            this.tx = tx * a1 + ty * c1 + this.tx;
            this.ty = tx * b1 + ty * d1 + this.ty;

            return this;
        },

        appendMatrix: function(m) {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;

            this.a = m.a * a1 + m.b * c1;
            this.b = m.a * b1 + m.b * d1;
            this.c = m.c * a1 + m.d * c1;
            this.d = m.c * b1 + m.d * d1;
            this.tx = m.tx * a1 + m.ty * c1 + this.tx;
            this.ty = m.tx * b1 + m.ty * d1 + this.ty;

            return this;
        },

        setPosition: function(x, y) {
            this.tx = x;
            this.ty = y;

            return this;
        },

        setPositionPoint: function(point) {
            this.tx = point.x;
            this.ty = point.y;

            return this;
        },

        getPosition: function(output) {
            if( adun.isUndefined(output) ) {
                output = new Geom.Point();
            }

            return output.setTo(this.tx, this.ty);
        },

        rotate: function(radians) {
            var cos = Math.cos(radians);
            var sin = Math.sin(radians);

            var a1 = this.a;
            var c1 = this.c;
            var tx1 = this.tx;

            this.a = a1 * cos - this.b * sin;
            this.b = a1 * sin + this.b * cos;
            this.c = c1 * cos - this.d * sin;
            this.d = c1 * sin + this.d * cos;
            this.tx = tx1 * cos - this.ty * sin;
            this.ty = tx1 * sin + this.ty * cos;

            return this;
        },

        translate: function(tx, ty) {
            this.tx += tx;
            this.ty += ty;

            return this;
        },

        scale: function(scaleX, scaleY) {
            this.a *= scaleX;
            this.d *= scaleY;

            return this;
        },

        transformPoint: function(point) {
            var x = point.x;
            var y = point.y;

            point.x = this.a * x + this.c * y + this.tx;
            point.y = this.b * x + this.d * y + this.ty;

            return point;
        },

        invert: function() {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            var tx1 = this.tx;

            var n = a1 * d1 - b1 * c1;

            this.a = d1 / n;
            this.b = -b1 / n;
            this.c = -c1 / n;
            this.d = a1 / n;
            this.tx = (c1 * this.ty - d1 * tx1) / n;
            this.ty = -(a1 * this.ty - b1 * tx1) / n;

            return this;
        },

        copyFrom: function(m) {
            this.a = m.a;
            this.b = m.b;
            this.c = m.c;
            this.d = m.d;
            this.tx = m.tx;
            this.ty = m.ty;

            return this;
        },

        copyTo: function(m) {
            m.a = this.a;
            m.b = this.b;
            m.c = this.c;
            m.d = this.d;
            m.tx = this.tx;
            m.ty = this.ty;

            return this;
        },

        clone: function() {
            return new Geom.Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
        },

        toString: function() {
            return "[{Matrix (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")}]";
        }

    });


})();

