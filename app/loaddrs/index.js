exports.getPrototype = function getPrototype(type) {
    var loaddr;
    if (!type || type === '' || type === 'index') {
        throw 'Invalid type: "' + type + '"';
    }
    try {
        loaddr = require('./' + type);
    } catch (e) {
        throw 'Loaddr "' + type + '" not defined in /app/loaddrs';
    }
    return loaddr;
};

