var Promise = require('bluebird');

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
                resolve({errors:['Something went wrong when trying to connect your coinbase account']});
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
            console.log('Gotten response from Coinbase: ' + JSON.stringify(body));
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