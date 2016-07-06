
// #Matrix
(function() {
    'use strict';

    /**
     * Matrix
     * 2D 변환 행렬을 나타낸다.
     * HTML canvas transform() Method에 사용.
     * void ctx.transform(a, b, c, d, e, f)
     * [a c e]
     * [b d f]
     * [0 0 1]
     * - basic -
     * [1 0 tx]
     * [0 1 ty]
     * [0 0  1]
     * 
     *
     * a (m11) => Horizonatal scaling => y축 scale
     * b (m12) => Horizonatal skewing => y축 rotate
     * c (m21) => Vertical skewing => x축 rotate
     * d (m22) => Vertical scaling => x축 scale
     * e (tx)  => Horizonatal moving => x축 이동
     * f (ty)  => Vertical moving => y축 이동
     *
     * 번외 행렬 변환
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

    var Matrix = adun.Matrix = adun.Class({
        init: function() {
            this.reset();
        },

        reset: function() {
            // ctx.transform(a, b, c, d, e, f)
            /**
            * [a c e]
            * [b d f]
            * [0 0 1]
            **/
            this.stack = [];

            this.stack.push([1, 0, 0, 0, 1, 0]);
        },

        makeTransformMatrix: function(node) {
            var x, y, width, height, w, h, rotation, scaleX, scaleY, theta, tmpcos, tmpsin,
                a, b, c, d, tx, ty, mat = [];

            x = node._x;
            y = node._y;
            width = node.width || 0;
            height = node.height || 0;
            w = adun.isNumber(node._originX) ? node._originX : width / 2;
            h = adun.isNumber(node._originY) ? node._originY : height / 2;
            scaleX = adun.isNumber(node._scaleX) ? node.scaleX : 1;
            scaleY = adun.isNumber(node._scaleY) ? node.scaleY : 1;
            rotation = node._roation || 0;
            theta = rotation * Math.PI / 180;
            tmpcos = Math.cos(theta);
            tmpsin = Math.sin(theta);

            a = scaleX * tmpcos;
            b = scaleX * tmpsin;
            c = scaleY * tmpsin;
            d = scaleY * tmpcos;
            dx = (-a * w + c * h + x + w);
            dy = (-b * w - d * h + y + h);

            mat[0] = a;
            mat[1] = b;
            mat[2] = -c;
            mat[3] = d;
            mat[4] = dx;
            mat[5] = dy;

            return mat;
        },

        multiply: function(m1, m2) {
            var mat = [];

            var a11 = m1[0], a21 = m1[2], adx = m1[4];
            var a12 = m1[1], a22 = m1[3], ady = m1[5];

            var b11 = m2[0], b21 = m2[2], bdx = m2[4];
            var b12 = m2[1], b22 = m2[3], bdy = m2[5];

            mat[0] = a11 * b11 + a21 * b12;
            mat[1] = a12 * b11 + a22 * b12;
            mat[2] = a11 * b21 + a21 * b22;
            mat[3] = a12 * b21 + a22 * b22;
            mat[4] = a11 * bdx + a21 * bdy + adx;
            mat[5] = a12 * bdx + a22 * bdy + ady;

            return mat;
        },

        mulitplyVec: function(m, vec) {
            var mat, x = vec[0], y = vec[1];
            mat = [];

            var a = m[0], c = m[2], dx = m[4];
            var b = m[1], d = m[3], dy = m[5];

            mat[0] = a * x + c * y + dx;
            mat[1] = b * x + d * y + dy;

            return mat;
        }
    });

    Matrix.instance = new Matrix();
})();
