exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const psqlBadRequestCodes = ["22P02", "42703"];
  const unprocessableEntityCodes = ["23503"];
  if (psqlBadRequestCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  }
  if (unprocessableEntityCodes.includes(err.code)) {
    res.status(422).send({ msg: "Unprocessable Entity" });
  } else next(err);
};
