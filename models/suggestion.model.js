'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');


const suggestionSchema = new mongoose.Schema({
    type: { type: String, required: true },
    desc: { type: String, required: true },
    credit: { type: String }
});

suggestionSchema.methods.serialize = function() {
    return {
        id: this._id,
        type: this.type,
        desc: this.desc,
        credit: this.credit
    };
};

const SuggestionJoiSchema = Joi.object().keys({
    type: Joi.string().required(),
    desc: Joi.string().required(),
    credit: Joi.string().optional()
});

const Suggestion = mongoose.model('suggestion', suggestionSchema);

module.exports = {Suggestion, SuggestionJoiSchema};