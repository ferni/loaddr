var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String
    },
    coinbase: {
        access_token: String,
        refresh_token: String
    },
    loaddrs: Array
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.hasConnectedCoinbase = function() {
    return this.coinbase.access_token;
};

module.exports = mongoose.model('User', userSchema);