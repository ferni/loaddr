var Promise = require('bluebird');

var coins = {btc:{},
    ltc:{},
    ppc:{},
    drk:{},
    doge:{},
    ftc:{},
    blk:{},
    nxt:{},
    btcd:{},
    qrk:{},
    rdd:{},
    nbt:{},
    bts:{},
    bitusd:{},
    xcp:{},
    xmr:{}};
module.exports = {
    onIncoming: function (amount, loaddr) {
        return new Promise(function(resolve, reject) {
            resolve({});
        });
    },
    validateSettings: function (settings) {
        return new Promise(function(resolve, reject) {
            resolve({});
        });
    },
    createForm: function () {
        return '{{external}}';
    },
    settingsForm: function(settings) {
        return 'This loader does nothing.';
    }
};