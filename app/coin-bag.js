var CoinBag = function(amount, loaddr) {
    var coins = amount;
    return {
        remaining: function() {
            return coins;
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
            if (amount > coins) {
                throw 'Cannot take ' + amount + ' from bag. Not enough coins.';
            }
            coins -= amount;
            return new CoinBag(amount, loaddr);
        }
    };
};

module.exports = CoinBag;