exports.up = function(knex) {
  return knex.schema.createTable("users", usersTable => {
    usersTable
      .string("username", 50)
      .primary()
      .unique()
      .notNullable();
    usersTable.string("name", 50).notNullable();
    usersTable.string("avatar_url").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
