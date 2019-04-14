'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const weekSchema = new mongoose.Schema({
    num: { type: Number, index: {unique: true}},
    enddate: {type: Date, required: true}
});

weekSchema.methods.serialize = function() {
  return {
        id: this._id,
        num: this.num,
        enddate: this.enddate
    };
};

const WeekJoiSchema = Joi.object().keys({
    num: Joi.number().required(),
    enddate: Joi.date().required(),
});

const Week = mongoose.model('Week', weekSchema);

module.exports = {Week, WeekJoiSchema};