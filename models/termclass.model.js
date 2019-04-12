'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const termclassSchema = new mongoose.Schema({
    name: { type: String, required: true },
    num: { type: String, required: true },
    desc: { type:String }
    //user:
});

termclassSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        num: this.num,
        desc: this.desc,
    };
};

const TermclassJoiSchema = Joi.object().keys({
        name: Joi.string().required(),
        num: Joi.string().required(),
        desc: Joi.string()
});

const Termclass = mongoose.model('Termclass', termclassSchema);

module.exports = {Termclass, TermclassJoiSchema};