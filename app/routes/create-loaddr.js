var isLoggedIn = require('./is-logged-in');
var wallet = require('../wallet');
var db = require('../db').db;

function getLoaddrFunctions(type) {
    var loaddr;
    try {
        loaddr = require('../loaddrs/' + type);
    } catch (e) {
        throw 'Loaddr "' + type + '" not defined in /app/loaddrs';
    }
    return loaddr;
}

module.exports = function(app) {
    app.get('/create-loaddr', isLoggedIn, function(req, res) {
        //todo: see query string for loaddr type
        var loaddrType = 'redirect';
        var loaddrFunctions = getLoaddrFunctions(loaddrType);
        res.render('create-loaddr', {
            form: loaddrFunctions.createForm()
        });
    });

    app.post('/create-loaddr', isLoggedIn, function(req, res, next) {
        var loaddrType = 'redirect';
        var settings = req.body;
        console.log('settings:' + JSON.stringify(settings));
        var loaddrFunctions = getLoaddrFunctions(loaddrType);
        if (!loaddrFunctions.validateSettings(settings)) {
            next(new Error('Invalid settings'));
        }
        var mongoose = require('mongoose');
        var Loaddr = db.model('Loaddr');
        var loaddr = new Loaddr({
            _creator: req.user._id,
            type: loaddrType,
            settings: settings
        });
        loaddr.save(function(err, newLoaddr) {
            if (err) {
                return next(err);
            }
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
        });
    });
};

