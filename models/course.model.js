'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const courseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    courseName: { 
        type: String, 
        required: true,
        unique: true
    }
});

courseSchema.pre('find', function(next) {
    this.populate('user');
    next();
});

courseSchema.pre('findOne', function(next) {
    this.populate('user');
    next();
});

courseSchema.virtual('studentName').get(function(){
    return `${this.user.firstname} ${this.user.lastname}`.trim();
})

courseSchema.methods.serialize = function() {
    return {
        id: this._id,
        //user: User.serialize(),
        //user: this.studentName,
        //user: this.user.username,
        //user: this.user.firstname,
        //user: `${user.firstname} ${user.lastname}`,
        courseName: this.courseName
    };
};
/*
courseSchema.methods.serialize = function() {
    return {
        user: this.user,
        id: this._id,
        deliverable_name: this.name,
        pressure: this.pressure,
        desc: this.desc,
        prephrs: this.prephrs,
        courseName: this.courseName
    };
};
*/
const CourseJoiSchema = Joi.object().keys({
        courseName: Joi.string().required()
});

const Course = mongoose.model('course', courseSchema);

module.exports = {Course, CourseJoiSchema};