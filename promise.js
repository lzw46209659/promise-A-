/**
 * author: Xigua12138
 * data: 2019-06-14
 */

const STATE_PENDING = 'pending'
const STATE_FULFILLED = 'fulfilled'
const STATE_REJECTED = 'rejected'

const Promise = function (executor) {
    
    this.state = STATE_PENDING
    this.arrOnFulfillCallbacks = []
    this.arrOnRejectCallbacks = []

    this.value = undefined
    this.reason = undefined

    let self = this

    function resolve(value) {
        if (self.state === STATE_PENDING) {
            self.value = value
            self.state = STATE_FULFILLED
            self.arrOnFulfillCallbacks.forEach(function(cb) {
                cb()
            })
        }
    }

    function reject(reason) {
        if (self.state === STATE_PENDING) {
            self.reason = reason
            self.state = STATE_REJECTED
            self.arrOnRejectCallbacks.forEach(function(cb) {
                cb()
            })
        }
    }

    try {
        executor(resolve, reject)
    } catch(e) {
        reject(e)
    }
}

function promiseResolution(promise2, x, resolve, reject) {

    // console.log('promiseResolution')
    // console.log(x)
    if (promise2 === x) {
        throw TypeError('循环引用')
    }

    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {   
        let called;
        try {
            let then = x.then
            if (typeof then === 'function') {
                then.call(x, function(y) {
                    if (called) return
                    called = true
                    // console.log(y)
                    promiseResolution(promise2, y, resolve, reject)
                }, function (err) {
                    if (called) return
                    called = true
                    reject(err)
                })
            } else {
                if (called) return
                called = true
                resolve(x)
            }
        } catch(e) {
            if (called) return
            called = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}


Promise.prototype.then = function(onFulfilled, onRejected) {
    let self = this
    // console.log('onFulfilled')
    // console.log(onFulfilled)
    // console.log(self.state)
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function(value) {return value}
    onRejected = typeof onRejected === 'function' ? onRejected : function(reason) {throw reason}

    // console.log(onFulfilled)
    let promise2 = null

    if (self.state == STATE_PENDING) {
        promise2 = new Promise(function(resolve, reject) {
            self.arrOnFulfillCallbacks.push(function() {
                setTimeout(function() {
                    try {
                        let x = onFulfilled(self.value)
                        // console.log(onFulfilled)
                        // console.log(x)
                        // console.log(self.value)
                        promiseResolution(promise2, x, resolve, reject)
                    } catch(e) {
                        reject(e)
                    }
                })
            })
            self.arrOnRejectCallbacks.push(function() {
                setTimeout(function() {
                    try {
                        let x = onRejected(self.reason)
                        promiseResolution(promise2, x, resolve, reject)
                    } catch(e) {
                        reject(e)
                    }
                })
            })
        })
    }

    if (self.state == STATE_FULFILLED) {
        promise2 = new Promise(function(resolve, reject) {
            setTimeout(function() {
                try {
                    let x = onFulfilled(self.value)
                    promiseResolution(promise2, x, resolve, reject)
                } catch(e) {
                    reject(e)
                }
            })
        })
    }

    if (self.state == STATE_REJECTED) {
        promise2 = new Promise(function(resolve, reject) {
            setTimeout(function() {
                try {
                    let x = onRejected(self.reason)
                    promiseResolution(promise2, x, resolve, reject)
                } catch(e) {
                    reject(e)
                }
            })
        })
    }

    return promise2
}


// 捕获错误的方法
Promise.prototype.catch = function (callback) {
    return this.then(null, callback)
}
// 生成一个成功的promise
Promise.resolve = function(value) {
    return new Promise(function(resolve, reject) {
        resolve(value)
    })
}
// 生成一个失败的promise
Promise.reject = function(reason){
    return new Promise(function(resolve, reject) {
        reject(reason)
    })
}

Promise.defer = Promise.deferred = function () {
    let dfd = {}
    dfd.promise = new Promise(function (resolve, reject) {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}

module.exports = Promise



