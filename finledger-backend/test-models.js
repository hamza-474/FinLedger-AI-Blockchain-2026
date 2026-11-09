const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function run() {
  const keys = [process.env.GEMINI_KEY_2, process.env.GEMINI_KEY_3];
  
  for (let key of keys) {
    if (!key) continue;
    try {
      console.log('Testing key:', key);
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent('hello');
      console.log('Success:', result.response.text());
    } catch (err) {
      console.error('Error:', err.message);
    }
  }
}
run();
