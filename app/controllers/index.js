var request = require('request'),
    mongoose = require('mongoose');

function handleCoinbase(code) {
    console.log('Posting to coinbase')
    request.post('https://www.coinbase.com/oauth/token', {
        form: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'https://loaddr.herokuapp.com',
            client_id: process.env.COINBASE_CLIENT_ID,
            client_secret: process.env.COINBASE_CLIENT_SECRET
        }
    }, function(err,httpResponse,body){
        console.log('Gotten response from Coinbase: ' + JSON.stringify(body));
    });
}

function renderApp(req, res, next) {
    mongoose.model('Loaddr').find(function (err, loaddrs) {
        if (err) return next(err);
        //los loaddrs del usuario
        return res.render('app', {
            loaddrs: loaddrs
        });
    });
}

module.exports = function(req, res, next) {
    if (req.isAuthenticated()) {
        return renderApp(req, res, next);
    }
    //render home
    /*console.log('req.query.code: ' + req.query.code);
    if (req.query.code) {
        balance = handleCoinbase(req.query.code);
    }*/
    res.render('index');
};
