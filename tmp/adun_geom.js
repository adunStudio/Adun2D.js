
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

})();

