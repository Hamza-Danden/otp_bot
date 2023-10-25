require("dotenv").config();
const knex = require("knex");
const { Telegraf, Markup } = require("telegraf");
const { message } = require("telegraf/filters");
const db = require("../db/connection"); // Import your database connection
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const initiateCall = require("./../call");

const {
  checkSubscriptionValidity,
  buyKeyMSG,
} = require("./../utils/checkKeyMiddleware");
// User state management
const userStates = new Map();

// Define user states
const ScriptStates = {
  LANGUAGE: "language",
  SCRIPT_NAME: "scriptName",
  PART_1: "part1",
  PART_2: "part2",
  PART_3: "part3",
  PART_4: "part4",
};

// Start command handler
bot.start(async (ctx) => {
  const user = await db("Users").select("*").where({
    user_id: ctx.update.message.from.id,
  });

  if (user.length) {
    const isValidKey = await checkSubscriptionValidity(
      user[0].subscription_key
    );
    if (isValidKey)
      return ctx.reply(
        `telegram id: ${ctx.update.message.from.id}\nsubscription key: ${user[0].subscription_key}\nvalid to: ${user[0].subscription_key_expiration_date}\nyou can pass !`
      );
    return buyKeyMSG(ctx);
  }

  await db("Users").insert({
    user_id: ctx.update.message.from.id,
    username:
      ctx.update.message.from.username || ctx.update.message.from.first_name,
  });

  return buyKeyMSG(ctx);
});

// Help command handler
bot.help((ctx) => {
  ctx.reply(
    "Available commands:\n/sticker - Send me a sticker\nhi - Greet the bot\n /addscript - Add a new script\n /listscripts - List all scripts\n /deletescript - Delete a script\n /updatescript - Update a script\n /runscript - Run a script\n /help - Show this help message"
  );
});

bot.command("survey", async (ctx) => {
  // console.log("hii from survey");
  try {
    console.log(
      `from: ${ctx.message.text.split(" ")[1]}\nto: ${
        ctx.message.text.split(" ")[2]
      }`
    );
    initiateCall(
      ctx.message.text.split(" ")[1],
      ctx.message.text.split(" ")[2]
    );
    ctx.reply("dev..");
  } catch (err) {
    ctx.reply("internal error");
  }
});

// Hi command handler
bot.hears("hi", (ctx) => {
  console.log("The 'hi' command was triggered.");
  ctx.reply("Hey there!");
});

// Add script command handler
// Add Script command handler
bot.command("createscript", (ctx) => {
  const userId = ctx.from.id;

  // Check if the user is already in a script creation state
  if (userStates.has(userId)) {
    ctx.reply(
      "You are already in the process of creating a script. Please complete the current process or type /cancel to abort."
    );
    return;
  }

  // Initialize a new script creation state
  userStates.set(userId, { state: ScriptStates.LANGUAGE, script: {} });

  // Prompt the user to select a language
  ctx.reply(
    "Select a language:",
    Markup.inlineKeyboard([
      Markup.button.callback("English (en_us)", "en_us"),
      // Add more language options as needed
    ]).oneTime()
  );
});

// authenticate user
bot.command("auth", async (ctx) => {
  try {
    // check if key exists
    const fetchKey = await db("SubscriptionKeys").where({
      subscription_key: ctx.payload.trim(),
      user_id: null,
    });

    if (!fetchKey.length) return ctx.reply("Invalid key");

    // add keyy to user
    await db("Users")
      .where({ user_id: ctx.message.from.id + "" })
      .update({
        subscription_key: ctx.payload.trim(),
      });

    // add user_id to key
    await db("SubscriptionKeys")
      .where({ subscription_key: ctx.payload.trim() })
      .update({ user_id: ctx.update.message.from.id + "" });

    return ctx.reply(`Done`);
  } catch (err) {
    console.log(err);
    ctx.reply("something wrong ");
  }
});

bot.command("create", async (ctx) => {
  // console.log(`id: ${ctx.botInfo.id}, \nmessage: ${ctx.update["message"]}`);
  // db.
  // console.log(ctx.update.update_id);
  return ctx.reply("fine");
});

// Language selection callback handler
bot.action("en_us", (ctx) => {
  const userId = ctx.from.id;

  // Check if the user is in the expected state
  if (userStates.get(userId)?.state !== ScriptStates.LANGUAGE) {
    return;
  }

  // Update the user's script state
  userStates.get(userId).script.language = "en_us";
  userStates.get(userId).state = ScriptStates.SCRIPT_NAME;

  // Prompt the user to enter the script name
  ctx.reply("Enter a name for your script:");
});

// Message handler for script name and all four parts
bot.on("text", (ctx) => {
  const userId = ctx.from.id;
  const userState = userStates.get(userId);

  if (!userState) {
    ctx.reply(
      "You are not currently creating a script. Type /createscript to start."
    );
    return;
  }

  switch (userState.state) {
    case ScriptStates.SCRIPT_NAME:
      // Save the script name
      userState.script.name = ctx.message.text;
      userState.state = ScriptStates.PART_1;
      // Prompt for the first part of the message
      ctx.reply("Enter the first part of your script:");
      break;

    case ScriptStates.PART_1:
      userState.script.part1 = ctx.message.text;
      userState.state = ScriptStates.PART_2;
      ctx.reply("Enter the second part of your script:");
      break;

    case ScriptStates.PART_2:
      userState.script.part2 = ctx.message.text;
      userState.state = ScriptStates.PART_3;
      ctx.reply("Enter the third part of your script:");
      break;

    case ScriptStates.PART_3:
      userState.script.part3 = ctx.message.text;
      userState.state = ScriptStates.PART_4;
      ctx.reply("Enter the fourth part of your script:");
      break;

    case ScriptStates.PART_4:
      userState.script.part4 = ctx.message.text;
      // All parts collected, save the script to the database
      db("ScriptTemplates")
        .insert({
          user_id: userId,
          language: userState.script.language,
          name: userState.script.name,
          part_1: userState.script.part1,
          part_2: userState.script.part2,
          part_3: userState.script.part3,
          part_4: userState.script.part4,
        })
        .returning("*")
        .then((script) => {
          ctx.reply("Script created successfully! Here is your script:");
          ctx.reply(`Language: ${script[0].language}`);
          ctx.reply(`Name: ${script[0].name}`);
          ctx.reply(`Part 1: ${script[0].part_1}`);
          ctx.reply(`Part 2: ${script[0].part_2}`);
          ctx.reply(`Part 3: ${script[0].part_3}`);
          ctx.reply(`Part 4: ${script[0].part_4}`);
          userStates.delete(userId); // Clear the user's state
        })
        .catch((error) => {
          ctx.reply(
            "An error occurred while adding the script. Please try again later."
          );
          console.error("Database error:", error);
          userStates.delete(userId); // Clear the user's state on error
        });
      break;

    default:
      ctx.reply(
        "Invalid state. Please type /createscript to start a new script."
      );
  }
});

// Enable graceful stop
process.once("SIGINT", () => {
  bot.stop("SIGINT");
  // You can add any cleanup logic here before stopping the bot
  db.destroy(); // Close the database connection on bot exit
});

process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
  // You can add any cleanup logic here before stopping the bot
  db.destroy(); // Close the database connection on bot exit
});

// Sticker message handler
bot.on("message", (ctx) => {
  if (ctx.message.sticker) {
    ctx.reply("👍");
  }
});

// Enable graceful stop
process.once("SIGINT", () => {
  bot.stop("SIGINT");
  // You can add any cleanup logic here before stopping the bot
  db.destroy(); // Close the database connection on bot exit
});

process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
  // You can add any cleanup logic here before stopping the bot
  db.destroy(); // Close the database connection on bot exit
});

module.exports = bot; // Export the bot instance
