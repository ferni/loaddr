var mongoose = require('mongoose'),
    coinbase = require('coinbase'),
    Promise = require('bluebird'),
    db = require('../db').db,
    autoIncrement = require('mongoose-auto-increment'),
    socket = require('../socket');
Promise.promisifyAll(coinbase);

var loaddrSchema = mongoose.Schema({
    _creator : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: String,
    address: String,
    index: {type: Number},
    settings: Object
});

loaddrSchema.methods.log = function(msg) {
    console.log('Loaddr (' + this.address + ') log: ' + msg);
    socket.sendTo(this._creator._id, 'log', {
        address: this.address,
        message: msg
    });
};

loaddrSchema.methods.loadPrototype = function() {
    var prot = require('../loaddrs').getPrototype(this.type);
    this.onIncoming = prot.onIncoming;
    this.validateSettings = prot.validateSettings;
    this.createForm = prot.createForm();
    this.settingsForm = prot.settingsForm(this.settings);
};
loaddrSchema.plugin(autoIncrement.plugin, 'Loaddr');
module.exports = db.model('Loaddr', loaddrSchema);