var util = require('util');

function Loaddr(model) {
    this.model = model;
    this.creator = model.creator;
    this.address = model.address;
    this.settings = model.settings;
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
        address: this.settings.destinationAddress,
        amountBag: coinBag.slice(coinBag.remaining() - 0.0001) ,
        feesBag: coinBag.slice(0.0001)
    }, function(err) {
        if(err) throw err;
        self.log('Sent funds');
    });
};
loaddrs.Redirect.prototype.saveSettings = function(settings, cb) {
    //todo: validate
    this.model.settings = settings;
    this.model.save(function(err) {
        if (err) throw err;
        cb(null);
    });
};
loaddrs.Redirect.prototype.createForm = function() {
    'Destination <input name="destinationAddress" type="text" />';
};
loaddrs.Redirect.prototype.settingsForm = loaddrs.Redirect.prototype.createForm;

util.inherits(loaddrs.Redirect, Loaddr);

function fromModel(model) {
    if (!loaddrs[model.type]) {
        throw 'There\'s no loaddr of type "' + model.type + '" defined';
    }
    return new loaddrs[model.type](model);
}

exports.fromModel = fromModel;