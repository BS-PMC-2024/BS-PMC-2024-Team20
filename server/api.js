// server/api.js
const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;

const sendMessageToGPT = async (message) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4', // או כל מודל אחר שאתה משתמש בו
      messages: [{ role: 'user', content: message }],
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error communicating with GPT:', error);
    throw new Error('Failed to communicate with GPT');
  }
};

module.exports = { sendMessageToGPT };
