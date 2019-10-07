exports.up = function(knex) {
  console.log("Creating the topics table");
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable
      .string("slug", 50)
      .primary()
      .unique();
    topicsTable.string("description", 150);
  });
};

exports.down = function(knex) {
  console.log("Removing the topics table");
  return knex.schema.dropTable("topics");
};
