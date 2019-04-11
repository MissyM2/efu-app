'use strict';

const bcrypt = require('bcryptjs'); 
const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    user_fname: { 
        type: String, 
        default: '' 
    },
    user_lname: { 
        type: String, 
        default: ''
    },
    user_loginidemail: { 
        type: String, 
        required: true, 
        unique: true },
    user_password: {
        type: String,
        required: true
    }
});

userSchema.methods.serialize = function() {
    return {
        user_fname: this.user_fname || '',
        user_lname: this.user_lname || '',
        user_loginidemail: this.user_loginidemail || ''
    };
};

userSchema.methods.validatePassword = function(user_password) {
    return bcrypt.compare(user_password, this.user_password);
};

userSchema.statics.hashPassword = function(user_password) {
    return bcrypt.hash(user_password, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = {User};