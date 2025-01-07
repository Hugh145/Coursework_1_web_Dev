//comment section of the talks get the comments add new comments and deletes the comments 
const Datastore = require("nedb");

class CommentModel {
  constructor() {
    this.db = new Datastore({ filename: "comments1.db", autoload: true });
  }

  // Add a new comment
  addComment(talkId, username, text) {
    return new Promise((resolve, reject) => {
      this.db.insert(
        { talkId, username, text, createdAt: new Date() },
        (err, newDoc) => {
          if (err) reject(err);
          else resolve(newDoc);
        }
      );
    });
  }

  // Get all comments for a specific talk
  getComments(talkId) {
    return new Promise((resolve, reject) => {
      this.db.find({ talkId }, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }

  // Delete a comment by ID and username
  deleteComment(commentId, username) {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: commentId, username }, {}, (err, numRemoved) => {
        if (err) reject(err);
        else resolve(numRemoved);
      });
    });
  }
}

module.exports = new CommentModel();
