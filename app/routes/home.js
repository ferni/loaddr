var db = require('../db').db,
    _ = require('lodash'),
    wallet = require('../wallet');

function renderApp(req, res, next) {
    db.model('Loaddr').find({_creator: req.user._id}, function (err, loaddrs) {

        setInterval(function() {
            require('../socket').sendTo(req.user._id, 'change', req.user.local.email);
        }, 1500);

        if (err) return next(err);
        if (loaddrs.length === 0) {
            return res.render('app', {
                loaddrs: loaddrs,
                user: req.user,
                connectionID: req.session.connectionID
            });
        }
        _.invoke(loaddrs, 'loadPrototype');
        wallet.loadBalances(loaddrs).then(function() {
            return res.render('app', {
                loaddrs: loaddrs,
                user: req.user,
                connectionID: req.session.connectionID
            });
        }).catch(function(e) {
            next(e);
        });
    });
}

module.exports = function(app) {
    app.get('/', function(req, res, next) {
        if (req.isAuthenticated()) {
            return renderApp(req, res, next);
        }

        res.render('index');
    });
};
