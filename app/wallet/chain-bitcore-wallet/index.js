var _ = require('lodash'),
    hd = require('./hd'),
    chainWrapper = require('./chain-wrapper');

var incomings = [],
    handler;

function substractFromPending(amount, incomingID) {
    var incoming = _.find(incomings, {id: incomingID});
    console.log('Incoming found:' + JSON.stringify(incoming));
    if (!incoming) {
        throw 'Incoming ID not found:' + incomingID;
    }
    if (amount > incoming.amount) {
        throw 'Tried to spend more than was incoming. incoming:' + incoming.amount +
        ' amount tried: ' + amount;
    }
    incoming.amount -= amount;
    if (incoming.amount === 0) {
        incomings.splice(incomings.indexOf(incoming), 1);
    }
}

function receivedHandlerMiddleware(incoming) {
    incomings.push(incoming);
    handler(incoming.address, incoming.amount, incoming.id);
}

module.exports = {
    init: function(app, addresses, onReceivedHandler) {
        //start tracking addresses
        handler = onReceivedHandler;
        return chainWrapper.init(app, addresses, receivedHandlerMiddleware);
    },
    /**
     * Sends funds to a bitcoin address.
     * @param params {{address:string,amount:int,incomingID:string,loaddr:Object}}
     * @param cb Function callback.
     */
    send: function(params, cb) {
        if (params.amount < 0) {
            return cb(new Error('Cannot send negative amount'));
        }
        try {
            substractFromPending(params.amount, params.incomingID);
        } catch (e) {
            return cb(new Error(e));
        }
        var privateKey = hd.getPrivateKey(params.loaddr._id);
        chainWrapper.chain.transactAsync({
            inputs: [{
                address: params.loaddr.address,
                private_key: privateKey
            }],
            outputs: [{
                address: params.address,
                amount: params.amount
            }]
        }).then(function(){
            cb(null);
        }).catch(function(e) {
            cb(e);
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
        console.log('loaddrsByAddress:' + JSON.stringify(loaddrsByAddress))
        return chainWrapper.chain.getAddressesAsync(addresses).map(function(detail) {
            console.log('detail:' + JSON.stringify(detail));
            loaddrsByAddress[detail.address][0].balance = detail.total.balance;
            console.log('loaddrsByAddress:' + detail.address + JSON.stringify(loaddrsByAddress[detail.address]));
            console.log('loaddrs:' + JSON.stringify(loaddrs));
        });
    }
};

