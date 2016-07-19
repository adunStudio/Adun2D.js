
// #Stage
(function() {
    'use strict';

    var Stage = adun.Stage = adun.Class({
        TYPE: 'STAGE',

        init: function(game, name, width, height, scaleType) {

            this.scaleType = adun.Stage.SCALE_NONE;

            this.offset = new adun.Geom.Point();

            //this._color = new adun.Utils.Color();

            this.container = null;

            this._game = game;

            this.name = name;

            this.domReady = false;

            this._alpha = 1;

            this._x = 0;
            this._y =  0;
            this._width = width;
            this._height = height;

            this.color = 'ffffff';

            this._scale = new adun.Geom.Point(1, 1);
            //this.

        }

    });

    Stage.DEFAULT_WIDTH = 800;
    Stage.DEFAULT_HEIGHT = 600;
    Stage.SCALE_NONE = 0;
    Stage.SCALE_FIT = 1;
    Stage.SCALE_STRETCH = 2;
})();