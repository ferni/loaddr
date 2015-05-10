var _ = require('lodash'),
    hd = require('./hd'),
    chainWrapper = require('./chain-wrapper');

function NotEnoughError(loaddr, amount, fee) {
    this.message = 'Balance ' + loaddr.balance +' in ' + loaddr.address +
        ' not enough to send ' + amount + ' plus ' + fee + ' fee = ' +
        (amount + fee);
    this.name = "NotEnoughError";
    Error.captureStackTrace(this, NotEnoughError);
}
NotEnoughError.prototype = Object.create(Error.prototype);
NotEnoughError.prototype.constructor = NotEnoughError;

module.exports = {
    fee: 10000,
    NotEnoughError: NotEnoughError,
    init: function(app, addresses, onReceivedHandler) {
        //start tracking addresses
        return chainWrapper.init(app, addresses, onReceivedHandler);
    },
    /**
     * Sends funds to a bitcoin address.
     * @param p:{loaddr:{Object, outputs:{address:string, amount:int}}
     */
    send: function(p) {
        var amount = _.sum(p.outputs, 'amount');
        console.log('Sending ' + amount);
        if (amount + this.fee > p.loaddr.balance) {
            throw new NotEnoughError(p.loaddr, amount, this.fee);
        }
        var privateKey = hd.getPrivateKey(p.loaddr._id);
        var transactionSettings = {
            inputs: [{
                address: p.loaddr.address,
                private_key: privateKey
            }],
            outputs: p.outputs,
            miner_fee_rate: 10000
        };
        console.log('chain params: ' + JSON.stringify(transactionSettings))
        return chainWrapper.chain.transactAsync(transactionSettings);
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
        return chainWrapper.chain.getAddressesAsync(addresses).each(function(detail) {
            loaddrsByAddress[detail.address][0].balance = detail.total.balance;
        }).then(function() {
            return loaddrs;
        });
    },
    withdraw: function(loaddrs, address) {
        var inputs = _.map(loaddrs, function(l) {
            return {
                address: l.address,
                private_key: hd.getPrivateKey(l._id)
            }
        });
        var amount = _.sum(loaddrs, 'balance');
        return chainWrapper.chain.transactAsync({
            inputs: inputs,
            outputs: [{
                address: address,
                amount: amount - this.fee
            }],
            miner_fee_rate: this.fee
        });
    }
};

