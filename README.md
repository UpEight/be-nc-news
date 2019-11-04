# Northcoders News API

A RESTful API for accessing the Northcoders News backend data.

The available endpoints are shown [here](https://upeight-nc-news.herokuapp.com/api/).

## Background

The data is stored in a PSQL database. The database Interactions are carried out using [Knex](https://knexjs.org).

## Installing a local development instance

### Prerequisites

_If you don't have PSQL installed, [follow these instructions to install PSQL](#psql-install-instructions)_.

### Installation

1. Clone this repo:

```bash
git clone https://github.com/UpEight/be-nc-news

cd be-nc-news
```

2. Install the dependencies:

```bash
npm install
```

3. Create the following `knexfile.js` in your root directory:

```bash
const { DB_URL } = process.env;

const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  development: {
    connection: {
      database: 'nc_news'
      user : 'your_database_user',
      password : 'your_database_password',
    }
  },
  test: {
    connection: {
      database: 'nc_news_test'
      user : 'your_database_user',
      password : 'your_database_password',
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
```

4. Create the test and development databases:

```bash
npm run setup-dbs
```

5. Seed the databases:

```bash
npm run seed        // seeds the development db
npm run seed-test   // seeds the test db
```

6. Start your local server:

```bash
npm start
```

## Running the tests

Run the unit tests:

```bash
npm test
```

Run the utility function tests:

```bash
npm run test-utils
```

## PSQL Install instructions

_*Mac*_

- Install Postrgres App https://postgresapp.com/
  - Open the app (little blue elephant) and select initialize/start
- type `psql` into your terminal. You should then see something similar to:

```psql
psql (9.6.5, server 9.6.6)
Type "help" for help.

username=#
```

- _if the above does not show/you get an error, run the following commands in your terminal:_
  - `brew update`
  - `brew doctor`
  - `brew install postgresql`

_*Ubuntu*_

- Run this command in your terminal:
  `sudo apt-get update`

  `sudo apt-get install postgresql postgresql-contrib`

- Next run the following commands to create a database user for Postgres.

  `sudo -u postgres createuser --superuser $USER`

  `sudo -u postgres createdb $USER`

- Then run this command to enter the terminal application for PostgreSQL:

  `psql`

- Now type:

  `ALTER USER username WITH PASSWORD 'mysecretword123';`

* You can then exit out of psql by typing `\q`

[Go to project installation instructions](#installation)
