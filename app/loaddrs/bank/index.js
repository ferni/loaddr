var Promise = require('bluebird');
var request = require('request');
var coinbase = require('coinbase');
Promise.promisifyAll(coinbase);

module.exports = {
    onIncoming: function (amount, loaddr) {
        console.log('accessToken:'+ loaddr._creator.coinbase.access_token +
            'refreshToken:' + loaddr._creator.coinbase.refresh_token);
        return new Promise(function(resolve){
            return resolve({});
        });
        var client = new coinbase.Client({
            apiKey: process.env.COINBASE_CLIENT_ID,
            apiSecret: process.env.COINBASE_CLIENT_SECRET,
            accessToken: loaddr._creator.coinbase.access_token,
            refreshToken: loaddr._creator.coinbase.refresh_token
        });
        client.getAccounts(function(err, accounts) {
            if (err) {
                throw err;
            }
            accounts.forEach(function(acct) {
                console.log('my bal: ' + acct.balance.amount + ' for ' + acct.name);
            });
        });
        return new Promise(function(resolve){
            return resolve({});
        });
    },
    validateSettings: function (settings, user) {
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
            console.log('coinbase response:' + body);
            body = JSON.parse(body);
            if (!body.access_token) {
                return {errors:['Unable to connect to Coinbase']}
            } else {
                user.coinbase.access_token = body.access_token;
                user.coinbase.refresh_token = body.refresh_token;
                return {};
            }
        });
    },
    createForm: function (user) {
        if (user.coinbase && user.coinbase.access_token) {
            return '<span id="connected">Coinbase account linked</span>';
        }
        return '{external}';
    },
    settingsForm: function(settings) {
        return 'Deposits incoming bits into your Coinbase account and sells them.';
    }
};