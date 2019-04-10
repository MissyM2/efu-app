'user strict'

const mongoose = require('mongoose');

const deliverableSchema = new mongoose.Schema({
    deliverable_pressure: { type: String, required: true },
    deliverable_name: { type: String, required: true },
    deliverable_desc: {type:String},
    deliverable_prephrs: {type: Number, required: true},
});

deliverableSchema.methods.serialize = function() {
    return {
        id: this._id,
        deliverable_pressure: this.deliverable_pressure,
        deliverable_name: this.deliverable_name,
        deliverable_desc: this.deliverable_desc,
        deliverable_prephrs: this.deliverable_prephrs,
    };
};

const Deliverable = mongoose.model('deliverable', deliverableSchema);

module.exports = {Deliverable};