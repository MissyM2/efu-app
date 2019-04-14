'use strict';

const bcrypt = require('bcryptjs'); 
const mongoose = require('mongoose'); 

const studentSchema = new mongoose.Schema({
    firstname: { 
        type: String, 
        default: '' 
    },
    lastname: { 
        type: String, 
        default: ''
    },
    studentname: { 
        type: String, 
        required: true, 
        unique: true },
    password: {
        type: String,
        required: true
    }
});

studentSchema.methods.serialize = function() {
    return {
        id: this.id,
        firstname: this.firstname || '',
        lastname: this.lastname || '',
        studentname: this.studentname || ''
    };
};

studentSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

studentSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

const Student = mongoose.model('student', studentSchema);
console.log('before student module export')
module.exports = {Student};