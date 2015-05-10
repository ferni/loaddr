/**
 * Created by Fer on 10/05/2015.
 */
var isLoggedIn = require('./is-logged-in');
var wallet = require('../wallet');
var db = require('../db').db;

module.exports = function(app) {
    app.get('/withdraw', isLoggedIn, function(req, res, next) {
        db.model('Loaddr')
            .findAsync({_creator: req.user._id})
            .each(function(loaddr) {
               loaddr.checked = req.query.loaddr == loaddr._id;
            })
            .then(wallet.loadBalances)
            .then(function(loaddrs) {
                res.render('withdraw', {loaddrs: loaddrs});
            });
    });

    app.post('/withdraw', isLoggedIn, function(req, res, next) {

    });
};
