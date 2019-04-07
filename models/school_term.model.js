'user strict'

const mongoose = require('mongoose');

const school_termSchema = new mongoose.Schema({
    school_term_institution: { type: String, required: true },
    school_term_level: { type: String, required: true },
    school_term_desc: { type:String },
    school_term_updateDate: { type: Date, default: Date.now }
});

school_termSchema.methods.serialize = function() {
    let term;
       if (typeof this.term.serialize === 'function') {
        term = this.term.serialize();
    } else {
        term = this.term;
    }

    return {
        id: this._id,
        school_term_institution: this.term_institution,
        school_term_level: this.term_level,
        school_term_desc: this.term_desc,
        school_term_updateDate: this.updateDate
    };
};

const Schoolterm = mongoose.model('Schoolterm', school_termSchema);

module.exports = {Schoolterm};