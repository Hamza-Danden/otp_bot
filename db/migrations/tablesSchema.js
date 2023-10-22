exports.up = function (knex) {
  return knex.schema
    .createTable("Users", function (table) {
      table.string("user_id").primary();
      table.string("username").unique().notNullable();
      table.string("subscription_key");
      table.date("subscription_key_expiration_date");
    })
    .createTable("ScriptTemplates", function (table) {
      table.increments("template_id").primary();
      table.string("name");
      table.string("language");
      //table.string('user_id').references('user_id').inTable('Users');
      table.string("user_id");
      table.string("part_1");
      table.string("part_2");
      table.string("part_3");
      table.string("part_4");
      table.timestamp("timestamp").defaultTo(knex.fn.now());
    })
    .createTable("PredefinedScripts", function (table) {
      table.increments("predefined_script_id").primary();
      table.string("part_1");
      table.string("part_2");
      table.string("part_3");
      table.string("part_4");
      table.timestamp("timestamp").defaultTo(knex.fn.now());
    })
    .createTable("Commands", function (table) {
      table.increments("command_id").primary();
      table.string("user_id").references("user_id").inTable("Users");
      table.string("command_text");
      table.timestamp("timestamp").defaultTo(knex.fn.now());
    })
    .createTable("Calls", function (table) {
      table.increments("call_id").primary();
      table.string("user_id").references("user_id").inTable("Users");
      table.string("receiver_number");
      table.timestamp("call_datetime").defaultTo(knex.fn.now());
      table.specificType("call_duration", "interval"); // Define 'call_duration' as an interval column
      table.string("call_recording_url");
      table.timestamp("timestamp").defaultTo(knex.fn.now());
    })
    .createTable("CommandInputs", function (table) {
      table.increments("input_id").primary();
      table.integer("call_id").references("call_id").inTable("Calls");
      table.string("input_text");
      table.timestamp("timestamp").defaultTo(knex.fn.now());
    })
    .createTable("SubscriptionKeys", function (table) {
      table.increments("key_id").primary();
      table.string("user_id").references("user_id").inTable("Users");
      table.string("subscription_key");
      table.timestamp("expiration_date", { useTz: true });
      table.timestamp("timestamp").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("SubscriptionKeys")
    .dropTable("CommandInputs")
    .dropTable("Calls")
    .dropTable("Commands")
    .dropTable("PredefinedScripts")
    .dropTable("ScriptTemplates")
    .dropTable("Users");
};
