var wallet = require('../wallet');

module.exports = {
    onIncoming: function (coinBag, model) {
        if (!(coinBag.remaining() <= 0.0001)) {
            return;
        }
        wallet.send({
            address: model.settings.destinationAddress,
            amountBag: coinBag.slice(coinBag.remaining() - 0.0001),
            feesBag: coinBag.slice(0.0001)
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
