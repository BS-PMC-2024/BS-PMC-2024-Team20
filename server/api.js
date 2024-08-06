const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;

const sendMessageToGPT = async (message) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Response from OpenAI:', response.data); // הדפסת התגובה מה-API של OpenAI
    return response.data;
  } catch (error) {
    console.error('Error communicating with GPT:', error.message);
    console.error('Response data:', error.response ? error.response.data : 'No response data'); // הדפסת נתוני התגובה אם יש
    throw new Error('Failed to communicate with GPT');
  }
};

module.exports = { sendMessageToGPT };
