exports.up = function(knex) {
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable
      .string("slug", 50)
      .primary()
      .unique()
      .notNullable();
    topicsTable.string("description", 150).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("topics");
};
