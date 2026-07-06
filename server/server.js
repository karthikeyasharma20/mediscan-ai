require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Analyze Medical Report Endpoint
app.post("/api/analyze", async (req, res) => {
  try {
    const { report } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are MediScan AI.
You are a medical report analyzer.
Analyze the medical report below.
Return ONLY valid JSON.
Use exactly this format:
{
  "healthScore": 0,
  "riskLevel": "",
  "summary": "",
  "abnormalValues": [
    {
      "test": "",
      "status": "",
      "value": "",
      "range": ""
    }
  ],
  "suggestions": [
    "",
    "",
    ""
  ]
}

Rules:
healthScore should be between 0 and 100.
riskLevel should be Low, Medium, or High.
summary should be one paragraph.
abnormalValues status must be Green (normal), Yellow (borderline), or Red (critical). Include the raw value and normal reference range if visible.
Do NOT diagnose diseases. Only provide educational information.

Medical Report:
${report}
`;

    const result = await model.generateContent(prompt);
    let answerText = result.response.text();

    // Clean up any JSON markdown formatting blocks from response
    answerText = answerText.replace(/```json/gi, "").replace(/```/g, "").trim();

    res.json({
      answer: answerText,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Gemini Error",
    });
  }
});

// Chat Assistant Follow-up Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { context, message, history } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // Format chat history log
    const formattedHistory = history
      ? history.map((h) => `${h.role === "user" ? "User" : "Assistant"}: ${h.parts[0].text}`).join("\n")
      : "";

    const systemPrompt = `
You are MediScan AI, an educational health assistant.
You are helping a patient understand their medical report.
Here is the context of the medical report under consideration:
${context}

Rules:
- Answer user queries about the report or general wellness guidelines accurately and supportively.
- Only provide educational health insights. Do NOT diagnose conditions, recommend drugs, or suggest modifications to prescribed therapies.
- Always recommend that the user consult their primary physician for health changes.

Conversation History:
${formattedHistory}

User: ${message}
Assistant:`;

    const result = await model.generateContent(systemPrompt);
    const aiText = result.response.text().trim();

    res.json({
      answer: aiText,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Gemini Assistant Error",
    });
  }
});

app.listen(5000, () => {
  console.log("Server Running on Port 5000");
});