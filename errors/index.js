exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const psqlBadRequestCodes = ["22P02", "23503", "42703"];
  if (psqlBadRequestCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
};
