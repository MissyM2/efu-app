'use strict';

const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs');  

const userSchema = new mongoose.Schema({
    user_fname: { type: String, required: true },
    user_lname: { type: String, required: true },
    user_loginid_email: { type: String, required: true, unique: true },
    user_password: {type: String,required: true}
});

userSchema.virtual('userName').get(function(){
    return `${this.user.user_fname} ${this.user.user_lname}`.trim();
})

userSchema.methods.serialize = function() {
    return {
        id: this._id,
        user_name: this.user_fname + this.user_lname,
        user_loginid_email: this.user_loginid_email
    };
};

userSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(user_password, 10);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = {User};