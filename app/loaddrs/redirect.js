var wallet = require('../wallet');

module.exports = {
    onIncoming: function (coinBag, model) {
        console.log('calling "onIncoming" with coinbag with ' + coinBag.remaining() + ' coins.');
        if (coinBag.remaining() <= 100000) {
            console.warn('Coins received on ' + model.address + ' <= 0.0001 (' + coinBag.remaining() + ')');
            return;
        }
        wallet.send({
            address: model.settings.destinationAddress,
            amountBag: coinBag.slice(coinBag.remaining() - 100000),
            feesBag: coinBag.slice(100000)
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
