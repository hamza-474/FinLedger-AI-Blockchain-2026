const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// 1. LOAD KEYS FROM .env
const keys = Object.keys(process.env)
  .filter(k => k.startsWith('GEMINI_KEY_'))
  .sort()
  .map(k => process.env[k])
  .filter(Boolean);

if (keys.length === 0) {
  throw new Error("No Gemini API keys found. Add GEMINI_KEY_1 to .env");
}

// 2. KEY STATE TRACKING
const keyStates = new Map();
keys.forEach((key, i) => {
  keyStates.set(i, {
    key: key,
    failCount: 0,
    rateLimitedUntil: null,
    totalRequests: 0,
    totalErrors: 0,
  });
});

const isRateLimited = (index) => {
  const state = keyStates.get(index);
  return state.rateLimitedUntil && Date.now() <= state.rateLimitedUntil;
};

// 3. KEY SELECTION LOGIC
const getAvailableKey = () => {
  // Filter out keys where rateLimitedUntil > Date.now()
  const availableKeys = Array.from(keyStates.entries())
    .filter(([_, state]) => !isRateLimited(state.key) && (!state.rateLimitedUntil || Date.now() > state.rateLimitedUntil));

  if (availableKeys.length > 0) {
    // Pick the one with the lowest failCount
    availableKeys.sort((a, b) => a[1].failCount - b[1].failCount);
    const selectedIndex = availableKeys[0][0];
    console.log(`Using Gemini Key Index [${selectedIndex}]`);
    return selectedIndex;
  } else {
    // If all keys are rate-limited, return the one whose rateLimitedUntil is soonest
    const allKeys = Array.from(keyStates.entries());
    allKeys.sort((a, b) => a[1].rateLimitedUntil - b[1].rateLimitedUntil);
    const selectedIndex = allKeys[0][0];
    console.log(`All keys limited, waiting for/using Gemini Key Index [${selectedIndex}]`);
    return selectedIndex;
  }
};

// 4. ROTATION ON FAILURE
const callGeminiWithRotation = async (prompt) => {
  let attempt = 0;
  let rotations = 0;

  while (rotations < 3) {
    for (let i = 0; i < keys.length; i++) {
      const keyIndex = getAvailableKey();
      const state = keyStates.get(keyIndex);

      try {
        const genAI = new GoogleGenerativeAI(state.key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Fast and typical for text
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // On SUCCESS
        state.failCount = 0;
        state.totalRequests += 1;
        
        return { text, keyIndex };
      } catch (error) {
        const errMsg = error.message.toLowerCase();
        
        if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('rate') || errMsg.includes('exhausted') || errMsg.includes('limit')) {
          state.rateLimitedUntil = Date.now() + 60 * 1000; // 1 min
          state.failCount += 1;
          state.totalErrors += 1;
          console.log(`Key [${keyIndex}] rate limited, trying next key...`);
        } else if (errMsg.includes('401') || errMsg.includes('403') || errMsg.includes('api_key_invalid')) {
          state.rateLimitedUntil = Date.now() + 60 * 60 * 1000; // 1 hr
          state.failCount += 1;
          state.totalErrors += 1;
          console.log(`Key [${keyIndex}] auth failed, skipping for 1 hour`);
        } else if (errMsg.includes('500') || errMsg.includes('503')) {
          state.failCount += 1;
          console.log(`Key [${keyIndex}] server error, trying next...`);
        } else {
          state.failCount += 1;
          console.log(`Key [${keyIndex}] other error: ${error.message}, trying next...`);
        }
      }
    }
    rotations += 1;
  }

  throw new Error("Gemini service unavailable after retries");
};

// 5. COOLDOWN AUTO-RESET
setInterval(() => {
  keyStates.forEach((state, index) => {
    if (state.rateLimitedUntil && Date.now() > state.rateLimitedUntil) {
      state.rateLimitedUntil = null;
      state.failCount = Math.max(0, state.failCount - 1);
      console.log(`Key [${index}] cooldown expired, re-activating`);
    }
  });
}, 5 * 60 * 1000);

// 6. STATUS ENDPOINT
const getKeyStatus = () => {
  return keys.map((_, i) => {
    const state = keyStates.get(i);
    return {
      index: i,
      available: state.rateLimitedUntil ? Date.now() > state.rateLimitedUntil : true,
      failCount: state.failCount,
      rateLimitedUntil: state.rateLimitedUntil,
      totalRequests: state.totalRequests,
      totalErrors: state.totalErrors
    };
  });
};

module.exports = {
  callGeminiWithRotation,
  getKeyStatus
};
