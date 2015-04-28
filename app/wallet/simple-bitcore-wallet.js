var uuid = require('node-uuid'),
    _ = require('lodash'),
    bitcore = require('bitcore');

var addresses = [],
    incomings = [],
    handler;

function getTotalIncoming() {
    return _.reduce(incomings, function(total, incoming) {
        return total + incoming.amount;
    });
}

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

function randomAdressReceives() {
    setTimeout(function() {
        if (addresses.length > 0) {
            var incoming = {
                id: uuid.v4(),
                address: addresses[Math.floor(Math.random() * addresses.length)],
                amount: Math.floor(Math.random() * 10000000000)
            };
            incomings.push(incoming);
            handler(incoming.address, incoming.amount, incoming.id);
        }
        randomAdressReceives();
    }, 3000);
}

module.exports = {
    init: function(subs, addresses) {
        //start tracking addresses
        handler = subs;
        randomAdressReceives();
    },
    /**
     * Sends funds to a bitcoin address.
     * @param params {{address:string,amount:int,incomingID:string}}
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

        console.log("Sending " + params.address);

    },
    getNewAddress: function() {
        var address = ;
        addresses.push(address);
        return address;
    }
};

