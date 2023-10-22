const knex = require("knex");
const config = require("../config/config"); // Import your configuration settings

// Create a new database connection based on your configuration
const db = knex({
  client: "pg", // Specify the PostgreSQL client
  connection: {
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
  },
});

module.exports = db;
