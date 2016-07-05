
// #LoadingScene
(function() {
    'use strict';

    var LoadingScene = adun.LoadingScene = adun.Class({
        extend: adun.Scene,

        init: function() {
            this.super();

            this.on(adun.Event.PROGRESS, function(e) {
                alert(e.total);
            });

            this.on(adun.Event.LOAD, function(e) {
                alert('로딩완료');
            });
        },

    });
})();
