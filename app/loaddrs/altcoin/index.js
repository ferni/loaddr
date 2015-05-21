function handleStatus(loaddr) {
    return function (status) {
        switch (status.status) {
            case 'no_deposits' : {
                return sh.waitForStatusChange(status).then(handleStatus(loaddr));
            }
            case 'received': {
                loaddr.log('Payment acknowledged, awaiting exchange...');
                return sh.waitForStatusChange(status).then(handleStatus(loaddr));
            }
            case 'complete': {
                loaddr.log('Exchange completed succesfully. ' + status.outgoingType + ' tx id: ' + status.transaction);
                return;
            }
            case 'failed': {
                loaddr.log('Exchange failed: ' + status.error);
                return;
            }
            default: throw new Error('Unknown shapeshift status: ' + JSON.stringify(status));
        }
    };
}

var Promise = require('bluebird'),
    sh = require('./shapeshift'),
    wallet = require('../../wallet'),
    $b = require('../../util').displayBits;

module.exports = {
    onIncoming: function (amount, loaddr) {
        var s = loaddr.settings;
        loaddr.log('Contacting ShapeShift.io ...');
        sh.getDepositAddress(s.coin, s.address).tap(function(address) {
            console.log('Gotten shapeshift deposit address: ' + address);
            return wallet.send({
                loaddr: loaddr,
                outputs: [{
                    address: address,
                    amount: amount - wallet.fee
                }]
            });
        }).then(function(address) {
            loaddr.log($b(amount - wallet.fee) + ' sent to ShapeShift.');
            return sh.getStatus(address);
        }).then(handleStatus(loaddr));
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
        return 'Coin: ' + (sh.coins[settings.coin] ? sh.coins[settings.coin].name : '(?) ')+ '<br/>Address: ' + settings.address;
    }
};