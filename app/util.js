/**
 * Created by Fer on 16/05/2015.
 */

var bitcore = require('bitcore');
exports.txLink = function(transactionHash) {
    return '<a href="https://blockchain.info/tx/' + transactionHash + '">view transaction</a>';
};

exports.displayBits = function(satoshis) {
    return bitcore.Unit.fromSatoshis(satoshis).toBits() + ' bits';
};