
// #LoadingScene
(function() {
    'use strict';

    var LoadingScene = adun.LoadingScene = adun.Class({
        extend: adun.Scene,

        init: function() {
            this.super();
            this.t = 1;


            this.on(adun.Event.PROGRESS, function(e) {
            });

            this.on(adun.Event.LOAD, function(e) {
                adun.Heart.instance.emit(new adun.Event(adun.Event.LOAD));
            });
        },

    });
})();
