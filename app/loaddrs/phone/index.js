var wallet = require('../../wallet');
var bitrefill = require('./bitrefill');
var Promise = require('bluebird');
var _ = require('lodash');
var $b = require('../../util').displayBits;

module.exports = {
    onIncoming: function (amount, loaddr) {
        loaddr.log('Looking up top up packages...');
        return bitrefill.lookupNumber(loaddr.settings.number).then(function(body) {
            var operator = body.operator;
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
                    ' worth of credit for ' + $b(pack.satoshiPrice) + ' ...');
                return bitrefill.placeOrder({
                    "operatorSlug": operator.slug,
                    "valuePackage" : pack.value,
                    "number" : loaddr.settings.number,
                    "email" : loaddr._creator.local.email
                });
            }
            var minPackage = _.min(operator.packages, 'satoshiPrice');
            loaddr.log('Saved ' + $b(amount) + '. Add ' + $b((minPackage.satoshiPrice + wallet.fee) - loaddr.balance) +
                ' more to buy the ' + minPackage.value + ' ' + operator.currency + ' top up package.');
            return [null, null];
        }).spread(function(result, order) {
            if (!result) return;
            console.log('Attempting to send to ' + order.payment.address + ' the amount of ' + order.satoshiPrice +
                ' order:' + JSON.stringify(order));
            return wallet.send({
                loaddr: loaddr,
                outputs: [{
                    address: order.payment.address,
                    amount: order.satoshiPrice
                }]
            }).then(function() {
                //todo: check order status to see if it was actually successful
                loaddr.log('Top up package successfully bought. You\'ll receive an SMS confirmation shortly.');
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
        return bitrefill.lookupNumber(settings.number).then(function(body) {
            console.log(' body:' + JSON.stringify(body));
            if (body.error) {
                return {errors: ['Sorry, that phone number is not supported.']};
            }
            return {};
        });
    },
    createForm: function () {
        return '{external}';
    },
    settingsForm: function(settings) {
        return 'Phone number: <strong>+' + settings.number+ '</strong>';
    },
    poweredBy: {
        name: 'Bitrefill',
        url: 'https://www.bitrefill.com/'
    }
};
