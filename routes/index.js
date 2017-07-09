var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Test = require('../models/test');
var Product = require('../models/product');
var Foodbank = require('../models/foodbank');
var request = require("request");
var csv = require("csv");
var Orderlog = require('../models/orderlog');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/addressfoodbankmembers', function(req,res,next){
  res.render('addressfoodbankmembers');
});

router.get('/orderconfirmationfood', function(req,res,next){
  var id = req.query.id;
  Product.findOne({_id:id}, function(err, product){
    Foodbank.findOne({_id:"596211f31acdec1fa88ee67f"}, function (err,foodbank){
      res.render('orderconfirmationfood', {product:product, foodbank:foodbank});
    });

  });
});

router.get('/orderlogs', function(req,res,next){
  Product.findOne({'_id': "596227e7bb8f4a209dd0f8dd"}, function(err, product){
      res.render('orderlogs', {product:product});
  });

});

router.get('/addressfood', function(req,res,next){
  res.render('addressfood');
});

router.get('/deliverydateandtime', function(req,res,next){
  res.render('deliverydateandtime');
});

router.post('/deliverydatefood', function(req,res,next){

  res.render('orderconfirmfood');
});

router.get('/login', function(req,res,next){
  res.render('login');
});

router.get('/register', function(req,res,next){
  res.render('register');
});

router.get('/foodbankregister', function(req,res,next){
  res.render('foodbankregister');
});

router.post('/foodbankregister', function(req,res,next){
  console.log(req.body);
  var loadcost = 0;
  var load = {};
  var newFoodbank = Foodbank({
      load: load,
      loadcost: loadcost,
      foodbankname: req.body.foodbankname,
      foodbankaddress: req.body.foodbankaddress,
      foodbankphone: req.body.foodbankphone,
      accountingPhone: req.body.accountingPhone,
      accountingMobile: req.body.accountingMobile,
      accountingEmail: req.body.accountingEmail,
      accountingPosition: req.body.accountingPosition,
      accountingFirstName: req.body.accountingFirstName,
      accountingLastName: req.body.accountingLastName,
      receivingPhone: req.body.receivingPhone,
      receivingMobile: req.body.receivingPhone,
      receivingEmail: req.body.receivingEmail,
      receivingPosition: req.body.receivingPosition,
      receivingLastName: req.body.receivingLastName,
      receivingFirstName: req.body.receivingFirstName,
      sourcingPhone: req.body.sourcingPhone,
      sourcingEmail: req.body.sourcingEmail,
      sourcingMobile: req.body.sourcingMobile,
      sourcingPosition: req.body.sourcingPosition,
      sourcingLastName: req.body.sourcingLastName,
      sourcingFirstName: req.body.sourcingFirstName,
      tier: req.body.tier
  });

  newFoodbank.save(function(err) {
      if (err) console.log(err);

      res.redirect('/');
  });
});

router.get('/addproduct', function(req,res,next){
  res.render('addproduct');
});

router.get('/foodorder',function(req,res,next){
  var id = req.query.id;
  Product.findOne({_id:id}, function(err, product){
    Foodbank.findOne({_id:"596211f31acdec1fa88ee67f"}, function (err,foodbank){
      res.render('foodorder', {product:product, foodbank:foodbank,palletnum:0});
    });

  });
});

router.post('/foodsave', function(req,res,next){
  var load = {};
  Foodbank.findOneAndUpdate({'_id': "596211f31acdec1fa88ee67f"}, {load: load}, {new: true}, function(err, venue) {
   res.json({
           success: true,
           message: 'Venue no longer reads as recently modified.'
           });
   if (err) {
     console.log('got an error');
   }
 });

});

router.post('/addproduct', function(req, res, next) {
    var costperlb = "$"+req.body.costperlb;
    var truckloadsoffered = req.body.truckloadsoffered
    var loadcost = "$"+req.body.costperlb*2000*truckloadsoffered*21
    var newProduct = Product({
        description: req.body.description,
        costperlb: costperlb,
        loadcost: loadcost,
        container: req.body.container,
        location: req.body.location,
        truckloadsoffered: truckloadsoffered,
        vendorname: req.body.vendorname,
        shelflife: req.body.shelflife,
        combo: req.body.combo,
        comments: req.body.comments,
        vegPallet: 0
    });

    // Save the user
    newProduct.save(function(err) {
        if (err) console.log(err);

        res.redirect('/productlist');
    });
});

router.get('/productlist', function(req,res,next){
  Product.find({}, function(err, products){
    console.log(products);
    var len = products.length
    res.render('productlist', {products:products, len:len});
  });
});

router.get('/xcode', function(req, res, next){
  res.render('xcode', {title: 'Xcode Page'});
});

router.post('/register', function(req, res, next) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;

    var newUser = User({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
    });

    // Save the user
    newUser.save(function(err) {
        if (err) console.log(err);

        res.redirect('/foodproductlist');
    });
});

router.get('/form',function(req,res,next){
  res.render('form');
});

router.get('/products', function(req,res,next){
  res.render('products', {title:'CSV picker'});
});

router.post('/plus_minus', function(req,res,next){
  var vegId = req.body.vegId;
  var totalPallet = req.body.totalPallet;
  var truckId = req.body.truckId;
  var vegPallet = req.body.vegPallet;
  Foodbank.findOneAndUpdate({_id:truckId},{totalPallet: totalPallet}, {new: true}, function(err, foodbank) {
    Product.findOneAndUpdate({_id:vegId},{vegPallet: vegPallet}, {new: true}, function(err, product) {
      res.send({
           success: true
           });
   if (err) {
     console.log('got an error');
   }

  });
});
});

router.post('/login', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({
    email: email
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    }
    else if (user) {

      bcrypt.compare(password, user.password, function(err, result) {
        if (!result) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        }
        else {

          res.redirect('/foodproductlist');
        }
      });

    }
  });

});

router.get('/foodproductlist',function(req,res,next){
  Product.find({}, function(err, products){
    console.log(products);
    var len = products.length
    res.render('foodproductlist', {products:products, len:len});
  });
});

router.get('/feednotification', function(req,res,next){
  Foodbank.find({},function(err, foodbanks){
    res.render('feednotification', {foodbanks:foodbanks});
  });
})

router.post('/emailnotification', function(req, res, next){
  console.log('got here');
  var subject = req.body.subject;
  var body = req.body.body;
  var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'feedingexpress9@gmail.com', // Your email id
            pass: 'Test1234!' // Your password
        }
    });

    var mailOptions = {
    from: 'noreplay@gmail.com', // sender address
    to: 'brendankellyatx@gmail.com', // list of receivers
    subject: subject, // Subject line
    body: body // You can choose to send an HTML body instead
    };
    transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);

    }
        console.log('Message sent: ' + info.response);
        res.render('emailconfirmation');
    });
});

router.get('/emailconfirmation', function(req,res,next){
  res.render('emailconfirmation');
});

router.get('/orderreceived', function(req,res,next){
  Foodbank.findOne({'_id': "596211f31acdec1fa88ee67f"}, function(err, foodbank){
    Product.findOne({'_id': "596227e7bb8f4a209dd0f8dd"}, function(err,product){
        res.render('orderreceived', {foodbank:foodbank,product:product});
    })
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
  Product.find({}, function(err, products){
    res.json({products:products});
  });
  // console.log('bod: ', bod);
  // // console.log('One: ',one);
  // var newTest = Test({
  //   bod: bod
  // });
  //
  // newTest.save(function(err){
  //   if (err) console.log(err);
  //
  //   res.json({products:[{"Product Description":"Watermelon","Packaging":"bin","Cost per lb":"$0.06","Estimated Load Cost":"$2,520","Location":"valley-area","Truckloads Offered":"1/day","Vendor Name":"Bagley","Estimated Shelf Life":"6-9 days","Comments":"NEEDS TO MOVE TODAY","Combo?":"valley"},
  //   {"Product Description":"Watermelon","Packaging":"bin","Cost per lb":"$0.08","Estimated Load Cost":"$3,360","Location":"valley-area","Truckloads Offered":"1/day","Vendor Name":"Crescent Fruit","Estimated Shelf Life":"7-10days","Comments":"Seeded or Seedless","Combo?":"valley"},
  //   {"Product Description":"Watermelon","Packaging":"bin","Cost per lb":"$0.09","Estimated Load Cost":"$3,780","Location":"valley-area","Truckloads Offered":"2","Vendor Name":"Majestic","Estimated Shelf Life":"7-10days","Comments":"","Combo?":"valley"},
  //   {"Product Description":"Onions","Packaging":"bag","Cost per lb":"$0.10","Estimated Load Cost":"$4,000","Location":"valley-area","Truckloads Offered":"1/day","Vendor Name":"Tex Mex","Estimated Shelf Life":"7-10days","Comments":"assorted","Combo?":"valley"}]});
  // })

});

module.exports = router;
