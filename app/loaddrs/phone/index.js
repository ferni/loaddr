var wallet = require('../../wallet');
var bitrefill = require('./bitrefill');
module.exports = {
    onIncoming: function (amount, incomingID, model) {
        return wallet.send({
            loaddr: model,
            address: model.settings.destinationAddress,
            amount: amount,
            incomingID: incomingID
        }).then(function () {
            model.log('Sent funds');
        });
    },
    validateSettings: function (settings) {
        return bitrefill.lookupNumber(settings.number).then(function(result) {
            return {errors: [result]};
        });
    },
    createForm: function () {
        return 'Phone number: <input name="number" type="text" />';
    },
    settingsForm: function(settings) {
        //TODO: Make the settings editable (ajax)
        return 'Destination: <strong>' + settings.destinationAddress+ '</strong>';
    }
};
