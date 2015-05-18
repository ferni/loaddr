var Promise = require('bluebird'),
    sh = require('./shapeshift'),
    wallet = require('../../wallet');

module.exports = {
    onIncoming: function (amount, loaddr) {
        var s = loaddr.settings;
        loaddr.log('Contacting ShapeShift.io ...');
        sh.getDepositAddress(s.coin, s.address).then(function(address) {
            loaddr.log('Gotten deposit address: ' + address);
            return wallet.send({
                loaddr: loaddr,
                outputs: [{
                    address: address,
                    amount: amount - wallet.fee
                }]
            });
        }).then(function() {
            loaddr.log('Bits sent to ShapeShift!');
        });
    },
    validateSettings: function (settings) {
        return new Promise(function(resolve, reject) {
            if (!settings.coin) {
                resolve({errors: ['No altcoin selected']});
            }
            if (!sh.coins[settings.coin]) {
                resolve({errors: ['Altcoin ' + settings.coin + ' not recognized.']});
            }
            if (!settings.address) {
                resolve({errors: ['Please enter a ' + sh.coins[settings.coin].name + ' address']});
            }
            resolve({});
        });
    },
    createForm: function () {
        return '{external}';
    },
    settingsForm: function(settings) {
        return 'This loader does nothing.';
    }
};