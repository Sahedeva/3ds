var mongoose = require('mongoose');

var orderlogSchema = new mongoose.Schema({
  dateordered: String,
  load: Object,
  deliverydate: Date,
  created_at: Date,
  updated_at: Date
});

var Orderlog = mongoose.model('Orderlog', orderlogSchema);

// Make this available to our other files
module.exports = Orderlog;
