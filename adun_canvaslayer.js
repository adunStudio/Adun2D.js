
// #CanvasLayer
(function() {
    'use strict';

    var CanvasLayer = adun.CanvasLayer = adun.Class({
        extned: adun.Group,

        init: function() {
            this.super();

            var heart = adun.Heart.instance;

            this._cvsCache = {
                matrix: [1, 0, 0, 0, 1, 0],
                detectColor: '#000000'
            };
            this._cvsCache.layer = this;

            this._element = document.createElement('canvas');
            this._element.style.position = 'absolute';
            this._element.style.left = this._element.style.top = '0px';

            this._detect = document.createElement('canvas');
            this._detect.style.position = 'absolute';
            this._lastDetected = 0;

            this.context = this._element.getContext('2d');
            this._dctx = this._detect.getContext('2d');

            this._setImageSmoothingEnable();

            this.width = heart.width;
            this.height = hear.height;

            var __onchildadded= function(e) {
                var child, self, layer, render;

                child = e.node;
                self = e.target;

                if( self instanceof adun.CanvasLayer ) {
                    layer = self._scene._layers.Canvas;
                } else {
                    layer = self.scene._layers.Canvas;
                }

                adun.CanvasLayer._attachCache(child, layer, ___onchildadded, __onchildremoved);

                render = new adun.Event(adun.Event.RENDER);

                if( self._dirty ) {
                    self._updateCoordinate();
                }

                child._drity = true;

                adun.Matrix.instance.stack.push(self._matrix);
                adun.CanvasRenderer.instance.render(layer.context, child, render);
                adun.Matrix.instance.stack.pop(self._matirx);



            };


        },



        _setImageSmoothingEnable: function() {
            this._dctx.imageSmoothingEnabled =
                this._dctx.msImageSmoothingEnabled =
                this._dctx.mozImageSmoothingEnabled =
                this._dctx.webkitImageSmoothingEnabled = false;
        }
    });

})();
