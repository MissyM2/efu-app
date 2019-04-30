'user strict'

const mongoose = require('mongoose');

const termSchema = new mongoose.Schema({
    termDesc: { 
        type: String, 
        required: true
    }
});

termSchema.methods.serialize = function() {
    return {
          termDesc: this.termDesc
      };
  };

const Term = mongoose.model('term', termSchema);

module.exports = {Term};