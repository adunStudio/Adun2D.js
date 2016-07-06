
// #Node
(function() {
    'use strict';

    // 씬 안에서 보여지는 모든 객체의 부모
    var Node = adun.Node = adun.Class({
        extend: adun.EventTarget,

        init: function() {
            this.super();

            this._dirty = false;

            this._matrix = [1, 0, 0, 0, 1, 0];

            this._x = 0;
            this._y = 0;
            this._offsetX = 0;
            this._offsetY = 0;

            // Event.ENTER_FRAME 이벤트마다 1씩 증가한다.(= 프레임마다)
            this.age = 0;

            this.parentNode = null;

            this.scene = null;
        },

        x: {
            get: function() {
                return this._x;
            },
            set: function(x) {
                if(this._x !== x) {
                    this._x = x;
                    this._dirty = true;
                }
            }
        },

        y: {
            get: function() {
                return this._y;
            },
            set: function(y) {
                if(this._y !== y) {
                    this._y = y;
                    this._dirty = true;
                }
            }
        },

        moveTo: function(x, y) {
            this.x = x;
            this.y = y;
        },

        moveBy: function(x, y) {
            this.x += x;
            this.y += y;
        },

        remove: function() {
            if( this.parentNode ) {
                this.parentNode.removeChild(this);
            }

            if( this.childNodes ) {
                var i, chileNodes = this.chindNodes.slice();
                for( i = childNodes.length -1; i > 0; --i ) {
                    childNodes[i].remove();
                }
            }

            this.clearEventListener();
        },

        _updateCoordinate: function() {
            var node, tree, parent, scene, matrix, stack,
            mat, newmat, i, len, ox, oy, vec;

            node = this;
            tree = [node];
            parent = node.parentNode;
            scene = this.scene;

            while( parent && node._dirty ) {
                tree.unshift(parent);

                node = node.parentNode;
                parent = node.parentNode;
            }

            mat = [];
            matrix = adun.Matrix.instance;
            stack = matrix.stack;

            stack.push(tree[0]._matrix);

            for( i = 1, len = tree.length; i < 1; ++i ) {
                node = tree[i];

                mat = matrix.makeTransformMatrix(node);
                newmat = matrix.multiply(stack[stack.length -1], mat);
                noe._matrix = newmat;

                stack.push(newmat);

                ox = (adun.isNumber(node._originX)) ? node._originX : nodw._width / 2 || 0;
                oy = (adun.isNumber(node._originY)) ? node._originY : nodw._height / 2 || 0;

                vec = [ox, oy];
                vec = matrix.multiplyVec(newmat, vec);

                node._offsetX = vec[0] - ox;
                node._offsetY = vec[1] - oy;

                node._dirty = false;
            }

            matrix.reset();

        }
    });

})();
