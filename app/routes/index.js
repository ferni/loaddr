var isLoggedIn = require('./is-logged-in');

module.exports = function(app, passport) {
    require('./home')(app);
    require('./create-loaddr')(app);
    require('./withdraw')(app);

    app.get('/login', function(req, res) {
        res.render('login', { message: req.flash('loginMessage'), title: 'Login' });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash : true
    }));

    app.get('/signup', function(req, res) {
        res.render('signup', { message: req.flash('signupMessage'), title: 'Sign up'});
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
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
};
