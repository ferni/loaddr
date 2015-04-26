var CoinBag = require('../coin-bag');

var addresses = [],
    handler;

function randomAdressReceives() {
    setTimeout(function() {
        if (addresses.length > 0) {
            handler(addresses[Math.floor(Math.random() * addresses.length)],
                Math.floor(Math.random() * 10000000000));
        }
        randomAdressReceives();
    }, 3000);
}

module.exports = {
    init: function(subs) {
       //start tracking addresses
        handler = subs;
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
        var address = 'asdf' + Math.floor(Math.random() * 1000);
        addresses.push(address);
        return address;
    }
};
