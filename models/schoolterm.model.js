'user strict'

const mongoose = require('mongoose');

const schooltermSchema = new mongoose.Schema({
    schoolterm_institution: { type: String, required: true },
    schoolterm_level: { type: String, required: true },
    schoolterm_desc: { type:String }
});

schooltermSchema.methods.serialize = function() {
    return {
        id: this._id,
        schoolterm_institution: this.term_institution,
        schoolterm_level: this.term_level,
        schoolterm_desc: this.term_desc,
    };
};

const Schoolterm = mongoose.model('Schoolterm', schooltermSchema);

module.exports = {Schoolterm};