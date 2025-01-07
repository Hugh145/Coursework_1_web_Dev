const Datastore = require("nedb");

// UserDAO class to handle user operations in the database
class UserDAO {
  constructor(dbFilePath) {
    // Initialize the NeDB database for the user role path
    this.db = new Datastore({ filename: dbFilePath, autoload: true });
  }

   //Add a new user to the database
  addUser(user) {
    return new Promise((resolve, reject) => {
      this.db.insert(user, (err, newUser) => {
        if (err) reject(err); // Reject if an error occurs
        else resolve(newUser); // Resolve with the new user object
      });
    });
  }

  //Find a user in the database based on a query
  findUser(query) {
    return new Promise((resolve, reject) => {
      this.db.findOne(query, (err, user) => {
        if (err) reject(err); // Reject if an error occurs
        else resolve(user); // Resolve with the matched user object
      });
    });
  }

  //Get a user's profile details that have been updated
  userUpdatedProfile(username, updates) {
    return new Promise((resolve, reject) => {
        this.db.update(
            { username },
            { $set: updates },
            { returnUpdatedDocs: true },
            (err, updatedDoc) => {
                if (err) reject(err);
                else resolve(updatedDoc);
            }
        );
    });
}


}

module.exports = UserDAO;


