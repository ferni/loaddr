var Promise = require('bluebird');
var request = require('request');
var coinbaseWrapper = require('./coinbase');
var wallet = require('../../wallet');
var _ = require('lodash');
var bitcore = require('bitcore');

module.exports = {
    onIncoming: function (amount, loaddr) {
        var available = amount - wallet.fee;
        var client = coinbaseWrapper.createClient(loaddr);
        client.getDepositAddress().spread(function(address, account) {
            return wallet.send({
                loaddr: loaddr,
                outputs: [{
                    amount: available,
                    address: address
                }]
            }).then(function() {
                return account;
            });
        }).then(function(account) {
            loaddr.log('Sent bits to Coinbase.');
            var sellInBTC = bitcore.Unit.fromSatoshis(available).toBTC();
            loaddr.log('Selling ' + sellInBTC + ' BTC...');
            return account.sellAsync({
                "qty": sellInBTC
            }).catch(function(e) {
                throw new Error('Unable to sell:' + JSON.stringify(e));
            });
        }).then(function(xfer) {
            loaddr.log('Sold. Transfer id: <strong>' + xfer.id + '</strong>');
        });
    },
    validateSettings: function (settings, user) {
        if(user.coinbase.access_token) {
            //already linked coinbase
            return new Promise(function(resolve, reject) {
                resolve({});
            });
        }
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
                return user.saveAsync();
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