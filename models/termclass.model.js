'user strict'

const mongoose = require('mongoose');

const termclassSchema = new mongoose.Schema({
    termclass_name: { type: String, required: true },
    termclass_num: { type: String, required: true },
    termclass_desc: { type:String }
});

termclassSchema.methods.serialize = function() {
    return {
        id: this._id,
        termclass_name: this.termclass_name,
        termclass_num: this.termclass_num,
        termclass_desc: this.termclass_desc,
    };
};

const Termclass = mongoose.model('Termclass', termclassSchema);

module.exports = {Termclass};