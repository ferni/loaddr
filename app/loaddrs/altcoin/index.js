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
        return (new Promise(function(resolve, reject) {
            if (!settings.coin) {
                return resolve({errors: ['No altcoin selected']});
            }
            if (!sh.coins[settings.coin]) {
                return resolve({errors: ['Altcoin ' + settings.coin + ' not recognized.']});
            }
            if (!settings.address) {
                return resolve({errors: ['Please enter a ' + sh.coins[settings.coin].name + ' address']});
            }
            return resolve({});
        })).then(function(object) {
            if (object.errors) {
                return object;
            }
            return sh.validateAddress(settings.coin, settings.address).then(function(isValid) {
                if (isValid) {
                    return {};
                }
                return {errors: ['Invalid ' + sh.coins[settings.coin].name + ' address.']};
            });
        });
    },
    createForm: function () {
        return '{external}';
    },
    settingsForm: function(settings) {
        return 'Coin: ' + sh.coins[settings.coin].name + '<br/>Address: ' + settings.address;
    }
};