var wallet = require('./wallet'),
    loaddrModel = require('./models/loaddr'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    $b = require('./util').displayBits;

function onAddressReceives(address, amount) {
    //get corresponding loaddr
    var loaddr = {log: function(){}};
    loaddrModel.find({address: address}).populate('_creator').then(function (docs) {
        if (docs.length > 1) {
            throw 'There\'s more than a loaddr with the same address';
        }
        if (docs.length === 0) {
            console.warn('Theres an address without loaddr assigned: ' + address);
            return;
        }
        var loaddr = docs[0];
        loaddr.log('Received ' + $b(amount));
        loaddr.loadPrototype();
        console.log('Waiting 3 seconds');
        Promise.delay(3000).then(function() {
            return wallet.loadBalances([loaddr]);
        }).then(function() {
            return loaddr.onIncoming(amount, loaddr);
        }).then(function() {
            return loaddr.balanceChanged();
        });
    }).catch(function(e) {
        console.error('Error when processing incoming funds on address ' + address);
        console.log(JSON.stringify(e));
        loaddr.log('Error: ' + e.message);
    });
}

exports.init = function(app) {
    loaddrModel.find({}, 'address', function(err, loaddrs) {
        var addresses = _.pluck(loaddrs, 'address');
        wallet.init(app, addresses, onAddressReceives);
    });
};
