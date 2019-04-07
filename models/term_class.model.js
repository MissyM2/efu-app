'user strict'

const mongoose = require('mongoose');

const term_classSchema = new mongoose.Schema({
    term_class_name: { type: String, required: true },
    term__class_num: { type: String, required: true },
    term_class_desc: { type:String },
    term_class_updateDate: { type: Date, default: Date.now }
});

term_classSchema.methods.serialize = function() {
    let term_class;
       if (typeof this.term_class.serialize === 'function') {
        term_class = this.term_class.serialize();
    } else {
        term_class = this.term_class;
    }

    return {
        id: this._id,
        term_class_name: this.term_class_name,
        term_class_num: this.term_class_num,
        term_class_desc: this.term_class_desc,
    };
};

const Termclass = mongoose.model('Termclass', term_classSchema);

module.exports = {Termclass};