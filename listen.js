const app = require('./app');

app.listen(process.env.PORT || 3030, () =>
  console.log(`Listening on ${PORT}...`)
);
