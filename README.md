# AI Text Summarizer

A clean, full-stack application that transforms unstructured text into structured, actionable JSON data containing a summary, key points, and sentiment analysis using the Gemini API.

## Core Features
1. **Strict Output Extraction:** Reliable mapping from messy unstructured text to exact JSON fields.
2. **Graceful Error Handling:** Robust UI/server checks for empty inputs, missing API keys, and model parsing failures without crashing.
3. **Clean UX/UI:** Polished visual design built with React and Tailwind CSS for rapid prototyping and premium aesthetics.

---

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- An active Gemini API key (Free via Google AI Studio)

### 1. Server Setup (Backend)
Navigate to the `server` directory:
```bash
cd server
npm install
```

Create a `.env` file by copying the example template:
```bash
cp .env.example .env
```

Insert your valid Gemini API key into the new `.env` file. Then run the server:
```bash
npm start
# The server will run on http://localhost:3001
```

### 2. Client Setup (Frontend)
Open a new terminal and navigate to the `client` directory:
```bash
cd client
npm install
npm run dev
# Vite will open the local development environment at http://localhost:5173
```

---

## Architecture & Trade-Offs

### 1. Separation of Concerns (React vs Node.js)
Instead of forcing server-side API keys into the client bundle (which is a massive anti-pattern), I designed a micro backend to handle the actual LLM interfacing.
**Trade-Off:** Increased setup complexity (two concurrent servers working via CORS), but guarantees safe API secret handling and models real-world enterprise architectures where server-side validation acts as a gateway before querying external costly AI models.

### 2. Strict Deterministic JSON Formatting
**Provider Used:** `gemini-2.5-flash` via `@google/genai`.
I utilized Gemini's highly reliable `responseMimeType: 'application/json'` schema constraint formatting, paired with a strict `systemInstruction` directive.
**Why?** The prompt demands an absolute JSON payload and refuses conversational text logic. The low temperature parameter completely stabilizes output variance.

### 3. Deliberate File Simplification
I actively avoided over-abstracting the repository with heavy MVC layers (`/services/`, `/controllers/`, Redux/Zustand etc).
**Why?** The objective is readability over massive enterprise scalability. For an 80-150 line core system architecture, a clean top-to-bottom procedural execution is safer, inherently more maintainable, and infinitely faster to parse in an engineering review.

### 4. Future Improvements (With More Time)
If I had more than the 1-2 hour limit, I would:
1. **File Upload Support:** Add a Drag-and-Drop zone on the UI to natively parse `.txt` or `.pdf` files into raw text strings before sending to the backend.
2. **Schema Customization:** Allow the user to define their own output JSON schema via front-end toggles (e.g., adding a "Word Count" or "Confidence Score" field).
3. **Batch Processing:** Allow uploading multiple blocks of text at once and process them concurrently using `Promise.all`.

---

## Example Output Profile

*Input String:*
> "We just deployed the new search filters to production yesterday. Overall user engagement is up by roughly 25% since the filters went live which is great news. However, there is a known latency pipeline bug on Safari that the mobile team has been complaining heavily about. Need to fix it by Tuesday."

*JSON Extracted System Output:*
```json
{
  "summary": "The new search filters successfully increased user engagement by 25%, but a critical latency bug on Safari requires fixing by Tuesday.",
  "keyPoints": [
    "Deployed new production search filters.",
    "User engagement is up 25%.",
    "Safari mobile users are experiencing a latency pipeline bug."
  ],
  "sentiment": "neutral"
}
```
