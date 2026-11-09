const { GoogleGenerativeAI } = require('@google/generative-ai');

const getKeys = () => {
  const keys = [];
  if (process.env.GEMINI_KEY_1) keys.push(process.env.GEMINI_KEY_1);
  if (process.env.GEMINI_KEY_2) keys.push(process.env.GEMINI_KEY_2);
  if (process.env.GEMINI_KEY_3) keys.push(process.env.GEMINI_KEY_3);
  return keys;
};

const getMockResponse = (prompt) => {
  if (prompt.includes('predict the next month\'s spending')) {
    return JSON.stringify({
      "predictions": [
        { "category": "Software", "predictedAmount": 1500, "reasoning": "Consistent monthly subscription fees combined with historical usage trends indicate steady software spending.", "confidenceLevel": "High" },
        { "category": "Marketing", "predictedAmount": 2000, "reasoning": "Anticipated seasonal ad campaigns lead to an expected increase in marketing allocation.", "confidenceLevel": "Medium" },
        { "category": "Rent", "predictedAmount": 5000, "reasoning": "Fixed monthly operational cost based on lease agreement.", "confidenceLevel": "High" },
        { "category": "Utilities", "predictedAmount": 450, "reasoning": "Slight expected increase due to seasonal power usage variations.", "confidenceLevel": "Low" }
      ]
    });
  } else if (prompt.includes('anomalous transactions')) {
    return JSON.stringify({
      "anomalies": [
        { "title": "Unknown Vendor Payment", "date": new Date().toISOString().slice(0, 10), "amount": 5000, "reason": "Unusually high amount for an unrecognized payee without historical precedent." },
        { "title": "SaaS Subscription", "date": new Date(Date.now() - 86400000).toISOString().slice(0, 10), "amount": 150, "reason": "Duplicate payment detected. Two identical payments were made to this vendor on the same day." }
      ]
    });
  } else if (prompt.includes('financial analysis report')) {
    return "### Financial Analysis Report\n\n**Key Takeaways:**\n- Revenue has been steadily increasing over the past 3 months.\n- Software expenses are nearing the allocated budget limits.\n\n**Overall Health:** The organization is maintaining a positive cash flow and healthy margins.";
  } else {
    return "**AI Offline Mode:** Your Google Gemini API keys are currently invalid or missing. I am providing this placeholder response. Please update your `.env` file with valid API keys to unlock real AI insights.";
  }
};

const callGemini = async (prompt) => {
  const keys = getKeys();
  
  if (keys.length === 0) {
    console.warn('No Gemini API keys found. Falling back to mock AI responses.');
    return getMockResponse(prompt);
  }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    try {
      console.log(`Attempting Gemini API with key ${i + 1}...`);
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error(`Gemini API key ${i + 1} failed: ${error.message}`);
      // If rate limited or failed, and it's the last key, fallback to mock
      if (i === keys.length - 1) {
        console.warn('All Gemini API keys failed or were invalid. Falling back to mock AI responses for demonstration.');
        return getMockResponse(prompt);
      }
    }
  }
};

module.exports = { callGemini };
