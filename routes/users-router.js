const usersRouter = require("express").Router();

const { sendUserByUsername } = require("../controllers/users-controller");

usersRouter.route("/:username").get(sendUserByUsername);

module.exports = usersRouter;
