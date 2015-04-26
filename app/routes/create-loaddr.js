var isLoggedIn = require('./is-logged-in');
var wallet = require('../wallet');

module.exports = function(app) {
    app.get('/create-loaddr', isLoggedIn, function(req, res) {
        //todo: see query string for loaddr type
        res.render('new-bank-loaddr');
    });

    app.post('/create-loaddr', isLoggedIn, function(req, res, next) {
        var mongoose = require('mongoose');
        var Loaddr = mongoose.model('Loaddr');
        var loaddr = new Loaddr({
            _creator: req.user._id,
            address: wallet.getNewAddress()
        });
        loaddr.save(function(err, newLoaddr) {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    });
};

