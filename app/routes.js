
module.exports = function(app, passport) {
    app.get('/', require('./controllers/index'));

    app.get('/login', function(req, res) {
        res.render('login', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));

    app.get('/signup', function(req, res) {
        res.render('signup', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user : req.user
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/create-loaddr', isLoggedIn, function(req, res) {
        //todo: see query string for loaddr type
        res.render('new-bank-loaddr');
    });

    app.post('/create-loaddr', isLoggedIn, function(req, res, next) {
        var mongoose = require('mongoose');
        var Loaddr = mongoose.model('Loaddr');
        var loaddr = new Loaddr({
            address: '1wxaASdfereqweasdfADDRESS',
            isBank: true
        });
        loaddr.save(function(err, newLoaddr) {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });

    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}