
// #CanvasRenderer
(function() {
    'use strict';

var a = 1;
    var CanvasRenderer = adun.CanvasRenderer = adun.Class({
        TYPE: 'CanvasRenderer',

        render: function(ctx, node, e) {
            var width, height, child;

            ctx.save();

            node.emit(e);

            this.transform(ctx, node);

            if( adun.isUndefined(node._visible) || node._visible ) {

                width = node.width;
                height = node.height;

                if( node.compositeOperation ) {
                    ctx.globalCompositeOperation = node.compositeOperation;
                }

                ctx.globalAlpha = adun.isNumber(node._opacity) ? node._opacity : 1.0;

                if( node._backgroundColor ) {
                    ctx.fillStyle = node._backgroundColor;
                    ctx.fillRect(0, 0, width, height);
                }

                if( node.cvsRender ) {
                    node.cvsRender(ctx);
                }

                if( adun.Heart.instance._debug && node._debugColor ) {
                    ctx.strokeStyle = node._debugColor;
                    ctx.strokeRect(0, 0, width, height);
                }

                if( node._clipping ) {
                    ctx.beginPath();
                    ctx.rect(0, 0, width, height);
                    ctx.clip();
                }

                if( node.childNodes ) {
                    for( var i = 0, len = node.childNodes.length; i < len; ++i ) {
                        child = node.childNodes[i];
                        this.render(ctx, child, e);
                    }
                }
            }

            ctx.restore();

            adun.Matrix.instance.stack.pop();
        },

        detectRender: function(ctx, node, e) {
            var width, height, child;

            if( adun.isUndefined(node._visible) || node._visible ) {

                width = node.width;
                height = node.height;

                ctx.save();
                this.transform(ctx, node);
                ctx.fillStyle = node._cvsCache.detectColor;

                if( node._clipping ) {
                    ctx.beginPath();
                    ctx.rect(0, 0, width, height);
                    ctx.clip();
                }

                if( node.childNodes ) {
                    for( var i = 0, len = node.childNodes.length; i < len; ++i ) {
                        child = node.childNodes[i];
                        this.detectRender(ctx, child, e);
                    }
                }

                ctx.restore();

                adun.Matrix.instance.stack.pop();

            }
        },

        transform: function(ctx, node) {
            var matrix, stack, newmat, ox, oy, vec;

            matrix = adun.Matrix.instance;
            stack = matrix.stack;

            if( node._dirty ) {

                node._cvsCache.matrix = matrix.makeTransformMatrix(node);

                newmat = matrix.multiply(stack[stack.length -1], node._cvsCache.matrix);

                node._matrix = newmat;

                ox = adun.isNumber(node._originX) ? node._originX : node._width / 2 || 0;
                oy = adun.isNumber(node._originY) ? node._originY : node._height / 2 || 0;

                vec = matrix.multiplyVec(newmat, [ox, oy]);

                node._offsetX = vec[0] - ox;
                node._offsetY = vec[1] - oy;

                node._dirty = false;
            } else {
                newmat = node._matrix;
            }

            stack.push(newmat);
            ctx.setTransform.apply(ctx, newmat);
        }
    });

    CanvasRenderer.instance = new adun.CanvasRenderer();
})();
