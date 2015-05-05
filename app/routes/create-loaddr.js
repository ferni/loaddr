var isLoggedIn = require('./is-logged-in');
var wallet = require('../wallet');
var db = require('../db').db;
var loaddrs = require('../loaddrs');

module.exports = function(app) {
    app.get('/create-loaddr', isLoggedIn, function(req, res, next) {
        var loaddrType = req.query.type;
        try {
            var loaddrPrototype = loaddrs.getPrototype(loaddrType);
        } catch(e) {
            return next(new Error(e));
        }
        res.render('create-loaddr', {
            form: loaddrPrototype.createForm()
        });
    });

    app.post('/create-loaddr', isLoggedIn, function(req, res, next) {
        var loaddrType = 'redirect';
        var settings = req.body;
        console.log('settings:' + JSON.stringify(settings));
        var proto = loaddrs.getPrototype(loaddrType);
        if (!proto.validateSettings(settings)) {
            next(new Error('Invalid settings'));
        }
        var Loaddr = db.model('Loaddr');
        var loaddr = new Loaddr({
            _creator: req.user._id,
            type: loaddrType,
            settings: settings
        });
        loaddr.saveAsync().spread(function(newLoaddr) {
            wallet.getAddress(newLoaddr._id).then(function(address) {
                newLoaddr.address = address;
                newLoaddr.save(function(err) {
                    if(err) return next(err);
                    res.redirect('/');
                })
            }).catch(function(e) {
                newLoaddr.remove().exec();
                next(e);
            });
        }).catch(function(e) {
            next(e);
        });
    });
};

