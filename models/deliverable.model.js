'user strict'

const mongoose = require('mongoose');
const moment = require('moment');

const deliverableSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    term: { type: mongoose.Schema.Types.ObjectId, ref: 'term'},
    week: { type: mongoose.Schema.Types.ObjectId, ref: 'week'},
    course:{ type: mongoose.Schema.Types.ObjectId, ref: 'course'},
    dueDate: { type: Date, required: true},
    deliverableName: { type: String, required: true },
    pressure: { type: String, required: true },
    desc: {type:String},
    prephrs: {type: Number, required: true}
});

// the user and course can be prepopulated because it is referred to in the schema
deliverableSchema.pre('find', function(next) {
    this.populate('user');
    this.populate('term');
    this.populate('week');
    this.populate('course');
    next();
});

deliverableSchema.pre('findOne', function(next) {
    this.populate('user');
    this.populate('term'),
    this.populate('week');
    this.populate('course');
    next();
});


deliverableSchema.virtual('studentFullName').get(function(){
    return `${this.user.firstName} ${this.user.lastName}`.trim();
});

deliverableSchema.virtual('dueDateFormatted').get(function() {
    return moment(this.dueDate).format('MMM. d, YYYY');
})

//below, I can use this.course to get the WHOLE object or just one of the
// keys, this.course.courseName..  same with user
deliverableSchema.methods.serialize = function() {
    return {
        id: this._id,
        user: this.studentFullName,
        termDesc: this.term.termDesc,
        weekNum: this.week.weekNum,
        courseName: this.course.courseName,
        dueDate: this.dueDateFormatted,
        deliverableName: this.deliverableName,
        pressure: this.pressure,
        desc: this.desc,
        prephrs: this.prephrs
    };
};


const Deliverable = mongoose.model('deliverable', deliverableSchema);

module.exports = {Deliverable};