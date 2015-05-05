var db = require('../db').db,
    _ = require('lodash'),
    wallet = require('../wallet');

function renderApp(req, res, next) {
    db.model('Loaddr').find({_creator: req.user._id}, function (err, loaddrs) {
        if (err) return next(err);
        _.invoke(loaddrs, 'loadPrototype');
        loaddrs = _.invoke(loaddrs, 'toObject');
        wallet.loadBalances(loaddrs).then(function() {
            return res.render('app', {
                loaddrs: loaddrs
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
