var wallet = require('./wallet'),
    loaddrModel = require('./models/loaddr'),
    _ = require('lodash');

function onAddressReceives(address, amount) {
    //get corresponding loaddr
    loaddrModel.find({address: address}).populate('_creator').then(function (docs) {
        if (docs.length > 1) {
            throw 'There\'s more than a loaddr with the same address';
        }
        if (docs.length === 0) {
            console.warn('Theres an address without loaddr assigned: ' + address);
            return;
        }
        var loaddr = docs[0];
        loaddr.log('Received ' + amount);
        loaddr.loadPrototype();
        return loaddr.onIncoming(amount, loaddr);
    }).catch(function(e) {
        console.error('Error when processing incoming funds on address ' + address);
        console.log(e.message);
    });
}

exports.init = function(app) {
    loaddrModel.find({}, 'address', function(err, loaddrs) {
        var addresses = _.pluck(loaddrs, 'address');
        wallet.init(app, addresses, onAddressReceives);
    });
};
