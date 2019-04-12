'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const deliverableSchema = new mongoose.Schema({
    pressure: { type: String, required: true },
    name: { type: String, required: true },
    desc: {type:String},
    prephrs: {type: Number, required: true},
});

deliverableSchema.methods.serialize = function() {
    return {
        id: this._id,
        pressure: this.pressure,
        name: this.name,
        desc: this.desc,
        prephrs: this.prephrs,
    };
};

const DeliverableJoiSchema = Joi.object().keys({
    pressure: Joi.string().required(),
    name: Joi.string().required(),
    desc: Joi.string().optional(),
    prephrs: Joi.number().required()

});

const Deliverable = mongoose.model('deliverable', deliverableSchema);

module.exports = {Deliverable, DeliverableJoiSchema};