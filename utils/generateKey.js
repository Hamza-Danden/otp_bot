const crypto = require("crypto");

function generateRandomKey() {
  return crypto.randomBytes(16).toString("hex");
}

function generateSubscriptionKey(expiration_date) {
  const key = generateRandomKey();

  return {
    key,
    expiration_date,
  };
}

module.exports = generateSubscriptionKey;
