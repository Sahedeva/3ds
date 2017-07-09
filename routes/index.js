var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Test = require('../models/test');
var request = require("request");
var csv = require("csv");
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '3DS' });
});

router.get('/login', function(req,res,next){
  res.render('login', {title: 'Login Page'});
});

router.get('/addproduct', function(req,res,next){
  res.render('addproduct');
});



router.get('/xcode', function(req, res, next){
  res.render('xcode', {title: 'Xcode Page'});
});

router.post('/login', function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var favorite = req.body.favorite;

    var newUser = User({
        name: name,
        email: email,
        favorite: favorite,
    });

    // Save the user
    newUser.save(function(err) {
        if (err) console.log(err);

        res.send('User created!');
    });
});

router.get('/products', function(req,res,next){
  res.render('products', {title:'CSV picker'});
});

router.get('/emailtest', function(req, res, next){
  console.log('got here');
  var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'feedingexpress9@gmail.com', // Your email id
            pass: 'Test1234!' // Your password
        }
    });
    var mailOptions = {
    from: 'noreplay@gmail.com', // sender address
    to: 'robertgweilbaecher@gmail.com', // list of receivers
    subject: 'Email Example', // Subject line
    html: '<h1>Oh yeah!</h1><br><b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };
    transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.json({yo: 'error'});
    }else{
        console.log('Message sent: ' + info.response);
        res.json({yo: info.response});
    };
    });
});

router.post('/products', function(req,res,next){
  // the name under "files" must correspond to the name of the
  // file input field in the submitted form (here: "csvdata")
  csv().from.path(req.files.csvdata.path, {
      delimiter: ",",
      escape: '"'
  })
  // when a record is found in the CSV file (a row)
  .on("record", function(row, index) {
      var firstName, lastName;

      // skip the header row
      if (index === 0) {
          return;
      }

      // read in the data from the row
      firstName = row[0].trim();
      lastName = row[1].trim();

      // perform some operation with the data
      // ...
  })
  // when the end of the CSV document is reached
  .on("end", function() {
      // redirect back to the root
      res.redirect("/");
  })
  // if any errors occur
  .on("error", function(error) {
      console.log(error.message);
  });
});

var productList = [
{"Product Description":"Watermelon","Packaging":"bin","Cost per lb":"$0.06","Estimated Load Cost":"$2,520","Location":"valley-area","Truckloads Offered":"1/day","Vendor Name":"Bagley","Estimated Shelf Life":"6-9 days","Comments":"NEEDS TO MOVE TODAY","Combo?":"valley"},
{"Product Description":"Watermelon","Packaging":"bin","Cost per lb":"$0.08","Estimated Load Cost":"$3,360","Location":"valley-area","Truckloads Offered":"1/day","Vendor Name":"Crescent Fruit","Estimated Shelf Life":"7-10days","Comments":"Seeded or Seedless","Combo?":"valley"},
{"Product Description":"Watermelon","Packaging":"bin","Cost per lb":"$0.09","Estimated Load Cost":"$3,780","Location":"valley-area","Truckloads Offered":"2","Vendor Name":"Majestic","Estimated Shelf Life":"7-10days","Comments":"","Combo?":"valley"},
{"Product Description":"Onions","Packaging":"bag","Cost per lb":"$0.10","Estimated Load Cost":"$4,000","Location":"valley-area","Truckloads Offered":"1/day","Vendor Name":"Tex Mex","Estimated Shelf Life":"7-10days","Comments":"assorted","Combo?":"valley"},
{"Product Description":"Green Cabbage","Packaging":"sack","Cost per lb":"$0.07","Estimated Load Cost":"$2,940","Location":"valley-area","Truckloads Offered":"5","Vendor Name":"Morgan and Sons","Estimated Shelf Life":"7-10days","Comments":"","Combo?":"valley"},
{"Product Description":"Zucchini","Packaging":"bin","Cost per lb":"$0.05","Estimated Load Cost":"$1,500","Location":"Hempstead","Truckloads Offered":"1","Vendor Name":"Dilorio Farms","Estimated Shelf Life":"7-10 Days","Comments":"NEEDS TO MOVE TODAY","Combo?":""},
{"Product Description":"Limes","Packaging":"box","Cost per lb":"$0.10","Estimated Load Cost":"$4,000","Location":"valley-area","Truckloads Offered":"1","Vendor Name":"Mestizo","Estimated Shelf Life":"5-7 days","Comments":"","Combo?":"valley"},
{"Product Description":"Honeydews","Packaging":"bin","Cost per lb":"$0.90","Estimated Load Cost":"$3,780","Location":"valley-area","Truckloads Offered":"1/day","Vendor Name":"J&D Produce","Estimated Shelf Life":"7-10 Days","Comments":"pics Available","Combo?":"valley"},
{"Product Description":"Onions","Packaging":"sack","Cost per lb":"$0.10","Estimated Load Cost":"$4,200","Location":"valley-area","Truckloads Offered":"1/day","Vendor Name":"Plantation","Estimated Shelf Life":"7-14days","Comments":"","Combo?":"valley"},
{"Product Description":"Limes","Packaging":"box","Cost per lb":"$0.10","Estimated Load Cost":"$1,000","Location":"valley-area","Truckloads Offered":"5 Pallets","Vendor Name":"First Value","Estimated Shelf Life":"5-7 days","Comments":"","Combo?":"valley"},
{"Product Description":"Tomatoes","Packaging":"box","Cost per lb":"$0.10","Estimated Load Cost":"$200","Location":"valley-area","Truckloads Offered":"1 Pallet","Vendor Name":"First Value","Estimated Shelf Life":"5-7 days","Comments":"","Combo?":"valley"},
{"Product Description":"Bell Pepper","Packaging":"box","Cost per lb":"$0.10","Estimated Load Cost":"$1,000","Location":"valley-area","Truckloads Offered":"5 Pallet","Vendor Name":"First Value","Estimated Shelf Life":"5-7 days","Comments":"","Combo?":"valley"},
{"Product Description":"Mango","Packaging":"box","Cost per lb":"$0.10","Estimated Load Cost":"$1,000","Location":"valley-area","Truckloads Offered":"5 Pallet","Vendor Name":"First Value","Estimated Shelf Life":"5-7 days","Comments":"","Combo?":"valley"},
{"Product Description":"Carrots","Packaging":"box","Cost per lb":"$0.10","Estimated Load Cost":"$600","Location":"valley-area","Truckloads Offered":"3 Pallet","Vendor Name":"First Value","Estimated Shelf Life":"5-7 days","Comments":"","Combo?":"valley"},
{"Product Description":"Lettuce and Mix","Packaging":"box","Cost per lb":"$0.10","Estimated Load Cost":"$400","Location":"valley-area","Truckloads Offered":"2 Pallet","Vendor Name":"First Value","Estimated Shelf Life":"5-7 days","Comments":"","Combo?":"valley"},
{"Product Description":"Limes","Packaging":"box","Cost per lb":"$0.10","Estimated Load Cost":"$1,200","Location":"valley-area","Truckloads Offered":"6 Pallets","Vendor Name":"Sunny Produce","Estimated Shelf Life":"5-7 days","Comments":"","Combo?":"valley"},
{"Product Description":"Cabbage","Packaging":"sack","Cost per lb":"$0.10","Estimated Load Cost":"$4,200","Location":"Uvalde","Truckloads Offered":"2","Vendor Name":"Cargil","Estimated Shelf Life":"7-14 days","Comments":"pack to order","Combo?":""},
{"Product Description":"Carrots","Packaging":"sack","Cost per lb":"$0.04","Estimated Load Cost":"$960","Location":"valley-area","Truckloads Offered":"12 Pallets","Vendor Name":"State St","Estimated Shelf Life":"7-14 days","Comments":"","Combo?":"valley"},
{"Product Description":"Russet Potatoes","Packaging":"depends","Cost per lb":"depends","Estimated Load Cost":"depends","Location":"Muleshoe","Truckloads Offered":"1","Vendor Name":"Richard Barrett","Estimated Shelf Life":"7-14 days","Comments":"0.08/lb for sacks; 10/lb for 5/10, ass .20/lb for transportation","Combo?":""},
{"Product Description":"Watermelon","Packaging":"bin","Cost per lb":"0.07","Estimated Load Cost":"$2,940","Location":"valley-area","Truckloads Offered":"1","Vendor Name":"A&W Produce","Estimated Shelf Life":"7-10 days","Comments":"","Combo?":"valley"},
{"Product Description":"Onions","Packaging":"bag","Cost per lb":"$0.09","Estimated Load Cost":"$3,780","Location":"valley-area","Truckloads Offered":"1","Vendor Name":"A&W Produce","Estimated Shelf Life":"7-10 Days","Comments":"","Combo?":"valley"},
{"Product Description":"Beets","Packaging":"bag","Cost per lb":"$0.09","Estimated Load Cost":"$720","Location":"valley-area","Truckloads Offered":"4 pallets","Vendor Name":"A&W Produce","Estimated Shelf Life":"7-10 Days","Comments":"","Combo?":"valley"},
{"Product Description":"Carrots","Packaging":"sack","Cost per lb":"$0.09","Estimated Load Cost":"$3,780","Location":"valley-area","Truckloads Offered":"1","Vendor Name":"a&W Produce","Estimated Shelf Life":"7-10 Days","Comments":"","Combo?":"valley"},
{"Product Description":"Russet Potatoes","Packaging":"5/10#","Cost per lb":"$0.08","Estimated Load Cost":"$3,360","Location":"Dalhart","Truckloads Offered":"1/day","Vendor Name":"Rocky Mountain","Estimated Shelf Life":"7-14 days","Comments":"#2 quality or non-A's","Combo?":""}
];

router.post('/productMock', function(req,res,next){

})

router.post('/xcode', function(req, res, next){
  // var one = req.body.one;
  var bod = req.body;
  console.log('bod: ', bod);
  // console.log('One: ',one);
  var newTest = Test({
    bod: bod
  });

  newTest.save(function(err){
    if (err) console.log(err);

    res.json({"Product Description":"Watermelon","Packaging":"bin","Cost per lb":"$0.06","Estimated Load Cost":"$2,520","Location":"valley-area","Truckloads Offered":"1/day","Vendor Name":"Bagley","Estimated Shelf Life":"6-9 days","Comments":"NEEDS TO MOVE TODAY","Combo?":"valley"});
  })

});

module.exports = router;
