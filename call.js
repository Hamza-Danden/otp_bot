const axios = require("axios");
require("dotenv").config();

async function initiateCall(to, from) {
  try {
    const config = {
      headers: {
        Authorization: `App ${process.env.INFOBIP_API_KEY}`,
        "Content-Type": "application/json",
      },
    };

    const payload = {
      from: from,
      to: to,
      tts: {
        language: "en",
        text: "Question 1: Do you like coffee? Press 1 for Yes, 2 for No.",
      },
    };

    const response = await axios.post(
      `https://${process.env.INFOBIP_API_KEY}/calls`,
      payload,
      config
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error initiating call:", error);
    return null;
  }
}

module.exports = initiateCall;
