var mongoose = require('mongoose');

var foodbankSchema = new mongoose.Schema({
  load: Object,
  loadcost: String,
  foodbankname: String,
  foodbankaddress: String,
  foodbankphone: String,
  accountingEmail: String,
  accountingPhone: String,
  accountingMobile: String,
  accountingFirstName: String,
  accountingLastName: String,
  accountingPosition: String,
  receivingEmail: String,
  receivingPhone: String,
  receivingMobile: String,
  receivingFirstName: String,
  receivingLastName: String,
  receivingPosition: String,
  sourcingEmail: String,
  sourcingPhone: String,
  sourcingMobile: String,
  sourcingFirstName: String,
  sourcingLastName: String,
  sourcingPosition: String,
  tier: String,
  created_at: Date,
  updated_at: Date
});

var Foodbank = mongoose.model('Foodbank', foodbankSchema);

// Make this available to our other files
module.exports = Foodbank;
