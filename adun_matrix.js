// #Matrix
(function() {
    'use strict';

    /**
     * Matrix
     * 2D 변환 행렬을 나타낸다.
     * 다른 좌표 공간 사이에서
     *
     *
     *
     * stack[0] = a = 1 => 행렬(0, 0) => scale과 rotate에 영향을 준다.
     * stack[1] = b = 0 => 행렬(0, 1) => scale과 roate에 영향을 준다.
     * stack[2] = c = 0 => 행렬(1, 0) => scale과 roate에 영향을 준다.
     * stack[3] = d = 1 => 행렬(1, 1) => scale과 roate에 영향을 준다.
     * stack[4] = tx = 0 => 행렬(2, 0) => x축 변환에 영향을 준다.
     * stack[5] = ty = 0 => 행렬(2, 1) => y축 변환에 영향을 준다.
     *
     * [x  x]
     * [y  y]
     *
     * [k  0] [x]    =>[kx]
     * [0  k] [y]    =>[ky]    k배 확대 닮은 변환 행렬
     *
     *
     * [1  0][x]     =>[x]
     * [0 -1][y]     =>[-y]   x축 대칭 행렬
     *
     *
     * [-1 0][x]     =>[-x]
     * [0  1][y]     =>[y]    y축 대칭 행렬
     *
     *
     * [-1 0][x]     => [-x]
     * [0 -1][y]     => [-y]  원점 대칭 행렬
     *
     *
     * [0  1][x]     => [y]
     * [1  0][y]     => [x]   y=x 대칭 변환 행렬
     *
     *
     * [0 -1][x]     => [-y]
     * [-1 0][y]     => [-x]   y=-x 대칭 변환 행렬
     *
     *
     * [cosΘ  -sinΘ] [x]    =>  [x']
     * [sinΘ   cosΘ] [y]    =>  [y']   Θ만틈 반시계 방향으로 회전한 회전변환 행렬
     *
     * [cosΘ  sinΘ] [x]    =>  [x']
     * [-sinΘ cosΘ] [y]    =>  [y']   Θ만틈 시계 방향으로 회전한 회전변환 행렬
     *
     *
     *
     * [a, c, tx]
     * [b, d, ty]
     *
     * [1, 0, 0]
     * [0, 1, 1]
     */


    var Matrix = ADUN.Matrix = ADUN.Class({

        init: function() {
            this.reset();
        },

        reset: function() {
           /**
            * [a    b    tx]
            * [c    d    ty]
            *
            * [1    0    0]
            * [0    1    0]
            */

            this.stack = [];
            this.stack.push([ 1, 0, 0, 0, 1, 0 ]);
        },

        makeTransformMatrix: function(node) {
            var dest = [];

            var x, y, width, height, w, h, rotation, scaleX, scaleY, theta, tmpcos, tmpsin,
                a11, a12, a21, a22, atx, aty;

            x = node._x;
            y = node._y;
            width = node.width || 0;
            height = node.height || 0;
            w = ( ADUN.isNumber(node._originX) ) ? node._originX : width / 2;
            h = ( ADUN.isNumber(node._originY) ) ? node._originY : height / 2;
            scaleX = ( ADUN.isNumber(node._scaleX) ) ? node._scaleX : 1;          // (|k| > 1) => x -> k배 확대,  (k < 0) => y축 대칭
            scaleY = ( ADUN.isNumber(node._scaleY) ) ? node._scaleY : 1;          // (|k| > 1) => y -> k백 확대,  (k < 0) => x축 대칭
            rotation = node._rotation || 0;
            theta = rotation * Math.PI / 180;
            tmpcos = Math.cos(theta);            // Math.cos(0) == 1
            tmpsin = Math.sin(theta);            // Math.sin(0) == 0

            a11 = scaleX * tmpcos; a12 = scaleX * tmpsin; atx = -a11 * w + a21* h + x + w;
            a21 = scaleY * tmpsin; a22 = scaleY * tmpcos; aty = -a12 * w - a22 * h + y + h;

            dest[0] =  a11; dest[1] = a12; dest[2] = atx;
            dest[3] = -a21; dest[4] = a22; dest[5] = aty;
        },

        multiply: function(m1, m2) {
            var dest = [];

            var a11 = m1[0], a12 = m1[1], atx = m1[2];
            var a21 = m1[3], a22 = m1[4], aty = m1[5];

            var b11 = m2[0], b12 = m2[1], btx = m2[2];
            var b21 = m2[3], b22 = m2[4], bty = m2[5];

            dest[0] = a11 * b11 + a12 * b21; dest[1] = a11 * b12 + a12 * b22; dest[2] = a11 * btx + a12 * bty + atx;
            dest[3] = a21 * b12 + a22 * b22; dest[4] = a21 * b12 + a22 * b22; dest[5] = a21 * btx + a22 * bty + aty;

            return dest;
        },

        multiVec: function(mat, vec) {
            var dest = [];

            var x = vec[0], y = vec[1];

            var m11 = mat[0], m12 = mat[1], mtx = mat[2];
            var m21 = mat[3], m22 = mat[4], mty = mat[5];


            dest[0] = m11 * x + m21 * y + mtx;
            dest[1] = m12 * x + m22 * y + mty;

            return dest;
        }
    });


    ADUN.Matrix.instance = new Matrix();
})();
