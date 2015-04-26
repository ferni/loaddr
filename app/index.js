var wallet = require('./wallet'),
    loaddrModel = require('./models/loaddr'),
    CoinBag = require('./coin-bag');

function getLoaddrFunctions(type) {
    var loaddr;
    try {
        loaddr = require('./loaddrs/' + type);
    } catch (e) {
        throw 'Loaddr "' + type + '" not defined in /app/loaddrs';
    }
    return loaddr;
}

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
        console.log('loaddr found: ' + JSON.stringify(loaddr));
        var loaddrHandler = getLoaddrFunctions(loaddr.type);
        var coinBag = new CoinBag(amount, loaddr);
        loaddrHandler.onIncoming(coinBag, loaddr);
    })
}

exports.init = function() {
    wallet.init(onAddressReceives);
};
