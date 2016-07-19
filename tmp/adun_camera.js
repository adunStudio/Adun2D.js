
// #Camera
(function() {
    'use strict';

    var Camera = adun.Camera = adun.Class({
        TYPE: 'Camera',

        init: function(game, id, name, x, y, width, height) {

            this.fitToStage = true;

            this._game = game;
            this.id = id;
            this.name = name;
            this.width = width;
            this.height = height;

            this.transform = new adun.Geom.Transform(x, y);
            this.transform.rotPointX = x + width / 2;
            this.transform.rotPointY = y + height / 2;

            // this._game.stage.onResize.add(this._updatedStageSize, this);
            this._scratchMatrix = new adun.Geom.Matrix();
        },

        _updatedStageSize: function(width, height) {
            this.width = width;
            this.height = height;
        },

        visible: {
            get: function() {
                return this._visible;
            },
            set: function(value) {
                this._visible = value;
            }
        },

        dirty: {
            get: function() {
                return this._dirty;
            },
            set: function(value) {
                this._drirty = value;
            }
        },

        transformPoint: function(point) {
            var m, np = point.clone();

            this._scratchMatrix.copyFrom(this.transform.getConcatenatedMatrix());

            m = this._scratchMatrix;

            m.append(1, 0, 0, 1, -this.transform.rotPointX, -this.transform.rotPointY);
            m.invert();

            return m.transformPoint(np);
        },

        transformPointToScreen: function(point) {
            var m, np = point.clone();

            this._scratchMatrix.copyFrom(this.transform.getConcatenatedMatrix());

            m = this._scratchMatrix;

            m.append(1, 0, 0, 1, -this.transform.rotPointX, -this.transform.rotPointY);

            return m.transformPoint(np);
        },

        update: function() { },

        render: function() {
            this._game.renderer.render(this);
        }

    });
})();


/**
 *
 * @���͵����: �ڹٽ�ũ��Ʈ 2D ���� ���̺귯�� ����
 * @���͵���: �ڹٽ�ũ��Ʈ ������ �˸�(�ʼ�!), �������ۿ� ��� or ���� or ������ ������ OK!
 * @���͵��ο�: 4�� �̻�
 * @���͵����: �Ǵ뿪 �ٹ�(����)
 * @���͵�ð�: ���� �Ͽ��� ���� 1��(����)
 * @���͵���: PDF File (Build your own 2D Game Engine and Create Great Web Games)
 * @���͵���: ��� + �Բ��ϴ� �ڵ�
 *
 */