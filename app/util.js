/**
 * Created by Fer on 16/05/2015.
 */
exports.txLink = function(transactionHash) {
    return '<a href="https://blockchain.info/tx/' + transactionHash + '">view transaction</a>';
};