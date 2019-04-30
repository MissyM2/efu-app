'user strict'

const mongoose = require('mongoose');

const weekSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, ref: "user"
    },
    term: {
        type: mongoose.Schema.Types.ObjectId, ref: "term"
    },
    weekNum: { 
        type: Number, 
        required: true
    },
    likedLeast: {
        type: String
    },
    likedMost: {
        type: String
    },
    mostDifficult: {
        type: String
    },
    leastDifficult: {
        type: String
    }
});

weekSchema.pre('find', function(next) {
    this.populate('user');
    this.populate('term');
    next();
});

weekSchema.pre('findOne', function(next) {
    this.populate('user');
    this.populate('term');
    next();
});

weekSchema.virtual('studentFullName').get(function(){
    return `${this.user.firstName} ${this.user.lastName}`.trim();
})

weekSchema.methods.serialize = function() {
  return {
        id: this._id,
        studentFullName: this.studentFullName,
        studentUserName: this.user.username,
        termDesc: this.term.termDesc,
        weekNum: this.weekNum,
        likedLeast: this.likedLeast,
        likedMost: this.likedMost,
        mostDifficult: this.mostDifficult,
        leastDifficult: this.leastDifficult
    };
};

const Week = mongoose.model('week', weekSchema);

module.exports = {Week};