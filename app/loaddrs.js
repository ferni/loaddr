var util = require('util');

function Loaddr(model) {
    this.model = model;
    this.creator = model.creator;
    this.address = model.address;
    this.options = model.options;
}
Loaddr.prototype.log = function(msg) {
  console.log('Loaddr:' + msg);
    //todo: save to database and send through web sockets. (email?)
};

var loaddrs = {};
loaddrs.Redirect = function() {};
loaddrs.Redirect.prototype.onIncoming = function(coinBag) {
    var self = this;
    if (!(coinBag.remaining() <= 0.0001)) {
        return;
    }
    wallet.send({
        address: this.options.destinationAddress,
        amountBag: coinBag.slice(coinBag.remaining() - 0.0001) ,
        feesBag: coinBag.slice(0.0001)
    }, function(err) {
        if(err) throw err;
        self.log('Sent funds');
    });
};
util.inherits(loaddrs.Redirect, Loaddr);

function fromModel(model) {
    return new loaddrs[model.type](model);
}

exports.fromModel = fromModel();