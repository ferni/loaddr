var wallet = require('../../wallet');
var bitrefill = require('./bitrefill');
var Promise = require('bluebird');
var _ = require('lodash');


module.exports = {
    onIncoming: function (amount, incomingID, loaddr) {
        wallet.loadBalances([loaddr]).then(function() {
            return bitrefill.lookupNumber(loaddr.settings.number);
        }).spread(function(result, body) {
            var operator = JSON.parse(body).operator;
            var maxAffordablePrice = _.chain(operator.packages)
                .filter(function(p) {
                    return p.satoshiPrice <= 50000000 - 10000;
                })
                .pluck('satoshiPrice')
                .max()
                .value();
            if (maxAffordablePrice !== -Infinity) {
                var pack = _.find(operator.packages, {satoshiPrice: maxAffordablePrice});
                return bitrefill.placeOrder({
                    "operatorSlug": operator.slug,
                    "valuePackage" : pack.value,
                    "number" : loaddr.settings.number,
                    "email" : loaddr._creator.local.email
                });
            }
            return false;
        }).then(function(order) {
            if (order) {
                console.log('order placed: ' + JSON.stringify(order));
            }
        });
    },
    validateSettings: function (settings) {
        //{"error":{"code":400,"message":"Error: All needed argument not received\nError: Errors: 1: System error. Retry operation; \n"}}
        if (!settings.number) {
            return new Promise(function(resolve, reject) {
                resolve({error: 'Please enter a phone number'});
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
