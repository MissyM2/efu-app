'user strict'

const mongoose = require('mongoose');

const deliverableSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    term: { type: mongoose.Schema.Types.ObjectId, ref: 'term'},
    course:{ type: mongoose.Schema.Types.ObjectId, ref: 'course'},
    dueDate: { type: Date, required: true},
    deliverableName: { type: String, required: true },
    impact: { type: String, required: true },
    desc: {type:String},
    prephrs: {type: Number, required: true}
});

// the user and course can be prepopulated because it is referred to in the schema
deliverableSchema.pre('find', function(next) {
    this.populate('user');
    this.populate('term');
    this.populate('course');
    next();
});

deliverableSchema.pre('findOne', function(next) {
    this.populate('user');
    this.populate('term'),
    this.populate('course');
    next();
});


deliverableSchema.virtual('studentFullName').get(function(){
    return `${this.user.firstName} ${this.user.lastName}`.trim();
});

deliverableSchema.virtual('dueDateFormatted').get(function() {
        let newDueDate = new Date(this.dueDate);
        let newDay = newDueDate.getUTCDate();
        let newMonth = newDueDate.getUTCMonth() + 1;
        let newYear = newDueDate.getUTCFullYear();
        let formattedDueDate =`${newYear} - ${newMonth<10?`0${newMonth}`:`${newMonth}`} - ${newDay}`;
        return formattedDueDate;
});



//below, I can use this.course to get the WHOLE object or just one of the
// keys, this.course.courseName..  same with user
deliverableSchema.methods.serialize = function() {
    return {
        id: this._id,
        user: this.studentFullName,
        termDesc: this.term.termDesc,
        courseName: this.course.courseName,
        dueDateFormatted: this.dueDateFormatted,
        dueDate: this.dueDate,
        deliverableName: this.deliverableName,
        impact: this.impact,
        desc: this.desc,
        prephrs: this.prephrs
    };
};


const Deliverable = mongoose.model('deliverable', deliverableSchema);

module.exports = {Deliverable};