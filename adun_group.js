
// #Group
(function() {
    'use strict';

    var Group = adun.Group = adun.Class({
        extend: adun.Node,
        TYPE: 'Group',

        init: function() {
            this.super();

            this.childNodes = [];

            this._rotation = 0;
            this._scaleX = 0;
            this._scaleY = 0;
            this.__dirty = false;

            [adun.Event.ADDED_TO_SCENE, adun.Event.REMOVED_FROM_SCENE]
                .forEach(function(event) {
                    this.on(event, function(e) {
                        this.childNodes.forEach(function(child) {
                            child.scene = this.scene;
                            child.emit(e);
                        });
                    });
                }, this);

        },

        firstChild: {
            get: function() {
                return this.childNodes[0];
            }
        },

        lastChild: {
            get: function() {
                return this.childNodes[this.childNodes.length -1];
            }
        },

        rotation: {
            get: function() {
                return this._rotation;
            },
            set: function(rotation) {
                if( this._rotation !== rotation ) {
                    this._rotation = rotation;
                    this._dirty = false;
                }
            }
        },

        scaleX: {
            get: function() {
                return this._scaleX;
            },
            set: function(scale) {
                if( this._scaleX !== scale) {
                    this._scaleX = scale;
                    this._dirty = false;
                }
            }
        },

        scaleY: {
            get: function() {
                return this._scaleY;
            },
            set: function(scale) {
                if( this._scaleY !== scale) {
                    this._scaleY = scale;
                    this._dirty = false;
                }
            }
        },

        originX: {
            get: function() {
                return this._originX;
            },
            set: function(originX) {
                if(this._originX !== originX) {
                    this._originX = originX;
                    this._dirty = true;
                }
            }
        },

        originY: {
            get: function() {
                return this._originY;
            },
            set: function(originY) {
                if(this._originY !== originY) {
                    this._originY = originY;
                    this._dirty = true;
                }
            }
        },

        _dirty: {
            get: function() {
                return this.__dirty;
            },
            set: function(dirty) {
                dirty = !!dirty;
                this.__dirty = dirty;
                if( dirty ) {
                    for( var i = 0, length = this.childNodes.length; i < length; ++i ) {
                        this.childNodes[i]._dirty = true;
                    }
                }
            }
        },

        addChild: function(node) {
            if( node.parentNode ) {
                node.parentNode.removeChild(node);
            }

            this.childNodes.push(node);
            node.parentNode = this;

            var childAdded = new adun.Event(adun.Event.CHILD_ADDED);
            childAdded.node = node;
            childAdded.next = null;

            this.emit(childAdded);

            node.emit(new adun.Event(adun.Event.ADDED));

            if( this.scene ) {
                node.scene = this.scene;
                var addedToScene = new adun.Event(adun.Event.ADDED_TO_SCENE);
                node.emit(addedToScene);
            }
        },

        insertBefore: function(node, reference) {
            if( node.parentNode ) {
                node.parentNode.removeChild(node);
            }

            var i = this.childNodes.indexOf(reference);

            if( i !== -1 ) {
                this.childNodes.splice(i, 0, node);
                node.parentNode = this;

                var childAdded = new adun.Event(adun.Event.CHILD_ADDED);
                childAdded.node = node;
                childAdded.next = reference;

                this.emit(childAdded);
                node.emit(new adun.Event(adun.Event.ADDED));

                if( this.scene ) {
                    node.scene = this.scene;
                    var addedToScene = new adun.Event(adun.Event.ADDED_TO_SCENE);
                    node.emit(addedToScene);
                }

            } else {
                this.addChild(node);
            }
        },

        removeChild: function(node) {
            var i = this.childNodes.indexOf(node);

            if( i !== -1 ) {
                this.childNodes.splice(i, 1);
                node.parentNode = null;

                var childRemoved = new adun.Event(adun.Event.CHILD_REMOVED);
                childRemoved.node = node;

                this.emit(childRemoved);
                node.emit(new adun.Event(adun.Event.REMOVED));

                if( this.scene ) {
                    node.scene = null;

                    var removedFromScene = new adun.Event(adun.Event.REMOVED_FROM_SCENE);
                    node.emit(removedFromScene);
                }
            }
        }
    });

})();
