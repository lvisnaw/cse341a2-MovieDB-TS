const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: function() { return !this.googleId; } // Only required if NOT a Google user
  }, 
  googleId: { type: String, unique: true, sparse: true },
  accountType: { 
    type: String, 
    enum: ['read', 'read-write', 'admin'], 
    default: 'read' 
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
