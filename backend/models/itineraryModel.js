const Datastore = require("nedb");

class ItineraryModel {
  constructor(dbFilePath) {
    this.db = new Datastore({ filename: dbFilePath, autoload: true });
  }

  // Add a talk to a user's itinerary
  addToItinerary(username, talk) {
    return new Promise((resolve, reject) => {
      this.db.update(
        { username },
        { $push: { itinerary: talk } },
        { upsert: true, returnUpdatedDocs: true },
        (err, numAffected, updatedDoc) => {
          if (err) reject(err);
          else resolve(updatedDoc);
        }
      );
    });
  }

  // Get a user's itinerary
  getUserItinerary(username) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ username }, (err, doc) => {
        if (err || !doc) reject("User or itinerary not found.");
        else resolve(doc.itinerary || []);
      });
    });
  }

  // Remove a talk from a user's itinerary
  removeFromItinerary(username, talkId) {
    return new Promise((resolve, reject) => {
      this.db.update(
        { username },
        { $pull: { itinerary: { id: talkId } } },
        { returnUpdatedDocs: true },
        (err, numAffected, updatedDoc) => {
          if (err) reject(err);
          else resolve(updatedDoc);
        }
      );
    });
  }
}

module.exports = ItineraryModel;
