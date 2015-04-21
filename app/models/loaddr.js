var mongoose = require('mongoose'),
    coinbase = require('coinbase'),
    Promise = require('bluebird');

Promise.promisifyAll(coinbase);

var Loaddr = mongoose.Schema({
    isBank: Boolean,
    isPhone: Boolean,
    address: String
});

module.exports = mongoose.model('Loaddr', Loaddr);