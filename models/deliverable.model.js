'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const deliverableSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    pressure: { type: String, required: true },
    name: { type: String, required: true },
    desc: {type:String},
    prephrs: {type: Number, required: true},
});



//deliverableSchema.virtual('username').get(function() {
//    return `${this.user.firstname} ${this.user.lastname}`.trim();
//});

deliverableSchema.methods.serialize = function(user) {
    return {
        id: this._id,
        user: user.serialize(),
        pressure: this.pressure,
        name: this.name,
        desc: this.desc,
        prephrs: this.prephrs,
    };
};

// for all endpoints other than create
//deliverableSchema.methods.serialize = function() {
 //   return {
 //       id: this._id,
 //       user: this.user,
 //       pressure: this.pressure,
  //      name: this.name,
  //      desc: this.desc,
   //     prephrs: this.prephrs,
  //  };
//};

const DeliverableJoiSchema = Joi.object().keys({
    user: Joi.string().optional(),
    pressure: Joi.string().required(),
    name: Joi.string().required(),
    desc: Joi.string().optional(),
    prephrs: Joi.number().required()

});

const Deliverable = mongoose.model('deliverable', deliverableSchema);

module.exports = {Deliverable, DeliverableJoiSchema};