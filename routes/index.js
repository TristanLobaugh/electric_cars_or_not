var express = require('express');
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var mongoURL = process.env.MONGODB_URI ||
				process.env.MONGOHQ_URL ||
				"mongodb://localhost:27017/electricOrNot";
var db;
MongoClient.connect(mongoURL, function(error, database){
		db = database;
});


router.get('/', function(req, res, next) {
  var currIP = req.ip;
  db.collection("users").find({ip:currIP}).toArray(function(error, userResult){
  	var photosVoted = [];
	  	for(var i = 0; i < userResult.length; i++){
	  			// console.log(userResult[i]);
	  			console.log(userResult[i].image);
	  			photosVoted.push(userResult[i].image);
	  		}
  	db.collection("cars").find({imageSrc: {$nin: photosVoted}}).toArray(function(error, photosToShow){
  		if(photosToShow.length === 0){
  			res.redirect("/standings");
  		}else{
	  		var randomNum = Math.floor(Math.random() * photosToShow.length);
	  		res.render('index', { carImage: photosToShow[randomNum].imageSrc });
  		}
  	});
  });  
});

router.get('/electric', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/standings", function(req, res, next){
	db.collection("cars").find().toArray(function(error, result){
		standingsArray = []
		for(var i = 0; i < result.length; i++){
			standingsArray.push(result[i]);
		}
		standingsArray.sort(function(a, b){
			return (b.totalVotes - a.totalVotes);
		});
		res.render("standings", {theStandings: standingsArray});
	});
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
	db.collection("users").insertOne({
		ip: req.ip,
		vote: "nonelectric",
		image: req.body.photo
	});

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

router.get("/reset", function(req, res, next){
	db.collection("cars").updateMany(
			{},
			{
				$set: { "totalVotes": 0}
			},
			{}
		);

	res.redirect("/");
});

router.get("/resetUser", function(req, res, next){
	db.collection("users").find().toArray(function(error, result){
		for(var i = 0; i < result.length; i++){
			db.collection("users").deleteOne(
				{"ip": "::1"},
				function(err, results) {

	      		}	
			);
		}
	});

	res.redirect("/");
});
	// db.collection("cars").find().toArray(function(error, result){
	// 	console.log(result);
	// 		for(var i = 0; i < result.length; i++){
	// 			console.log("working "+i);
	// 	 		db.collection("cars").updateOne(
	// 				{
	// 					$set: {"totalVotes": 0}
	// 				}
	// 			);
	//  		}
	// });

module.exports = router;
