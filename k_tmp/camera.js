
// #Camera
/**
 * Camera
 * Camera는 게임월드 속의 stage에서 특정한 섹션을 렌더링하는데 사용한다.
 * 각각의 카메라는 좌표와 width, height를 가지고있다.
 * 이 클래스의 인스턴는 직접적으로 생성하지 않으며, cameraManger를 통해 생성되어진다.
 *
 * @Class Camera
 * @namespace adun
 * @constructor
 * @param game {adun.Game}
 * @param id {Number}
 * @param name {String}
 * @param x {Number}
 * @param y {Number}
 * @param width {Number}
 * @param height {Number}
 * @return {adun.Camera}
 */
(function() {
    'use strict';
    var Camera = adun.Camera = adun.Class({
        TYPE: 'Camera',

        init: function(game, id, name, x, y, width, heiht) {
            /**
             * stage가 resize되었을시 camera가 resize할지의 여부다.
             *
             * @property fitToStage
             * @type {Boolean}
             * @default true
             * @public
             */
            this.fitToStage = true;

            this._game = game;
            this.id = id;
            this.name = name;

            this.width = width;
            this.height = height;

            this.transform = new adun.Geom.Transform(x, y);
            this.transform.rotPointX = x + width / 2;
            this.transform.rotPointY = y + height / 2;

            // ???
            this._game.stage.onResize.add(this._updatedStageSize, this);

            this._scratchMatrix = new adun.Geom.Matrix();
        },

        visible: {
            get: function() {
                return this._visible;
            },
            /**
             * camera가 render를 할지 설정한다.
             *
             * @property visible
             * @type {Boolean}
             * @public
             */
            set: function(value) {
                this._visible = value;
            }
        },

        dirty: {
            get: function() {
                return this._dirty;
            },
            /**
             * camera가 re-render 할지의 여부
             *
             * @property
             * @type {Boolean}
             * @public
             */
            set: function(value) {
                this._dirty = value;
            }
        },

        /**
         * camera의 width, height 프로퍼티를 업데이트한다.
         * stage가 resize하였을때 사용된다.
         *
         * @method _updateStageSize
         * @param width
         * @param height
         * @public
         */
        _updateStageSize: function(width, height) {
            this.width = width;
            this.height = height;
        },

        /**
         * screen 좌표를 world 좌표로 convert한다.
         * 마우스의 좌표를 계산하는데 유용하다.
         *
         * @method transformPoint
         * @param point {adun.Geom.Point}
         * @return {adun.Geom.Point}
         */
        transformPoint: function(point) {
            var m, np = point.clone();

            this._scratchMatrix.copyFrom(this.transform.getConcatenatedMatrix());

            m = this._scratchMatrix;

            m.append(1, 0, 0, 1, -this.transform.rotPointX, -this.transform.rotPointY);
            m.invert();

            return m.transformPoint(np);
        },

        /**
         * world좌표를 screen 좌표로 convert한다.
         * visibility에 접근하는데 유용하다.
         *
         * @param point
         * @returns {*|adun.Geom.Point}
         */
        transformPointToScreen: function(point) {
            var m, np = point.clone();

            this._scratchMatrix.copyFrom(this.transform.getConcatenatedMatrix());

            m = this._scratchMatrix;

            m.append(1, 0, 0, 1, -this.transform.rotPointX, -this.transform.rotPointY);

            return m.transformPoint(np);
        },

        /**
         * 매 frame마다 호출되는 update loop 메서드다.
         *
         * @method update
         * @public
         */
        update: function() { },

        /**
         * game playing동안 호출되는 render loop다.
         *
         * @method render
         * @public
         */
        render: function() {
            this._game.renderer.render(this);
        }
    });
})();