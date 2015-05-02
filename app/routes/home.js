var db = require('../db').db;

function renderApp(req, res, next) {
    db.model('Loaddr').find({_creator: req.user._id}, function (err, loaddrs) {
        if (err) return next(err);
        //los loaddrs del usuario
        return res.render('app', {
            loaddrs: loaddrs
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
