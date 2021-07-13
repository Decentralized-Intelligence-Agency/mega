const axios = require("axios");
const config = require("../config.js");
module.exports.gpt3 = async (text, stopSequence = ["\n", "People:"]) => {
  console.log("=== getGpt3 ===");

  console.log(text);
  try {
    const resp = await axios.post(
      "https://api.openai.com/v1/engines/davinci/completions",
      {
        prompt: text,
        temperature: config.gpt3.temperature,
        max_tokens: 1050,
        best_of: 1,
        top_p: 1,
        presence_penalty: 0.6,
        stop: stopSequence,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + config.gpt3.apiKey,
        },
      }
    );
    console.log("=== GPT3 API DATA ===");
    console.log(resp.data);
    console.log("=== GPT3 API DATA ===");
    return resp.data.choices[0].text.trim();
  } catch (err) {
    console.log("====== getGpt3 errored ===== ", err);
    return "";
  }
};
