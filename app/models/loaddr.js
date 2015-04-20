var mongoose = require('mongoose'),
    coinbase = require('coinbase'),
    Promise = require('bluebird');

Promise.promisifyAll(coinbase);

var CoinbaseLoaddr = mongoose.Schema({

});

CoinbaseLoaddr.methods.hasBank = function () {

};

exports.coinbase = mongoose.model('Loaddr', CoinbaseLoaddr);