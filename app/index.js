var wallet = require('./wallet'),
    loaddrModel = require('./models/loaddr'),
    _ = require('lodash');

function onAddressReceives(address, amount, incomingID) {
    console.log('Received ' + amount + ' on ' + address);
    //get corresponding loaddr
    loaddrModel.findAsync({address: address}).then(function (docs) {
        if (docs.length > 1) {
            throw 'There\'s more than a loaddr with the same address';
        }
        if (docs.length === 0) {
            console.warn('Theres an address without loaddr assigned: ' + address);
            return;
        }
        var loaddr = docs[0];
        console.log('loaddr found: ' + JSON.stringify(loaddr));
        loaddr.loadPrototype();
        return loaddr.onIncoming(amount, incomingID, loaddr);
    }).catch(function(e) {
        console.error('Error when processing incoming funds on address ' + address);
        console.log(JSON.stringify(e));
    });
}

exports.init = function(app) {
    loaddrModel.find({}, 'address', function(err, loaddrs) {
        var addresses = _.pluck(loaddrs, 'address');
        wallet.init(app, addresses, onAddressReceives);
    });
};
