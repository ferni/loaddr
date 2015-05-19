var db = require('../db').db,
    _ = require('lodash'),
    wallet = require('../wallet');

function renderApp(req, res, next) {
    db.model('Loaddr').find({_creator: req.user._id}, function (err, loaddrs) {
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
                connectionID: req.session.connectionID,
                title: 'Loaddr - Smart Addresses in your Wallet'
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
        res.render('index', {title: 'Loaddr - Smart Addresses in your Wallet'});
    });
};
