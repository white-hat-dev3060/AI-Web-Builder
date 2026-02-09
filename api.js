// Node.js / Express backend
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GEMINI_KEY = process.env.GEMINI_KEY; // set environment variable

app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=" + GEMINI_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Generate ONE complete HTML file with inline CSS only. No markdown or explanation. Website request: ${prompt}` }]
          }]
        })
      }
    );

    const data = await response.json();
    const html = data.candidates[0].content.parts[0].text;

    res.json({ html });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "AI generation failed" });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
