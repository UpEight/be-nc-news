const { selectUserByUsername } = require("../models/users-model");

exports.sendUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username).then(users => {
    res.status(200).send({ user: users[0] });
  });
};
