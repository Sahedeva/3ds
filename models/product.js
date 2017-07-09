var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  description: String,
  vegPallet: String,
  costperlb: String,
  loadcost: String,
  container: String,
  location: String,
  truckloadsoffered: Number,
  vendorname: String,
  shelflife: String,
  combo: String,
  comments: String,
  created_at: Date,
  updated_at: Date
});

var Product = mongoose.model('Product', productSchema);

// Make this available to our other files
module.exports = Product;
