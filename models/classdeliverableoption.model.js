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

const class_deliverable_optionSchema = new mongoose.Schema({
    class_deliverable_option_type: [deliverable_typeSchema],
    class_deliverable_option_name: { type: String, required: true },
    class_deliverable_option_desc: {type:String},
    class_deliverable_option_prephrs: {type: Number, required: true},
});

class_deliverable_optionSchema.methods.serialize = function() {
    return {
        id: this._id,
        class_deliverable_option_type: this.class_deliverable_option_type,
        class_deliverable_option_name: this.class_deliverable_option_name,
        class_deliverable_option_desc: this.class_deliverable_option_desc,
        class_deliverable_option_prephrs: this.class_deliverable_option_prephrs
    };
};

const Deliverabletype = mongoose.model('Deliverabletype', deliverable_typeSchema);
const Classdeliverableoption = mongoose.model('Classdeliverableoption', class_deliverable_optionSchema);

module.exports = {Deliverabletype, Classdeliverableoption};