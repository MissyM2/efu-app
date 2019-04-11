'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const weekSchema = new mongoose.Schema({
    week_num: { type: Number },
    week_enddate: {type: Date, required: true}
});

weekSchema.methods.serialize = function() {
  return {
        id: this._id,
        week_num: this.week_num,
        week_enddate: this.week_enddate
    };
};

const WeekJoiSchema = Joi.object().keys({
    week_num: Joi.number().required(),
    week_enddate: Joi.date().required(),
});

const Week = mongoose.model('Week', weekSchema);

module.exports = {Week, WeekJoiSchema};