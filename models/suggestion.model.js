'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');


const suggestionSchema = new mongoose.Schema({
    category: { type: String, required: true },
    desc: { type: String, required: true },
    credit: { type: String }
});

suggestionSchema.methods.serialize = function() {
    return {
        id: this._id,
        category: this.category,
        desc: this.desc,
        credit: this.credit
    };
};

const SuggestionJoiSchema = Joi.object().keys({
    category: Joi.string().required(),
    desc: Joi.string().required(),
    credit: Joi.string().optional()
});

const Suggestion = mongoose.model('suggestion', suggestionSchema);

module.exports = {Suggestion, SuggestionJoiSchema};