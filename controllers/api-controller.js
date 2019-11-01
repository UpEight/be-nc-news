const { getApi } = require('../models/api-model');

exports.sendApi = (req, res, next) => {
  console.log('In th api model');
  const api = getApi();
  res.status(200).send(JSON.stringify(api));
};
