const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not defined');
}

const sendMessageToGPT = async (message) => {
  try {
    const prompt = `המטרה היא לספק עזרה בפתרון בעיות לימודיות יומיומיות ולשפר את הלמידה של המשתמש.
המשתמש הכניס את השאלה הבאה: "${message}". 

1. תענה על השאלה רק אם היא קשורה באופן ברור לנושא הלימודי. 
2. אם השאלה לא קשורה לנושא הלימודי, תענה בתשובה קצרה כמו: "מצטער, שאלה זו אינה קשורה לנושא הלימודי."
3. תשובות צריכות להיות קצרות וברורות, עד שתי שורות לכל היותר אם רלוונטי לנושא, ועד שורה אחת אם לא רלוונטי.`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
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

// פונקציה לסקר
const getSurveyTipsFromGPT = async (surveyResponses) => {
  try {
    console.log('Preparing prompt for GPT...');
    const prompt = `
    תכיל בתגובה שלך את המשפט: "שמחים שהצטרפת אלינו, אנחנו כאן תמיד בשבילך!"
    ולאחר מכן, בהתבסס על המידע שסופק, ספק שלושה טיפים להרגלי לימוד טובים יותר:
    /n
    התמקדות: ${surveyResponses.question1}/n
    ניהול זמן: ${surveyResponses.question2}/n
    הסחת דעת: ${surveyResponses.question3}/n
    
    מידע נוסף: ${surveyResponses.openEnded}
    `;


    console.log('Sending prompt to GPT:', prompt);
    const response = await sendMessageToGPT(prompt); // קריאה לפונקציה הקיימת

    console.log('Received response from GPT:', response);

    // הדפסת תוכן ההודעה לפרטים
    console.log('Received message object:', JSON.stringify(response.choices[0].message, null, 2));

    // גישה לתוכן ההודעה
    if (response.choices && response.choices.length > 0) {
      const messageContent = response.choices[0].message.content.trim(); // שליפת תוכן התשובה
      return messageContent;
    } else {
      throw new Error('Invalid response structure from GPT');
    }
  } catch (error) {
    console.error('Error generating survey tips:', error.message);
    throw new Error('Failed to generate survey tips');
  }
};

module.exports = { sendMessageToGPT, getSurveyTipsFromGPT };
