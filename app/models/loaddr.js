var mongoose = require('mongoose'),
    coinbase = require('coinbase'),
    Promise = require('bluebird'),
    db = require('../db').db,
    autoIncrement = require('mongoose-auto-increment'),
    socket = require('../socket'),
    $b = require('../util').displayBits;
Promise.promisifyAll(coinbase);

var loaddrSchema = mongoose.Schema({
    _creator : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: String,
    address: String,
    index: {type: Number},
    settings: Object,
    logs: Array
});

loaddrSchema.methods.log = function(msg) {
    console.log((this._creator.local ? this._creator.local.email : this._creator) + '\'s ' +
        this.type + ' loaddr (' + this.address + ') log: ' + msg);
    socket.sendTo(this._creator._id, 'log', {
        address: this.address,
        message: msg
    });
    this.logs.push(msg);
    this.save();
};

loaddrSchema.methods.balanceChanged = function() {
    //update the user
    socket.sendTo(this._creator._id, 'update balance', {
        address: this.address,
        balance: $b(this.balance)
    });
};

loaddrSchema.methods.loadPrototype = function() {
    var prot = require('../loaddrs').getPrototype(this.type);
    this.onIncoming = prot.onIncoming;
    this.validateSettings = prot.validateSettings;
    this.createForm = prot.createForm(this._creator);
    this.settingsForm = prot.settingsForm(this.settings, this);
};
loaddrSchema.plugin(autoIncrement.plugin, 'Loaddr');
module.exports = db.model('Loaddr', loaddrSchema);