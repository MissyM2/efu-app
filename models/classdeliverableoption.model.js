'user strict'

const mongoose = require('mongoose');

const deliverabletypeSchema = new mongoose.Schema({
    deliverabletype_pressure: { type: String, required: true },
    deliverabletype_def: {type: String, required: true}
});

deliverabletypeSchema.methods.serialize = function() {
    return {
        id: this._id,
        deliverabletype_pressure: this.deliverabletype_pressure,
        deliverabletype_def: this.deliverabletype_def
    };
};

const classdeliverableoptionSchema = new mongoose.Schema({
    classdeliverableoption_type: [deliverabletypeSchema],
    classdeliverableoption_name: { type: String, required: true },
    classdeliverableoption_desc: {type:String},
    classdeliverableoption_prephrs: {type: Number, required: true},
});

classdeliverableoptionSchema.methods.serialize = function() {
    return {
        id: this._id,
        classdeliverableoption_type: this.classdeliverableoption_type,
        classdeliverableoption_name: this.classdeliverableoption_name,
        classdeliverableoption_desc: this.classdeliverableoption_desc,
        classdeliverableoption_prephrs: this.classdeliverableoption_prephrs
    };
};

const Deliverabletype = mongoose.model('Deliverabletype', deliverabletypeSchema);
const Classdeliverableoption = mongoose.model('Classdeliverableoption', classdeliverableoptionSchema);

module.exports = {Deliverabletype, Classdeliverableoption};