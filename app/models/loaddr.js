var mongoose = require('mongoose'),
    coinbase = require('coinbase'),
    Promise = require('bluebird');

Promise.promisifyAll(coinbase);

var Loaddr = mongoose.Schema({
    _creator : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isBank: Boolean,
    isPhone: Boolean,
    address: String
});

module.exports = mongoose.model('Loaddr', Loaddr);