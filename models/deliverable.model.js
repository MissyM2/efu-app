'user strict'

const mongoose = require('mongoose');
const Joi = require('joi');

const deliverableSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
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
    this.populate('course');
    next();
});

deliverableSchema.pre('findOne', function(next) {
    this.populate('user');
    this.populate('course');
    next();
});


deliverableSchema.virtual('studentFullName').get(function(){
    return `${this.user.firstName} ${this.user.lastName}`.trim();
});

//below, I can use this.course to get the WHOLE object or just one of the
// keys, this.course.courseName..  same with user
deliverableSchema.methods.serialize = function() {
    return {
        id: this._id,
        user: this.user,
        course: this.course,
        dueDate: this.dueDate,
        deliverableName: this.deliverableName,
        pressure: this.pressure,
        desc: this.desc,
        prephrs: this.prephrs
    };
};

const DeliverableJoiSchema = Joi.object().keys({
    dueDate: Joi.date().required(),
    deliverableName: Joi.string().required(),
    pressure: Joi.string().required(),
    desc: Joi.string().optional(),
    prephrs: Joi.number().required()

});

const Deliverable = mongoose.model('deliverable', deliverableSchema);

module.exports = {Deliverable, DeliverableJoiSchema};