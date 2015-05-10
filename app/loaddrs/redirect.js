var wallet = require('../wallet');
var Promise = require('bluebird');
var bitcore = require('bitcore');

module.exports = {
    onIncoming: function (amount, loaddr) {
        return wallet.send({
            loaddr: loaddr,
            outputs: [{
                address: loaddr.settings.destinationAddress,
                amount: amount
            }]
        }).then(function () {
            loaddr.log('Sent funds');
        });
    },
    validateSettings: function (settings) {
        return new Promise(function(resolve, reject){
            if(settings.destinationAddress) {
                try {
                    bitcore.Address.fromString(settings.destinationAddress);
                    resolve({});
                } catch(e) {
                    resolve({errors: ['Invalid address format.']});
                }
            } else {
                resolve({errors: ['Please enter a bitcoin address to redirect the funds to.']});
            }
        });
    },
    createForm: function () {
        return 'Destination <input name="destinationAddress" type="text" />';
    },
    settingsForm: function(settings) {
        //TODO: Make the settings editable (ajax)
        return 'Destination: <strong>' + settings.destinationAddress+ '</strong>';
    }
};
