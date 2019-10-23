const app = require('./app');

const { PORT = 9090 } = process.env;

app.listen(process.env.PORT || 3030, () =>
  console.log(`Listening on ${PORT}...`)
);
