var Chain = require('chain-node');
var Promise = require("bluebird");
var _ = require('lodash');
var chain = new Chain({
    keyId: process.env.CHAIN_KEY_ID,
    keySecret: process.env.CHAIN_KEY_SECRET,
    blockChain: 'bitcoin'
});

Promise.promisifyAll(Object.getPrototypeOf(chain));

/*
 {
 "id": "2837-38f0-j292-29f3",
 "created_at": "2014-10-20T18:27:16Z",
 "delivery_attempt": 1,
 "notification_id": "38220-243858-3848303838",
 "payload": {
         "type": "address",
         "address": "1kf93kf...",
         "block_chain": "bitcoin",
         "sent": 0,
         "received": 4000,
         "input_addresses": ["1rBauUT..."],
         "output_addresses": ["1kf93kf..."],
         "transaction_hash": "48d4425...",
         "block_hash": "00000000000004758...",
         "confirmations": 5
     }
 }

 */

var api = {
    init: function(app, addresses, onReceivedHandler) {
        app.post('/chain', function(req, res) {
            var payload = req.body.payload;
            console.log('New Chain notification: ' + JSON.stringify(req.body));
            if(payload.type === 'address' && payload.received > 0) {
                console.log('Received ' + payload.received + ' on ' + payload.address);
            }
            res.json({});
        });

        //check the tracked addresses
        return chain.listNotificationsAsync().then(function(notif) {
            return _.chain(notif)
                .filter({type: 'address'})
                .pluck('address')
                .value();
        }).then(function(tracked) {
            //track addresses not already tracked
            var track = _.difference(addresses, tracked);
            //todo: track all with join or something
        });
    },
    trackNew: function(address) {
        return chain.createNotificationAsync({
            type: "address",
            block_chain: "bitcoin",
            address: address,
            url: "https://loaddr.herokuapp.com/chain"
        });
    }
};
module.exports = api;