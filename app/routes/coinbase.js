/**
 * Created by Fer on 13/05/2015.
 */
var request = require('request');

/*

 {
 "access_token": "...",
 "refresh_token": "...",
 "token_type": "bearer",
 "expire_in": 7200,
 "scope": "universal"
 }

 */
module.exports = function(app) {
    app.get('/coinbase/:user', function(req, res, next) {
        var code = req.query.code;
        console.log('Posting to coinbase');
        request.post('https://www.coinbase.com/oauth/token', {
            form: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'https://loaddr.herokuapp.com/coinbase',
                client_id: process.env.COINBASE_CLIENT_ID,
                client_secret: process.env.COINBASE_CLIENT_SECRET
            }
        }, function(err,httpResponse,body){
            console.log('Gotten response from Coinbase: ' + JSON.stringify(body));
        });
    });
};