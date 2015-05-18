/**
 * Created by Fer on 18/05/2015.
 */
var request = require('request');
exports.coins = {
    "BLK": {
        "name": "Blackcoin",
        "symbol": "BLK",
        "image": "https://shapeshift.io/images/coins/blackcoin.png",
        "status": "available"
    },
    "BITUSD": {
        "name": "BitUSD",
        "symbol": "BITUSD",
        "image": "https://shapeshift.io/images/coins/bitusd.png",
        "status": "available"
    },
    "BTS": {
        "name": "Bitshares",
        "symbol": "BTS",
        "image": "https://shapeshift.io/images/coins/bitshares.png",
        "status": "available"
    },
    "BTCD": {
        "name": "BitcoinDark",
        "symbol": "BTCD",
        "image": "https://shapeshift.io/images/coins/bitcoindark.png",
        "status": "available"
    },
    "CLAM": {
        "name": "Clams",
        "symbol": "CLAM",
        "image": "https://shapeshift.io/images/coins/clams.png",
        "status": "available"
    },
    "XCP": {
        "name": "Counterparty",
        "symbol": "XCP",
        "image": "https://shapeshift.io/images/coins/counterparty.png",
        "status": "available"
    },
    "DASH": {
        "name": "Dash",
        "symbol": "DASH",
        "image": "https://shapeshift.io/images/coins/dash.png",
        "status": "available"
    },
    "DGB": {
        "name": "Digibyte",
        "symbol": "DGB",
        "image": "https://shapeshift.io/images/coins/digibyte.png",
        "status": "available"
    },
    "DOGE": {
        "name": "Dogecoin",
        "symbol": "DOGE",
        "image": "https://shapeshift.io/images/coins/dogecoin.png",
        "status": "available"
    },
    "FTC": {
        "name": "Feathercoin",
        "symbol": "FTC",
        "image": "https://shapeshift.io/images/coins/feathercoin.png",
        "status": "available"
    },
    "GEMZ": {
        "name": "GEMZ",
        "symbol": "GEMZ",
        "image": "https://shapeshift.io/images/coins/gemz.png",
        "status": "available"
    },
    "LTC": {
        "name": "Litecoin",
        "symbol": "LTC",
        "image": "https://shapeshift.io/images/coins/litecoin.png",
        "status": "available"
    },
    "MSC": {
        "name": "Mastercoin",
        "symbol": "MSC",
        "image": "https://shapeshift.io/images/coins/mastercoin.png",
        "status": "available"
    },
    "MINT": {
        "name": "Mintcoin",
        "symbol": "MINT",
        "image": "https://shapeshift.io/images/coins/mintcoin.png",
        "status": "available"
    },
    "XMR": {
        "name": "Monero",
        "symbol": "XMR",
        "image": "https://shapeshift.io/images/coins/monero.png",
        "status": "available"
    },
    "NBT": {
        "name": "Nubits",
        "symbol": "NBT",
        "image": "https://shapeshift.io/images/coins/nubits.png",
        "status": "available"
    },
    "NXT": {
        "name": "Nxt",
        "symbol": "NXT",
        "image": "https://shapeshift.io/images/coins/nxt.png",
        "status": "available"
    },
    "NVC": {
        "name": "Novacoin",
        "symbol": "NVC",
        "image": "https://shapeshift.io/images/coins/novacoin.png",
        "status": "available"
    },
    "POT": {
        "name": "Potcoin",
        "symbol": "POT",
        "image": "https://shapeshift.io/images/coins/potcoin.png",
        "status": "available"
    },
    "PPC": {
        "name": "Peercoin",
        "symbol": "PPC",
        "image": "https://shapeshift.io/images/coins/peercoin.png",
        "status": "available"
    },
    "QRK": {
        "name": "Quark",
        "symbol": "QRK",
        "image": "https://shapeshift.io/images/coins/quark.png",
        "status": "available"
    },
    "RDD": {
        "name": "Reddcoin",
        "symbol": "RDD",
        "image": "https://shapeshift.io/images/coins/reddcoin.png",
        "status": "available"
    },
    "SDC": {
        "name": "Shadowcash",
        "symbol": "SDC",
        "image": "https://shapeshift.io/images/coins/shadowcash.png",
        "status": "available"
    },
    "START": {
        "name": "Startcoin",
        "symbol": "START",
        "image": "https://shapeshift.io/images/coins/startcoin.png",
        "status": "available"
    },
    "SJCX": {
        "name": "StorjX",
        "symbol": "SJCX",
        "image": "https://shapeshift.io/images/coins/storjcoinx.png",
        "status": "available"
    },
    "SWARM": {
        "name": "Swarm",
        "symbol": "SWARM",
        "image": "https://shapeshift.io/images/coins/swarm.png",
        "status": "available"
    },
    "USDT": {
        "name": "Tether",
        "symbol": "USDT",
        "image": "https://shapeshift.io/images/coins/tether.png",
        "status": "available"
    },
    "UNO": {
        "name": "Unobtanium",
        "symbol": "UNO",
        "image": "https://shapeshift.io/images/coins/unobtanium.png",
        "status": "available"
    },
    "VRC": {
        "name": "Vericoin",
        "symbol": "VRC",
        "image": "https://shapeshift.io/images/coins/vericoin.png",
        "status": "available"
    }
};

exports.getDepositAddress = function(coin, address) {
    return request.postAsync({
        uri: 'https://shapeshift.io/shift',
        json: {"withdrawal":address, "pair":"btc_" + coin.toLowerCase()}
    }).spread(function(response, body) {
        console.log('Shapeshift response: ' + JSON.stringify(body));
        if (body.error) {
            throw new Error(body.error);
        }
        return body.deposit;
    })
};