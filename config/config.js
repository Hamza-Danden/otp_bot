module.exports = {
  // Database connection settings
  client: "pg",
  database: {
    // host: process.env.DB_HOST || 'localhost',
    // port: process.env.DB_PORT || 5432,
    // user: process.env.DB_USER || 'postgres',
    // password: process.env.DB_PASSWORD || 'root',
    // database: process.env.DB_NAME || 'tele_bot',
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "Sandragalka1*", // "root",
    database: "tele_bot",
  },
  // Telegram Bot Token
  telegramBotToken:
    process.env.TELEGRAM_BOT_TOKEN ||
    "6293077107:AAF4950jZWxEGJ_Nipl67t33FJj0kxnh6SY", // '6440683146:AAGIdyIQmZqkNHeUGvHxMnC2-9t0xWBxAz0',
  // Telegraph API Token (if used)
  //telegraphApiToken: process.env.TELEGRAPH_API_TOKEN || 'your_telegraph_api_token',
};
