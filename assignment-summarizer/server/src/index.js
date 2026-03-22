const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Prompt specifically engineered for deterministic strict JSON extraction
const SYSTEM_PROMPT = `You are an AI assistant that extracts unstructured text into a highly structured JSON summary.
Your strict requirement is to return ONLY valid, parseable JSON and no other conversational text.

Required JSON Structure:
{
  "summary": "Exactly one sentence summarizing the core theme.",
  "keyPoints": [
    "Short point 1",
    "Short point 2",
    "Short point 3"
  ],
  "sentiment": "positive" | "neutral" | "negative"
}

Rules:
- 'summary' MUST be one single sentence.
- 'keyPoints' MUST contain exactly 3 string items.
- 'sentiment' MUST be strictly one of: "positive", "neutral", "negative".
`;

app.post('/api/summarize', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Input text is required to generate a summary.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('[Error] Missing GEMINI_API_KEY in server environment.');
    return res.status(500).json({ error: 'Server misconfiguration: API key is missing. Check backend logs.' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: text,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.1,
        responseMimeType: 'application/json'
      }
    });

    const rawContent = response.text.trim();
    let jsonResult;
    try {
        jsonResult = JSON.parse(rawContent);
    } catch (parseError) {
        console.error('[Error] Malformed JSON from LLM:', rawContent);
        return res.status(500).json({ error: 'Failed to parse strictly structured JSON from AI provider.' });
    }

    return res.json(jsonResult);
  } catch (error) {
    console.error('[Error] Gemini API call failed:', error.message);
    return res.status(502).json({ error: 'Failed to connect to the AI Provider. Please try again later.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running correctly on port ${PORT} [API Key verification triggered]`);
});
