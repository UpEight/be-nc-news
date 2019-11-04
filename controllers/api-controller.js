const { getApi } = require('../models/api-model');

exports.sendApi = (req, res, next) => {
  const api = getApi();
  res.status(200).send(JSON.stringify(api));
};
