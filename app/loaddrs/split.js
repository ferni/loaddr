var wallet = require('../wallet'),
    Promise = require('bluebird'),
    bitcore = require('bitcore'),
    _ = require('lodash'),
    util = require('../util');
module.exports = {
    onIncoming: function (amount, loaddr) {
        var outputs = _.map(loaddr.settings.addresses, function(a) {
            var amountToLog = amount * a.percentage / 100;
            console.log(amountToLog);
            return {
                address: a.address,
                amount: amountToLog
            }
        });
        var total = _.sum(outputs, 'amount');
        console.log('total ' + total);
        if (total < amount) {
            outputs[0].amount += (amount - total);
            outputs[0].amount -= wallet.fee;
        }
        console.log('outputs:');
        outputs.forEach(function(o) {
            console.log(JSON.stringify(o));
        });
        return wallet.send({
            loaddr: loaddr,
            outputs: outputs
        }).then(function (tx) {
            loaddr.log(amount + ' split among ' + outputs.length + ' addresses (' + util.txLink(tx) + ')');
        });
    },
    validateSettings: function (settings) {
        return new Promise(function(resolve, reject){
            var total = 0;
            if (!settings.addresses) {
                resolve({errors: ['No addresses set.']});
            }
            if (settings.addresses.length < 2) {
                resolve({errors: ['There should be at least two addresses.']});
            }
            settings.addresses.forEach(function(address) {
                if (address.percentage == undefined ) {
                    resolve({errors: ['Percentage missing for address ' + address.address]});
                }
                try {
                    bitcore.Address.fromString(address.address);
                } catch(e) {
                    resolve({errors: ['Invalid address format.']});
                }
                total += address.percentage;
            });
            if (total != 100) {
                settings.addresses[0].percentage += (100 - total);
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
