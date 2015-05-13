var Promise = require('bluebird');
var request = require('request');

module.exports = {
    onIncoming: function (amount, loaddr) {
        return new Promise(function(resolve, reject) {
            resolve({});
        });
    },
    validateSettings: function (settings) {
        var code = settings.code;
        if (!code) {
            return new Promise(function(resolve, reject) {
                resolve({errors:['Unable to connect to Coinbase']});
            });
        }
        return request.postAsync('https://www.coinbase.com/oauth/token', {
            form: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'https://loaddr.herokuapp.com/create-loaddr/bank',
                client_id: process.env.COINBASE_CLIENT_ID,
                client_secret: process.env.COINBASE_CLIENT_SECRET
            }
        }).spread(function(httpResponse, body){
            /*
             {"access_token":"...","token_type":"bearer","expires_in":7200,"refresh_token":"...","scope":"user balance"}"
             */
            if (!body.access_token) {
                return {errors:['Unable to connect to Coinbase']}
            }
            console.log('Gotten response from Coinbase: ' + body);
            return {};
        });
    },
    createForm: function () {
        return '{external}';
    },
    settingsForm: function(settings) {
        return 'Deposits incoming bits into your Coinbase account and sells them.';
    }
};