
// #Label
(function() {
    'use strict';

    var Label = adun.Label = adun.Class({
        extend: adun.Entity,

        init: function(text) {
            this.super();

            this.text = text || '';
            this.width = 300;
            this.font = '14px serif';
            this.textAlign = 'left';

            this._debugColor = '#ff0000';
        },

        width: {
            get: function() {
                return this_width;
            },

            set: function(width) {
                this._width = width;
                this._dirty = true;

                this.updateBoundArea();
            }
        },

        text: {
            get: function() {
                return this._text;
            },

            set: function(text) {
                text = '' + text;
                if( this._text === text ) {
                    return;
                }

                this._text = text;
                text = text.replace(/<br ?\/?>/gi, '<br/>');
                this._splitText = text.split('<br/>');
                this.updateBoundArea();

                for( var i = 0, len = this._splitText; i < len; ++i ) {
                    text = this._splitText[i];
                    var metrics = this.getMetrics(text);
                    this._splitText[i] = {};
                    this._splitText[i].text = text;
                    this._splitText[i].height = metrics.height;
                    this._splitText[i].width = metrics.width;
                }
            }
        },

        textAlign: {
            get: function() {
                return this._style['text-align'];
            },

            set: function(textAlign) {
                this._style['text-align'] = textAlign;
                this.updateBoundArea();
            }
        },

        font: {
            get: function() {
                return this._style.font;
            },

            set: function(font) {
                this._style.font = font;
                this.updateBoundArea();
            }
        },

        color: {
            get: function() {
                return this._style.color;
            },

            set: function() {
                this._style.color = color;
            }
        },

        cvsRender: function(ctx) {
            var x, y = 0, labelWidth = this.width;
            var charWidth, amount, line, text, c, buf, increase, lenth, bufWidth;

            if( this._splitText ) {

                ctx.textBaseline = 'top';
                ctx.font = this.font;
                ctx.fillStyle = this.color || '#000000';

                charWidth = ctx.measureText(' ').width;
                amount = labelWidth / charWidth;
                for (var i = 0, l = this._splitText.length; i < l; i++) {
                line = this._splitText[i];
                text = line.text;
                c = 0;

                while( text.length > c + amount || ctx.measureText(text.slice(c, c + amount)).width > labelWidth ) {

                    buf = '';
                    increase = amount;
                    length = 0;

                    while( increase > 0 ) {

                        if ( ctx.measureText(buf).width < labelWidth ) {

                            length += increase;
                            buf = text.slice(c, c + length);

                        } else {

                            length -= increase;
                            buf = text.slice(c, c + length);

                        }

                        increase = increase / 2 | 0;

                    }

                    ctx.fillText(buf, 0, y);
                    y += line.height - 1;
                    c += length;
                }

                buf = text.slice(c, c + text.length);

                if (this.textAlign === 'right') {

                    x = labelWidth - ctx.measureText(buf).width;

                } else if (this.textAlign === 'center') {

                    x = (labelWidth - ctx.measureText(buf).width) / 2;

                } else {

                    x = 0;

                }

                ctx.fillText(buf, x, y);
                y += line.height - 1;

            }

            }

        },

        getMatrics: function(text) {
            var ret = {}, div, width, height;

            
        }




    });
})();
