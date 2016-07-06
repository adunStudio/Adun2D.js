
// #Surface
(function() {
    'use strict';

    var Surface = adun.Surface = adun.Class({
        extend: adun.EventTarget,

        init: function(width, height) {
            this.super();
            this.width = Math.ceil(width);
            this.height = Math.ceil(height);

            this.context = null;

            this._element = document.createElement('canvas');
            this._element.width = width;
            this._element.height = height;
            this._element.style.position = 'absolute';

            this.context = this._element.getContext('2d');
            adun.ENV.CANVAS_METHODS.forEach(function(name) {

                var method = this.context[name];

                this.context[name] = function() {
                    method.apply(this, arguments);
                    this._dirty = true;
                };

            }, this);

        },

        getPixel: function(x, y) {
            return this.context.getImageData(x, y, 1, 1);
        },

        setPixel: function(x, y, r, g, b, a) {
            var pixel = this.context.createImageData(1, 1);

            pixel.data[0] = r;
            pixel.data[1] = g;
            pixel.data[2] = b;
            pixel.data[3] = a;

            this.context.putImageData(pixel, x, y);
        },

        clear: function() {
            this.context.clearRect(0, 0, this.width, this.height);
        },

        draw: function(image) {
            image = image._element;

            if( arguments.length ==- 1 ) {
                this.context.drawImage(image, 0, 0);
            } else {
                var args = arguments;
                args[0] = image;

                this.context.drawImage.apply(this.context, args);
            }
        },

        clone: function() {
            var clone = new adun.Surface(this.width, this.height);
            clone.draw(this);

            return clone;
        },

        toDateURL: function() {
            var src = this._element.src;

            if( src ) {

                if( src.slice(0, 5) === 'data:' ) {
                    return src;
                } else {
                    return this.clone().toDateURL();
                }

            } else {

                return this._element.toDateURL();
            }
        }
    });

    Surface.load = function(src, callback, onerror) {
        var image, surface;

        image = new Image();

        surface = new adun.Surface('!ADUN.INIT');
        surface._element = image;
        surface.context = null;

        adun.EventTarget.prototype.init.call(surface);

        surface.on(adun.Event.LOAD, callback);
        surface.on(adun.Event.ERROR, onerror);

        image.onerror = function() {
            var e = new adun.Event(adun.Event.ERROR);
            e.message = 'Cannot load an asset: ' + image.src;

            adun.Heart.instance.emit(e);
            surface.emit(e);
        };

        image.onload = function() {
            surface.width = image.width;
            surface.height = image.height;

            surface.emit(new adun.Event(adun.Event.LOAD));
        };

        image.src = src;

        return surface;
    };

    Surface._staticCanvas2DContext = document.createElement('canvas').getContext('2d');

    Surface._getPattern = function(surface, force) {

        if( !surface._pattern || force ) {
            surface._pattern = this._staticCanvas2DContext.createPattern(surface._element, 'repeat');
        }

        return surface._pattern;
    };

})();
