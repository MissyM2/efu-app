'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');


const suggestionSchema = new mongoose.Schema({
    suggestion_type: { type: String, required: true },
    suggestion_desc: { type: String, required: true },
    suggestion_credit: { type: String }
});

suggestionSchema.methods.serialize = function() {
    return {
        id: this._id,
        suggestion_type: this.suggestion_type,
        suggestion_desc: this.suggestion_desc,
        suggestion_credit: this.suggestion_credit
    };
};

const SuggestionJoiSchema = Joi.object().keys({
    suggestion_type: Joi.string().required(),
    suggestion_desc: Joi.string().required(),
    suggestion_credit: Joi.string().optional()
});

const Suggestion = mongoose.model('suggestion', suggestionSchema);

module.exports = {Suggestion, SuggestionJoiSchema};