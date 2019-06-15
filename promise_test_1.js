/**
 * 测试promise revolve,reject
 **/

const Promise = require('./promise')

const log = val => {
    console.log(val)
};

console.log('start')
console.time('start')
new Promise(function(resolve, reject) {
    console.time('start1')
    console.time('start2')
    console.time('start3')
    setTimeout(function() {
        let num = Math.random()
        if (num > .1) {
            resolve(new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve(11)
                }, 2000)
            }))
        } else {
            reject(`出错 ${num}`)
        }
    }, 200)

}).then(function(val) {
    console.timeEnd('start')
    console.log('start1')
    console.log(val)
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            console.log('x == promise')
            resolve(new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve('y == promise')
                    console.log('inner')
                    console.timeEnd('start3')
                }, 3000)
            }))
        }, 2000)
    })
}, log).then(function(val) {
    console.log('start2')
    console.timeEnd('start2')
    console.log(val)
}, log)



