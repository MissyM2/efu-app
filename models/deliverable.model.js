'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const deliverableSchema = new mongoose.Schema({
    //user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    course:{ type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
    deliverable_name: { type: String, required: true },
    //pressure: { type: String, required: true },
    //desc: {type:String},
    //prephrs: {type: Number, required: true}
});



//deliverableSchema.virtual('username').get(function() {
//    return `${this.user.firstname} ${this.user.lastname}`.trim();
//});

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
/*
// for all endpoints other than create
deliverableSchema.methods.serialize = function() {
    return {
        id: this._id,
        course_name: this.course_name,
        deliverable_name: this.name
        //pressure: this.pressure,
        //desc: this.desc,
        //prephrs: this.prephrs
    };
};

const DeliverableJoiSchema = Joi.object().keys({
    //user: Joi.string().optional(),
    course_name: Joi.string().required(),
    deliverable_name: Joi.string().required()
    //pressure: Joi.string().required(),
    
    //desc: Joi.string().optional(),
    //prephrs: Joi.number().required()

});
*/
const Deliverable = mongoose.model('deliverable', deliverableSchema);

module.exports = {Deliverable};