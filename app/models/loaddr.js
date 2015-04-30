var mongoose = require('mongoose'),
    coinbase = require('coinbase'),
    Promise = require('bluebird'),
    autoIncrement = require('mongoose-auto-increment');
Promise.promisifyAll(coinbase);

var loaddrSchema = mongoose.Schema({
    _creator : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: String,
    address: String,
    index: {type: Number},
    settings: Object
});

loaddrSchema.methods.log = function(msg) {
    console.log('Loaddr log: ' + msg);
};
//loaddrSchema.plugin(autoIncrement.plugin, 'Loaddr');
module.exports = mongoose.model('Loaddr', loaddrSchema);