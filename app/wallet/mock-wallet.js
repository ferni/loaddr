var CoinBag = require('../coin-bag');

var addresses = [],
    subscriber;

function randomAdressReceives() {
    setTimeout(function() {
        if (addresses.length > 0) {
            subscriber.received(addresses[Math.floor(Math.random() * addresses.length)],
                Math.random());
        }
        randomAdressReceives();
    }, Math.random() * 8000);
}

module.exports = {
    init: function(subs) {
       //start tracking addresses
        subscriber = subs;
        randomAdressReceives();
    },
    /**
     * Sends funds to a bitcoin address.
     * @param params {{address:string,amountBag:CoinBag,feesBag:CoinBag}}
     * @param cb Function callback.
     */
    send: function(params, cb) {
        console.log("Sending " + params.amountBag.remaining());
        setTimeout(function() {
            cb(null);
        }, 2000);
    },
    getNewAddress: function() {
        var address = require('crypto').randomBytesSync(48).toString('hex');
        addresses.push(address);
        return address;
    }
};
