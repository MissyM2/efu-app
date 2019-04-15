'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const deliverableSchema = new mongoose.Schema({
    course:{ type: mongoose.Schema.Types.ObjectId, ref: 'course'},
    deliverableName: { type: String, required: true },
    //pressure: { type: String, required: true },
    //desc: {type:String},
    //prephrs: {type: Number, required: true}
});

deliverableSchema.pre('find', function(next) {
    this.populate('course');
    next();
});

deliverableSchema.pre('findOne', function(next) {
    this.populate('course');
    next();
});

deliverableSchema.methods.serialize = function() {
    return {
        id: this._id,
        course: this.course.courseName,
        deliverableName: this.deliverableName
        //pressure: this.pressure,
        //desc: this.desc,
        //prephrs: this.prephrs
    };
};

//deliverableSchema.methods.serialize = function(user) {
 //   return {
  //      id: this._id,
 //       user: user.serialize(),
  //      pressure: this.pressure,
 //       name: this.name,
  //      desc: this.desc,
  //      prephrs: this.prephrs,
   // };
//};


const DeliverableJoiSchema = Joi.object().keys({
    //user: Joi.string().optional(),
    course: Joi.string().required(),
    deliverableName: Joi.string().required()
    //pressure: Joi.string().required(),
    
    //desc: Joi.string().optional(),
    //prephrs: Joi.number().required()

});

const Deliverable = mongoose.model('deliverable', deliverableSchema);

module.exports = {Deliverable, DeliverableJoiSchema};