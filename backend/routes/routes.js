const express = require("express"); //import express
const router = express.Router(); //create a router object
const controller = require("../controllers/controllers"); //import the controller object
const { registerUser, loginUser } = require("../controllers/controllers"); //import the controller object

// router.get("/setup", controller.newList);

//talks router infromation
router.get("/talks", controller.listConf);
router.get('/talks/speaker/:term', controller.listOneSpeaker);
router.get('/talks/session/:term', controller.listSession);
router.get('/talks/time/:term', controller.listTime);
router.get('/talks/:speaker/rating', controller.listRatingsBySpeaker);
router.get('/talks/:id/ratingById', controller.listRatingsById);
router.get('/talks/rate/:id/:rating', controller.rateTalkById);


//talks router infromation 
router.post('/talks/rate/:id', controller.addNewRating);
router.post('/posts', controller.handlePosts);

// list of user talks 
router.post("/itinerary", controller.addToItinerary);
router.get("/itinerary/:username", controller.getUserItinerary);
router.delete("/itinerary", controller.removeFromItinerary);

//comments routers of the talks 
const { getComments, addComment, deleteComment } = require("../controllers/controllers");
router.get("/talks/:talkId/comments", getComments);
router.post("/talks/:talkId/comments", addComment);
router.delete("/talks/:talkId/comments/:commentId", deleteComment);

// router for the users profile 
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user/:username", controller.getUserDetails);
router.put("/updateProfile", controller.updateProfile);

//error message stating if the pages 
router.use(function (req, res) {
  res.status(404);
  res.type("text/plain");
  res.send("404 Not found.");
});

//error message stating if the pages
router.use(function (err, req, res, next) {
  res.status(500);
  res.type("text/plain");
  res.send("Internal Server Error.");
});

module.exports = router;
