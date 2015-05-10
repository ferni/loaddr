/**
 * Created by Fer on 10/05/2015.
 */
var isLoggedIn = require('./is-logged-in');
var wallet = require('../wallet');
var db = require('../db').db;
var _ = require('lodash');
var bitcore = require('bitcore');
module.exports = function(app) {
    app.get('/withdraw', isLoggedIn, function(req, res, next) {
        db.model('Loaddr')
            .findAsync({_creator: req.user._id})
            .then(wallet.loadBalances)
            .filter(function(loaddr) {
                return loaddr.balance > 0;
            })
            .each(function(loaddr) {
               loaddr.checked = req.query.loaddr == loaddr._id;
            })
            .then(function(loaddrs) {
                res.render('withdraw', {loaddrs: loaddrs, user: req.user});
            });
    });

    app.post('/withdraw', isLoggedIn, function(req, res, next) {
        var ids = req.body.loaddrs;
        if (!ids) {
            return next(new Error('Please select at least one loader to withdraw from.'));
        }
        console.log('address:' + req.body.address);
        try {
            bitcore.Address.fromString(req.body.address);
        } catch(e) {
            return next(new Error('Invalid bitcoin address.'));
        }
        db.model('Loaddr')
            .findAsync({_creator: req.user._id, _id: { "$in" : ids}})
            .then(wallet.loadBalances)
            .then(function(loaddrs) {
                return wallet.withdraw(loaddrs, req.body.address);
            })
            .then(function() {
               return res.render('withdraw', {message: 'Withdraw successful', user: req.user});
            });
    });
};
