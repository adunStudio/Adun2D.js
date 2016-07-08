// #Deferred
(function() {
    'use strict';

    var Deferred = adun.Deferred = adun.Class({
        extend: null,
        TYPE: 'Deferred',

        init: function() {
            this._success   =   this._fail   =   this._id   = null;
            this._tail = this;
        },

        _add: function(queue) {
            // 큐 방식의 연결리스트 자료구조를 사용한다.

            // 마지막에 추가된 Deferred 객체._next => 마지막에 추가된 Deferred 객체
            this._tail._next = queue;

            // 꼬리는 항상 마지막에 추가된 Deferred 객체를 가리킨다.
            this._tail = queue;

            // 연결리스트에서 맨 처음 Deferred 객체 반환.
            return this;
        },

        next: function(fn) {
            var queue = new adun.Deferred();
            queue._success = fn;

            return this._add(queue);
        },

        error: function(fn) {
            var queue = new adun.Deferred();
            queue._fail = fn;

            return this._add(queue);
        },

        call: function(arg) {
            var received, queue = this;

            // _fail 건너뛰기
            while( queue && !queue._success ) {
                queue = queue._next;
            }

            if( !(queue instanceof adun.Deferred) ) {
                return;
            }

            try {
                received = queue._success(arg);
            } catch(e) {
                return queue.fail(e);
            }

            if( received instanceof adun.Deferred ) {
                // 값이 Deferred의 인스턴스라면 삽입한다.
                adun.Deferred._insert(queue, received);
            } else if( queue._next instanceof adun.Deferred ) {
                queue._next.call(received);
            }
        },

        fail: function(arg) {
            var result, error, queue = this;

            // _success 건너뛰기
            while( queue && !queue._fail ) {
                queue = queue._next;
            }

            if( queue instanceof adun.Deferred ) {
                result = queue._fail(arg);
                queue.call(result);
            } else if( arg instanceof Error ) {
                //arg.stackTrace();
                throw arg;
            } else {
                error = new Error('faild in Deferred');
                error.arg = arg;
                throw error;
            }
        }
    });

    Deferred.next = function(fn) {
        var queue = new adun.Deferred().next(fn);

        // 타이머 함수를 이용하여 비동기성을 가진다.
        // (함수 스택이 모두 클리어되었을 때 실행된다.)
        queue._id = setTimeout(function() {
            queue.call();
        }, 0);

        return queue;
    };

    Deferred._insert = function(queue, ins) {
        // 만약 현재 큐의 _next가 Deferred의 인스턴스라면 블록에 진입
        if( queue._next instanceof adun.Deferred ) {
            ins._tail._next = queue._next;
        }

        // 현재 큐의 _next에 새로운 Deferred의 인스턴스를 참조시킨다.
        queue._next = ins;
    };

    // 평행
    Deferred.parallel = function(arg) {
        var q = new adun.Deferred();
        q._id = setTimeout(function() {
            q.call();
        }, 0);

        var progress = 0,
            ret = adun.isArray(arg) ? [] : {},
            p = new adun.Deferred(),
            prop;

        for( prop in arg ) {
            if( adun.has(arg, prop) ) {
                progress ++;

                // 복사본(Deferred 인스턴스)을 즉시실행함수에 바로 넘겨준다.
                (function(queue, name) {
                    // 복사본.next(fn)
                    queue.next(function(arg) {
                        progress --;

                        ret[name] = arg;    // 리턴된 값,

                        if( progress <= 0 ) {
                            p.call(ret);
                        }
                    }).error(function(err) {
                        p.fail(err);
                    });

                    if( adun.isNumber(queue._id) ) {
                        clearTimeout(queue._id);
                    }

                    queue._id = setTimeout(function() {
                        queue.call();
                    }, 0);

                })(arg[prop], prop);
            }
        }

        if( progress == 0 ) {
            p._id = setTimeout(function() {
                p.call(ret);
            }, 0);
        }

        return q.next(function() { return p; });
    };
})();
