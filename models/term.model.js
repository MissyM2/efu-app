'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const termSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, ref: "user"
    },
    termDesc: { 
        type: String, 
        required: true
    }
});

termSchema.pre('find', function(next) {
    this.populate('user');
    next();
});

termSchema.pre('findOne', function(next) {
    this.populate('user');
    next();
});

termSchema.virtual('studentFullName').get(function(){
    return `${this.user.firstName} ${this.user.lastName}`.trim();
})

termSchema.methods.serialize = function() {
  return {
        id: this._id,
        studentFullName: this.studentFullName,
        studentUserName: this.user.username,
        termDesc: this.termDesc
    };
};

const TermJoiSchema = Joi.object().keys({
    termDesc: Joi.string().required()
});

const Term = mongoose.model('term', termSchema);

module.exports = {Term, TermJoiSchema};