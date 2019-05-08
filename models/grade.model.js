'user strict'

const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    term: { type: mongoose.Schema.Types.ObjectId, ref: 'term'},
    week: { type: mongoose.Schema.Types.ObjectId, ref: 'week'},
    course:{ type: mongoose.Schema.Types.ObjectId, ref: 'course'},
    gradeNum: {type: Number, required: true}
});

gradeSchema.pre('find', function(next) {
    this.populate('user');
    this.populate('term');
    this.populate('week');
    this.populate('course');
    next();
});

gradeSchema.pre('findOne', function(next) {
    this.populate('user');
    this.populate('term');
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
        user: this.studentFullName,
        term: this.term.termDesc,
        week: this.week.weekNum,
        course: this.course.courseName,
        gradeNum: this.gradeNum
    };
};


const Grade = mongoose.model('grade', gradeSchema);

module.exports = {Grade};