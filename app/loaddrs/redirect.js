var wallet = require('../wallet');

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
        return settings.destinationAddress ? true : false;
    },
    createForm: function () {
        return 'Destination <input name="destinationAddress" type="text" />';
    },
    settingsForm: function(settings) {
        //TODO: Make the settings editable (ajax)
        return 'Destination: <strong>' + settings.destinationAddress+ '</strong>';
    }
};
