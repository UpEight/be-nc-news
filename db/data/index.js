const ENV = process.env.NODE_ENV || 'development';

const development_data = require('./development-data');
const test_data = require('./test-data');

const data = {
  development: development_data,
  test: test_data,
  production: development_data
};

module.exports = data[ENV];
