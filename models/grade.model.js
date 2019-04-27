'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const gradeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    week: { type: mongoose.Schema.Types.ObjectId, ref: 'week'},
    course:{ type: mongoose.Schema.Types.ObjectId, ref: 'course'},
    gradeNum: {type: Number, required: true}
});

// the user and course can be prepopulated because it is referred to in the schema
gradeSchema.pre('find', function(next) {
    this.populate('user');
    this.populate('week');
    this.populate('course');
    next();
});

gradeSchema.pre('findOne', function(next) {
    this.populate('user');
    this.populate('week'),
    this.populate('course');
    next();
});


gradeSchema.virtual('studentFullName').get(function(){
    return `${this.user.firstName} ${this.user.lastName}`.trim();
});

//below, I can use this.course to get the WHOLE object or just one of the
// keys, this.course.courseName..  same with user
gradeSchema.methods.serialize = function() {
    return {
        id: this._id,
        user: this.user,
        week: this.week,
        course: this.course,
        gradeNum: this.gradeNum
    };
};

const GradeJoiSchema = Joi.object().keys({
    prephrs: Joi.number().required()

});

const Grade = mongoose.model('grade', gradeSchema);

module.exports = {Grade, GradeJoiSchema};