var isLoggedIn = require('./is-logged-in');
var wallet = require('../wallet');
var db = require('../db').db;
var loaddrs = require('../loaddrs');
var _ = require('lodash');
module.exports = function(app) {
    app.get('/create-loaddr/:type', isLoggedIn, function(req, res, next) {
        var loaddrType = req.params.type,
            loaddrPrototype,
            form,
            renderObject = {
                title: loaddrType + ' loader',
                type: loaddrType
            };
        console.log('User ' + req.user.local.email + ' is creating a ' + loaddrType + ' loaddr.');
        try {
            loaddrPrototype = loaddrs.getPrototype(loaddrType);
        } catch(e) {
            return next(new Error(e));
        }
        form = loaddrPrototype.createForm(req.user);
        if (form == '{external}') {
            renderObject.externalCreateForm = true;
            renderObject[loaddrType] = true;
        } else {
            renderObject.form = form;
        }
        renderObject.user = req.user;
        renderObject.createError = req.flash('createError');
        res.render('create-loaddr', renderObject)
    });

    app.post('/create-loaddr/:type', isLoggedIn, function(req, res, next) {
        var loaddrType = req.params.type;
        var settings = req.body;
        console.log('Settings submitted:' + JSON.stringify(settings));
        var proto = loaddrs.getPrototype(loaddrType);
        var Loaddr = db.model('Loaddr');
        var loaddr = new Loaddr({
            _creator: req.user._id,
            type: loaddrType,
            settings: settings
        });
        proto.validateSettings(settings, req.user).then(function(result) {
            if (result.errors) {
                throw result.errors.toString();
            }
        }).then(function() {
            return loaddr.saveAsync();
        }).spread(function(newLoaddr) {
            wallet.getAddress(newLoaddr._id).then(function(address) {
                newLoaddr.address = address;
                newLoaddr.save(function(err) {
                    if(err) return next(err);
                    res.redirect('/');
                })
            }).catch(function(e) {
                newLoaddr.remove();
                throw e;
            });
        }).catch(function(e) {
            console.log('Create error: ' + _.isObject(e) ? JSON.stringify(e) : e);
            req.flash('createError', _.isObject(e) ? JSON.stringify(e) : e);
            res.redirect('/create-loaddr/' + loaddrType);
        });
    });
};

