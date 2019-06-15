/**
 * 测试promise revolve,reject
 **/

const Promise = require('./promise')

let a = new Promise(function(resolve, reject) {
    console.time('start1')
    console.time('start2')
    setTimeout(function() {
        let num = Math.random()
        if (num > .1) {
            resolve(`成功 ${num}`)
        } else {
            reject(`出错 ${num}`)
        }
    }, 200)

})

const log = val => {
    console.log(val)
};

a.then(null, null).then(function(val) {
    console.log('start1')
    console.timeEnd('start1')
    console.log(val)
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve('inner')
                }, 3000)
            }))
        }, 2000)
    })
}, log).then(function(val) {
    console.log('start2')
    console.timeEnd('start2')
    console.log(val)
}, log)



