'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const weekSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, ref: "user"
    },
    term: {
        type: mongoose.Schema.Types.ObjectId, ref: "term"
    },
    weekNum: { 
        type: Number, 
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date, 
        required: true
    },
    likedLeast: {
        type: String
    },
    likedMost: {
        type: String
    },
    mostDifficult: {
        type: String
    },
    leastDifficult: {
        type: String
    }
});

weekSchema.pre('find', function(next) {
    this.populate('user');
    this.populate('term');
    next();
});

weekSchema.pre('findOne', function(next) {
    this.populate('user');
    this.populate('term');
    next();
});

weekSchema.virtual('studentFullName').get(function(){
    return `${this.user.firstName} ${this.user.lastName}`.trim();
})

weekSchema.methods.serialize = function() {
  return {
        id: this._id,
        studentFullName: this.studentFullName,
        studentUserName: this.user.username,
        termDesc: this.term.termDesc,
        weekNum: this.weekNum,
        startDate: this.startDate,
        endDate: this.endDate,
        likedLeast: this.likedLeast,
        likedMost: this.likedMost,
        mostDifficult: this.mostDifficult,
        leastDifficult: this.leastDifficult
    };
};

const WeekJoiSchema = Joi.object().keys({
    termDesc: Joi.string().required(),
    weekNum: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    likedLeast: Joi.string(),
    likedMost: Joi.string(),
    mostDifficult: Joi.string(),
    leastDifficult: Joi.string()
});

const Week = mongoose.model('Week', weekSchema);

module.exports = {Week, WeekJoiSchema};