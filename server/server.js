const express = require('express');
const { sendMessageToGPT, getSurveyTipsFromGPT } = require('./api'); // וודא שהפונקציות מיובאות נכון מהקובץ api.js
const app = express();
const cors = require('cors'); // ייבוא חבילת CORS


app.use(express.json());
app.use(cors()); // שימוש ב-CORS בכל הבקשות


// נתיב הקיים עבור הצ'אט
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await sendMessageToGPT(message);
    res.json(response);
  } catch (error) {
    console.error('Error communicating with GPT:', error.message);
    res.status(500).send('Failed to communicate with GPT');
  }
});

// נתיב חדש עבור ה-סקר
app.post('/api/getSurveyTipsFromGPT', async (req, res) => {
  try {
    const surveyResponses = req.body;
    const tips = await getSurveyTipsFromGPT(surveyResponses);
    res.json({ gptResponse: tips });
  } catch (error) {
    console.error('Error generating survey tips:', error.message);
    res.status(500).send('Failed to generate survey tips');
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// turn the server on to listen on port 3002
//node server/server.js