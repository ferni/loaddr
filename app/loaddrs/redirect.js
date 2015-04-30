var wallet = require('../wallet');

module.exports = {
    onIncoming: function (amount, incomingID, model) {
        wallet.send({
            loaddr: model,
            address: model.settings.destinationAddress,
            amount: amount,
            incomingID: incomingID
        }, function (err) {
            if (err) throw err;
            model.log('Sent funds');
        });
    },
    validateSettings: function (settings) {
        return settings.destinationAddress ? true : false;
    },
    createForm: function () {
        return 'Destination <input name="destinationAddress" type="text" />';
    },
    settingsForm: function() {
        return this.createForm();
    }
};
