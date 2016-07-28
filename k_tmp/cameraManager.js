
// #CameraManager
/**
 * CameraManager
 * 게임에서 카메라의 생성과 관리를 처리한다.
 * 각각의 게임은 항상 CameraManager가 존재하며, CameraManager는 default Camerea를 가지고 있다.
 *
 * @Class CameraManager
 * @namespace adun
 * @constructor
 * @param game {adun.Game}
 * @return {adun.CameraManager}
 */
(function() {
    'use strict';

    var CameraManager = adun.CameraManager = adun.Class({
        TYPE: 'CameraManager',

        init: function(game) {
            this._game = game;

            this._cameras = [];

            this._nextCameraID = 0;
        },

        /**
         * CameraManger를 초기화한다.
         * 새로운 Camera를 생성하고, defaultCamera에 할당한다.
         *
         * @method boot
         * @public
         */
        boot: function() {
            this.create('defaultCamera', 0, 0, this._game.stage.width, this._game.stage.height);
            this.defaultCamera = this._cameras[0];
        },

        /**
         * 새로운 Camera를 생성한다.
         * 그리고 cameras 배열에 push한다.
         *
         * @method create
         * @param name {String}
         * @param x {Number}
         * @param y {Number}
         * @param width {Number}
         * @param height {Number}
         * @return {adun.Camera} The new camera objcet
         * @public
         */
        create: function(name, x, y, width, height) {
            var newCamera = new adun.Camera(this._game, this._nextCameraID++, name, x, y, width, height);

            this._cameras.push(newCamera);

            return newCamera;
        },

        /**
         * 주어진 camera를 삭제한다.
         *
         * @method remove
         * @param camera {adun.Camera}
         * @return {boolean}
         * @public
         */
        remove: function(camera) {
            var i = this._cameras.indexOf(camera);

            if( i !== -1) {
                this._cameras.splice(i, 1);
                return true;
            }

            return false;
        },

        /**
         * 모든 camera의 update method를 호출한다.
         *
         * @method update
         * @public
         */
        update: function() {
            if( this._cameras.length === 0 ) {
                return false;
            }

            for( var i = 0, len = this._cameras.length; i < len; ++i ) {
                this._cameras[i].update();
            }
        },

        /**
         * 모든 camera의 render method를 호출한다.
         *
         * @method render
         * @public
         */
        render: function() {
            if( this._cameras.length === 0 ) {
                return false;
            }

            for( var i = 0, len = this._cameras.length; i < len; ++i ) {
                this._cameras[i].render();
            }
        },

        /**
         * cameraManager의 defaultCamera를 제외한 모든 camera를 제거한다.
         *
         * @method removeAll
         * @public
         */
        removeAll: function() {
            this._cameras = [];
        },

        /**
         * 매개변수로 받은 camera를 초기화한다.
         *
         * @method zeroCamera
         * @param camera {adun.Camera}
         * @public
         */
        zeroCamera: function(camera) {
            camera.transform.x = 0;
            camera.transform.y = 0;
            camera.transform.rotation = 0;
            camera.transform.scaleX = 1;
            camera.transform.scaleY = 1;
            camera.transform.rotPointX = camera.width / 2;
            camera.transform.rotPointY = camera.height / 2;
        },

        /**
         * cameraManger의 모든 camera를 초기화한다.
         * (새로운 state에서 start할 때 호출한다.)
         *
         * @method zeroAllCameras
         * @public
         */
        zeroAllCameras: function() {
            for( var i = 0, len = this._cameras.length; i < len; ++i ) {
                this.zeroCamera(this._cameras[i]);
            }

            this.zeroCamera(this.defaultCamera);
        }
    });
})();