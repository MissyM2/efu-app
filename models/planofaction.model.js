'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const planofactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    week: { type: mongoose.Schema.Types.ObjectId, ref: 'week'},
    deliverable:{ type: mongoose.Schema.Types.ObjectId, ref: 'deliverable'},
    prepDate1: { type: Date},
    prepHrs1: { type: Number},
    prepDate2: { type: Date},
    prepHrs2: { type: Number},
    prepDate3: { type: Date},
    prepHrs3: { type: Number},
    prepDate4: { type: Date},
    prepHrs4: { type: Number}
});

// the user and course can be prepopulated because it is referred to in the schema
planofactiohnSchema.pre('find', function(next) {
    this.populate('user');
    this.populate('week');
    this.populate('deliverable');
    next();
});

planofactionSchema.pre('findOne', function(next) {
    this.populate('user');
    this.populate('week');
    this.populate('deliverable');
    next();
});


planofactionSchema.virtual('studentFullName').get(function(){
    return `${this.user.firstName} ${this.user.lastName}`.trim();
});

//below, I can use this.course to get the WHOLE object or just one of the
// keys, this.course.courseName..  same with user
planofactionSchema.methods.serialize = function() {
    return {
        id: this._id,
        user: this.user,
        course: this.course,
        deliverable:this.deliverable,
        prepDate1: this.prepDate1,
        prepHrs1: this.prephrs1,
        prepDate2: this.prepDate2,
        prepHrs2: this.prephrs2,
        prepDate3: this.prepDate3,
        prepHrs3: this.prephrs3,
        prepDate4: this.prepDate4,
        prepHrs4: this.prephrs4
    };
};

const planofactionJoiSchema = Joi.object().keys({
    prepDate1: Joi.date(),
    prepHrs1: Joi.number(),
    prepDate2: Joi.date(),
    prepHrs2: Joi.number(),
    prepDate3: Joi.date(),
    prepHrs3: Joi.number(),
    prepDate4: Joi.date(),
    prepHrs4: Joi.number(),

});

const Planofaction = mongoose.model('planofaction', planofactionSchema);

module.exports = {Planofaction, PlanofactionJoiSchema};