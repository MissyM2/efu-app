'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const schooltermSchema = new mongoose.Schema({
    institution: { type: String, required: true },
    level: { type: String, required: true },
    desc: { type:String }
});

schooltermSchema.methods.serialize = function() {
    return {
        id: this._id,
        institution: this.institution,
        level: this.level,
        desc: this.desc,
    };
};

const SchooltermJoiSchema = Joi.object().keys({
    institution: Joi.string().required(),
    level: Joi.string().required(),
    desc: Joi.string().required(),

})

const Schoolterm = mongoose.model('Schoolterm', schooltermSchema);

module.exports = {Schoolterm, SchooltermJoiSchema};