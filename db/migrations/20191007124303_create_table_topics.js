exports.up = function(knex) {
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable
      .string("slug", 50)
      .primary()
      .unique();
    topicsTable.string("description", 150);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("topics");
};
