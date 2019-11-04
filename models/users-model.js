const connection = require('../db/connection');

exports.selectUserByUsername = ({ username }) => {
  return connection
    .select('*')
    .from('users')
    .where('username', username)
    .then(users => {
      if (users.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `User '${username}' not found`
        });
      }
      return users[0];
    });
};
