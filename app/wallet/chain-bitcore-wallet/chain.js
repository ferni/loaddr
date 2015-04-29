var Chain = require('chain-node');
var Promise = require("bluebird");
var _ = require('lodash');
var chain = new Chain({
    keyId: process.env.CHAIN_KEY_ID,
    keySecret: process.env.CHAIN_KEY_SECRET,
    blockChain: 'bitcoin'
});

Promise.promisifyAll(Object.getPrototypeOf(chain));


module.exports = {
    init: function(app, addresses, receivedHandlerMiddleware) {
        app.post('/chain', function(req, res) {
            res.json({});
        });

        //check the tracked addresses
        return chain.listNotificationsAsync().then(function(notif) {
            var listedAddresses = _.chain(notif)
                .filter({type: 'address'})
                .pluck('address')
                .value();
            console.log('Listed addresses: ' + listedAddresses.toString());
        });
    }
};
