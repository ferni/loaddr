var CoinBag = function(amount, loaddr) {
    var satoshis = amount;
    return {
        remaining: function() {
            return satoshis;
        },
        loaddr: function() {
            return loaddr;
        },
        /**
         * Substracts coins from the bag. Returns available coins
         * after substraction.
         * @param amount
         * @returns {*}
         */
        slice: function(amount) {
            if (amount > satoshis) {
                throw 'Cannot take ' + amount + ' from bag. Not enough coins. (' + satoshis + ')';
            }
            satoshis -= amount;
            return new CoinBag(amount, loaddr);
        }
    };
};

module.exports = CoinBag;