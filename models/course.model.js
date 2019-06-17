'user strict'

const mongoose = require('mongoose');

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
    },
    courseDesc: {
        type: String
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
        termDesc: this.term.termDesc,
        courseName: this.courseName,
        courseDesc: this.courseDesc
    };
};

const Course = mongoose.model('course', courseSchema);

module.exports = {Course};