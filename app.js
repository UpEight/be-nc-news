const express = require("express");
const app = express();

const apiRouter = require("./routes/api-router");

const { handleCustomErrors, handlePsqlErrors } = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);

app.all("/*", (req, res, next) =>
  res.status(404).send({ msg: "Route not found" })
);

module.exports = app;
