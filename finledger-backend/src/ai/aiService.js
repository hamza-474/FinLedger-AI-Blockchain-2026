const { callGemini } = require('./geminiService');

exports.predictFutureSpending = async (organizationData) => {
  const prompt = `
    Based on the following last 3-6 months of transaction data for an organization, predict the next month's spending by category.
    Return the response ONLY as a valid JSON object in this exact format:
    { "predictions": [ { "category": "String", "predictedAmount": Number, "reasoning": "String", "confidenceLevel": "High|Medium|Low" } ] }
    Data: ${JSON.stringify(organizationData)}
  `;
  const response = await callGemini(prompt);
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(response);
  } catch (error) {
    console.error("Error parsing AI JSON response:", error);
    return { predictions: [] };
  }
};

exports.detectAnomalies = async (transactions) => {
  const prompt = `
    Analyze the following recent transactions and identify any unusual, suspicious, or anomalous transactions. 
    Look for duplicate payments, unusually high amounts compared to similar categories, or suspicious descriptions.
    Return the response ONLY as a valid JSON object in this exact format:
    { "anomalies": [ { "title": "String", "date": "YYYY-MM-DD", "amount": Number, "reason": "String" } ] }
    Data: ${JSON.stringify(transactions)}
  `;
  const response = await callGemini(prompt);
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(response);
  } catch (error) {
    console.error("Error parsing AI JSON response:", error);
    return { anomalies: [] };
  }
};

exports.generateFinancialReport = async (summaryData) => {
  const prompt = `
    Write a professional financial analysis report based on the following monthly summary data (income, expenses, categories).
    Highlight key takeaways, areas of concern, and overall financial health. Use markdown formatting.
    Data: ${JSON.stringify(summaryData)}
  `;
  return await callGemini(prompt);
};

exports.getChatAdvice = async (userQuestion, financialContext) => {
  const prompt = `
    You are a professional financial advisor AI for an organization.
    The user asked: "${userQuestion}"
    Answer their question helpfully and professionally based on their actual financial data context below. Use markdown formatting.
    Context: ${JSON.stringify(financialContext)}
  `;
  return await callGemini(prompt);
};
