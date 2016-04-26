var express = require('express');
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var mongoURL = process.env.MONGOLAB_URI ||
				process.env.MONGOHQ_URL ||
				"mongodb://localhost:27017/electricOrNot";
var db;
var allPhotos;
MongoClient.connect(mongoURL, function(error, database){
	database.collection("cars").find().toArray(function(error, result){
		allPhotos = result;
		db = database;
		console.log(allPhotos);
	})
});

/* GET home page. */
router.get('/', function(req, res, next) {
  
  // 1. get all pics form MongoClient
  // 2. Get the current user from mongo
  var currIP = req.ip;
  console.log("The current user's IP address is: " + currIP);
  // 3 find out what pictures the current user has not voted on 
  db.collection("users").find({ip:currIP}).toArray(function(error, userResult){
  	//If user result returns nothing then user hasnt voted on anything.
  	if(userResult.length === 0){
  		photosToShow = allPhotos;
  	}
  	else{
  		//only load pics users havent voted on
  		// res.send("You voted!");
  		photosToShow = allPhotos;
  	}
  	// 5 pick a random one
  	var randomNum = Math.floor(Math.random() * photosToShow.length);
  	// 6 send the ramdom one to the view index.ejs
  	res.render('index', { carImage: allPhotos[randomNum].imageSrc });
  });
  // 4 Loadd all those into an array
  
  
  // 6b If the user has votred on every image in the databse, tell them so.
  
});

router.get('/electric', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/electric", function(req, res, next){
	// 1. We know they voted electric or they wouldnt be here
	// 2. We know what they voted on, becuase we passed it in the req.body var
	// 3. We know who they are becuase we know the ip
	// 4. Update user collection to include current ip and phote they voted on
	// 5 Update the images/cars collection by 1
	// 6. send them back to main page

	db.collection("users").insertOne({
		ip: req.ip,
		vote: "electric",
		image: req.body.photo
	});

	db.collection("cars").find({imageSrc:req.body.photo}).toArray(function(error, result){
		db.collection("cars").updateOne(
			{imageSrc: req.body.photo},
			{
				$inc: {"totalVotes": 1}
			}, function(error, results){
			}
		);
	});

	res.redirect("/");
	
});

router.post("/nonelectric", function(req, res, next){
	db.collection("cars").updateOne(
		{imageSrc: req.body.photo},
		{
			$inc: {"totalVotes": -1}
		}, function(error, results){
			// console.log(results);
		}
	);
	res.redirect("/");
	// 1. We know they voted electric or they wouldnt be here
	// 2. We know what they voted on, becuase we passed it in the req.body var
	// 3. We know who they are becuase we know the ip
	// 4. Update user collection to include current ip and phote they voted on
	// 5 Update the images/cars collection by -1
	// 6 send them back to main page so they can vote again.
});

module.exports = router;
