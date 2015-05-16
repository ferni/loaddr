var wallet = require('../wallet');
var Promise = require('bluebird');
var bitcore = require('bitcore');
var _ = require('lodash');
module.exports = {
    onIncoming: function (amount, loaddr) {
        return wallet.send({
            loaddr: loaddr,
            outputs: [{
                address: loaddr.settings.destinationAddress,
                amount: amount - wallet.fee
            }]
        }).then(function () {
            loaddr.log('Sent funds to ' + loaddr.settings.destinationAddress);
        });
    },
    validateSettings: function (settings) {
        return new Promise(function(resolve, reject){
            var total = 0;
            if (!settings.addresses) {
                resolve({errors: ['No addresses set.']});
            }
            settings.addresses.forEach(function(address) {
                try {
                    bitcore.Address.fromString(address.address);
                } catch(e) {
                    resolve({errors: ['Invalid address format.']});
                }
                total += address.percentage;
            });
            if (total > 100) {
                resolve({errors: ['Invalid total percentage.']});
            }
            resolve({});
        });
    },
    createForm: function () {
        return '{external}';
    },
    settingsForm: function(settings) {
        return 'Destination: <strong>' + settings.destinationAddress+ '</strong>';
    }
};
