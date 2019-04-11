'use strict';

const mongoose = require('mongoose'); 
const Joi = require('joi');
const bcrypt = require('bcryptjs');  

const userSchema = new mongoose.Schema({
    user_fname: { type: String, required: true },
    user_lname: { type: String, required: true },
    user_loginidemail: { type: String, required: true, unique: true },
    user_password: {type: String,required: true}
});

//userSchema.virtual('userName').get(function(){
//    return `${this.user.user_fname} ${this.user.user_lname}`.trim();
//})

userSchema.methods.serialize = function() {
    return {
        id: this._id,
        user_fname: this.user_fname,
        user_lname: this.user_lname,
        user_loginidemail: this.user_loginidemail
    };
};

const UserJoiSchema = Joi.object().keys({
    user_fname: Joi.string().required(),
    user_lname: Joi.string().required(),
    user_loginidemail: Joi.string().email().required(),
    //user_password: Joi.string().min(5).max(15).alphanum().required()
    user_password: Joi.string()
})

userSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = {User, UserJoiSchema};