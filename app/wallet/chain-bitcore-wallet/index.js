var _ = require('lodash'),
    hd = require('./hd'),
    chainWrapper = require('./chain-wrapper');

module.exports = {
    init: function(app, addresses, onReceivedHandler) {
        //start tracking addresses
        return chainWrapper.init(app, addresses, onReceivedHandler);
    },
    /**
     * Sends funds to a bitcoin address.
     * @param params {{address:string,amount:int,loaddr:Object}}
     * @param cb Function callback.
     */
    send: function(params) {
        if (params.amount < 0) {
            throw 'Cannot send negative amount';
        }
        var privateKey = hd.getPrivateKey(params.loaddr._id);
        console.log('private key:' + privateKey);
        var fee = 10000;
        return chainWrapper.chain.transactAsync({
            inputs: [{
                address: params.loaddr.address,
                private_key: privateKey
            }],
            outputs: [{
                address: params.address,
                amount: params.amount - fee
            }],
            miner_fee_rate: fee
        });
    },
    getAddress: function(index) {
        var address = hd.getAddress(index);
        return chainWrapper.trackNew(address).then(function() {
            return address;
        });
    },
    loadBalances: function(loaddrs) {
        var addresses = _.pluck(loaddrs, 'address');
        var loaddrsByAddress = _.groupBy(loaddrs, 'address');
        return chainWrapper.chain.getAddressesAsync(addresses).map(function(detail) {
            loaddrsByAddress[detail.address][0].balance = detail.total.balance;
        });
    }
};

