const connection = require("../db/connection");

exports.selectUserByUsername = username => {
  return connection
    .select("*")
    .from("users")
    .where("username", username)
    .then(users => {
      if (users.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No user found with username = ${username}`
        });
      }
      return users[0];
    });
};
