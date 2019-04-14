'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const courseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Student"},
    course_name: { 
        type: String, 
        required: true ,
        unique: true
    },
    //deliverables: [{ type: mongoose.Schema.Types.ObjectId, ref: "Deliverables"}]
});

//courseSchema.methods.serialize = function(user) {
 //   return {
 //       id: this._id,
 //       //user: user.serialize(),
 //       course_name: this.course_name
  //  };
//};
/*
courseSchema.methods.serialize = function() {
    return {
        //user: this.user,
        id: this._id,
        deliverable_name: this.name,
        pressure: this.pressure,
        desc: this.desc,
        prephrs: this.prephrs,
        course_name: this.course_name
    };
};

const CourseJoiSchema = Joi.object().keys({
        //user: Joi.string().optional(),
        course_name: Joi.string().required()
});
*/
const Course = mongoose.model('course', courseSchema);

module.exports = {Course};