var mongoose = require('mongoose'),
    coinbase = require('coinbase'),
    Promise = require('bluebird');

Promise.promisifyAll(coinbase);

var Loaddr = mongoose.Schema({
    _creator : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: String,
    address: String,
    settings: Object
});

Loaddr.methods.log = function(msg) {
    console.log('Loaddr log: ' + msg);
};

module.exports = mongoose.model('Loaddr', Loaddr);