var request = require('request');

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

module.exports = function(req, res) {

    var balance;
    console.log('req.query.code: ' + req.query.code);
    if (req.query.code) {
        balance = handleCoinbase(req.query.code);
    }
    res.render('index', {balance: balance});
};
