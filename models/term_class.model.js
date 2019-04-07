'user strict'

const mongoose = require('mongoose');

const term_classSchema = new mongoose.Schema({
    term_class_name: { type: String, required: true },
    term__class_num: { type: String, required: true },
    term_class_desc: { type:String },
    term_class_updateDate: { type: Date, default: Date.now }
});

term_classSchema.methods.serialize = function() {
    let termclass;
       if (typeof this.termclass.serialize === 'function') {
        termclass = this.termclass.serialize();
    } else {
        termclass = this.termclass;
    }

    return {
        id: this._id,
        term_class_name: this.term_class_name,
        term_class_num: this.term_class_num,
        term_class_desc: this.term_class_desc,
        term_class_updateDate: this.term_class_updateDate
    };
};

const Termclass = mongoose.model('termclass', term_classSchema);

module.exports = {Termclass};