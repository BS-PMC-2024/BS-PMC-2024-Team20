const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sendMessageToGPT } = require('./api');

const app = express();
const port = process.env.PORT || 3002;

app.use(bodyParser.json());
app.use(cors());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await sendMessageToGPT(message);
    res.json(response);
  } catch (error) {
    console.error('Error:', error.message); // הדפסת הודעת השגיאה
    console.error('Stack:', error.stack); // הדפסת ה-stack trace
    res.status(500).send('Error communicating with GPT');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// turn the server on to listen on port 3001
//node server/server.js