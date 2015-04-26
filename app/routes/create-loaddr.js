var isLoggedIn = require('./is-logged-in');
var wallet = require('../wallet');

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
        var Loaddr = mongoose.model('Loaddr');
        var loaddr = new Loaddr({
            _creator: req.user._id,
            address: wallet.getNewAddress(),
            type: loaddrType,
            settings: settings
        });
        loaddr.save(function(err, newLoaddr) {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    });
};

