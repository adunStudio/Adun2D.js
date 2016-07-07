
// #LoadingScene
(function() {
    'use strict';

    var LoadingScene = adun.LoadingScene = adun.Class({
        extend: adun.Scene,
        TYPE: 'LoadingScene',

        init: function() {
            this.super();
            this.t = 1;


            this.on(adun.Event.PROGRESS, function(e) {
            });

            this.on(adun.Event.LOAD, function(e) {
                var heart = adun.Heart.instance;

                heart.removeScene(heart.loadingScene);
                heart.emit(new adun.Event(adun.Event.LOAD));
            });
        },

    });
})();
