/**
 * Created by Fer on 12/05/2015.
 */
var Promise = require('bluebird');
var coinbase = require('coinbase');
var _ = require('lodash');
Promise.promisifyAll(coinbase);
var bitcore = require('bitcore');
var $b = require('../../util').displayBits;
//--- coinbase errors ---
// 'ExpiredAccessToken':
// use the client.refresh API to get a new access_token
//'InvalidAccessToken':
//'AuthenticationError'


var sellRetryMS = 36500;
//var sellRetryMS = 3000;

var ExpiredAccessToken = function(e) {
    return e.type === 'ExpiredAccessToken';
};

exports.createClient = function (loaddr) {
    return new WrappedClient(loaddr);
};

function WrappedClient(loaddr) {
    this.fullClient = new coinbase.Client({
        apiKey: process.env.COINBASE_CLIENT_ID,
        apiSecret: process.env.COINBASE_CLIENT_SECRET,
        accessToken: loaddr._creator.coinbase.access_token,
        refreshToken: loaddr._creator.coinbase.refresh_token
    });
    this.loaddr = loaddr;
}

WrappedClient.prototype.refreshToken = function() {
    var loaddr = this.loaddr;
    return this.fullClient.refreshAsync().then(function(result) {
        console.log('new token: ' + result.access_token);
        loaddr._creator.coinbase.access_token = result.access_token;
        loaddr._creator.coinbase.refresh_token = result.refresh_token;
        return loaddr._creator.saveAsync();
    }).then(function() {
        console.log('new token successfully saved');
    });
};

WrappedClient.prototype.getDepositAddress = function() {
    var self = this,
        client = this.fullClient;

    console.log('getting accounts:');
    return client.getAccountsAsync().catch(ExpiredAccessToken, function() {
        console.log('expired token, refreshing...');
        return self.refreshToken().then(function() {
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
        return primary.getAddressAsync().then(function(response) {
            if (!response.success) {
                throw new Error('Something went wrong getting the deposit address:'
                + JSON.stringify(response));
            }
            console.log('address found:' + response.address);
            return [response.address, primary];
        });
    });
};

WrappedClient.prototype.sell = function(account, satoshis, retryOptions) {
    var self = this,
        sellInBTC = bitcore.Unit.fromSatoshis(satoshis).toBTC();
    if (retryOptions) {
        retryOptions.retry--;
    }
    self.loaddr.log('Selling ' + $b(satoshis) + ' ...');
    return account.sellAsync({
        "qty": sellInBTC
    }).catch(function(e) {
        //User is unable to sell (level 0)
        self.loaddr.log('Unable to sell:' + e.cause.response.body);
        if (retryOptions && retryOptions.retry > -1) {
            self.loaddr.log('Retrying in ' + sellRetryMS + ' ms.');
            return Promise.delay(sellRetryMS).then(function() {
                return self.sell(account, satoshis, retryOptions);
            });
        } else {
            throw new Error(e);
        }
    });
};
