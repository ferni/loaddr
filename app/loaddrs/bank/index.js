var Promise = require('bluebird');
var request = require('request');
var coinbase = require('coinbase');
var wallet = require('../../wallet');
var _ = require('lodash');
Promise.promisifyAll(coinbase);

//coinbase errors =
// 'ExpiredAccessToken':
// use the client.refresh API to get a new access_token
//'InvalidAccessToken':
//'AuthenticationError'

var ExpiredAccessToken = function(e) {
    return e.type === 'ExpiredAccessToken';
};

module.exports = {
    onIncoming: function (amount, loaddr) {
        var client = new coinbase.Client({
            apiKey: process.env.COINBASE_CLIENT_ID,
            apiSecret: process.env.COINBASE_CLIENT_SECRET,
            accessToken: loaddr._creator.coinbase.access_token,
            refreshToken: loaddr._creator.coinbase.refresh_token
        });
        //get addresses
        console.log('getting accounts:');
        return client.getAccountsAsync().catch(ExpiredAccessToken, function() {
            console.log('expired token, refreshing...');
           return client.refreshAsync().then(function(result) {
               console.log('new token: ' + result.access_token);
               loaddr._creator.coinbase.access_token = result.access_token;
               loaddr._creator.coinbase.refresh_token = result.refresh_token;
               return loaddr.saveAsync();
           }).then(function() {
               console.log('new token successfully saved');
               return client.getAccountsAsync();
           });
        }).then(function(accounts) {
            console.log('gotten accounts');
            var primary = _.find(accounts, {primary: true, type: 'wallet'});
            if (!primary) {
                throw new Error('Did not find a primary wallet account');
            }
            if (!primary.getAddressAsync) {
                Promise.promisifyAll(Object.getPrototypeOf(primary));
            }
            console.log('getting primary address:');

            return primary.getAddressAsync();
        }).then(function(coinbaseResponse) {
            if (!success) {
                throw new Error('Something went wrong getting deposit address:' + JSON.stringify(coinbaseResponse));
            }
            console.log('address found:' + coinbaseResponse.address);
            return wallet.send({
                loaddr: loaddr,
                outputs: [{
                    amount: amount - wallet.fee,
                    address: coinbaseResponse.address
                }]
            });
        }).then(function() {
            loaddr.log('Sent bits to Coinbase.');
        });


        /*
         var args = {
         "qty": "12"
         };
         account.sell(args, function(err, xfer) {
         console.log('my xfer id is: ' + xfer.id);
         });
         */
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