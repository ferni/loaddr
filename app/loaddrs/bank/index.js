var Promise = require('bluebird');

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
        return '{external}';
    },
    settingsForm: function(settings) {
        return 'Deposits incoming bits into your Coinbase account and sells them.';
    }
};