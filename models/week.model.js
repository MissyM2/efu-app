'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const weekSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, ref: "user"
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
    }
});

weekSchema.pre('find', function(next) {
    this.populate('user');
    next();
});

weekSchema.pre('findOne', function(next) {
    this.populate('user');
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
        weekNum: this.weekNum,
        startDate: this.startDate,
        endDate: this.endDate
    };
};

const WeekJoiSchema = Joi.object().keys({
    weekNum: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
});

const Week = mongoose.model('Week', weekSchema);

module.exports = {Week, WeekJoiSchema};