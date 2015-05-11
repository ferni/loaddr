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
        return 'This loader does nothing';
    },
    settingsForm: function(settings) {
        return 'This loader does nothing.';
    }
};