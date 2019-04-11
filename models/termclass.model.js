'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const termclassSchema = new mongoose.Schema({
    termclass_name: { type: String, required: true },
    termclass_num: { type: String, required: true },
    termclass_desc: { type:String }
    //user:
});

termclassSchema.methods.serialize = function() {
    return {
        id: this._id,
        termclass_name: this.termclass_name,
        termclass_num: this.termclass_num,
        termclass_desc: this.termclass_desc,
    };
};

const TermclassJoiSchema = Joi.object().keys({
        termclass_name: Joi.string().required(),
        termclass_num: Joi.string().required(),
        termclass_desc: Joi.string()
});

const Termclass = mongoose.model('Termclass', termclassSchema);

module.exports = {Termclass, TermclassJoiSchema};