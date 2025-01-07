const confDAO = require("../models/confModel"); // For interacting with the conference database
const conf = new confDAO({ filename: "conf.db", autoload: true }); // For interacting with the conference database

//user part of the database 
const bcrypt = require("bcryptjs"); // For hashing passwords
const jwt = require("jsonwebtoken"); // For generating JWTs
const UserDAO = require("../models/userModel"); // For interacting with the user database
require("dotenv").config();// For loading environment variables
const userDB = new UserDAO("users.db"); // For interacting with the user database
const commentModel = require("../models/commentsModel"); // For interacting with the comments database
const ItineraryModel = require("../models/itineraryModel"); // For interacting with the itinerary database
const itineraryDB = new ItineraryModel("itinerary.db"); // For interacting with the itinerary database

//user controller of the backend information 
// Register a new user
exports.registerUser = async (req, res) => {
  const { email, username, password, firstName, lastName, dob, address1, address2, role } = req.body;

  if (!email || !username || !password || !firstName || !lastName || !dob || !address1 || !role) {
    return res.status(400).json({ error: "All required fields must be filled." });
  }

  if (password.length < 6 || username.length < 6) {
    return res.status(400).json({ error: "Username and password must be at least 6 characters long." });
  }

  const existingUser = await userDB.findUser({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ error: "Email or username already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    email,
    username,
    password: hashedPassword,
    firstName,
    lastName,
    dob,
    address1,
    address2: address2 || null,
    role,
  };

  try {
    const savedUser = await userDB.addUser(newUser);
    res.status(201).json({ message: "User registered successfully.", user: savedUser });
  } catch (error) {
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await userDB.findUser({ username });
  if (!user) {
    return res.status(400).json({ error: "Invalid username or password." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid username or password." });
  }

  // Debug JWT_SECRET to ensure it's loaded
  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  const token = jwt.sign(
    { username: user.username, role: user.role },
    process.env.JWT_SECRET
  );

  res.status(200).json({ username: user.username, role: user.role, token, message: "Login successful" });
};

//edit on the user the own profile 
exports.updateProfile = async (req, res) => {
  const { username, updates } = req.body;

  if (!username || !updates) {
      return res.status(400).json({ error: "Username and updates are required." });
  }

  try {
      const updatedUser = await userDB.userUpdatedProfile(username, updates);

      if (!updatedUser) {
          return res.status(404).json({ error: "User not found." });
      }

      res.status(200).json({ message: "Profile updated successfully.", user: updatedUser });
  } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile. Try again later." });
  }
};

//view a details of profile 
exports.getUserDetails = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await userDB.findUser({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user details.", details: err.message });
  }
};

// Add a talk to the itinerary
exports.addToItinerary = async (req, res) => {
  const { username, talk } = req.body;

  try {
    const updatedItinerary = await itineraryDB.addToItinerary(username, talk);
    res.status(200).json({ message: "Talk added to itinerary", itinerary: updatedItinerary.itinerary });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Get a user's itinerary
exports.getUserItinerary = async (req, res) => {
  const { username } = req.params;

  try {
    const itinerary = await itineraryDB.getUserItinerary(username);
    res.status(200).json(itinerary);
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

// Remove a talk from the itinerary
exports.removeFromItinerary = async (req, res) => {
  const { username, talkId } = req.body;

  try {
    const updatedItinerary = await itineraryDB.removeFromItinerary(username, talkId);
    res.status(200).json({ message: "Talk removed from itinerary", itinerary: updatedItinerary.itinerary });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};


// talk controller of the backend information 
exports.addNewRating = (req, res) => {
  const { talkId, rating } = req.body;

  conf
    .rateTalkById(talkId, rating)
    .then(() => {
      res.status(200).json({ message: "Rating added successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to add rating", details: err });
    });
};

//talk controller of the backend information
exports.newList = function (req, res) {
  conf.init();
  res.redirect("/");
};
exports.listConf = function (req, res) {
  conf
    .getAllEntries()
    .then((list) => {
      res.json(list);
      console.log(list);
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

//talk controller of the backend information for the speaker, session and time
exports.listOneSpeaker = function (req, res) {
  let speakerName = req.params["term"];
  conf
    .getSpeaker(speakerName)
    .then((list) => {
      res.json(list);
      console.log(list);
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};
//talk controller of the backend information for the session
exports.listSession = function (req, res) {
  let sessionName = req.params["term"];
  conf
    .getSession(sessionName)
    .then((list) => {
      res.json(list);
      console.log(list);
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

exports.listTime = function (req, res) {
  let talkTime = req.params["term"];
  conf
    .getTime(talkTime)
    .then((list) => {
      res.json(list);
      console.log(list);
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

exports.listRatingsBySpeaker = function (req, res) {
  let speakerName = req.params["speaker"];
  conf
    .getSpeaker(speakerName)
    .then((list) => {
      res.json(list[0].ratings);
      console.log("ratings: ", list[0].ratings);
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

exports.listRatingsById = function (req, res) {
  let talkId = req.params["id"];
  conf
    .getTalkById(talkId)
    .then((list) => {
      res.json(list[0].ratings);
      console.log("ratings: ", list[0].ratings);
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

exports.rateTalkById = function (req, res) {
  let talkId = req.params["id"];
  let newRating = req.params["rating"];

  conf
    .rateTalkById(talkId, newRating)
    .then(console.log("adding rating using params"))
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

//getting the avg rating for the talks 
exports.getAverageRating = function (req, res) {
  const talkId = req.params.id; 

  conf
    .getAverageRating(talkId)
    .then((avgRating) => {
      res.json({ talkId, avgRating });
      console.log(`Average rating for talk ${talkId}: ${avgRating}`);
    })
    .catch((err) => {
      res.status(500).json({ error: "Unable to calculate average rating" });
      console.error(err);
    });
};

//comment section of the talks
// Get all comments for a talk
exports.getComments = async (req, res) => {
  const { talkId } = req.params;
  try {
    const comments = await commentModel.getComments(talkId);
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: "Error fetching comments" });
  }
};

// Add a comment
exports.addComment = async (req, res) => {
  const { talkId } = req.params;
  const { username, comment } = req.body;
  try {
    const newComment = await commentModel.addComment(talkId, username, comment);
    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (err) {
    res.status(500).json({ error: "Error adding comment" });
  }
};

// Delete a comment
exports.deleteComment = (req, res) => {
  const { talkId, commentId } = req.params;
  const { username } = req.body;

  commentModel.findOne({ talkId }, (err, talk) => {
    if (err) {
      res.status(500).json({ message: "Internal server error." });
      return;
    }
    if (!talk) {
      res.status(404).json({ message: "Talk not found." });
      return;
    }

    const commentIndex = talk.comments.findIndex(
      (comment) => comment.id === commentId && comment.username === username
    );

    if (commentIndex === -1) {
      res.status(403).json({ message: "You can only delete your own comments." });
      return;
    }

    talk.comments.splice(commentIndex, 1);

    commentModel.update({ talkId }, { $set: { comments: talk.comments } }, {}, (updateErr) => {
      if (updateErr) {
        res.status(500).json({ message: "Failed to delete comment." });
      } else {
        res.status(200).json({ message: "Comment deleted successfully." });
      }
    });
  });
};


exports.handlePosts = function (req, res) {
  let talkId = req.body.talkId;
  let newRating = req.body.rating;
  conf
    .rateTalk(talkId, newRating)
    .then(console.log("rating added"))
    .catch((err) => {
      console.log("promise rejected", err);
    });
};
