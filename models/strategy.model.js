'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const strategySchema = new mongoose.Schema({
    strategy_type: { type: String, required: true },
    strategy_desc: { type: String, required: true },
    strategy_credit: { type: String }
});

strategySchema.methods.serialize = function() {
    //let strategy;
    //if (typeof this.strategy.serialize === 'function') {
   //     strategy = this.strategy.serialize();
   // } else {
   //     strategy = this.strategy;
   // }

    return {
        id: this._id,
        strategy_type: this.strategy_type,
        strategy_desc: this.strategy_desc,
        strategy_credit: this.strategy_credit
    };
};

const StrategyJoiSchema = Joi.object().keys({
    strategy_type: Joi.string().required(),
    strategy_desc: Joi.string().required(),
    strategy_credit: Joi.string().optional()
});

const Strategy = mongoose.model('Strategy', strategySchema);

module.exports = {Strategy, StrategyJoiSchema};