/**
 * Created by Fer on 05/05/2015.
 */
var Promise = require('bluebird');
var request = require("request");
Promise.promisifyAll(request);


var auth = {
    user: process.env.BITREFILL_KEY_ID,
    pass: process.env.BITREFILL_KEY_SECRET
};

function makeRequest(method, path, body) {
    var r = {
        auth: auth,
        uri: 'https://api.bitrefill.com/v1/' + path
    };
    if(body != null) {
        r['json'] = body;
    }
    switch(method) {
        case 'GET':
        case 'get': return request.getAsync(r);
        case 'post':
        case 'POST': return request.postAsync(r);
    }
    throw 'Unrecognized method: ' + method;
}

exports.lookupNumber = function(number) {
    return makeRequest('GET', 'lookup_number?number=' + number, null);
};

