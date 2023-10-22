require("dotenv").config(); // Load environment variables from .env file

const bot = require("./src/bot"); // Import your Telegram bot logic (bot.js)
require("./src/commands");
require("./utils/generateKey");
// Start the Telegram bot
console.log("Telegram bot is up and running");
bot.launch().then(() => {
  console.log("Telegram bot is up and running");
});

// Handle graceful shutdown
const gracefulShutdown = () => {
  console.log("Shutting down gracefully...");
  bot.stop(); // Stop the bot
};

// Listen for SIGINT (Ctrl+C) and SIGTERM signals to gracefully stop the bot
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
