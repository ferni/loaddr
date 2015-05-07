var fs = require('fs');
var _ = require('lodash');
var types = fs.readdirSync('./app/loaddrs');
types = _.map(types, function(l) {
    return l.split('.')[0];
});
_.remove(types, function(l) {
    return l === 'index';
});
console.log('Loaddr types: ' + types.toString());

exports.getPrototype = function getPrototype(type) {
    if (!_.includes(types, type)) {
        throw 'Invalid loaddr type: "' + type + '"';
    }
    return require('./' + type);
};

