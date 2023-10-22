const db = require("../db/connection"); // Import your database connection

const knex = require("knex");

const generateKey = require("./generateKey");

const checkSubscriptionValidity = async (userSubscriptionKey) => {
  try {
    if (!userSubscriptionKey) return false;
    const fetch = await db("SubscriptionKeys")
      .where("subscription_key", userSubscriptionKey)
      .where("expiration_date", ">", db.fn.now());
    if (fetch.length) return true;
    return false;
  } catch (err) {
    console.log(err);
  }
};
// checkSubscriptionValidity("7ed2fe5356d8b14d18d3d783318083bc");

buyKeyMSG = (ctx) => {
  ctx.reply(
    `user created\ntelegram id: ${ctx.update.message.from.id}\nPlease choose yur payment method`
  );
};

exports.buyKeyMSG = buyKeyMSG;

exports.checkSubscriptionValidity = checkSubscriptionValidity;

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
// ------------------------ create keys for test ----------------------------------- //////////////

const createKey = async (keyObj) => {
  try {
    keyObj.expiration_date = db.raw(
      `NOW() + INTERVAL '${keyObj.expiration_date} days'`
    );

    createdSubscriptionKey = await db("SubscriptionKeys").insert({
      subscription_key: keyObj.key,
      expiration_date: keyObj.expiration_date,
    });

    return console.log(createdSubscriptionKey);
  } catch (error) {
    console.log(error);
  }
};

// createKey(generateKey(1));
// createKey(generateKey(7));

//////////// fetch keys //////////
const fetchKeys = async () => {
  const keys = await db("Users");
  console.log(keys);
};

// fetchKeys();

// add key to user test
//
const addKeyToUser = async () => {
  try {
    const updatedUser = await db("Users")
      .where({
        user_id: "1971171458",
        subscription_key_expiration_date: new Date("2023-10-21T23:21:37.830Z"),
      })
      .update({
        subscription_key: "7ed2fe5356d8b14d18d3d783318083bc",
      });
    console.log(updatedUser);
  } catch (err) {
    console.log(err);
  }
};
// addKeyToUser();
