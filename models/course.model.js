'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const courseSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, ref: "user"
    },
    term: {
        type: mongoose.Schema.Types.ObjectId, ref: "term"
    },
    courseName: { 
        type: String, 
        required: true,
        unique: true
    }
});

courseSchema.pre('find', function(next) {
    this.populate('user');
    this.populate('term');
    next();
});

courseSchema.pre('findOne', function(next) {
    this.populate('user');
    this.populate('term');
    next();
});

courseSchema.virtual('studentFullName').get(function(){
    return `${this.user.firstName} ${this.user.lastName}`.trim();
})

courseSchema.methods.serialize = function() {
    return {
        id: this._id,
        studentFullName: this.studentFullName,
        studentUserName:  this.user.username,
        term: this.term.termDesc,
        courseName: this.courseName
    };
};

const CourseJoiSchema = Joi.object().keys({
        courseName: Joi.string().required()
});

const Course = mongoose.model('course', courseSchema);

module.exports = {Course, CourseJoiSchema};