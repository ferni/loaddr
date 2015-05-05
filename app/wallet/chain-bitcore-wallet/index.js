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
    send: function(params) {
        if (params.amount < 0) {
            throw 'Cannot send negative amount';
        }
        substractFromPending(params.amount, params.incomingID);
        var privateKey = hd.getPrivateKey(params.loaddr._id);
        return chainWrapper.chain.transactAsync({
            inputs: [{
                address: params.loaddr.address,
                private_key: privateKey
            }],
            outputs: [{
                address: params.address,
                amount: params.amount
            }]
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

