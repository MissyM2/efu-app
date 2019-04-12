'use strict';

const bcrypt = require('bcryptjs'); 
const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    firstname: { 
        type: String, 
        default: '' 
    },
    lastname: { 
        type: String, 
        default: ''
    },
    username: { 
        type: String, 
        required: true, 
        unique: true },
    password: {
        type: String,
        required: true
    }
});

userSchema.methods.serialize = function() {
    return {
        firstname: this.firstname || '',
        lastname: this.lastname || '',
        username: this.username || ''
    };
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = {User};