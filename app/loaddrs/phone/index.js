var wallet = require('../../wallet');
var bitrefill = require('./bitrefill');
var Promise = require('bluebird');
var _ = require('lodash');


module.exports = {
    onIncoming: function (amount, loaddr) {
        wallet.loadBalances([loaddr]).then(function() {
            console.log('looking up number');
            return bitrefill.lookupNumber(loaddr.settings.number);
        }).spread(function(result, body) {
            var operator = JSON.parse(body).operator;
            var maxAffordablePrice = _.chain(operator.packages)
                .filter(function(p) {
                    return p.satoshiPrice <= loaddr.balance - wallet.fee;
                })
                .pluck('satoshiPrice')
                .max()
                .value();
            if (maxAffordablePrice !== -Infinity) {
                var pack = _.find(operator.packages, {satoshiPrice: maxAffordablePrice});
                loaddr.log('Buying ' + pack.value + ' ' + operator.currency +
                    ' worth of credit for ' + pack.satoshiPrice + ' satoshi.');
                return bitrefill.placeOrder({
                    "operatorSlug": operator.slug,
                    "valuePackage" : pack.value,
                    "number" : loaddr.settings.number,
                    "email" : loaddr._creator.local.email
                });
            }
            var minPackage = _.min(operator.packages, 'satoshiPrice');
            loaddr.log('Saved ' + amount + '. Add ' + ((minPackage.satoshiPrice + wallet.fee) - loaddr.balance) +
                ' more to buy the ' + minPackage.value + ' ' + operator.currency + ' top up package.');
            return [null, null];
        }).spread(function(result, order) {
            if (!result) return;
            return wallet.send({
                loaddr: loaddr,
                outputs: [{
                    address: order.address,
                    amount: order.satoshiPrice
                }]
            });
        });
    },
    validateSettings: function (settings) {
        //{"error":{"code":400,"message":"Error: All needed argument not received\nError: Errors: 1: System error. Retry operation; \n"}}
        if (!settings.number) {
            return new Promise(function(resolve, reject) {
                resolve({errors: ['Please enter a phone number']});
            })
        }
        return bitrefill.lookupNumber(settings.number).then(function(result) {
            if (result.error) {
                return {errors: ['Phone number not supported']};
            }
            return {};
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
