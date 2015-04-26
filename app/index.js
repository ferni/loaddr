var wallet = require('./wallet'),
    loaddrs = require('./loaddrs'),
    loaddrModel = require('./models/loaddr'),
    CoinBag = require('./coin-bag');

function onAddressReceives(address, amount) {
    console.log('Received ' + amount + ' on ' + address);
    //get corresponding loaddr
    loaddrModel.find({address: address}, function (err, docs) {
        if (err) throw err;
        if (docs.length > 1) {
            throw 'There\'s more than a loaddr with the same address';
        }
        if (docs.length === 0) {
            console.warn('Theres an address without loaddr assigned: ' + address);
            return;
        }
        var loaddr = docs[0];
        var loaddrHandler = loaddrs.fromModel(loaddr);
        var coinBag = new CoinBag(amount, loaddr);
        loaddrHandler.onIncoming(coinBag);
    })
}

exports.init = function() {
    wallet.init(onAddressReceives);
};
