
// #Geometry
// #adun.Geom
/**
 * 기하학과 기하학적 도형의 충돌을 다루는 클래스다.
 *
 * @module Adun
 * @submodule Geom
 */
(function(adun) {
    'use strict';

    var Geom = adun.Geom = {};
})(adun || (adun = {}));

// #AABB
/**
 * AABB(Axis Aligned Bounding Box)
 * 축 정렬 경계 박스
 * 2D 기준으로 x, y축에 평행한 경계를 만들어 낸다.
 * 장점: 충돌처리에 연산속도가 빠르며 직관적이다.
 * 단점: 회전하는 물체에 적합 하지않다.
 *
 * @Class AABB
 * @namespace Adun.Geom
 * @constructor
 * @param [cx=0] {Number} 박스 x축의 중앙 위치
 * @param [cy=0] {Number} 박스 y축의 중앙 위치
 * @param [width=0] {number} 박스의 넓이
 * @param [height=0] {number} 박스의 높이
 * @return {adun.Geom.AABB} AABB object
 */
(function(adun) {
    'use strict';

    var AABB = adun.Geom.AABB = adun.Class({
        TYPE: 'AABB',

        init: function(cx, cy, width, height) {

            /**
             * 박스 x축의 중앙 위치
             *
             * @property cx
             * @type {Number}
             * @default 0
             * @public
             */
            this.cx = 0;

            /**
             * 박스 y축의 중앙 위치
             *
             * @property cy
             * @type {Number}
             * @default 0
             * @public
             */
            this.cy = 0;

            /**
             * 박스 넓이의 절반
             *
             * @property halfWidth
             * @type {Number}
             * @default 0
             * @public
             */
            this.halfWidth = 0;

            /**
             * 박스 높이의 절반
             *
             * @property halfHeight
             * @type {Number}
             * @default 0
             * @public
             */
            this.halfHeight = 0;


            this.cx = cx || 0;
            this.cy = cy || 0;
            this.halfWidth = width / 2 || 0;
            this.halfHeight = height / 2 || 0;
        },

        height: {
            /**
             * 박스의 높이
             *
             * @property height
             * @type {Number}
             * @readyOnly
             * @public
             */
            get: function() {
                return this.halfWidth * 2;
            }
        },

        width: {
            /**
             * 박스의 넓이
             *
             * @property height
             * @type {Number}
             * @readyOnly
             * @public
             */
            get: function() {
                return this.width * 2;
            }
        },

        /**
         * 캔버스에 객체를 그린다.
         *
         * @method draw
         * @para ctx {CanvasRenderingContext2D} 그리고 싶은 캔버스의 컨텍스트
         * @return {adun.Geom.AABB}
         * @public
         */
        draw: function(ctx) {
            ctx.beginPath();
            ctx.moveTo(this.cx - this.halfWidth, this.cy);
            ctx.lineTo(this.cx + this.halfWidth, this.cy);
            ctx.moveTo(this.cx, this.cy - this.halfHeight);
            ctx.lineTo(this.cx, this.cy + this.halfHeight);
            ctx.stroke();
            return this;
        },

        /**
         * 객체의 새로운 위치를 설정한다.
         *
         * @method setPosition
         * @param cx {Number} 박스 x축의 새로운 중앙 위치
         * @param cy {Number} 박스 y축의 새로운 중앙 위치
         * @return {adun.Geom.AABB}
         * @public
         */
        setPosition: function(cx, cy) {
            this.cx = cx || 0;
            this.cy = cy || 0;

            return this;
        },

        /**
         * 객체의 새로운 위치를 포인트 객체로부터 설정한다.
         *
         * @method setPositionPoint
         * @param pos {adun.Geom.Point}
         * @return {adun.Geom.AABB}
         * @public
         */
        setPositionPoint: function(pos) {
            this.cx = pos.x;
            this.cy = pos.y;

            return this;
        },

        /**
         * Rectangle 객체로 반환한다.
         *
         * @method toRect
         * @return {adun.Geom.Rectangle}
         * @public
         */
        toRect: function() {
            return new adun.Geom.Rectangle(this.cx - this.halfWidth, this.cy - this.halfHeight, this.halfWidth * 2, this.halfHeight * 2);
        },

        /**
         * Rectangle으로부터 AABB의 치수를 받는다.
         *
         * @method setPositionPoint
         * @param rect {adun.Geom.Rectangle}
         * @return {adun.Geom.AABB}
         * @public
         */
        fromRect: function(rect) {
            this.halfWidth = rect.width / 2;
            this.halfHeight = rect.height / 2;
            this.cx = rect.x + this.halfWidth;
            this.cy = rect.y + this.halfHeight;

            return this;
        }
    });

})(adun || (adun = {}));

// #Circle
/**
 * Circle
 * 원
 * Circle 객체는 position에 의해 정의된 중심점(x, y)과 지름을 가진다.
 *
 * @Class Circle
 * @namespace Adun.Geom
 * @constructor
 * @param [x=0] {Number} 원의 중앙 x좌표
 * @param [y=0] {Number} 원의 중앙 y좌표
 * @param [diameter=0]{Number} 원의 지름
 * @return {adun.Geom.Circle} Circle object
 */
(function() {
    'use strict';

    var Circle = adun.Geom.Circle = adun.Class({
        TYPE: 'Circle',

        init: function(x, y, diameter) {

            /**
             * 원의 지름
             *
             * @property _diameter
             * @type {Number}
             * @default 0
             * @private
             */
            this._diameter = 0;

            /**
             * 원의 반지름
             *
             * @property _radius
             * @type {Number}
             * @default 0
             * @private
             */
            this._radius = 0;

            /**
             * 원의 중앙 x좌표
             *
             * @property x
             * @type {Number}
             * @default 0
             * @public 0
             */
            this.x = 0;

            /**
             * 원의 중앙 y좌표
             *
             * @property y
             * @type {Number}
             * @default 0
             * @public 0
             */
            this.y = 0;

            this.setTo(x, y, diameter);
        },

        diameter: {
            get: function() {
                return this._diameter;
            },
            /**
             * 원의 지름(diameter)
             * 원안의 어떤 두점 사이의 가장 큰 거리이다.
             * 반지름(radius) * 2와 같다.
             *
             * @property diameter
             * @type {Number}
             * @public
             */
            set: function(valued) {
                if( value > 0 ) {
                    this._daimater = value;
                    this._radius = value * 0.5;
                }
            }
        },

        radius: {
            get: function() {
                return this._radius;
            },
            /**
             * 원의 반지름(radius)
             * 원의 중심으로부터 원의 어떤 선까지의 거리이다.
             *
             * @property radius
             * @type {Number}
             * @public
             */
            set: function(value) {
                if( value > 0 ) {
                    this._radius = value;
                    this._daimater = value * 2;
                }
            }
        },

        circumference: {
            /**
             * 원의 둘레(circumference)
             *
             * @property circumference
             * @type {Number}
             * @readOnly
             * @public
             */
            get: function() {
                return 2 * (Math.PI * this._radius);
            }
        },

        top: {
            get: function() {
                return this.y - this._radius;
            },
            /**
             * top
             * 원의 가장 위 y좌표 값이다.
             * 원의 y좌표 값과 반지름의 '차' 이다.
             * top 프로퍼티값을 바꾸는것은 원 객체의 지름을 바꾸며, 원 객체의 x,y 좌표값에는 아무런 영향을 끼치지 않는다.
             *
             * @property top
             * @type {Number}
             * @public
             */
            set: function(value) {
                if ( adun.isNumber(value) ) {
                    if( value > this.y ) {
                        this._radius = 0;
                        this._diameter = 0;
                    } else {
                        this.radius = this.y - value;
                    }
                }
            }
        },

        bottom: {
            get: function() {
                return this.y + this._radius;
            },
            /**
             * bottom
             * 원의 가장 아래 y좌표 값이다.
             * 원의 y좌표 값과 반지름의 '합' 이다.
             * bottom 프로퍼티값을 바꾸는것은 원 객체의 지름을 바꾸며, 원 객체의 x,y 좌표값에는 아무런 영향을 끼치지 않는다.
             *
             * @property bottom
             * @type {Number}
             * @public
             */
            set: function(value) {
                if ( adun.isNumber(value) ) {
                    if( value < this.y ) {
                        this._radius = 0;
                        this._diameter = 0;
                    } else {
                        this.radius = value - this.y;
                    }
                }
            }
        },

        left: {
            get: function() {
                return this.x - this._radius;
            },
            /**
             * left
             * 원의 가장 왼쪽 x좌표이다.
             * 원의 x좌표 값과 반지름의 '차' 이다.
             * left 프로퍼티값을 바꾸는것은 원 객체의 지름을 바꾸며, 원 객체의 x,y 좌표값에는 아무런 영향을 끼치지 않는다.
             *
             * @property left
             * @type {Number}
             * @public
             */
            set: function(value) {
                if ( adun.isNumber(value) ) {
                    if( value < this.x ) {
                        this.radius = this.x - value;
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
            /**
             * right
             * 원의 가장 오른쪽 x좌표이다.
             * 원의 x좌표 값과 반지름의 '합' 이다.
             * right 프로퍼티값을 바꾸는것은 원 객체의 지름을 바꾸며, 원 객체의 x,y 좌표값에는 아무런 영향을 끼치지 않는다.
             *
             * @property right
             * @type {Number}
             * @public
             */
            set: function(value) {
                if ( adun.isNumber(value) ) {
                    if( value > this.x ) {
                        this.radius = value - this.x;
                    } else {
                        this._radius = 0;
                        this._diameter = 0;
                    }
                }
            }
        },

        area: {
            /**
             * 원의 넓이(area)
             *
             * @property area
             * @type {Number}
             * @readOnly
             * @public
             */
            get: function() {
                if( this._radius > 0 ) {
                    return Math.PI * this._radius * this._radius;
                }
            }
        },

        isEmpty: {
            /**
             * 원이 빈원인인지 아닌지 반환한다.
             * 원의 지름이 0과 같거나 작으면 true, 아니면 false
             *
             * @property isEmpty
             * @return {Boolean}
             * @public
             */
            get: function() {
                return this._daimater <= 0;
            }
        },

        /**
         * 원의 중앙 x, y좌표와 지름을 설정한다.
         *
         * @method setTo
         * @param x
         * @param y
         * @param diameter
         * @return {adun.Geom.Circle}
         * @public
         */
        setTo: function(x, y, diameter) {
            this.x = x || 0;
            this.y = y || 0;
            this._diameter = diameter || 0;
            this._radius = diameter * 0.5 || 0;

            return this;
        },

        /**
         * 같은 프로퍼티 x, y, 지름, 반지름 값을 가진 새로운 Circle 객체를 반환한다.
         *
         * @method clone
         * @param [output=adun.Circle] {adun.Geom.Circle}
         * @return {adun.Geom.Circle}
         * @public
         */
        clone: function(output) {
            if( adun.isUndefined(output) ) { output = new Circle(); }

            return output.setTo(this.x, this.y, this._daimater);
        },

        /**
         * 다른 Circle 객체로부터 프로퍼티 x, y, 지름, 반지름 값을 이 Circle 객체로 복사한다.
         *
         * @param source {adun.Geom.Circle}
         * @return {adun.Geom.Circle}
         * @public
         */
        copyFrom: function(source) {
            return this.setTo(source.x, source.y, source.diameter);
        },

        /**
         * 이 Circle 객체의 프로퍼티 값을 파라미터로 받은 Circle 객체에 복사하여 파라미터로 받은 Circle 객체를 반환한다.
         *
         * @param target {adun.Geom.Circle} this 객체를 복사하여 반환할 객체
         * @return {adun.Geom.Circle}
         * @public
         */
        copyTo: function(target) {
            return target.copyFrom(this);
        },

        /**
         * 이 Circle 객체의 중심과 파리미터로 받은 객체의 중심사이의 거리를 반환한다.
         * 파라미터로 받은 객체는 Circle, Point등 x, y값이 있으면 어느것도 가능하다.
         *
         * @param target {Any} Circle, Point등 x, y값이 있으면 어느것도 가능하다.
         * @param [round= false] {Boolean} 가장 가까운 정수로 반올림한다. (default false)
         * @return {Number}
         * @public
         */
        distanceTo: function(target, round) {
            if( adun.isUndefined(round) ) { round = false }

            var dx = this.x - target.x;
            var dy = this.y - target.y;

            if( round ) {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            } else {
                return Math.sqrt(dx * dx + dy * dy);
            }
        },

        /**
         * 파라미터로 받은 Circle 객체와 프로퍼티 x, y, diameter(지름) 값이 같은지 비교한다.
         *
         * @method equals
         * @param toCompare {adun.Geom.Circle}
         * @return {Boolean}
         * @public
         */
        equals: function(toCompare) {
            return this.x === toCompare.x && this.x === toCompare.y && this.diameter === toCompare.diameter;
        },

        /**
         * 두개의 Circle 객체가 충돌햇는지 검사한다.
         *
         * @method intersects
         * @param toIntersect {adun.Geom.Circle}
         * @return {Boolean}
         * @public
         */
        intersects: function(toIntersect) {
            return this.distanceTo(toIntersect, false) < (this._radius + toIntersect._radius);
        },

        /**
         * 주어진 각도에 기반하여 이 CIrcle 객체의 둘레에서 하나의 점 좌표를 반환한다..
         *
         * @method circumferencePoint
         * @param angle {Number} 다윈가 라디안 또는 도
         * @param [asDegrees=false] 주어진 angle의 단위가 도이면 true, 라디안이면 false (dafault=false)
         * @param [output=adun.Geom.Point]
         * @return {adun.Geom.Point}
         * @public
         */
        circumferencePoint: function(angle, asDegrees, output) {
            if( adun.isUndefined(asDegrees) ) { asDegrees = false }
            if( adun.isUndefined(output) ) { output = new adun.Geom.Point; }

            if( asDegrees ) {
                angle = angle * (Math.PI / 180);  // Radians -> Degree
            }

            output.x = this.x + this._radius * Math.cos(angle);
            output.y = this.x + this._radius * Math.sin(angle);

            return output;
        },

        /**
         * Circle 객체의 중심좌표(x, y)의 위치를 주어진 값만큼 조정한다.
         *
         * @method offset
         * @param dx {Number} Circle 객체의 x값을 이동한다.
         * @param dy {Number} Circle 객체의 y값을 이동한다.
         * @return {adun.Geom.Circle}
         * @public
         */
        offset: function(dx, dy) {
            if( adun.isNumber(dx) && adun.isNumber(dy) ) {
                this.x += dx;
                this.y += dy;
            }

            return this;
        },

        /**
         * Point 객체를 이용하여 Circle 객체의 중심좌표(x, y)의 위치를 주어진 값만큼 조정한다.
         *
         * @method offset
         * @param post {adun.Geom.Point}
         * @return {adun.Geom.Circle}
         * @public
         */
        offsetPoint: function(pos) {
            return this.offset(pos.x, pos.y);
        }
    });
})();

// #Line
/**
 * Line
 * 선
 * Line(선) 객체는 두가지 의미가 있는데 필요로 하는 상황에 따라 다르다.
 * 1. 무한한 선
 * 2. 두개의 지정한 위치 사이의 선
 *
 * @Class Line
 * @namespace Adun.Geom
 * @constructor
 * @param [x1=0] {Number} 선의 시작 x 좌표
 * @param [y1=0] {Number} 선의 시작 y 좌표
 * @param [x2=0] {Number} 선의 끝 x 좌표
 * @param [y2=0] {Number} 선의 끝 y 좌표
 * @return {adun.Geom.Line} Line object
 */
(function() {
    'use strict';
    var Line = adun.Geom.Line = adun.Class({
        TYPE: 'Line',

        init: function(x1, y1, x2, y2) {

            /**
             * 선의 시작 x좌표
             *
             * @property x1
             * @type {Number}
             * @default 0
             * @public
             */
            this.x1 = 0;

            /**
             * 선의 시작 y좌표
             *
             * @property y1
             * @type {Number}
             * @default 0
             * @public
             */
            this.y1 = 0;

            /**
             * 선의 끝 x좌표
             *
             * @property x2
             * @type {Number}
             * @default 0
             * @public
             */
            this.x2 = 0;

            /**
             * 선의 끝 y좌표
             *
             * @property y2
             * @type {Number}
             * @default 0
             * @public
             */
            this.y2 = 0;

            this.setTo(x1, y1, x2, y2);
        },

        length: {
            /**
             * 선의 길이
             *
             * @property length
             * @type {Number}
             * @readyOnly
             * @public
             */
            get: function() {
                Math.sqrt((this.x2 - this.x1) * (this.x2 - this.x1) + (this.y2 - this.y1) *(this.y2 - this.y1));
            }
        },

        angle: {
            /**
             * 선의 각도(라디안)
             * Math.atan2(y, x)
             *
             * @property angle
             * @type {Number}
             * @readyOnly
             * @public
             */
            get: function() {
                return Math.atan2(this.y2 - this.y1, this.x2 - this.x1);
            }
        },

        slope: {
            /**
             * 선의 기울기
             * y의 증가량 / x의 증갈야 (y/x)
             *
             * @property angle
             * @type {Number}
             * @readyOnly
             * @public
             */
            get: function() {
                return (this.y2 - this.y1) / (this.x2 - this.x1);
            }
        },

        perpSlope: {
            /**
             * 선의 90도로 교차하는 기울기
             *
             * @property angle
             * @type {Number}
             * @readyOnly
             * @public
             */
            get: function() {
                return -((this.x2 - this.x1) / (this.y2 - this.y1));
            }
        },

        yIntercept: {
            /**
             * 선의 y 절편
             * y = ax + b 에서 b가 절편
             *
             * @property yIntercept
             * @type {Number}
             * @readOnly
             * @public
             */
            get: function() {
                return (this.y1 - this.slope * this.x1);
            }
        },

        /**
         * Line 객체의 좌표를 설정한다.
         *
         * @method setTo
         * @param x1 시작 x좌표
         * @param y1 시작 y좌표
         * @param x2 끝 x 좌표
         * @param y2 끝 y 좌표
         * @return {adun.Geom.Line}
         * @public
         */
        setTo: function(x1, y1, x2, y2) {
            this.x1 = x1 || 0;
            this.y1 = y1 || 0;
            this.x2 = x2 || 0;
            this.y2 = y2 || 0;

            return this;
        },

        /**
         * 같은 프로퍼티 값을 가진 새로운 Line 객체를 반환한다.
         *
         * @method clone
         * @param [output=adun.Geom.Line] {adun.Geom.Line}
         * @return {adun.Geom.LIne}
         * @public
         */
        clone: function(output) {
            if( adun.isUndefined(output) ) { output = new Line(); }

            return output.setTo(this.x1, this.y1, this.x2, this.y2);
        },

        /**
         * 다른 Line 객체의 프로퍼티 값을 이 Line 객체로 복사한다.
         *
         * @param source {adun.Geom.Line}
         * @return {adun.Geom.Line}
         * @public
         */
        copyFrom: function(source) {
            return this.setTo(source.x1, source.y1, source.x2, source.y2);
        },

        /**
         * 이 Line 객체의 프로퍼티 값을 파라미터로 받은 Line 객체에 복사하여 반환한다.
         *
         * @param target {adun.Geom.Line} this 객체를 복사하여 반환할 객체
         * @return {adun.Geom.Line}
         * @public
         */
        copyTo: function(target) {
            return target.copyFrom(this);
        },

        /**
         * 한 점이 무한한 선 위에있는지 체크한다.
         *
         * @method isPointOnLine
         * @param x {Number}
         * @param y {Number}
         * @return {Boolean}
         * @public
         */
        isPointOnLine: function(x, y) {
            // Gradient
            // 참고: http://www.teacherschoice.com.au/Maths_Library/Gradient/gradient_-_two_fixed_points.htm
            // (this.y2 - this.y1) / (this.x2 - this.x1) === (y - this.y1) / (x - this.x1); 에 대한 곱셈표현과 동치. (x,y) 에 대해서 대상 직선의 증분값이 적용되는지 비교하는 식
            // 나눗셈으로 할경우  precision로 인해 truncation 오류 발생 가능성
            return (x - this.x1) * (this.y2 - this.y1) === (this.x2 - this.x1) * (y - this.y1);
        },

        /**
         * 한 점이 두개의 지정한 위치 사이의 선 위에있는지 체크한다.
         *
         * @method isPointOnLineSegment
         * @param x {Number}
         * @param y {Number}
         * @return {Boolean}
         * @public
         */
        isPointOnLineSegment: function(x, y) {
            var xMin = Math.min(this.x1, this.x2);
            var xMax = Math.max(this.x1, this.x2);
            var yMin = Math.min(this.y1, this.y2);
            var yMax = Math.max(this.y1, this.y2);

            return this.isPointOnLine(x, y) && (x >= xMin && x <= xMax) && (y >= yMin && y <= yMax);
        },

        /**
         * 무한한 두 선이 충돌하는지 검사한다.
         *
         * @method intersectLineLine
         * @param line {adun.Geom.Line}
         * @return {adun.Geom.IntersectResult} IntersectResult는 충돌 정보를 포함한다.
         * @public
         */
        intersectLineLine: function(line) {
            return adun.Geom.Intersect.lineToLine(this, line);
        },

        /**
         * 선에서 주어진 한 지점을 통과하는 직선(perpendicular)을 반환한다.
         *
         * @param x
         * @param y
         * @param output
         * @returns {*}
         */
        perp: function(x, y, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.Line(); }

            // 만약 현재 선이 수평선이라면 수직선을 반환한다.
            if( this.y1 === this.y2 ) {
                output.setTo(x, y, x, this.y1);
                return output;
            }

            // 만약 현재 선이 수직선이라며 수평선을 반환한다.
            if( this.x1 === this.x2 ) {
                output.setTo(x, y, this.x1, y);
                return output;
            }

            var pt, yInt = (y - this.perpSlope * x);       // y절편: y = ax + b -> b = y - ax

            if( x !== 0 ) {
                pt = this.intersectLineLine({x1: x, y1: y, x2: 0, y2: yInt});
            } else {
                pt = this.intersectLineLine({x1: x, y1: y, x2: 1, y2: yInt + this.perpSlope});
            }

            output.setTo(x, y, pt.x, pt.y);

            return output;
        }
    });
})();

// #Ray
/**
 * Ray
 * 광선
 * Ray(광선) 객체는 시작지점으로부터 한 방향으로 무한히 뻗어나간다.
 *
 * @Class Ray
 * @namespace Adun.Geom
 * @constructor
 * @param [x1=0] {Number} 광선의 시작 x 좌표
 * @param [y1=0] {Number} 광선의 시작 y 좌표
 * @param [x2=0] {Number} 광선의 끝 x 좌표 -> 방향계산에 사용되므로, 진짜 끝을 의미하지는 않는다.
 * @param [y2=0] {Number} 광선의 끝 y 좌표 -> 방향계산에 사용되므로, 진짜 끝을 의미하지는 않는다.
 * @return {adun.Geom.Ray} Ray object
 */
(function() {
    'use strict';
    var Ray = adun.Geom.Ray = adun.Class({
        extend: adun.Geom.Line,
        TYPE: 'Ray',

        init: function(x1, y1, x2, y2) {
            this.super(x1, y1, x2, y2);
        },

        /**
         * 같은 프로퍼티 값을 가진 새로운 Ray 객체를 반환한다.
         *
         * @method clone
         * @param [output=adun.Geom.Ray] {adun.Geom.Ray}
         * @return {adun.Geom.Ray}
         * @public
         */
        clone: function(output) {
            if( adun.isUndefined(output) ) { output = new Ray(); }

            return output.setTo(this.x1, this.y1, this.x2, this.y2);
        },

        /**
         * 한 점이 광선 위에있는지 체크한다.
         *
         * @method isPointOnRay
         * @param x {Number}
         * @param y {Number}
         * @return {Boolean}
         * @public
         */
        isPointOnRay: function(x, y) {
            // Gradient
            // 참고: http://www.teacherschoice.com.au/Maths_Library/Gradient/gradient_-_two_fixed_points.htm
            // (this.y2 - this.y1) / (this.x2 - this.x1) === (y - this.y1) / (x - this.x1); 에 대한 곱셈표현과 동치. (x,y) 에 대해서 대상 직선의 증분값이 적용되는지 비교하는 식
            // 나눗셈으로 할경우  precision로 인해 truncation 오류 발생 가능성
            if( (x - this.x1) * (this.y2 - this.y1) === (this.x2 - this.x1) * (y - this.y1) ) {
                // 각도를 비교한다.
                if( Math.atan2(y - this.y1, x - this.x1) == Math.atan2(this.y2 - this.y1, this.x2 - this.x1)) {
                    return true;
                }
            }

            return false;
        },
    });
})();





