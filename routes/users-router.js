const usersRouter = require("express").Router();

const { send405Error } = require("../errors");

const { sendUserByUsername } = require("../controllers/users-controller");

usersRouter
  .route("/:username")
  .get(sendUserByUsername)
  .all(send405Error);

module.exports = usersRouter;
