'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const schooltermSchema = new mongoose.Schema({
    schoolterm_institution: { type: String, required: true },
    schoolterm_level: { type: String, required: true },
    schoolterm_desc: { type:String }
});

schooltermSchema.methods.serialize = function() {
    return {
        id: this._id,
        schoolterm_institution: this.term_institution,
        schoolterm_level: this.term_level,
        schoolterm_desc: this.term_desc,
    };
};

const SchooltermJoiSchema = Joi.object().keys({
    schoolterm_institution: Joi.string().required(),
    schoolterm_level: Joi.string().required(),
    schoolterm_desc: Joi.string().required(),

})

const Schoolterm = mongoose.model('Schoolterm', schooltermSchema);

module.exports = {Schoolterm, SchooltermJoiSchema};