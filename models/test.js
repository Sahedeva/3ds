var mongoose = require('mongoose');

var testSchema = new mongoose.Schema({
  one: Number,
  created_at: Date,
  updated_at: Date
});

var Test = mongoose.model('Test', testSchema);

// Make this available to our other files
module.exports = Test;
