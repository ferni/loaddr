var bitcore = require('bitcore');

var privateKey = new bitcore.HDPrivateKey(process.env.xprv);

exports.getAddress = function(index) {
    var derived = privateKey.derive(0, true).derive(index);// formato multibit hd (m/0'/x)
    return derived.privateKey.toAddress().toString();//direccion comprimida
};

exports.getPrivateKey = function(index) {
    var derived = privateKey.derive(0, true).derive(index);// formato multibit hd (m/0'/x)
    return derived.privateKey.toString();//HEX
};