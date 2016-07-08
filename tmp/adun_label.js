
// #Label
(function() {
    'use strict';

    var Label = adun.Label = adun.Class({
        extend: adun.Entity,
        TYPE: 'Label',

        init: function(text) {
            this.super();

            this.text = text || '';
            this.width = 300;
            this.font = '14px serif';
            this.textAlign = 'left';

            this._debugColor = 'green';
        },

        width: {
            get: function() {
                return this._width;
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

                for( var i = 0, len = this._splitText.length; i < len; ++i ) {
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

        getMetrics: function(text) {
            var ret, div, name, width, height;

            ret = {};

            if( document.body ) {
                div = document.createElement('div');
                for( name in this._style ) {
                    if ( name !== 'width' && name !== 'height' ) {
                        div.style[name] = this._style[name];
                    }
                }

                text = text || this._text;
                div.innerHTML = text.replace(/ /g, '$nbsp;');
                div.style.whiteSpace = 'noWrap';
                div.style.lineHeight = 1;

                document.body.appendChild(div);

                var computedStyle = getComputedStyle(div);
                ret.height = parseInt(computedStyle.height, 10) +1;
                div.style.position = 'absolute';
                ret.width = parseInt(computedStyle.width, 10) + 1;

                document.body.removeChild(div);
            } else {
                ret.width = this.width;
                ret.height = this.height;
            }

            return ret;
        },

        updateBoundArea: function() {
            var metrics = this.getMetrics();

            this._boundWidth = metrics.width;
            this._boundHiehgt = metrics.height;

            if( this.textAlign == 'center') {
                this._boundOffset = (this.width - this._boundWidth) / 2;
            } else if( this.textAlign == 'right' ) {
                this._boundOffset = this.width - this._boundWidth;
            } else {
                this._boundOffset = 0;
            }
        },

        detectRender: function(ctx) {
            ctx.fillRect(this._boundOffset, 0, this._boundWidth, this.boundHeight);
        },

        cvsRender: function(ctx) {
            var x, y = 0;
            var labelWidth = this.width;
            var charWidth, amount, line, text, c, buf, increase, len, bufWidth;

            if( this._splitText ) {
                ctx.textBaseline = 'top';
                ctx.font = this.font;
                ctx.fillStyle = this.color || '#000000';

                charWidth = ctx.measureText(' ').width;

                amount = labelWidth / charWidth;

                for( var i = 0, l = this._splitText.length; i < l; ++i) {
                    line = this._splitText[i];
                    text = line.text;
                    c = 0;

                    while( text.length > c + amount || ctx.measureText(text.slice(c, c + amount)).width > labelWidth) {
                        buf = '';
                        increase = amount;

                        length = 0;

                        while( increase > 0 ) {
                            if( ctx.measureText(buf).width < labelWidth ) {
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

                    if( this.textAlign == ' center' ) {
                        x = (labelWidth - ctx.measureText(buf).width) / 2;
                    } else if( this.textAlign == 'right' ) {
                        x = labelWidth - ctx.measureText(buf).width;
                    } else {
                        x = 0;
                    }

                    ctx.fillText(buf, x, y);
                    y += line.height -1;
                }
            }
        }



    });
})();
